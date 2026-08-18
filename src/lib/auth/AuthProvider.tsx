/**
 * Client-side authentication context.
 *
 * The CareerAI session is an HttpOnly cookie owned by the backend, so this
 * provider never reads or stores tokens. It only:
 *  - resolves the current identity by calling `GET /auth/me` on mount,
 *  - drives Google Sign-In (ID-token flow) and exchanges the credential at
 *    `POST /auth/google`,
 *  - exposes `logout` and a `refreshSession` used after onboarding writes.
 *
 * Navigation is intentionally left to route guards, which redirect based on the
 * `status` / `onboardingRequired` exposed here.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ApiError, api } from "@/lib/api";
import { env, isGoogleConfigured } from "@/lib/env";
import {
  loadGoogleIdentity,
  type GoogleButtonOptions,
  type GoogleCredentialResponse,
} from "@/lib/auth/google";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface AuthStudent {
  id: string;
  profileCompletion: number;
  profileStatus: string;
}

interface SessionResponse {
  user: { id: string; email: string; name: string; picture: string | null };
  student: { id: string; profile_completion: number; profile_status: string };
  onboarding_required: boolean;
}

export interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: AuthUser | null;
  student: AuthStudent | null;
  onboardingRequired: boolean;
  googleConfigured: boolean;
  signingIn: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  promptGoogleSignIn: () => Promise<void>;
  renderGoogleButton: (el: HTMLElement, options?: GoogleButtonOptions) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [student, setStudent] = useState<AuthStudent | null>(null);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleInitialized = useRef(false);

  const applySession = useCallback((session: SessionResponse) => {
    setUser({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      picture: session.user.picture ?? null,
    });
    setStudent({
      id: session.student.id,
      profileCompletion: session.student.profile_completion,
      profileStatus: session.student.profile_status,
    });
    setOnboardingRequired(session.onboarding_required);
    setStatus("authenticated");
    setError(null);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setStudent(null);
    setOnboardingRequired(false);
    setStatus("unauthenticated");
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const session = await api.get<SessionResponse>("/auth/me");
      applySession(session);
    } catch (cause) {
      if (cause instanceof ApiError && cause.isUnauthorized) {
        clearSession();
        return;
      }
      // Network or unexpected error: treat as signed-out but surface a message.
      clearSession();
      setError("We couldn't reach CareerAI. Please try again.");
    }
  }, [applySession, clearSession]);

  const exchangeCredential = useCallback(
    async (credential: string) => {
      setSigningIn(true);
      setError(null);
      try {
        const session = await api.post<SessionResponse>("/auth/google", {
          body: { credential },
        });
        applySession(session);
      } catch (cause) {
        if (cause instanceof ApiError && cause.status === 409) {
          setError("An account already exists for this email with a different sign-in method.");
        } else if (cause instanceof ApiError) {
          setError(cause.message || "Google sign-in failed. Please try again.");
        } else {
          setError("Google sign-in failed. Please try again.");
        }
      } finally {
        setSigningIn(false);
      }
    },
    [applySession],
  );

  // Keep a stable reference for the Google callback registered with GIS.
  const exchangeRef = useRef(exchangeCredential);
  useEffect(() => {
    exchangeRef.current = exchangeCredential;
  }, [exchangeCredential]);

  const ensureGoogleInitialized = useCallback(async () => {
    if (!isGoogleConfigured) {
      throw new Error("Google Sign-In is not configured.");
    }
    const google = await loadGoogleIdentity();
    if (!googleInitialized.current) {
      google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: (response: GoogleCredentialResponse) => {
          void exchangeRef.current(response.credential);
        },
        cancel_on_tap_outside: false,
      });
      googleInitialized.current = true;
    }
    return google;
  }, []);

  // On mount: resolve the existing session and warm up Google (best-effort).
  useEffect(() => {
    void refreshSession();
    if (isGoogleConfigured) {
      void ensureGoogleInitialized().catch(() => {
        setError("Google Sign-In could not be loaded.");
      });
    }
  }, [refreshSession, ensureGoogleInitialized]);

  const promptGoogleSignIn = useCallback(async () => {
    const google = await ensureGoogleInitialized();
    google.accounts.id.prompt();
  }, [ensureGoogleInitialized]);

  const renderGoogleButton = useCallback(
    async (el: HTMLElement, options?: GoogleButtonOptions) => {
      const google = await ensureGoogleInitialized();
      google.accounts.id.renderButton(el, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        ...(options ?? {}),
      });
    },
    [ensureGoogleInitialized],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout is best-effort; clear local state regardless.
    }
    if (isGoogleConfigured && typeof window !== "undefined" && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    clearSession();
  }, [clearSession]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      user,
      student,
      onboardingRequired,
      googleConfigured: isGoogleConfigured,
      signingIn,
      error,
      refreshSession,
      logout,
      promptGoogleSignIn,
      renderGoogleButton,
      clearError,
    }),
    [
      status,
      user,
      student,
      onboardingRequired,
      signingIn,
      error,
      refreshSession,
      logout,
      promptGoogleSignIn,
      renderGoogleButton,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
