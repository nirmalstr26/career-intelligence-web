import React from "react";
import { Sparkles } from "lucide-react";
import heroBgImage from "@/assets/hero_background_home.png";
import { CareerRoadArt } from "@/components/landing/CareerRoadArt";
import { AuthCard } from "@/components/landing/AuthCard";
import { ConstellationCapabilityRoadmap } from "@/components/landing/ConstellationCapabilityRoadmap";

export function Hero() {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      {/* EXPANSIVE HIGH-VISIBILITY BACKGROUND ARTWORK LAYER */}
      <div className="pointer-events-none absolute inset-0 -top-10 -bottom-14 flex items-center justify-center select-none overflow-hidden">
        <div className="relative w-full max-w-[1920px] h-full min-h-[760px] lg:min-h-[880px] flex items-center justify-center">
          
          {/* Enhanced Rich Atmospheric Aura */}
          <div 
            className="absolute inset-0 -z-10 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(6, 215, 247, 0.28), rgba(99, 102, 241, 0.22) 42%, rgba(168, 85, 247, 0.15) 68%, transparent 95%)",
            }}
          />

          <img
            src={heroBgImage || "/brand/hero_background_home.png"}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center select-none transition-all duration-300 opacity-100"
            style={{
              filter: "contrast(1.18) saturate(1.3) brightness(1.04)",
            }}
          />

          {/* Minimal seamless bottom fade into trusted colleges strip */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent opacity-80" />
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
          <p className="text-xs sm:text-sm text-foreground/85 dark:text-muted-foreground leading-relaxed max-w-lg font-medium">
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
