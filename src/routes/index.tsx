import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerAI — AI Career Intelligence for College Students" },
      {
        name: "description",
        content:
          "CareerAI is an AI-powered career operating system for college students: career discovery, readiness tracking, and placement guidance in one platform.",
      },
      { property: "og:title", content: "CareerAI — Build the career you're meant for" },
      {
        property: "og:description",
        content:
          "AI-powered career discovery, readiness tracking, and placement guidance for college students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { status, onboardingRequired } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      void navigate({ to: onboardingRequired ? "/onboarding" : "/app/home" });
    }
  }, [status, onboardingRequired, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] lg:hidden"
        style={{ backgroundImage: "var(--gradient-hero-glow)" }}
        aria-hidden="true"
      />

      <Navbar />

      <main className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-20">
        <Hero />
        <TrustStrip />
      </main>
    </div>
  );
}
