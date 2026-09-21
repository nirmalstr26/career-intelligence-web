import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Users,
  BookOpen,
  Award,
  BrainCircuit,
  Compass,
  MessageSquareCode,
  Activity,
  FolderGit2,
  Rocket,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AuthCard } from "@/components/landing/AuthCard";

/* ------------------------------------------------------------------
 * FULL-BLEED ANIMATED AURORA & CYBER CANVAS (Edge-to-Edge)
 * ------------------------------------------------------------------ */
function AuroraBackground({ parallax }: { parallax: number }) {
  // Pre-calculated deterministic floating dust particles
  const particles = [
    { top: "18%", left: "12%", delay: "0s", duration: "7s", size: "3px" },
    { top: "32%", left: "28%", delay: "1.5s", duration: "8.5s", size: "2px" },
    { top: "65%", left: "18%", delay: "3s", duration: "6s", size: "4px" },
    { top: "25%", left: "75%", delay: "0.8s", duration: "9s", size: "3px" },
    { top: "50%", left: "62%", delay: "2.2s", duration: "7.5s", size: "2.5px" },
    { top: "78%", left: "82%", delay: "4s", duration: "6.5s", size: "3px" },
    { top: "85%", left: "45%", delay: "1.2s", duration: "8s", size: "2px" },
    { top: "12%", left: "55%", delay: "3.5s", duration: "10s", size: "3.5px" },
    { top: "42%", left: "90%", delay: "2s", duration: "7s", size: "2px" },
    { top: "70%", left: "32%", delay: "0.4s", duration: "8s", size: "3px" },
    { top: "22%", left: "40%", delay: "2.8s", duration: "9.5s", size: "2px" },
    { top: "58%", left: "8%", delay: "1.9s", duration: "7.2s", size: "3px" },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ transform: `translate3d(0, ${parallax * 0.06}px, 0)` }}
      aria-hidden="true"
    >
      {/* Deep Space Foundation */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Perspective Cyber Grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,215,247,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,215,247,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          animation: "grid-scroll 8s linear infinite",
        }}
      />

      {/* Floating Star Dust / Particle Drift */}
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-cyan-300"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 8px rgba(6,215,247,0.9), 0 0 16px rgba(6,215,247,0.4)",
            animation: `particle-drift ${p.duration} ease-in-out infinite ${p.delay}`,
          }}
        />
      ))}

      {/* Dynamic Multi-Color Aurora Mesh Orbs */}
      {/* Orb 1: Cyan High Orbit */}
      <div
        className="absolute"
        style={{
          width: "65vw",
          height: "65vw",
          top: "-18%",
          left: "-12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,215,247,0.26) 0%, rgba(6,215,247,0.08) 45%, transparent 70%)",
          filter: "blur(65px)",
          animation: "aurora-1 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Orb 2: Electric Indigo Mid Horizon */}
      <div
        className="absolute"
        style={{
          width: "55vw",
          height: "55vw",
          top: "8%",
          right: "-8%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(99,102,241,0.07) 50%, transparent 70%)",
          filter: "blur(75px)",
          animation: "aurora-2 24s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Orb 3: Ultraviolet Core */}
      <div
        className="absolute"
        style={{
          width: "48vw",
          height: "48vw",
          bottom: "-6%",
          left: "22%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.24) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)",
          filter: "blur(85px)",
          animation: "aurora-3 28s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Orb 4: Emerald Ascent */}
      <div
        className="absolute"
        style={{
          width: "35vw",
          height: "35vw",
          top: "40%",
          left: "5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: "aurora-1 26s ease-in-out infinite reverse",
          willChange: "transform",
        }}
      />

      {/* High-Tech Sweep Scanline */}
      <div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(6,215,247,0.4) 25%, rgba(6,215,247,0.95) 50%, rgba(6,215,247,0.4) 75%, transparent 100%)",
          boxShadow: "0 0 16px rgba(6,215,247,0.8), 0 0 32px rgba(6,215,247,0.3)",
          animation: "scan-line 9s linear infinite",
        }}
      />

      {/* Vignette Depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 35%, rgba(2,6,23,0.85) 100%)",
        }}
      />

      {/* Seamless Bottom Gradient Fade into Page */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * CAPABILITY DATA & RICH ANIMATED CARDS (No Emojis — High Quality)
 * ------------------------------------------------------------------ */
interface CapabilityItem {
  id: string;
  label: string;
  subtext: string;
  metricBadge: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  icon: React.ElementType;
  renderVisual: () => React.ReactNode;
}

const CAPABILITY_ITEMS: CapabilityItem[] = [
  {
    id: "ai-matching",
    label: "AI Career Matching",
    subtext: "Neural skill-to-role vector fit",
    metricBadge: "98% Match Fit",
    accentColor: "text-cyan-400",
    glowColor: "rgba(6,215,247,0.4)",
    borderColor: "rgba(6,215,247,0.25)",
    bgGradient: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    icon: BrainCircuit,
    renderVisual: () => (
      <div className="relative size-7 flex items-center justify-center">
        {/* Radar ping ring */}
        <span
          className="absolute inset-0 rounded-full border border-cyan-400/80"
          style={{ animation: "radar-ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        <span className="relative size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,215,247,0.9)]" />
      </div>
    ),
  },
  {
    id: "roadmap",
    label: "Personalised Roadmap",
    subtext: "Adaptive sequenced sprint mastery",
    metricBadge: "Sprint 1 → 5",
    accentColor: "text-indigo-400",
    glowColor: "rgba(99,102,241,0.4)",
    borderColor: "rgba(99,102,241,0.25)",
    bgGradient: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    icon: Compass,
    renderVisual: () => (
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
        <span className="w-3 h-[1.5px] bg-gradient-to-r from-indigo-400 to-indigo-500/30" />
        <span className="size-1.5 rounded-full bg-indigo-400/60" />
        <span className="w-3 h-[1.5px] bg-gradient-to-r from-indigo-400/60 to-indigo-400/20" />
        <span className="size-1.5 rounded-full bg-indigo-400/30" />
      </div>
    ),
  },
  {
    id: "interview",
    label: "Interview Coaching",
    subtext: "AI mock rounds with real-time cues",
    metricBadge: "Live Voice & Code",
    accentColor: "text-violet-400",
    glowColor: "rgba(168,85,247,0.4)",
    borderColor: "rgba(168,85,247,0.25)",
    bgGradient: "from-violet-500/15 via-violet-500/5 to-transparent",
    icon: MessageSquareCode,
    renderVisual: () => (
      /* Animated Voice Equalizer Soundwave */
      <div className="flex items-end gap-[3px] h-4.5 px-1 py-0.5 rounded bg-violet-950/40 border border-violet-500/30">
        <span
          className="w-[2.5px] bg-violet-400 rounded-full"
          style={{ animation: "wave-bar-1 0.9s ease-in-out infinite" }}
        />
        <span
          className="w-[2.5px] bg-violet-300 rounded-full"
          style={{ animation: "wave-bar-2 1.1s ease-in-out infinite" }}
        />
        <span
          className="w-[2.5px] bg-violet-400 rounded-full"
          style={{ animation: "wave-bar-3 0.8s ease-in-out infinite" }}
        />
        <span
          className="w-[2.5px] bg-violet-300 rounded-full"
          style={{ animation: "wave-bar-4 1.2s ease-in-out infinite" }}
        />
      </div>
    ),
  },
  {
    id: "readiness",
    label: "Readiness Score",
    subtext: "Live placement probability index",
    metricBadge: "88% Hire Ready",
    accentColor: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.4)",
    borderColor: "rgba(16,185,129,0.25)",
    bgGradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    icon: Activity,
    renderVisual: () => (
      /* Circular SVG Progress Meter */
      <div className="relative size-6 flex items-center justify-center">
        <svg className="size-6 -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="rgba(16,185,129,0.2)"
            strokeWidth="2.5"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="56.5"
            strokeDashoffset="10"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.6))" }}
          />
        </svg>
        <span className="absolute text-[8px] font-bold text-emerald-300">88</span>
      </div>
    ),
  },
  {
    id: "projects",
    label: "Project Guidance",
    subtext: "Production-grade portfolio proof",
    metricBadge: "Repo Verified",
    accentColor: "text-teal-400",
    glowColor: "rgba(20,184,166,0.4)",
    borderColor: "rgba(20,184,166,0.25)",
    bgGradient: "from-teal-500/15 via-teal-500/5 to-transparent",
    icon: FolderGit2,
    renderVisual: () => (
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-teal-300/80 bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-500/30">
        <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
        <span>git:main</span>
      </div>
    ),
  },
  {
    id: "placement",
    label: "Placement Ready",
    subtext: "Fast-track pipeline to top recruiters",
    metricBadge: "Direct Connect",
    accentColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.4)",
    borderColor: "rgba(245,158,11,0.25)",
    bgGradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    icon: Rocket,
    renderVisual: () => (
      <div className="flex items-center gap-1">
        <Zap className="size-3 text-amber-400 animate-pulse" />
        <span className="text-[9px] font-bold tracking-wider text-amber-300 uppercase">
          FAST
        </span>
      </div>
    ),
  },
];

