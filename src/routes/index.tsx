import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";

import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPAR AI — AI Career Intelligence & Placement Operating System" },
      {
        name: "description",
        content:
          "SPAR AI is an adaptive career operating system for students and universities: evidence-based career discovery, benchmark readiness scoring, and placement pipeline in one platform.",
      },
      { property: "og:title", content: "SPAR AI — Build the career you're meant for" },
      {
        property: "og:description",
        content:
          "AI-powered career discovery, verified capability evidence, and university placement intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { status, onboardingRequired, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      if (user?.role === "COLLEGE_COORDINATOR" || user?.role === "COLLEGE_ADMIN") {
        void navigate({ to: "/college/dashboard" });
      } else if (user?.role === "PLATFORM_ADMIN") {
        void navigate({ to: "/admin" });
      } else if (user?.role === "RECRUITER") {
        void navigate({ to: "/recruiter/dashboard" });
      } else {
        void navigate({ to: onboardingRequired ? "/onboarding" : "/app/today" });
      }
    }
  }, [status, onboardingRequired, user, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] lg:hidden"
        style={{ backgroundImage: "var(--gradient-hero-glow)" }}
        aria-hidden="true"
      />

      <div>
        <Navbar />
        <main className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-20">
          <Hero />
          <TrustStrip />
        </main>
      </div>

      {/* Public Footer with Discreet Admin Link */}
      <footer className="border-t border-border bg-card/40 py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground">SPAR AI</span>
            <span>· Adaptive Career Intelligence & University Placement Operating System</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#product" className="hover:text-foreground transition-colors">Product</a>
            <a href="#careers" className="hover:text-foreground transition-colors">Careers</a>
            <Link to="/colleges" className="hover:text-foreground transition-colors">For Colleges</Link>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors border border-border/40 rounded-md px-2 py-0.5"
            >
              <Lock className="size-3" />
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
