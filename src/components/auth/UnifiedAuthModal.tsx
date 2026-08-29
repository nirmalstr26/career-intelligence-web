import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "student" | "college";
}

export function UnifiedAuthModal({ isOpen, onClose, initialMode = "student" }: UnifiedAuthModalProps) {
  const {
    renderGoogleButton,
    promptGoogleSignIn,
    googleConfigured,
    sendEmailOtp,
    verifyEmailOtp,
    signingIn,
    error: authError,
    clearError,
  } = useAuth();

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Email OTP state
  const [emailStep, setEmailStep] = useState<"enter_email" | "enter_code">("enter_email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Render Google button inside modal when open
  useEffect(() => {
    if (isOpen && googleConfigured && googleBtnRef.current) {
      void renderGoogleButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
      });
    }
  }, [isOpen, googleConfigured, renderGoogleButton, emailStep]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    setLocalError(null);
    clearError();
    setIsSendingCode(true);
    try {
      const res = await sendEmailOtp(email.trim());
      setEmailStep("enter_code");
      setCountdown(res.retry_after_seconds || 30);
    } catch (err: any) {
      setLocalError(err?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim() || code.length !== 6) {
      setLocalError("Please enter the 6-digit verification code.");
      return;
    }
    setLocalError(null);
    clearError();
    setIsVerifyingCode(true);
    try {
      await verifyEmailOtp(email.trim(), code.trim(), firstName.trim() || undefined, lastName.trim() || undefined);
      onClose();
    } catch (err: any) {
      setLocalError(err?.message || "Invalid verification code. Please check and try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleSendCode();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <img
            src="/brand/icon/spar-ai-icon-64.png"
            srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
            alt="SPAR AI"
            className="size-11 object-contain mx-auto mb-2.5 drop-shadow-[0_0_12px_rgba(6,215,247,0.3)]"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-2">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>Unified Platform Access</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Welcome to SPAR <span className="text-cyan-400">AI</span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {initialMode === "college"
              ? "Access your college placement and student readiness console"
              : "Build a career plan that adapts as you grow"}
          </p>
        </div>

        {/* Error Notice */}
        {(localError || authError) && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {localError || authError}
          </div>
        )}

        {/* --- STEP A: ENTER EMAIL / SELECT METHOD --- */}
        {emailStep === "enter_email" ? (
          <div className="space-y-4">
            {/* Primary: Google Sign In */}
            {googleConfigured ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div ref={googleBtnRef} className="w-full flex justify-center" />
                <p className="text-[11px] text-muted-foreground">Fast, 1-click Google authentication</p>
              </div>
            ) : null}

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase">
                or continue with email
              </span>
            </div>

            {/* Secondary: Email OTP Form */}
            <form onSubmit={handleSendCode} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu or gmail.com"
                    required
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl py-2.5 text-sm font-semibold"
                disabled={isSendingCode || !email.trim()}
              >
                {isSendingCode ? (
                  <>
                    <InlineSpinner className="size-4" />
                    Sending Code…
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* --- STEP B: ENTER 6-DIGIT CODE --- */
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">We sent a 6-digit code to</p>
              <p className="text-xs font-bold text-foreground mt-0.5 truncate">{email}</p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setCode(val);
                    if (val.length === 6) {
                      // Auto-trigger verify
                      setTimeout(() => {
                        void verifyEmailOtp(email.trim(), val, firstName.trim() || undefined, lastName.trim() || undefined).then(() => onClose()).catch(() => {});
                      }, 100);
                    }
                  }}
                  placeholder="••••••"
                  autoFocus
                  className="w-full tracking-[10px] text-center font-mono text-2xl font-bold rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Rivera"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-xl py-2.5 text-sm font-semibold"
                disabled={isVerifyingCode || code.length !== 6}
              >
                {isVerifyingCode ? (
                  <>
                    <InlineSpinner className="size-4" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <CheckCircle2 className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <button
                type="button"
                onClick={() => {
                  setEmailStep("enter_email");
                  setCode("");
                  setLocalError(null);
                }}
                className="text-primary hover:underline"
              >
                Change email
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isSendingCode}
                className={cn(
                  "hover:underline",
                  countdown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary font-semibold"
                )}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-6 border-t border-border pt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Passwordless, verified email ownership · No passwords needed</span>
        </div>
      </div>
    </div>
  );
}