function CapabilityCard({
  item,
  index,
}: {
  item: CapabilityItem;
  index: number;
}) {
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-xl p-3.5 cursor-default select-none overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${hovered ? item.glowColor : item.borderColor}`,
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`
          : "rgba(15,23,42,0.65)",
        boxShadow: hovered
          ? `0 10px 28px -4px ${item.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : "0 4px 12px rgba(0,0,0,0.3)",
        backdropFilter: "blur(14px)",
        animation: `hero-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards ${
          420 + index * 60
        }ms`,
        opacity: 0,
        transform: hovered ? "translateY(-3px) scale(1.015)" : "translateY(0) scale(1)",
      }}
    >
      {/* Top Header: Icon + Visual Micro-Animation + Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Glowing Icon Capsule */}
          <div
            className="size-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              background: `radial-gradient(circle, ${item.glowColor.replace(
                "0.4",
                "0.25"
              )} 0%, rgba(255,255,255,0.03) 75%)`,
              border: `1px solid ${item.borderColor}`,
              boxShadow: hovered ? `0 0 14px ${item.glowColor}` : "none",
            }}
          >
            <Icon
              className={`size-4 ${item.accentColor} transition-all duration-300`}
              style={{
                filter: hovered
                  ? `drop-shadow(0 0 6px ${item.glowColor})`
                  : "none",
              }}
            />
          </div>

          {/* Micro Animation / HUD element */}
          <div className="shrink-0">{item.renderVisual()}</div>
        </div>

        {/* Small Metric Pill */}
        <span
          className="text-[9.5px] font-semibold tracking-wide px-2 py-0.5 rounded-full border transition-all duration-300"
          style={{
            borderColor: hovered ? item.glowColor : item.borderColor,
            background: hovered
              ? item.glowColor.replace("0.4", "0.15")
              : "rgba(255,255,255,0.03)",
            color: hovered ? "#ffffff" : "rgba(255,255,255,0.75)",
          }}
        >
          {item.metricBadge}
        </span>
      </div>

      {/* Title & Subtext */}
      <div>
        <h3
          className={`text-xs sm:text-[13px] font-bold leading-tight tracking-tight ${item.accentColor} transition-colors duration-300`}
        >
          {item.label}
        </h3>
        <p className="text-[10px] sm:text-[10.5px] text-white/50 leading-normal mt-0.5 font-normal">
          {item.subtext}
        </p>
      </div>

      {/* Shimmer sweep on hover */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
            animation: "badge-shimmer 1.2s ease-in-out infinite",
          }}
        />
      )}

      {/* Bottom accent glow line */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1.5px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.glowColor}, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * STAT CARDS — Futuristic Glassmorphism HUD Pods
 * ------------------------------------------------------------------ */
interface StatItem {
  icon: React.ElementType;
  value: string;
  suffix: string;
  label: string;
  microSub: string;
  color: string;
  glow: string;
  bgGradient: string;
  progressPercent: string;
}

const STAT_ITEMS: StatItem[] = [
  {
    icon: Users,
    value: "12,000",
    suffix: "+",
    label: "Active Students",
    microSub: "60+ Universities",
    color: "text-cyan-400",
    glow: "rgba(6,215,247,0.45)",
    bgGradient: "rgba(6,215,247,0.08)",
    progressPercent: "85%",
  },
  {
    icon: TrendingUp,
    value: "94",
    suffix: "%",
    label: "Placement Rate",
    microSub: "In 6 Months",
    color: "text-indigo-400",
    glow: "rgba(99,102,241,0.45)",
    bgGradient: "rgba(99,102,241,0.08)",
    progressPercent: "94%",
  },
  {
    icon: BookOpen,
    value: "200",
    suffix: "+",
    label: "Skill Modules",
    microSub: "Curated Tracks",
    color: "text-violet-400",
    glow: "rgba(168,85,247,0.45)",
    bgGradient: "rgba(168,85,247,0.08)",
    progressPercent: "90%",
  },
  {
    icon: Award,
    value: "4.8",
    suffix: "★",
    label: "Avg Rating",
    microSub: "8,400+ Reviews",
    color: "text-emerald-400",
    glow: "rgba(16,185,129,0.45)",
    bgGradient: "rgba(16,185,129,0.08)",
    progressPercent: "96%",
  },
];

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const Icon = stat.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col justify-between rounded-2xl p-4 overflow-hidden cursor-default transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${stat.bgGradient.replace(
              "0.08",
              "0.16"
            )}, rgba(15,23,42,0.85))`
          : `linear-gradient(135deg, ${stat.bgGradient}, rgba(15,23,42,0.6))`,
        border: `1px solid ${hovered ? stat.glow : stat.glow.replace("0.45", "0.2")}`,
        boxShadow: hovered
          ? `0 12px 32px -6px ${stat.glow.replace(
              "0.45",
              "0.3"
            )}, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 16px rgba(0,0,0,0.3)",
        backdropFilter: "blur(14px)",
        transform: hovered ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
        animation: `hero-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) forwards ${
          650 + index * 80
        }ms`,
        opacity: 0,
      }}
    >
      {/* Top Header: Icon + Micro Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="size-7.5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${stat.glow.replace(
              "0.45",
              "0.3"
            )} 0%, transparent 70%)`,
            border: `1px solid ${stat.glow.replace("0.45", "0.25")}`,
            boxShadow: hovered ? `0 0 12px ${stat.glow}` : "none",
          }}
        >
          <Icon
            className={`size-3.5 ${stat.color}`}
            style={{
              filter: hovered ? `drop-shadow(0 0 6px ${stat.glow})` : "none",
            }}
          />
        </div>

        <span className="text-[10px] font-medium text-white/40 tracking-tight text-right">
          {stat.microSub}
        </span>
      </div>

      {/* Number Value + Suffix */}
      <div className="mt-1">
        <div
          className={`font-display text-2xl sm:text-3xl font-black leading-none tracking-tight ${stat.color} transition-all duration-300`}
          style={{
            textShadow: hovered
              ? `0 0 18px ${stat.glow}, 0 0 36px ${stat.glow.replace("0.45", "0.2")}`
              : "none",
          }}
        >
          {stat.value}
          <span className="text-base sm:text-lg font-bold ml-0.5 opacity-85">
            {stat.suffix}
          </span>
        </div>
        <div className="text-[11px] font-medium text-white/60 leading-tight mt-1">
          {stat.label}
        </div>
      </div>

      {/* Animated Bottom Meter Bar */}
      <div className="mt-3 w-full h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: hovered ? "100%" : stat.progressPercent,
            background: `linear-gradient(90deg, ${stat.glow.replace(
              "0.45",
              "0.6"
            )}, ${stat.glow})`,
            boxShadow: hovered ? `0 0 8px ${stat.glow}` : "none",
          }}
        />
      </div>

      {/* Subtle Corner Light Flare */}
      <div
        className="absolute -top-6 -right-6 size-16 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${stat.glow}, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * PARALLAX HOOK
 * ------------------------------------------------------------------ */
