import { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
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

      {/* Orbital Dotted Trajectory Arc matching reference image */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 460 Q 480 610, 980 390 T 1480 260"
          fill="none"
          stroke="rgba(6,215,247,0.18)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle cx="260" cy="505" r="2.5" fill="#06d7f7" opacity="0.6" />
        <circle cx="560" cy="535" r="3" fill="#818cf8" opacity="0.7" />
        <circle cx="860" cy="450" r="2.5" fill="#a855f7" opacity="0.6" />
        <circle cx="1180" cy="340" r="3" fill="#06d7f7" opacity="0.7" />
      </svg>

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
 * TICKER ITEMS — horizontal scrolling strip
 * ------------------------------------------------------------------ */
const TICKER_ITEMS = [
  { label: "PERSONALISED ROADMAPS", dot: "cyan" },
  { label: "READINESS SCORE", dot: "indigo" },
  { label: "PROJECT GUIDANCE", dot: "violet" },
  { label: "PLACEMENT READY", dot: "emerald" },
  { label: "AI INTERVIEW COACH", dot: "cyan" },
  { label: "CAREER MATCHING", dot: "indigo" },
  { label: "LIVE MOCK ROUNDS", dot: "violet" },
  { label: "HIRING INTELLIGENCE", dot: "emerald" },
];

const DOT_COLOR: Record<string, string> = {
  cyan: "#06d7f7",
  indigo: "#818cf8",
  violet: "#a855f7",
  emerald: "#10b981",
};

function TickerStrip() {
  // Duplicate items so seamless loop works (we animate -50%)
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="relative w-full overflow-hidden py-1.5"
      style={{ mask: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "ticker-scroll 24s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-4 sm:px-5 text-[10.5px] font-bold tracking-widest uppercase text-white/40 select-none"
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{
                background: DOT_COLOR[item.dot],
                boxShadow: `0 0 6px ${DOT_COLOR[item.dot]}`,
              }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * STAT ROW — simple inline large numbers
 * ------------------------------------------------------------------ */
interface StatItem {
  value: string;
  suffix: string;
  label: string;
  subLabel: string;
  color: string;
}

const STAT_ITEMS: StatItem[] = [
  { value: "12,000", suffix: "+", label: "Active Students",  subLabel: "60+ Universities", color: "#06d7f7" },
  { value: "94",     suffix: "%", label: "Placement Rate",   subLabel: "In 6 Months",    color: "#818cf8" },
  { value: "200",    suffix: "+", label: "Skill Modules",    subLabel: "Curated Tracks",  color: "#a855f7" },
  { value: "4.8",    suffix: "★", label: "Avg Rating",      subLabel: "8,400+ Reviews",  color: "#10b981" },
];

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
    <section className="relative isolate w-full min-h-[92vh] flex items-center overflow-hidden pt-4 pb-14">
      {/* ── 100% EDGE-TO-EDGE FULL-BLEED ANIMATED AURORA CANVAS ── */}
      <AuroraBackground parallax={parallax} />

      {/* ── CENTERED HERO CONTENT CONTAINER ────────────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1.1fr)_440px] gap-8 lg:gap-12 xl:gap-14 items-center">

          {/* ── LEFT COLUMN: VALUE PROPOSITION & CAPABILITIES ────── */}
          <div className="space-y-5 lg:space-y-6 min-w-0 max-w-full">

            {/* Headline */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-extrabold tracking-tight leading-[1.06] text-white">
                Your career,{" "}
                <br className="hidden sm:block" />
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
            <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl font-light">
              SPAR maps your strengths to high-demand careers, builds your adaptive
              skill roadmap, coaches you through real mock interviews, and tracks
              your hiring readiness — all in one AI platform built for college students.
            </p>

            {/* ── SCROLLING TICKER STRIP (PERSONALISED ROADMAPS ETC) ─ */}
            <div className="w-full max-w-xl min-w-0 overflow-hidden">
              <TickerStrip />
            </div>

            {/* ── 4 STATS — clean inline row matching image ───────── */}
            <div className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-10 pt-1">
              {STAT_ITEMS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <div
                    className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black leading-none tracking-tight"
                    style={{ color: s.color, textShadow: `0 0 20px ${s.color}55` }}
                  >
                    {s.value}
                    <span className="text-base sm:text-lg font-bold ml-0.5">{s.suffix}</span>
                  </div>
                  <div className="text-[13px] font-bold text-white mt-1.5 leading-tight">{s.label}</div>
                  <div className="text-[11px] text-white/40 leading-tight mt-0.5">{s.subLabel}</div>
                  {/* Subtle colored glow bar underneath matching reference image */}
                  <div
                    className="h-[3px] w-8 rounded-full mt-2"
                    style={{
                      backgroundColor: s.color,
                      boxShadow: `0 0 8px ${s.color}88`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* ── CREDIBILITY & TRUST STRIP ─────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* College Avatars */}
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-cyan-500", text: "VIT" },
                  { bg: "bg-indigo-600", text: "SRM" },
                  { bg: "bg-violet-600", text: "BITS" },
                  { bg: "bg-emerald-500", text: "MIT" },
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

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold ml-1">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>100% Free for Students</span>
                <span className="text-emerald-400/70 font-bold">&gt;</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: GLOWING HIGH-CONVERTING AUTH CARD ──── */}
          <div
            id="auth-card"
            className="flex justify-center lg:justify-end w-full min-w-0 mt-6 lg:mt-0"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[440px]">
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
