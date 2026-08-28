import { useState } from "react";
import {
  Sparkles,
  Terminal,
  UserPlus,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isGoogleConfigured } from "@/lib/env";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const CAREER_OPTIONS = [
  { value: "DATA_ENGINEER", label: "Data Engineer", desc: "Pipelines, SQL, Big Data, Cloud Warehouses" },
  { value: "CYBERSECURITY", label: "Cybersecurity", desc: "Network Defense, SecOps, Threat Analysis" },
  { value: "SOFTWARE_ENGINEERING", label: "Software Engineering", desc: "Full-Stack, Backend Systems, Architecture" },
  { value: "AI_ML", label: "AI / Machine Learning", desc: "Model Engineering, PyTorch, LLM Apps" },
  { value: "CLOUD_PLATFORM", label: "Cloud & Platform", desc: "DevOps, Kubernetes, Infrastructure as Code" },
  { value: "DATA_ANALYTICS", label: "Data & Analytics", desc: "BI, SQL Analytics, Dashboards, Modeling" },
];

export function AuthCard() {
  const { error, refreshSession } = useAuth();
  const [activeTab, setActiveTab] = useState<"register" | "signin">("register");

  // Registration Form State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCareer, setRegCareer] = useState("DATA_ENGINEER");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("dev@careerai.dev");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim()) {
      setRegError("Please fill in your name and email address.");
      return;
    }

    setRegLoading(true);
    setRegError(null);
    try {
      await api.post("/auth/dev-login", {
        body: {
          email: regEmail.trim(),
          first_name: regFirstName.trim(),
          last_name: regLastName.trim(),
          is_new_registration: true,
          target_career: regCareer,
        },
      });
      await refreshSession();
    } catch {
      setRegError("Registration failed. Make sure the backend server is running.");
    } finally {
      setRegLoading(false);
    }
  }

  async function handleDevLogin(customEmail?: string) {
    setSignInLoading(true);
    setSignInError(null);
    try {
      const email = customEmail || signInEmail.trim() || "dev@careerai.dev";
      await api.post("/auth/dev-login", {
        body: {
          email,
          first_name: email.includes("alex") ? "Alex" : email.includes("sam") ? "Sam" : "Dev",
          last_name: "User",
          is_new_registration: false,
        },
      });
      await refreshSession();
    } catch {
      setSignInError("Sign in failed. Make sure the backend server is running.");
    } finally {
      setSignInLoading(false);
    }
  }

  return (
    <div className="surface-panel w-full max-w-[540px] rounded-3xl p-6 shadow-[var(--shadow-elevated)] sm:p-8 backdrop-blur border border-border/80">
      <div className="flex flex-col items-center text-center">
        <span
          className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/30"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="size-6 text-primary-foreground" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
          {activeTab === "register" ? "Create Student Account" : "Welcome Back to CareerAI"}
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">
          {activeTab === "register"
            ? "Sign up with Google or enter details to build your AI career roadmap."
            : "Sign in with Google or your pilot account to resume your journey."}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex rounded-xl bg-surface/80 p-1 ring-1 ring-border/60">
        <button
          type="button"
          onClick={() => {
            setActiveTab("register");
            setRegError(null);
          }}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
            activeTab === "register"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <UserPlus className="size-3.5" />
          Sign Up / Register
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("signin");
            setSignInError(null);
          }}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
            activeTab === "signin"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <LogIn className="size-3.5" />
          Sign In
        </button>
      </div>

      {/* Tab 1: Register New Student */}
      {activeTab === "register" ? (
        <div className="mt-5 space-y-4">
          {/* Primary Option: Sign Up with Google */}
          {isGoogleConfigured ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" />
                  Recommended for Students:
                </span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  Instant Setup
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-2 pt-1">
                <GoogleSignInButton options={{ width: 320, text: "signup_with" }} />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <ShieldCheck className="size-3 text-success" />
                  Secure 1-click verification · Takes you directly to onboarding
                </p>
              </div>
            </div>
          ) : null}

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border/70" />
            <span className="bg-card px-3 text-[11px] font-medium text-muted-foreground shrink-0 uppercase tracking-wider">
              {isGoogleConfigured ? "Or register with details" : "Register with details"}
            </span>
            <div className="w-full border-t border-border/70" />
          </div>

          {/* Fallback Manual Registration Form */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-foreground block mb-1">
                  First Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-foreground block mb-1">
                  Last Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="e.g. Rivera"
                  className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground block mb-1">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. alex.rivera@college.edu"
                className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-foreground block mb-1">
                Target Career Direction <span className="text-primary">*</span>
              </label>
              <select
                value={regCareer}
                onChange={(e) => setRegCareer(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CAREER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                    {opt.label} — {opt.desc}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="hero"
              disabled={regLoading}
              className="w-full font-semibold gap-2 shadow-lg mt-2"
            >
              {regLoading ? (
                "Creating Account & Preparing Onboarding…"
              ) : (
                <>
                  Register & Begin Career Onboarding
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <p className="text-[11px] text-center text-muted-foreground">
              You will complete your academic profile and baseline diagnostic in the next step.
            </p>
          </form>
        </div>
      ) : (
        /* Tab 2: Sign In */
        <div className="mt-5 space-y-4">
          {isGoogleConfigured ? (
            <div className="flex flex-col items-center gap-3 py-1">
              <GoogleSignInButton options={{ width: 320, text: "signin_with" }} />
            </div>
          ) : null}

          {isGoogleConfigured ? (
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border/70" />
              <span className="bg-card px-3 text-[11px] font-medium text-muted-foreground shrink-0 uppercase tracking-wider">
                Or demo access
              </span>
              <div className="w-full border-t border-border/70" />
            </div>
          ) : null}

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Terminal className="size-3.5 text-primary" />
              Quick Demo Accounts:
            </p>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => void handleDevLogin("dev@careerai.dev")}
                disabled={signInLoading}
                className="flex items-center justify-between rounded-xl border border-primary/40 bg-surface/80 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-primary/10 hover:border-primary"
              >
                <div>
                  <p className="font-semibold text-foreground">Dev User</p>
                  <p className="text-[10px] text-muted-foreground">Data Engineer · 13% Roadmap Progress</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  Active Plan
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => void handleDevLogin("test@spar.dev")}
                disabled={signInLoading}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/80 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-secondary hover:border-border-strong"
              >
                <div>
                  <p className="font-semibold text-foreground">Test User</p>
                  <p className="text-[10px] text-muted-foreground">test@spar.dev</p>
                </div>
                <span className="text-[10px] text-muted-foreground">Standard</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-foreground block">
              Or Sign In with existing email:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 rounded-xl border border-border/80 bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="button"
                onClick={() => void handleDevLogin()}
                disabled={signInLoading || !signInEmail.trim()}
                size="sm"
                variant="outline"
                className="font-semibold"
              >
                {signInLoading ? "…" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {(error ?? regError ?? signInError) !== null ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-center text-xs text-destructive"
        >
          {error ?? regError ?? signInError}
        </p>
      ) : null}

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
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
