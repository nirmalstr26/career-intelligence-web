import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Menu,
  Sparkles,
  UserRound,
  X,
  Compass,
  Map,
  BookOpen,
  Terminal,
  MessageSquare,
  Award,
  UserCheck,
  Target,
  Layers,
  Building2,
  ArrowRight,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedAuthModal } from "@/components/auth/UnifiedAuthModal";
import { useAuth } from "@/lib/auth/AuthProvider";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [careerMenuOpen, setCareerMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "get_started">("get_started");

  const { isAuthenticated, onboardingRequired } = useAuth();

  const handleGetStartedClick = () => {
    trackLandingEvent("GET_STARTED_CLICKED");
    const authCard = document.getElementById("auth-card");
    if (authCard && window.innerWidth >= 1024) {
      authCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const emailInput = authCard.querySelector("input[type='email']") as HTMLInputElement | null;
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 400);
      }
    } else {
      setAuthModalMode("get_started");
      setAuthModalOpen(true);
    }
  };

  const handleSignInClick = () => {
    setAuthModalMode("signin");
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-3 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/60 bg-card/75 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,215,247,0.3)] transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="size-5" fill="none">
                  <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                  SPAR <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                  Career Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main" className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Product Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setProductMenuOpen(true)}
                onMouseLeave={() => setProductMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Product
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${productMenuOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>

                {productMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[460px] rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                    <a
                      href="#discovery"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                        <Compass className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Career Discovery</p>
                        <p className="text-[10px] text-muted-foreground">AI path direction matching</p>
                      </div>
                    </a>

                    <a
                      href="#roadmap"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                        <Map className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Personalized Roadmap</p>
                        <p className="text-[10px] text-muted-foreground">Tailored skill milestones</p>
                      </div>
                    </a>

                    <a
                      href="#projects"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                        <Terminal className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Practical Projects</p>
                        <p className="text-[10px] text-muted-foreground">Verified code artifacts</p>
                      </div>
                    </a>

                    <a
                      href="#interviews"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                        <MessageSquare className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Mock Interviews</p>
                        <p className="text-[10px] text-muted-foreground">Voice & technical simulation</p>
                      </div>
                    </a>

                    <a
                      href="#readiness"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20">
                        <Award className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Readiness Intelligence</p>
                        <p className="text-[10px] text-muted-foreground">Benchmark skill scores</p>
                      </div>
                    </a>

                    <a
                      href="#opportunities"
                      className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                        <Target className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Gap Optimizer</p>
                        <p className="text-[10px] text-muted-foreground">Job fit & role preparation</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Career Paths Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setCareerMenuOpen(true)}
                onMouseLeave={() => setCareerMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  Career Paths
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${careerMenuOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>

                {careerMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[380px] rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <a
                      href="#careers"
                      className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-secondary/70 transition-colors text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">Data Engineering</p>
                        <p className="text-[10px] text-muted-foreground">Pipelines, SQL, PySpark, Lakehouses</p>
                      </div>
                      <span className="text-[9px] rounded-md bg-cyan-500/10 text-cyan-400 px-2 py-0.5 font-semibold">
                        Guided Path
                      </span>
                    </a>

                    <a
                      href="#careers"
                      className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-secondary/70 transition-colors text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">Artificial Intelligence</p>
                        <p className="text-[10px] text-muted-foreground">ML, Deep Learning, LLMs & Agents</p>
                      </div>
                      <span className="text-[9px] rounded-md bg-cyan-500/10 text-cyan-400 px-2 py-0.5 font-semibold">
                        Guided Path
                      </span>
                    </a>

                    <a
                      href="#careers"
                      className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-secondary/70 transition-colors text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">Software Engineering</p>
                        <p className="text-[10px] text-muted-foreground">Fullstack, System Design, APIs</p>
                      </div>
                      <span className="text-[9px] rounded-md bg-cyan-500/10 text-cyan-400 px-2 py-0.5 font-semibold">
                        Guided Path
                      </span>
                    </a>

                    <div className="border-t border-border/60 pt-2 px-1">
                      <a
                        href="#careers"
                        className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 hover:underline"
                      >
                        Explore all career directions →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link
                to="/colleges"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <Building2 className="size-3.5 text-cyan-400" />
                For Colleges
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                How It Works
              </a>

              <a
                href="#coach"
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                SPAR Coach
              </a>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2.5">
              {isAuthenticated ? (
                <Link
                  to={onboardingRequired ? "/onboarding" : "/app/today"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] hover:brightness-110 transition-all"
                >
                  <Sparkles className="size-3.5" />
                  Open Workspace
                </Link>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignInClick}
                    className="hidden sm:inline-flex text-xs font-semibold text-foreground hover:bg-secondary/70 rounded-xl"
                  >
                    <UserRound className="size-3.5 mr-1.5" />
                    Sign In
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleGetStartedClick}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.35)] hover:brightness-110 transition-all gap-1.5"
                  >
                    Get Started
                    <ArrowRight className="size-3.5" />
                  </Button>
                </>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-9 place-items-center rounded-xl border border-border/80 bg-surface text-muted-foreground hover:text-foreground lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {open && (
            <div className="mt-3 border-t border-border/60 pt-3 lg:hidden space-y-1 animate-in slide-in-from-top-2 duration-150">
              <a
                href="#discovery"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                AI Career Discovery
              </a>
              <a
                href="#roadmap"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Personalized Roadmap
              </a>
              <a
                href="#careers"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Supported Careers
              </a>
              <Link
                to="/colleges"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-secondary"
              >
                For Colleges & Universities →
              </Link>
              <a
                href="#how-it-works"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                How SPAR Works
              </a>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setOpen(false);
                      handleSignInClick();
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="w-full text-xs bg-gradient-to-r from-cyan-400 to-indigo-600 text-white"
                    onClick={() => {
                      setOpen(false);
                      handleGetStartedClick();
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Unified Auth Modal */}
      <UnifiedAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
