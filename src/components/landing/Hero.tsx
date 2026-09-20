import React, { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, Users, Zap, BookOpen, Target, Award } from "lucide-react";
import { AuthCard } from "@/components/landing/AuthCard";

/* ------------------------------------------------------------------
 * ANIMATED AURORA CANVAS
 * Pure-CSS aurora orbs + a scrolling grid — zero external deps.
 * ------------------------------------------------------------------ */
function AuroraBackground({ parallax }: { parallax: number }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ transform: `translate3d(0, ${parallax * 0.06}px, 0)` }}
      aria-hidden="true"
    >
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[#020817]" />

      {/* Scrolling perspective grid */}
      <div className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,215,247,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,215,247,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          animation: "grid-scroll 6s linear infinite",
        }}
      />

      {/* Aurora orb 1 — cyan */}
      <div
        className="absolute"
        style={{
          width: "70vw",
          height: "70vw",
          top: "-20%",
          left: "-15%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,215,247,0.28) 0%, rgba(6,215,247,0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-1 18s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Aurora orb 2 — indigo */}
      <div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          top: "10%",
          right: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)",
          filter: "blur(70px)",
          animation: "aurora-2 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Aurora orb 3 — violet */}
      <div
        className="absolute"
        style={{
          width: "50vw",
          height: "50vw",
          bottom: "-5%",
          left: "25%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.06) 50%, transparent 70%)",
          filter: "blur(80px)",
          animation: "aurora-3 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(6,215,247,0.6) 30%, rgba(6,215,247,0.9) 50%, rgba(6,215,247,0.6) 70%, transparent 100%)",
          boxShadow: "0 0 12px rgba(6,215,247,0.6)",
          animation: "scan-line 8s linear infinite",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,8,23,0.7) 100%)",
        }}
      />

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * ANIMATED STAT TICKER
 * ------------------------------------------------------------------ */
interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { icon: Users,    value: "12,000+", label: "Students",      color: "text-cyan-400" },
  { icon: Target,   value: "94%",     label: "Placed",        color: "text-indigo-400" },
  { icon: BookOpen, value: "200+",    label: "Modules",       color: "text-purple-400" },
  { icon: Award,    value: "4.8★",    label: "Avg Rating",    color: "text-emerald-400" },
];

function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  const Icon = stat.icon;
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm"
      style={{
        animation: `stat-count 0.6s ease forwards ${delay}ms`,
        opacity: 0,
      }}
    >
      <Icon className={`size-4 shrink-0 ${stat.color}`} />
      <div>
        <div className={`font-display text-sm font-extrabold leading-none ${stat.color}`}>
          {stat.value}
        </div>
        <div className="text-[10px] text-white/50 leading-none mt-0.5">{stat.label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * ANIMATED CAPABILITY PILLS
 * ------------------------------------------------------------------ */
const CAPABILITIES = [
  { icon: "🎯", label: "AI Career Matching" },
  { icon: "🗺️", label: "Personalised Roadmap" },
  { icon: "💡", label: "Interview Coaching" },
  { icon: "📊", label: "Readiness Score" },
  { icon: "🏗️", label: "Project Guidance" },
  { icon: "🚀", label: "Placement Ready" },
];

function CapabilityPills() {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {CAPABILITIES.map((cap, i) => (
        <span
          key={cap.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300"
          style={{
            animation: `hero-fade-up 0.5s ease forwards ${600 + i * 80}ms`,
            opacity: 0,
          }}
        >
          <span>{cap.icon}</span>
          {cap.label}
        </span>
      ))}
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
    ) return;
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
 * HERO
 * Layout: full-bleed aurora bg | 2-col: [copy + pills] [auth card]
 * ------------------------------------------------------------------ */
export function Hero() {
  const parallax = useHeroParallax(0.14);

  return (
    <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden pt-4 pb-16">
      {/* ── FULL-BLEED ANIMATED BACKGROUND ─────────────────────────── */}
      <AuroraBackground parallax={parallax} />

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-center">

          {/* ── LEFT: VALUE PROP ────────────────────────────────────── */}
          <div className="space-y-7">

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-md"
              style={{ animation: "hero-fade-up 0.5s ease forwards 0ms", opacity: 0 }}
            >
              <Sparkles className="size-3.5 text-cyan-400" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-cyan-300">
                AI Career Intelligence · India's #1
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: "hero-fade-up 0.55s ease forwards 120ms", opacity: 0 }}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] text-white">
                Your career,{" "}
                <span className="relative inline-block">
                  <span
                    className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent"
                    style={{ backgroundSize: "200% auto", animation: "gradient-pan 4s linear infinite" }}
                  >
                    engineered
                  </span>
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
              SPAR maps your strengths to real career paths, builds a personalised skill roadmap,
              coaches you through mock interviews, and tracks your readiness — all in one AI-powered
              platform built for college students.
            </p>

            {/* Capability pills */}
            <CapabilityPills />

            {/* Stats row */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
              style={{ animation: "hero-fade-up 0.5s ease forwards 500ms", opacity: 0 }}
            >
              {STATS.map((s, i) => (
                <StatCard key={s.label} stat={s} delay={800 + i * 100} />
              ))}
            </div>

            {/* Trust strip */}
            <div
              className="flex items-center gap-3"
              style={{ animation: "hero-fade-up 0.5s ease forwards 700ms", opacity: 0 }}
            >
              <div className="flex -space-x-2">
                {["bg-cyan-500", "bg-indigo-500", "bg-violet-500", "bg-emerald-500"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className={`size-7 rounded-full border-2 border-[#020817] ${c} flex items-center justify-center text-[9px] font-bold text-white`}
                    >
                      {["S", "A", "R", "P"][i]}
                    </div>
                  )
                )}
              </div>
              <p className="text-xs text-white/40">
                Trusted by students at <span className="text-white/70 font-medium">VIT, SRM, BITS</span> and 60+ colleges
              </p>
            </div>
          </div>

          {/* ── RIGHT: AUTH CARD ────────────────────────────────────── */}
          <div
            className="flex justify-center lg:justify-end"
            style={{ animation: "hero-fade-up 0.65s ease forwards 300ms", opacity: 0 }}
          >
            {/* Glow ring behind card */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(6,215,247,0.2) 0%, rgba(99,102,241,0.15) 50%, transparent 70%)",
                  filter: "blur(20px)",
                  animation: "glow-pulse 4s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <AuthCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
