import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, KeyRound, CheckCircle2, Terminal, Sparkles, RefreshCw, Building2 } from "lucide-react";
import { devLogin } from "@/lib/careerai/client";
import { useRouter, Link } from "@tanstack/react-router";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export function AuthCard() {
  const router = useRouter();
  const { isGoogleConfigured, sendEmailOtp, verifyEmailOtp, refreshSession, error } = useAuth();

  // Tab State: 'email' | 'demo'
  const [authMode, setAuthMode] = useState<"email" | "demo">("email");

  // Email OTP state
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
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
    trackLandingEvent("EMAIL_AUTH_SELECTED");

    try {
      await sendEmailOtp(email.trim());
      setStep("enter_otp");
      setResendCooldown(30);
      trackLandingEvent("EMAIL_OTP_REQUESTED");
      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setAuthError(err?.message || "Failed to send verification code. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    // Auto move to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...otpCode];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || "";
    }
    setOtpCode(newCode);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    }
  };

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = otpCode.join("");
    if (fullCode.length < 6) {
      setAuthError("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      const res = await verifyEmailOtp(email.trim(), fullCode);
      trackLandingEvent("AUTH_COMPLETED", { method: "EMAIL_OTP" });
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
      const targetEmail = customEmail || "alex.rivera@spar.dev";
      const isAlex = targetEmail.includes("alex");
      await devLogin(targetEmail, isAlex ? "Alex" : "Student", isAlex ? "Rivera" : "User");
      await refreshSession();
      trackLandingEvent("AUTH_COMPLETED", { method: "DEMO" });
    } catch (err: any) {
      setAuthError(err?.message || "Demo sign in failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div
      id="auth-card"
      className="surface-panel relative w-full max-w-[420px] rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl border border-border/80 transition-all duration-300"
    >
      {/* Subtle top card glow accent */}
      <div className="pointer-events-none absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="size-3" />
            {step === "enter_otp" ? "SECURITY CODE" : "START YOUR CAREER JOURNEY"}
          </span>
          <h2 className="text-xl font-bold font-display text-foreground mt-0.5">
            {step === "enter_otp" ? "Check your email" : "Start your career journey"}
          </h2>
        </div>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/40 text-[10px] px-2 py-0.5">
          Pilot Access
        </Badge>
      </div>

      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {step === "enter_otp"
          ? `We sent a 6-digit verification code to ${email}`
          : "Sign in or create your account. SPAR will guide you from there."}
      </p>

      {/* Step 1: Google + Email Form */}
      {step === "enter_email" ? (
        <div className="mt-5 space-y-4">
          {isGoogleConfigured ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <GoogleSignInButton options={{ width: 340, text: "continue_with" }} />
              </div>

              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-border/70" />
                <span className="bg-card/90 px-3 text-[11px] font-medium text-muted-foreground shrink-0 uppercase tracking-wider">
                  or
                </span>
                <div className="w-full border-t border-border/70" />
              </div>
            </>
          ) : null}

          {/* Mode Tabs: Email vs Demo */}
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
              Continue with Email
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
              Quick Demo
            </button>
          </div>

          {authMode === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-3 mt-2">
              <div>
                <label className="text-[11px] font-medium text-foreground block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="College or personal email"
                    className="w-full rounded-xl border border-border/80 bg-surface pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all"
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
                No password required. We'll verify with a secure 6-digit code.
              </p>
            </form>
          ) : (
            /* Quick Demo Tab */
            <div className="rounded-2xl border border-border/60 bg-card/40 p-3.5 space-y-2.5 mt-2">
              <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="size-3.5 text-cyan-400" />
                Select a Test Profile:
              </p>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => void handleDevLogin("alex.rivera@spar.dev")}
                  disabled={demoLoading}
                  className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-surface/80 px-3 py-2 text-left text-xs transition-colors hover:bg-cyan-500/10 hover:border-cyan-400"
                >
                  <div>
                    <p className="font-semibold text-foreground text-[11px]">Alex Rivera (Data Engineer)</p>
                    <p className="text-[10px] text-muted-foreground">Active roadmap & diagnostic score: 78%</p>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[9px]">
                    Active
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDevLogin("new.student@spar.dev")}
                  disabled={demoLoading}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/80 px-3 py-2 text-left text-xs transition-colors hover:bg-secondary hover:border-border-strong"
                >
                  <div>
                    <p className="font-semibold text-foreground text-[11px]">New Student Account</p>
                    <p className="text-[10px] text-muted-foreground">Fresh onboarding state</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Fresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Step 2: 6-Box OTP Code View */
        <form onSubmit={handleVerifyOtp} className="space-y-4 mt-5">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-center space-y-1.5">
            <div className="flex justify-center">
              <div className="grid size-8 place-items-center rounded-xl bg-cyan-500/20 text-cyan-300">
                <KeyRound className="size-4" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Enter the code sent to <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          {/* 6 Individual Code Boxes */}
          <div>
            <label className="text-[11px] font-medium text-foreground block mb-2 text-center">
              Verification Code
            </label>
            <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="size-11 sm:size-12 rounded-xl border border-border/80 bg-surface text-center font-mono text-lg font-bold text-foreground focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="hero"
            disabled={loading || otpCode.join("").length < 6}
            className="w-full font-semibold gap-2 shadow-lg mt-1"
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
                setOtpCode(["", "", "", "", "", ""]);
                setAuthError(null);
              }}
              className="text-muted-foreground hover:text-foreground underline transition-colors"
            >
              ← Change email
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleSendOtp}
              className="text-cyan-400 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {/* Error display */}
      {(error ?? authError) !== null ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2 text-center text-xs text-destructive"
        >
          {error ?? authError}
        </p>
      ) : null}

      {/* College Workflow CTA */}
      <div className="mt-4 pt-3.5 border-t border-border/60 text-center">
        <Link
          to="/colleges"
          onClick={() => trackLandingEvent("COLLEGE_CTA_CLICKED")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
        >
          <Building2 className="size-3.5" />
          Representing a college? <span className="font-semibold underline">Explore SPAR for Colleges →</span>
        </Link>
      </div>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground">
        By continuing, you agree to SPAR's{" "}
        <a href="#terms" className="text-cyan-400 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#privacy" className="text-cyan-400 hover:underline">
          Privacy Notice
        </a>
        .
      </p>
    </div>
  );
}
