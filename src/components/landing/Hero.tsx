import React from "react";
import {
  Compass,
  Map,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";
import heroBgImage from "@/assets/hero_background_home.png";
import { CareerRoadArt } from "@/components/landing/CareerRoadArt";
import { StatsFloatingCard } from "@/components/landing/StatsFloatingCard";
import { AuthCard } from "@/components/landing/AuthCard";

interface FeatureTile {
  title: string;
  tagline: string;
  icon: React.ElementType;
  iconColor: string;
  glowColor: string;
}

// 4 Focused Hero Capabilities
const FEATURE_TILES: FeatureTile[] = [
  {
    title: "Career Discovery",
    tagline: "Target high-fit tech roles",
    icon: Compass,
    iconColor: "text-purple-500 dark:text-purple-400",
    glowColor: "border-purple-500/30 bg-purple-500/10 dark:bg-purple-950/40 shadow-sm",
  },
  {
    title: "Personalized Roadmap",
    tagline: "Adaptive milestone steps",
    icon: Map,
    iconColor: "text-blue-500 dark:text-blue-400",
    glowColor: "border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/40 shadow-sm",
  },
  {
    title: "Verified Projects",
    tagline: "Evidence-backed repositories",
    icon: Briefcase,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    glowColor: "border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-950/40 shadow-sm",
  },
  {
    title: "Placement Readiness",
    tagline: "Real-time hiring scoring",
    icon: Award,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    glowColor: "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 shadow-sm",
  },
];

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
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_420px] xl:grid-cols-[1.15fr_1.05fr_430px] items-center gap-8 lg:gap-6 xl:gap-8">
        
        {/* LEFT COLUMN: Value Proposition + 4 Clean Capability Chips */}
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

          {/* 4 Focused Capability Chips (2 Columns x 2 Rows) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 max-w-lg">
            {FEATURE_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.title}
                  className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/85 dark:bg-[#090e24]/80 p-3 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:-translate-y-0.5 shadow-sm"
                >
                  <div className={`grid size-8 shrink-0 place-items-center rounded-lg border ${tile.glowColor}`}>
                    <Icon className={`size-4 ${tile.iconColor}`} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-xs font-bold text-foreground truncate">
                      {tile.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {tile.tagline}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Visual Career Path + Floating Pilot Pillar Card */}
        <div className="flex flex-col items-center justify-between h-full pt-1">
          {/* Floating Pathway Milestone Chips */}
          <CareerRoadArt />

          {/* Bottom Pilot Pillar Card */}
          <div className="w-full flex justify-center -mt-6 sm:-mt-10 z-20">
            <StatsFloatingCard />
          </div>
        </div>

        {/* RIGHT COLUMN: Radiant Light Glowing Glassmorphic Auth Panel */}
        <div className="flex justify-center lg:justify-end pt-1">
          <AuthCard />
        </div>

      </div>
    </section>
  );
}
