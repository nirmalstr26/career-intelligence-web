import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Compass,
  Map,
  Terminal,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { UnifiedAuthModal } from "@/components/auth/UnifiedAuthModal";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Navbar() {
  const { status, onboardingRequired } = useAuth();
  const isAuthenticated = status === "authenticated";

  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  const handleGetStartedClick = () => {
    const authCard = document.getElementById("auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full pt-3 pb-2 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/80 bg-background/80 dark:bg-[#090e24]/85 px-4 sm:px-6 py-2.5 shadow-xl backdrop-blur-2xl transition-all">
          <div className="flex items-center justify-between">
            {/* Brand Logo Lockup */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,215,247,0.3)] transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/brand/icon/spar-ai-icon-64.png"
                  alt="SPAR AI"
                  className="size-5.5 object-contain"
                />
              </div>
              <div className="flex items-baseline">
                <span className="font-display text-lg font-black tracking-tight text-foreground">
                  SPAR
                </span>
                <span className="ml-1 text-sm font-extrabold text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,215,247,0.4)]">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Product Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductMenuOpen(true)}
                onMouseLeave={() => setProductMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Product
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${productMenuOpen ? "rotate-180 text-cyan-500" : ""}`} />
                </button>

                {productMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[280px] rounded-2xl border border-border/80 bg-popover/95 dark:bg-[#090e24]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <a href="#capabilities" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
                        <Compass className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">AI Career Discovery</p>
                        <p className="text-[10px] text-muted-foreground">Matching engine</p>
                      </div>
                    </a>

                    <a href="#architecture" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400">
                        <Map className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Unified Architecture</p>
                        <p className="text-[10px] text-muted-foreground">Connected intelligence hub</p>
                      </div>
                    </a>

                    <a href="#how-it-works" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        <Terminal className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Methodology Roadmap</p>
                        <p className="text-[10px] text-muted-foreground">5-stage guided path</p>
                      </div>
                    </a>

                    <a href="#careers" className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-secondary/70 transition-colors">
                      <div className="grid size-7 place-items-center rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400">
                        <MessageSquare className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Supported Careers</p>
                        <p className="text-[10px] text-muted-foreground">High-growth tech tracks</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Career Paths */}
              <a
                href="#careers"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Career Paths
              </a>

              {/* For Colleges */}
              <Link
                to="/colleges"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
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
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resources
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${resourcesMenuOpen ? "rotate-180 text-cyan-500" : ""}`} />
                </button>

                {resourcesMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[220px] rounded-2xl border border-border/80 bg-popover/95 dark:bg-[#090e24]/95 p-2 shadow-2xl backdrop-blur-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <a href="#how-it-works" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                      Methodology
                    </a>
                    <a href="#architecture" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                      Platform Architecture
                    </a>
                    <a href="#careers" className="block rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                      Career Directions
                    </a>
                  </div>
                )}
              </div>

              {/* About */}
              <a
                href="#about"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
            </nav>

            {/* Right Action CTAs + Theme Toggle */}
            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              <ThemeToggle className="size-8 rounded-xl border border-border/60" />

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
                    className="text-xs font-semibold text-foreground/90 hover:text-cyan-500 transition-colors px-2 py-1"
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
                className="grid size-9 place-items-center rounded-xl border border-border/80 bg-secondary/80 text-muted-foreground hover:text-foreground lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {open && (
            <div className="mt-3 border-t border-border/60 pt-3 lg:hidden space-y-1 animate-in slide-in-from-top-2 duration-150">
              <a href="#capabilities" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
                Product
              </a>
              <a href="#careers" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
                Career Paths
              </a>
              <Link to="/colleges" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-cyan-500 hover:bg-secondary">
                For Colleges
              </Link>
              <a href="#about" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
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
