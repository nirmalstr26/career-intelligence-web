import { ChevronDown, Menu, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { UnifiedAuthModal } from "@/components/auth/UnifiedAuthModal";
import { useAuth } from "@/lib/auth/AuthProvider";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Careers", href: "#careers" },
  { label: "For Colleges", href: "/colleges", isRoute: true },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, user, student, onboardingRequired } = useAuth();

  return (
    <>
      <header className="relative z-20 mx-auto w-full max-w-[1440px] px-6 lg:px-10">
        <div className="grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground shadow-sm"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none">
                <path d="M12 4 20 20H4L12 4Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="truncate font-display text-xl font-bold tracking-tight text-foreground">
              SPAR <span className="text-primary">AI</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={onboardingRequired ? "/onboarding" : "/app/today"}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="size-4" />
                Go to Workspace
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden text-sm font-medium sm:inline-flex"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <UserRound className="size-4 mr-1.5" />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-5 text-sm font-semibold shadow-sm"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Get Started
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open ? (
          <nav
            aria-label="Mobile"
            className="mb-4 grid gap-1 rounded-2xl border border-border bg-card p-4 shadow-xl lg:hidden"
          >
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              )
            )}
            {!isAuthenticated ? (
              <Button
                variant="outline"
                className="mt-2 w-full rounded-full"
                onClick={() => {
                  setOpen(false);
                  setAuthModalOpen(true);
                }}
              >
                <UserRound className="size-4 mr-1.5" />
                Sign In / Get Started
              </Button>
            ) : null}
          </nav>
        ) : null}
      </header>

      {/* Unified Auth Modal */}
      <UnifiedAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
