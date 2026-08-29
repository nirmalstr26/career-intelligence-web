import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedCollegesStrip } from "@/components/landing/TrustedCollegesStrip";
import { PlatformCapabilities } from "@/components/landing/PlatformCapabilities";
import { UnifiedArchitecture } from "@/components/landing/UnifiedArchitecture";
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
      { title: "SPAR AI — Turn ambition into a career roadmap" },
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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 overflow-x-hidden transition-colors duration-300">
      {/* Dynamic Cosmic Background Glow for Dark Mode & Soft Radiant Bloom for Light Mode */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[960px] -z-20 opacity-75 dark:opacity-70 transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% 10%, rgba(6, 215, 247, 0.16), rgba(70, 87, 255, 0.12) 40%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div>
        <Navbar />

        <main className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
          {/* Main Hero (Left 6 Feature Tiles + Center Road & Stats + Right Auth Panel) */}
          <Hero />

          {/* Bottom Trusted by Leading Colleges Strip */}
          <TrustedCollegesStrip />

          {/* Deep Feature Exploration & Single-Row Auto-Scrolling Showcase */}
          <PlatformCapabilities />

          {/* Unified Career Intelligence Architecture Hub */}
          <UnifiedArchitecture />

          {/* Methodology: How SPAR Guides Your Entire Journey Roadmap */}
          <HowItWorks />

          {/* Supporting Deep Dives */}
          <CoachPreview />
          <KnowledgeGraphPreview />
          <ReadinessPreview />
          <CareerPathsSection />
          <CollegesSection />
        </main>
      </div>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
