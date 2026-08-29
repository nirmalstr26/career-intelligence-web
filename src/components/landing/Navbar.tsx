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
  Terminal,
  MessageSquare,
  Award,
  Target,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedAuthModal } from "@/components/auth/UnifiedAuthModal";
import { useAuth } from "@/lib/auth/AuthProvider";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "get_started">("get_started");

  const { isAuthenticated, onboardingRequired } = useAuth();

  const handleGetStartedClick = () => {
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
      <header className="sticky top-0 z-40 w-full pt-4 px-4 sm:px-6 lg:px-10 select-none">
        <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/60 bg-[#090e24]/75 backdrop-blur-xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            {/* Logo: Triangle + SPAR AI */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,215,247,0.4)] transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="size-5" fill="none">
                  <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                SPAR <span className="text-cyan-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
              {/* Product Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductMenuOpen(true)}
                onMouseLeave={() => setProductMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  Product
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${productMenuOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>

                {productMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[440px] rounded-2xl border border-border/80 bg-[#090e24]/95 p-3 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                    <a href="#discovery" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Compass className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Career Discovery</p>
                        <p className="text-[10px] text-muted-foreground">AI path direction matching</p>
                      </div>
                    </a>

                    <a href="#roadmap" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Map className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Personalized Roadmap</p>
                        <p className="text-[10px] text-muted-foreground">Adaptive skill curriculum</p>
                      </div>
                    </a>

                    <a href="#projects" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Terminal className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Practical Projects</p>
                        <p className="text-[10px] text-muted-foreground">Verified code artifacts</p>
                      </div>
                    </a>

                    <a href="#interviews" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-purple-500/10 text-purple-400">
                        <MessageSquare className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Mock Interviews</p>
                        <p className="text-[10px] text-muted-foreground">Technical simulation</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Career Paths */}
              <a
                href="#careers"
                className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                Career Paths
              </a>

              {/* For Colleges */}
              <Link
                to="/colleges"
                className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                For Colleges
              </Link>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setResourcesMenuOpen(true)}
                onMouseLeave={() => setResourcesMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  Resources
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${resourcesMenuOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>

                {resourcesMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[220px] rounded-2xl border border-border/80 bg-[#090e24]/95 p-2 shadow-2xl backdrop-blur-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <a href="#roadmap" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-white">
                      Career Guides
                    </a>
                    <a href="#interviews" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-white">
                      Interview Preparation
                    </a>
                    <a href="#projects" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-white">
                      Project Templates
                    </a>
                  </div>
                )}
              </div>

              {/* About */}
              <a
                href="#about"
                className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                About
              </a>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to={onboardingRequired ? "/onboarding" : "/app/today"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] hover:brightness-110 transition-all"
                >
                  <Sparkles className="size-3.5" />
                  Go to Workspace
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    className="text-xs font-semibold text-white/90 hover:text-cyan-400 transition-colors px-2 py-1"
                  >
                    Sign In
                  </button>

                  <Button
                    size="sm"
                    onClick={handleGetStartedClick}
                    className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] hover:brightness-110 transition-all gap-1.5"
                  >
                    Get Started
                    <ArrowRight className="size-3.5" />
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-9 place-items-center rounded-xl border border-border/80 bg-[#0d1436] text-muted-foreground hover:text-white lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {open && (
            <div className="mt-3 border-t border-border/60 pt-3 lg:hidden space-y-1 animate-in slide-in-from-top-2 duration-150">
              <a href="#discovery" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-white">
                Product
              </a>
              <a href="#careers" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-white">
                Career Paths
              </a>
              <Link to="/colleges" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-secondary">
                For Colleges
              </Link>
              <a href="#about" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-white">
                About
              </a>

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setOpen(false); handleSignInClick(); }}>
                    Sign In
                  </Button>
                  <Button size="sm" className="w-full text-xs bg-gradient-to-r from-cyan-400 to-indigo-600 text-white" onClick={() => { setOpen(false); handleGetStartedClick(); }}>
                    Get Started →
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
