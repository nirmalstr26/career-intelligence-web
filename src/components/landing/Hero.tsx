import React from "react";
import { Sparkles } from "lucide-react";
import heroBgImage from "@/assets/hero_background_home.png";
import { CareerRoadArt } from "@/components/landing/CareerRoadArt";
import { AuthCard } from "@/components/landing/AuthCard";
import { ConstellationCapabilityRoadmap } from "@/components/landing/ConstellationCapabilityRoadmap";

export function Hero() {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      {/* EXPANSIVE SEAMLESS BACKGROUND ARTWORK LAYER */}
      <div className="pointer-events-none absolute inset-0 -top-8 -bottom-16 flex items-center justify-center select-none overflow-hidden">
        <div className="relative w-full max-w-[1600px] h-[720px] lg:h-[820px] flex items-center justify-center">
          <img
            src={heroBgImage || "/brand/hero_background_home.png"}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105 opacity-85 dark:opacity-95 select-none transition-opacity"
            style={{
              maskImage:
                "radial-gradient(ellipse 60% 60% at 50% 45%, black 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 75%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 60% at 50% 45%, black 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 75%, transparent 95%)",
            }}
          />

          {/* Dark theme gradient overlays */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/35 to-transparent opacity-90" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-transparent opacity-85" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-90" />

          {/* Light theme gradient overlays */}
          <div className="dark:hidden absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
          <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent opacity-80" />
          <div className="dark:hidden absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-90" />
        </div>
      </div>

      {/* 3-Column Clean Three-Zone Composition */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr_420px] xl:grid-cols-[1.2fr_1fr_430px] items-center gap-8 lg:gap-6 xl:gap-8">
        
        {/* LEFT COLUMN: Value Proposition + Animated Constellation Capability Roadmap */}
        <div className="space-y-6 pt-2">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1.5 text-xs text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.15)] backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-500" />
            <span className="font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase">
              AI Career Intelligence for College Students
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem] font-extrabold tracking-tight text-foreground leading-[1.08]">
            Turn ambition <br />
            into a career <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
              roadmap.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
            SPAR AI helps you discover the right careers, build in-demand skills, track your readiness, and get placement ready with continuous AI guidance.
          </p>

          {/* ANIMATED CONSTELLATION CAPABILITY ROADMAP (Career Discovery -> Personalized Roadmap -> Verified Projects -> Placement Readiness) */}
          <div className="pt-2">
            <ConstellationCapabilityRoadmap />
          </div>
        </div>

        {/* CENTER COLUMN: Visual Career Path (Clean, floating stats card removed) */}
        <div className="flex flex-col items-center justify-center h-full pt-1">
          <CareerRoadArt />
        </div>

        {/* RIGHT COLUMN: Radiant Light Glowing Glassmorphic Auth Panel */}
        <div className="flex justify-center lg:justify-end pt-1">
          <AuthCard />
        </div>

      </div>
    </section>
  );
}
