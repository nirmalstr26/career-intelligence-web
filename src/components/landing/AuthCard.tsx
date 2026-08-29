import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, KeyRound, CheckCircle2, Terminal, Sparkles, RefreshCw } from "lucide-react";
import { devLogin } from "@/lib/careerai/client";
import { useRouter } from "@tanstack/react-router";

export function AuthCard() {
  const router = useRouter();
  const { isGoogleConfigured, sendEmailOtp, verifyEmailOtp, refreshSession, error } = useAuth();

  // Tab State: 'email' | 'demo'
  const [authMode, setAuthMode] = useState<"email" | "demo">("email");

  // Email OTP state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"enter_email" | "enter_otp">("enter_email");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Demo Sign In State
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      await sendEmailOtp(email.trim());
      setStep("enter_otp");
      setResendCooldown(30);
    } catch (err: any) {
      setAuthError(err?.message || "Failed to send verification code. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length < 6) {
      setAuthError("Please enter the full 6-digit verification code.");
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      const res = await verifyEmailOtp(email.trim(), otpCode.trim(), firstName.trim() || undefined, lastName.trim() || undefined);
      if (res?.nextRoute) {
        await router.navigate({ to: res.nextRoute as any });
      }
    } catch (err: any) {
      setAuthError(err?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDevLogin(customEmail?: string) {
    setDemoLoading(true);
    setAuthError(null);
    try {
      const targetEmail = customEmail || "dev@careerai.dev";
      const isAlex = targetEmail.includes("alex");
      await devLogin(targetEmail, isAlex ? "Alex" : "Dev", isAlex ? "Rivera" : "User");
      await refreshSession();
    } catch (err: any) {
      setAuthError(err?.message || "Demo sign in failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="surface-panel w-full max-w-[540px] rounded-3xl p-6 shadow-[var(--shadow-elevated)] sm:p-8 backdrop-blur border border-border/80">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            Get Started Free
          </span>
          <h2 className="text-xl font-bold font-display text-foreground mt-1">
            {step === "enter_otp" ? "Enter Verification Code" : "Start Your Career Journey"}
          </h2>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[11px]">
          Student Pilot
        </Badge>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {step === "enter_otp"
          ? `We sent a 6-digit code to ${email}`
          : "Discover your AI Career Match, assess real skills, and build proven readiness."}
      </p>

      {/* Google OAuth Section (if on email entry step) */}
      {step === "enter_email" ? (
        <div className="mt-5 space-y-4">
          {isGoogleConfigured ? (
            <>
              <div className="flex flex-col items-center gap-2 py-1">
                <GoogleSignInButton options={{ width: 340, text: "continue_with" }} />
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="w-full border-t border-border/70" />
                <span className="bg-card px-3 text-[11px] font-medium text-muted-foreground shrink-0 uppercase tracking-wider">
                  Or passwordless email
                </span>
                <div className="w-full border-t border-border/70" />
              </div>
            </>
          ) : null}

          {/* Mode Switcher: Email vs Quick Demo */}
          <div className="flex rounded-xl bg-surface/80 p-1 border border-border/60">
            <button
              type="button"
              onClick={() => {
                setAuthMode("email");
                setAuthError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                authMode === "email"
                  ? "bg-card text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email Sign In / Register
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("demo");
                setAuthError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                authMode === "demo"
                  ? "bg-card text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Demo Accounts
            </button>
          </div>

          {authMode === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-foreground block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-foreground block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Rivera"
                    className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-foreground block mb-1">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@college.edu"
                    className="w-full rounded-xl border border-border/80 bg-surface pl-10 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="hero"
                disabled={loading || !email.trim()}
                className="w-full font-semibold gap-2 shadow-lg mt-1"
              >
                {loading ? (
                  "Sending Verification Code…"
                ) : (
                  <>
                    Continue with Email
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                No password required. We'll send a 6-digit code to your email.
              </p>
            </form>
          ) : (
            /* Demo Accounts Tab */
            <div className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-3 mt-2">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="size-3.5 text-primary" />
                Quick One-Click Pilot Access:
              </p>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => void handleDevLogin("alex.rivera@spar.dev")}
                  disabled={demoLoading}
                  className="flex items-center justify-between rounded-xl border border-primary/40 bg-surface/80 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-primary/10 hover:border-primary"
                >
                  <div>
                    <p className="font-semibold text-foreground">Alex Rivera (Data Engineer)</p>
                    <p className="text-[10px] text-muted-foreground">Pre-configured roadmap & diagnostics</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                    Ready
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDevLogin("new.student@spar.dev")}
                  disabled={demoLoading}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/80 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary hover:border-border-strong"
                >
                  <div>
                    <p className="font-semibold text-foreground">New Student Account</p>
                    <p className="text-[10px] text-muted-foreground">Starts fresh 3-step onboarding</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Fresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Step 2: Enter 6-digit OTP Code */
        <form onSubmit={handleVerifyOtp} className="space-y-4 mt-5">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                <KeyRound className="size-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          <div>
            <label className="text-[11px] font-medium text-foreground block mb-1 text-center">
              6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              autoFocus
              value={otpCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtpCode(val);
              }}
              placeholder="123456"
              className="w-full rounded-xl border border-border/80 bg-surface px-4 py-3 text-center text-xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="hero"
            disabled={loading || otpCode.length < 6}
            className="w-full font-semibold gap-2 shadow-lg"
          >
            {loading ? (
              "Verifying Code…"
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                Verify & Continue
              </>
            )}
          </Button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setStep("enter_email");
                setOtpCode("");
                setAuthError(null);
              }}
              className="text-muted-foreground hover:text-foreground underline transition-colors"
            >
              ← Change Email
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleSendOtp}
              className="text-primary hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {(error ?? authError) !== null ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-center text-xs text-destructive"
        >
          {error ?? authError}
        </p>
      ) : null}

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
        By continuing, you agree to SPAR's{" "}
        <a href="#terms" className="text-primary hover:underline">
          Terms
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
