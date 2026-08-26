import { Sparkles, Terminal } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isGoogleConfigured } from "@/lib/env";
import { api } from "@/lib/api";
import { useState } from "react";

/**
 * Sign-in card. When running locally without Google OAuth configured,
 * a "Dev Login" button is shown for fast end-to-end testing.
 */
export function AuthCard() {
  const { error, refreshSession } = useAuth();
  const [devLoading, setDevLoading] = useState(false);
  const [devError, setDevError] = useState<string | null>(null);

  async function handleDevLogin() {
    setDevLoading(true);
    setDevError(null);
    try {
      await api.post("/auth/dev-login", {
        body: { email: "dev@careerai.dev", first_name: "Dev", last_name: "User" },
      });
      await refreshSession();
    } catch {
      setDevError("Dev login failed. Make sure the backend is running.");
    } finally {
      setDevLoading(false);
    }
  }

  return (
    <div className="surface-panel w-full max-w-[520px] rounded-3xl p-6 shadow-[var(--shadow-elevated)] sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span
          className="grid size-12 place-items-center rounded-2xl"
          style={{ backgroundImage: "var(--gradient-primary)" }}
          aria-hidden="true"
        >
          <Sparkles className="size-6 text-primary-foreground" />
        </span>

        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">
          Start your career journey
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Sign in to build your AI career profile, track readiness, and get personalized guidance.
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center gap-3">
        {isGoogleConfigured && <GoogleSignInButton options={{ width: 320 }} />}

        {!isGoogleConfigured && (
          <button
            onClick={() => void handleDevLogin()}
            disabled={devLoading}
            className="flex w-[320px] items-center justify-center gap-3 rounded-full border border-primary/40 bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 disabled:opacity-60"
          >
            <Terminal className="size-4 text-primary" />
            {devLoading ? "Signing in…" : "Continue as Dev User (local only)"}
          </button>
        )}
      </div>

      {(error ?? devError) !== null ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive-foreground"
        >
          {error ?? devError}
        </p>
      ) : null}

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#terms" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
