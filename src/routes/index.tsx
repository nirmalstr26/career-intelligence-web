import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TruthfulProofBar } from "@/components/landing/TruthfulProofBar";
import { PlatformCapabilities } from "@/components/landing/PlatformCapabilities";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoachPreview } from "@/components/landing/CoachPreview";
import { KnowledgeGraphPreview } from "@/components/landing/KnowledgeGraphPreview";
import { ReadinessPreview } from "@/components/landing/ReadinessPreview";
import { CareerPathsSection } from "@/components/landing/CareerPathsSection";
import { CollegesSection } from "@/components/landing/CollegesSection";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/lib/auth/AuthProvider";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPAR AI — AI Career Intelligence & Placement Operating System" },
      {
        name: "description",
        content:
          "SPAR AI is an adaptive career operating system for students and universities: evidence-based career discovery, benchmark readiness scoring, practical projects, and university placement intelligence.",
      },
      { property: "og:title", content: "SPAR AI — Turn ambition into a career roadmap" },
      {
        property: "og:description",
        content:
          "AI-powered career discovery, verified capability evidence, practical projects, and university placement intelligence.",
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
    trackLandingEvent("LANDING_VIEWED");
  }, []);

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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Ambient Glow Gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[800px] -z-20 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(6, 215, 247, 0.18), rgba(70, 87, 255, 0.08) 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div>
        <Navbar />

        <main className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 space-y-4">
          {/* 1. Hero Section with Animated Luminous Career Road & Auth Card */}
          <Hero />

          {/* 2. Truthful System Capabilities Proof Bar */}
          <TruthfulProofBar />

          {/* 3. 3x2 Platform Capability Cards */}
          <PlatformCapabilities />

          {/* 4. How It Works 5-Step Connected Visual Progression */}
          <HowItWorks />

          {/* 5. SPAR Coach Contextual AI Preview */}
          <CoachPreview />

          {/* 6. Career Knowledge Graph Architecture Preview */}
          <KnowledgeGraphPreview />

          {/* 7. Benchmark Readiness Intelligence Preview */}
          <ReadinessPreview />

          {/* 8. Supported Career Paths Showcase */}
          <CareerPathsSection />

          {/* 9. University / College Cohort Intelligence Section */}
          <CollegesSection />
        </main>
      </div>

      {/* 10. Comprehensive Public Footer */}
      <Footer />
    </div>
  );
}
