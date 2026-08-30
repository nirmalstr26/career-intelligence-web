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
      <div className="pointer-events-none absolute inset-0 -top-10 -bottom-16 flex items-center justify-center select-none overflow-hidden">
        <div className="relative w-full max-w-[1800px] h-[760px] lg:h-[880px] flex items-center justify-center">
          
          {/* Luminous Ambient Glow Underlayer */}
          <div 
            className="absolute inset-0 -z-10 opacity-80 dark:opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(6, 215, 247, 0.22), rgba(99, 102, 241, 0.18) 40%, rgba(168, 85, 247, 0.12) 65%, transparent 90%)",
            }}
          />

          <img
            src={heroBgImage || "/brand/hero_background_home.png"}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105 select-none transition-all duration-300 opacity-100 dark:opacity-95 contrast-[1.12] saturate-[1.25] brightness-[1.04] dark:contrast-100 dark:saturate-100 dark:brightness-100"
          />

          {/* Dark theme gradient overlays */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent opacity-90" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-transparent to-transparent opacity-85" />
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-80" />

          {/* Light theme soft edge blending - only fades the outermost boundaries so the full scene is 100% visible & vibrant */}
          <div className="dark:hidden absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="dark:hidden absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
          <div className="dark:hidden absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background/40 to-transparent" />
          <div className="dark:hidden absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/40 to-transparent" />
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
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem] font-extrabold tracking-tight text-foreground leading-[1.08] drop-shadow-sm">
            Turn ambition <br />
            into a career <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
              roadmap.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed max-w-lg font-medium">
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
