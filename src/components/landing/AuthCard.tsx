import { Sparkles } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Google-only sign-in card. Google is the sole authentication provider for the
 * MVP, so there is no email/password form — just a single, verifiable Google
 * ID-token flow. The surrounding visual design is preserved.
 */
export function AuthCard() {
  const { error } = useAuth();

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
          Sign in with Google to build your AI career profile, track readiness, and get personalized
          guidance.
        </p>
      </div>

      <div className="mt-7 flex justify-center">
        <GoogleSignInButton options={{ width: 320 }} />
      </div>

      {error !== null ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive-foreground"
        >
          {error}
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
