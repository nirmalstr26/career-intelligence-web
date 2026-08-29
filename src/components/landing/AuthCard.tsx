import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Shield, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { devLogin } from "@/lib/careerai/client";
import { useRouter } from "@tanstack/react-router";

export function AuthCard() {
  const router = useRouter();
  const { isGoogleConfigured, sendEmailOtp, verifyEmailOtp, refreshSession, error } = useAuth();

  // Role Tab State: 'student' | 'graduate' | 'college'
  const [roleTab, setRoleTab] = useState<"student" | "graduate" | "college">("student");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification State
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setAuthError("Please enter a valid college or personal email address.");
      return;
    }

    if (roleTab === "college") {
      void router.navigate({ to: "/colleges" });
      return;
    }

    setLoading(true);
    setAuthError(null);

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Student";
    const lastName = nameParts.slice(1).join(" ") || "User";

    try {
      await devLogin(email.trim(), firstName, lastName);
      await refreshSession();
    } catch {
      try {
        await sendEmailOtp(email.trim());
        setOtpStep(true);
        setResendCooldown(30);
      } catch (err: any) {
        setAuthError(err?.message || "Failed to create account. Please check your email and try again.");
      }
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

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Student";
    const lastName = nameParts.slice(1).join(" ") || "User";

    try {
      const res = await verifyEmailOtp(email.trim(), otpCode.trim(), firstName, lastName);
      if (res?.nextRoute) {
        await router.navigate({ to: res.nextRoute as any });
      }
    } catch (err: any) {
      setAuthError(err?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="auth-card"
      className="relative w-full max-w-[395px] lg:max-w-[410px] rounded-[28px] border border-blue-500/25 bg-[#090e24]/90 p-5 sm:p-6 lg:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all select-none"
    >
      {/* Top Outer Edge Subtle Cyan Highlight */}
      <div className="pointer-events-none absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      {/* Role Switcher Pills */}
      <div className="flex rounded-full bg-[#0d1436] p-1 border border-border/60 mb-4">
        <button
          type="button"
          onClick={() => {
            setRoleTab("student");
            setAuthError(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
            roleTab === "student"
              ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-[0_0_12px_rgba(130,71,255,0.4)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => {
            setRoleTab("graduate");
            setAuthError(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
            roleTab === "graduate"
              ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-[0_0_12px_rgba(130,71,255,0.4)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Graduate
        </button>
        <button
          type="button"
          onClick={() => {
            setRoleTab("college");
            setAuthError(null);
          }}
          className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
            roleTab === "college"
              ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-[0_0_12px_rgba(130,71,255,0.4)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          College
        </button>
      </div>

      {!otpStep ? (
        <>
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {roleTab === "college" ? "Register Your College" : "Start your career journey"}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {roleTab === "college"
                ? "Get institutional placement intelligence for your student cohorts."
                : "Create your account to get personalized guidance and opportunities."}
            </p>
          </div>

          {/* Google Button */}
          {roleTab !== "college" && (
            <div className="space-y-3 mb-3.5">
              {isGoogleConfigured ? (
                <div className="flex justify-center">
                  <GoogleSignInButton options={{ width: 320, text: "continue_with" }} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const emailInput = document.querySelector("#auth-card input[type='email']") as HTMLInputElement | null;
                    if (emailInput) emailInput.focus();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-full bg-white py-2 px-4 text-xs font-semibold text-[#1f1f1f] shadow-md hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-border/70" />
                <span className="bg-[#090e24] px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  or
                </span>
                <div className="w-full border-t border-border/70" />
              </div>
            </div>
          )}

          {/* Inputs Form */}
          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl border border-border/80 bg-[#0d1436]/90 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === "college" ? "Official Institution Email" : "College Email Address"}
                className="w-full rounded-xl border border-border/80 bg-[#0d1436]/90 pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>

            {/* Password with Eye icon toggle */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-border/80 bg-[#0d1436]/90 pl-10 pr-10 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Trust Badges: AI-Powered · 100% Free · Secure */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground/90 px-1 pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="size-3 text-cyan-400" />
                AI-Powered
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3 text-teal-400" />
                100% Free
              </span>
              <span className="flex items-center gap-1">
                <Shield className="size-3 text-blue-400" />
                Secure
              </span>
            </div>

            {/* Create Account CTA Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full font-bold text-sm text-white rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_25px_rgba(6,215,247,0.4)] hover:brightness-110 hover:scale-[1.01] transition-all gap-2 mt-1.5"
            >
              {loading ? (
                "Creating Account…"
              ) : (
                <>
                  {roleTab === "college" ? "Continue to College Portal" : "Create My Account"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Terms text */}
          <p className="mt-3 text-center text-[10px] text-muted-foreground leading-relaxed">
            By signing up, you agree to our{" "}
            <a href="#terms" className="text-cyan-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </>
      ) : (
        /* OTP Verification Step */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-2">
              <div className="grid size-10 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                <KeyRound className="size-5" />
              </div>
            </div>
            <h3 className="font-display text-lg font-bold text-white">Enter 6-Digit Code</h3>
            <p className="text-xs text-muted-foreground">
              We sent a code to <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          <div>
            <input
              type="text"
              maxLength={6}
              autoFocus
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full rounded-xl border border-border/80 bg-[#0d1436] px-4 py-3 text-center text-xl font-mono tracking-widest text-foreground focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading || otpCode.length < 6}
            className="w-full font-bold text-white rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 shadow-lg"
          >
            {loading ? "Verifying…" : "Verify & Continue →"}
          </Button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtpCode("");
              }}
              className="text-muted-foreground hover:text-foreground underline"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={handleFormSubmit}
              className="text-cyan-400 hover:underline disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {/* Error alert */}
      {(error ?? authError) !== null ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2 text-center text-xs text-destructive"
        >
          {error ?? authError}
        </p>
      ) : null}
    </div>
  );
}
