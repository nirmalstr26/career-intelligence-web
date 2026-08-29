/**
 * Unified Client-Side Authentication Context (Google Sign-In + Passwordless Email OTP).
 *
 * The SPAR session is an HttpOnly cookie owned by the backend. This provider:
 *  - resolves current identity by calling `GET /auth/me` on mount,
 *  - drives Google Sign-In (ID-token flow) and exchanges at `POST /auth/google`,
 *  - drives Passwordless Email OTP at `POST /auth/email/otp/send` and `/auth/email/otp/verify`,
 *  - exposes authoritative `user.role`, `student.lifecycleState`, and `refreshSession`.
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
import type { SendEmailOtpResponse, VerifyEmailOtpRequest } from "@/lib/careerai/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  picture: string | null;
}

export interface AuthStudent {
  id: string;
  profileCompletion: number;
  profileStatus: string;
  lifecycleState: string;
  onboardingStep: number;
}

interface SessionResponse {
  user: { id: string; email: string; name: string; role?: string; picture: string | null };
  student: {
    id: string;
    profile_completion: number;
    profile_status: string;
    lifecycle_state?: string;
    onboarding_step?: number;
  };
  onboarding_required: boolean;
  redirect_route?: string;
}

export interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: AuthUser | null;
  student: AuthStudent | null;
  onboardingRequired: boolean;
  redirectRoute: string;
  googleConfigured: boolean;
  signingIn: boolean;
  error: string | null;
  sendEmailOtp: (email: string) => Promise<SendEmailOtpResponse>;
  verifyEmailOtp: (email: string, code: string, firstName?: string, lastName?: string) => Promise<void>;
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
  const [redirectRoute, setRedirectRoute] = useState("/app/today");
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleInitialized = useRef(false);

  const applySession = useCallback((session: SessionResponse) => {
    setUser({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || "STUDENT",
      picture: session.user.picture ?? null,
    });
    setStudent({
      id: session.student.id,
      profileCompletion: session.student.profile_completion,
      profileStatus: session.student.profile_status,
      lifecycleState: session.student.lifecycle_state || "ACCOUNT_CREATED",
      onboardingStep: session.student.onboarding_step || 1,
    });
    setOnboardingRequired(session.onboarding_required);
    if (session.redirect_route) {
      setRedirectRoute(session.redirect_route);
    }
    setStatus("authenticated");
    setError(null);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setStudent(null);
    setOnboardingRequired(false);
    setRedirectRoute("/");
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
      clearSession();
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

  const sendEmailOtp = useCallback(async (email: string): Promise<SendEmailOtpResponse> => {
    setError(null);
    try {
      return await api.post<SendEmailOtpResponse>("/auth/email/otp/send", { body: { email } });
    } catch (err: any) {
      setError(err?.message || "Failed to send verification code. Please check your email.");
      throw err;
    }
  }, []);

  const verifyEmailOtp = useCallback(
    async (email: string, code: string, firstName?: string, lastName?: string) => {
      setSigningIn(true);
      setError(null);
      try {
        const session = await api.post<SessionResponse>("/auth/email/otp/verify", {
          body: { email, code, first_name: firstName, last_name: lastName },
        });
        applySession(session);
      } catch (err: any) {
        setError(err?.message || "Verification code failed. Please check the code and try again.");
        throw err;
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
      return null;
    }
    try {
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
    } catch {
      return null;
    }
  }, []);

  // On mount: resolve the existing session and warm up Google.
  useEffect(() => {
    void refreshSession();
    if (isGoogleConfigured) {
      void ensureGoogleInitialized().catch(() => {});
    }
  }, [refreshSession, ensureGoogleInitialized]);

  const promptGoogleSignIn = useCallback(async () => {
    const google = await ensureGoogleInitialized();
    if (google) google.accounts.id.prompt();
  }, [ensureGoogleInitialized]);

  const renderGoogleButton = useCallback(
    async (el: HTMLElement, options?: GoogleButtonOptions) => {
      const google = await ensureGoogleInitialized();
      if (google) {
        google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          ...(options ?? {}),
        });
      }
    },
    [ensureGoogleInitialized],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
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
      redirectRoute,
      googleConfigured: isGoogleConfigured,
      signingIn,
      error,
      sendEmailOtp,
      verifyEmailOtp,
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
      redirectRoute,
      signingIn,
      error,
      sendEmailOtp,
      verifyEmailOtp,
      refreshSession,
      logout,
      promptGoogleSignIn,
      renderGoogleButton,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
