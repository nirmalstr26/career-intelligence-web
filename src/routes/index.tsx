import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedCollegesStrip } from "@/components/landing/TrustedCollegesStrip";
import { PlatformCapabilities } from "@/components/landing/PlatformCapabilities";
import { UnifiedArchitecture } from "@/components/landing/UnifiedArchitecture";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { IntelligenceInAction } from "@/components/landing/IntelligenceInAction";
import { CareerPathsSection } from "@/components/landing/CareerPathsSection";
import { CollegesSection } from "@/components/landing/CollegesSection";
import { OutcomesSlider } from "@/components/landing/OutcomesSlider";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/lib/auth/AuthProvider";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPAR AI — AI Career Intelligence for College Students" },
      {
        name: "description",
        content:
          "Discover career paths, build real skills, track readiness and prepare for placements with personalized AI career guidance from SPAR.",
      },
      { property: "og:title", content: "SPAR AI — AI Career Intelligence for College Students" },
      {
        property: "og:description",
        content:
          "Discover career paths, build real skills, track readiness and prepare for placements with personalized AI career guidance from SPAR.",
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
      {/* Dynamic Ambient Background Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[960px] -z-20 opacity-85 dark:opacity-70 transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% 12%, rgba(6, 215, 247, 0.2), rgba(70, 87, 255, 0.14) 45%, transparent 80%)",
        }}
        aria-hidden="true"
      />
      
      {/* Secondary Ambient Light Aura for Light Theme */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[120px] h-[640px] -z-20 opacity-70 dark:hidden transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(168, 85, 247, 0.12), rgba(6, 215, 247, 0.15) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div>
        <Navbar />

        <main className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
          {/* 01 — Hero (What SPAR is + Signup) */}
          <Hero />

          {/* Pilot Credibility Pillar Strip */}
          <TrustedCollegesStrip />

          {/* 02 — Product Capabilities Carousel (What SPAR actually does) */}
          <PlatformCapabilities />

          {/* 03 — Connected Career Intelligence (Why SPAR is different) */}
          <UnifiedArchitecture />

          {/* 04 — Placement Journey (How a student progresses) */}
          <HowItWorks />

          {/* 05 — Intelligence in Action (SPAR Coach + Readiness Intelligence) */}
          <IntelligenceInAction />

          {/* 06 — Career Directions (Where SPAR can take the student) */}
          <CareerPathsSection />

          {/* 07 — Outcomes Journey (Auto-playing image slider) */}
          <OutcomesSlider />

          {/* 08 — Colleges (Institutional Value Proposition) */}
          <CollegesSection />
        </main>
      </div>

      {/* 08 — Minimal Production Footer */}
      <Footer />
    </div>
  );
}
