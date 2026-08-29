import React from "react";
import { ArrowRight, Compass, CheckCircle2, Award, Terminal, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareerJourneyRoad } from "@/components/landing/CareerJourneyRoad";
import { AuthCard } from "@/components/landing/AuthCard";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export function Hero() {
  const handleStartJourney = () => {
    trackLandingEvent("GET_STARTED_CLICKED");
    const authCard = document.getElementById("auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const emailInput = authCard.querySelector("input[type='email']") as HTMLInputElement | null;
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 400);
      }
    }
  };

  return (
    <section className="relative grid items-center gap-10 pt-8 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12 lg:pt-14 lg:pb-20">
      {/* Background Animated Luminous Career Road */}
      <CareerJourneyRoad />

      {/* Left Column: Hero Copy & Value Points */}
      <div className="relative z-10 space-y-6 lg:max-w-[620px]">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.2)] backdrop-blur">
          <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px]">AI-Powered Career Intelligence</span>
        </div>

        {/* Main Headline with Gradient Career Roadmap text */}
        <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.85rem]">
          Turn ambition <br />
          into a{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            career roadmap.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
          Discover where you fit, build the skills that matter, prove what you can do, and prepare
          for real opportunities — with SPAR guiding every step.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
          <Button
            size="lg"
            onClick={handleStartJourney}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(6,215,247,0.4)] hover:brightness-110 hover:scale-[1.02] transition-all gap-2"
          >
            Start My Career Journey
            <ArrowRight className="size-4" />
          </Button>

          <a
            href="#careers"
            onClick={() => trackLandingEvent("CAREER_PATH_EXPLORED")}
            className="inline-flex items-center justify-center rounded-2xl border border-border/80 bg-surface/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary hover:border-cyan-500/40 transition-all gap-2"
          >
            <Compass className="size-4 text-cyan-400" />
            Explore Career Paths
          </a>
        </div>

        {/* Truthful Core Value Points (No fake metrics) */}
        <div className="grid gap-3 pt-4 sm:grid-cols-3 border-t border-border/60">
          <div className="flex items-start gap-2.5">
            <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">AI Discovery</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Find role fit by interest & skills</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Terminal className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Real Projects</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Build proven code artifacts</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Verified Proof</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Readiness score & interview practice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Unified Google + Passwordless Email Auth Panel */}
      <div className="relative z-10 flex justify-center lg:justify-end">
        <AuthCard />
      </div>
    </section>
  );
}