function useHeroParallax(strength = 0.14) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setOffset(window.scrollY * strength);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);
  return offset;
}

/* ------------------------------------------------------------------
 * HERO MAIN COMPONENT
 * ------------------------------------------------------------------ */
export function Hero() {
  const parallax = useHeroParallax(0.14);

  return (
    <section className="relative isolate w-full min-h-[92vh] flex items-center overflow-hidden pt-6 pb-16">
      {/* ── 100% EDGE-TO-EDGE FULL-BLEED ANIMATED AURORA CANVAS ── */}
      <AuroraBackground parallax={parallax} />

      {/* ── CENTERED HERO CONTENT CONTAINER ────────────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_440px] gap-10 lg:gap-14 items-center">

          {/* ── LEFT COLUMN: VALUE PROPOSITION & CAPABILITIES ────── */}
          <div className="space-y-6 lg:space-y-7">

            {/* Futuristic Eyebrow Pill */}
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/35 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(6,215,247,0.2)]"
              style={{ animation: "hero-fade-up 0.5s ease forwards 0ms", opacity: 0 }}
            >
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute size-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <span className="size-1.5 rounded-full bg-cyan-400" />
              </div>
              <Sparkles className="size-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-200">
                AI Career Intelligence · India's #1 Platform
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: "hero-fade-up 0.55s ease forwards 120ms", opacity: 0 }}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-extrabold tracking-tight leading-[1.06] text-white">
                Your career,{" "}
                <span
                  className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% auto",
                    animation: "gradient-pan 4s linear infinite",
                  }}
                >
                  engineered
                </span>
                <br />
                by AI.
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl font-light"
              style={{ animation: "hero-fade-up 0.55s ease forwards 240ms", opacity: 0 }}
            >
              SPAR maps your strengths to high-demand careers, builds your adaptive
              skill roadmap, coaches you through real mock interviews, and tracks
              your hiring readiness — all in one AI platform built for college students.
            </p>

            {/* ── 6 RICH ANIMATED CAPABILITY CARDS (NO EMOJIS) ───── */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1"
              style={{ animation: "hero-fade-up 0.5s ease forwards 340ms", opacity: 0 }}
            >
              {CAPABILITY_ITEMS.map((item, i) => (
                <CapabilityCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* ── 4 STATS HUD CARDS ─────────────────────────────── */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1"
              style={{ animation: "hero-fade-up 0.5s ease forwards 480ms", opacity: 0 }}
            >
              {STAT_ITEMS.map((s, i) => (
                <StatCard key={s.label} stat={s} index={i} />
              ))}
            </div>

            {/* ── CREDIBILITY & TRUST STRIP ─────────────────────── */}
            <div
              className="flex flex-wrap items-center gap-3 pt-1"
              style={{ animation: "hero-fade-up 0.5s ease forwards 640ms", opacity: 0 }}
            >
              {/* College Avatars */}
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-gradient-to-br from-cyan-400 to-cyan-600", text: "VIT" },
                  { bg: "bg-gradient-to-br from-indigo-400 to-indigo-600", text: "SRM" },
                  { bg: "bg-gradient-to-br from-violet-400 to-violet-600", text: "BITS" },
                  { bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", text: "MIT" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`size-7 rounded-full border-2 border-[#020617] ${a.bg} flex items-center justify-center text-[8px] font-extrabold text-white shadow-lg`}
                  >
                    {a.text}
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/50">
                Trusted by students at{" "}
                <span className="text-white/80 font-semibold">
                  VIT, SRM, BITS, MIT
                </span>{" "}
                and 60+ colleges
              </p>

              <div className="flex items-center gap-1.5 ml-auto sm:ml-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 font-semibold">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>100% Free for Students</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: GLOWING HIGH-CONVERTING AUTH CARD ──── */}
          <div
            className="flex justify-center lg:justify-end"
            style={{ animation: "hero-fade-up 0.65s ease forwards 300ms", opacity: 0 }}
          >
            <div className="relative w-full max-w-[440px]">
              {/* Multi-Layered Neon Backlight Glow */}
              <div
                className="absolute -inset-6 rounded-3xl opacity-70 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(6,215,247,0.22) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)",
                  filter: "blur(28px)",
                  animation: "glow-pulse 4s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -inset-2 rounded-3xl opacity-50 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, rgba(6,215,247,0.3), transparent 60%)",
                  filter: "blur(14px)",
                  animation: "glow-pulse 4s ease-in-out infinite 2s",
                }}
                aria-hidden="true"
              />

              {/* The Actual Auth Card */}
              <AuthCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
