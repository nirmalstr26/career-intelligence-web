import React from "react";
import {
  Compass,
  LineChart,
  FileText,
  UserCheck,
  Briefcase,
  Target,
  Sparkles,
} from "lucide-react";
import heroBgImage from "@/assets/hero_background_home.png";
import { CareerRoadArt } from "@/components/landing/CareerRoadArt";
import { StatsFloatingCard } from "@/components/landing/StatsFloatingCard";
import { AuthCard } from "@/components/landing/AuthCard";

interface FeatureTile {
  title: string;
  desc: string;
  icon: React.ElementType;
  iconColor: string;
  glowColor: string;
}

const FEATURE_TILES: FeatureTile[] = [
  {
    title: "Career Discovery",
    desc: "Find paths that match your strengths & goals",
    icon: Compass,
    iconColor: "text-purple-400",
    glowColor: "border-purple-500/30 bg-purple-950/40 shadow-[0_0_12px_rgba(130,71,255,0.2)]",
  },
  {
    title: "Readiness Tracking",
    desc: "Real-time insights on skills, progress & improvement",
    icon: LineChart,
    iconColor: "text-cyan-400",
    glowColor: "border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,215,247,0.2)]",
  },
  {
    title: "Resume & Profile Builder",
    desc: "Create a standout resume & portfolio that gets noticed",
    icon: FileText,
    iconColor: "text-purple-400",
    glowColor: "border-purple-500/30 bg-purple-950/40 shadow-[0_0_12px_rgba(130,71,255,0.2)]",
  },
  {
    title: "Mentor Guidance",
    desc: "Connect with mentors and get career advice",
    icon: UserCheck,
    iconColor: "text-blue-400",
    glowColor: "border-blue-500/30 bg-blue-950/40 shadow-[0_0_12px_rgba(0,140,255,0.2)]",
  },
  {
    title: "Internships & Projects",
    desc: "Discover verified opportunities to learn and grow",
    icon: Briefcase,
    iconColor: "text-purple-400",
    glowColor: "border-purple-500/30 bg-purple-950/40 shadow-[0_0_12px_rgba(130,71,255,0.2)]",
  },
  {
    title: "Placement Preparation",
    desc: "Aptitude, coding, mock interviews & company prep",
    icon: Target,
    iconColor: "text-cyan-400",
    glowColor: "border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,215,247,0.2)]",
  },
];

export function Hero() {
  return (
    <section className="relative pt-6 pb-8 overflow-visible">
      {/* 
        EXPANSIVE SEAMLESS BACKGROUND ARTWORK LAYER
        - Positioned behind the entire hero content
        - Universal smooth radial mask fading softly on all 4 sides
        - Directional edge gradient overlays to seamlessly blend into page background
      */}
      <div className="pointer-events-none absolute inset-0 -top-8 -bottom-10 -z-10 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-[1500px]">
          <img
            src={heroBgImage || "/brand/hero_background_home.png"}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105 select-none opacity-90"
            style={{
              maskImage:
                "radial-gradient(ellipse 72% 65% at 50% 42%, black 35%, rgba(0,0,0,0.8) 58%, rgba(0,0,0,0.2) 80%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 65% at 50% 42%, black 35%, rgba(0,0,0,0.8) 58%, rgba(0,0,0,0.2) 80%, transparent 100%)",
            }}
          />

          {/* Directional Soft Gradient Overlays for Zero Hard Edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-70" />
        </div>
      </div>

      {/* 3-Column Foreground Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_400px] xl:grid-cols-[1.15fr_1.05fr_410px] items-start gap-8 lg:gap-6 xl:gap-8">
        
        {/* LEFT COLUMN: Eyebrow + Headline + Description + 6 Feature Tiles */}
        <div className="space-y-6 pt-2">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-[#090e24]/90 px-3.5 py-1.5 text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.2)] backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span className="font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase">
              AI-Powered Career Intelligence for College Students
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[3.9rem] font-extrabold tracking-tight text-white leading-[1.08]">
            Turn ambition <br />
            into a career <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
              roadmap.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
            SPAR AI helps you discover the right careers, build in-demand skills, track your readiness, and get placement ready — with personalized AI guidance at every step.
          </p>

          {/* 6 Feature Tiles (2 Columns x 3 Rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg">
            {FEATURE_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.title}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-[#090e24]/80 p-3 sm:p-3.5 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:-translate-y-0.5"
                >
                  <div className={`grid size-9 shrink-0 place-items-center rounded-xl border ${tile.glowColor}`}>
                    <Icon className={`size-4.5 ${tile.iconColor}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-bold text-white">
                      {tile.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {tile.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Floating Pathway Milestone Chips + Floating Bottom Stats Card */}
        <div className="flex flex-col items-center justify-between h-full pt-1">
          {/* Floating Pathway Milestone Chips */}
          <CareerRoadArt />

          {/* Bottom Stats Card with Avatars & Stars */}
          <div className="w-full flex justify-center -mt-6 sm:-mt-10 z-20">
            <StatsFloatingCard />
          </div>
        </div>

        {/* RIGHT COLUMN: Pixel-Perfect 2-Tab Auth Panel */}
        <div className="flex justify-center lg:justify-end pt-1">
          <AuthCard />
        </div>

      </div>
    </section>
  );
}
