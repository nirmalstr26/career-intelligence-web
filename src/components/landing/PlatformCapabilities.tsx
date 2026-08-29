import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  Map,
  Award,
  Terminal,
  MessageSquare,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowcaseCard {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  colorGlow: string;
  borderColor: string;
  renderVisual: () => React.ReactNode;
}

export function PlatformCapabilities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const CARDS: ShowcaseCard[] = [
    // 1. AI CAREER DISCOVERY
    {
      id: "discovery",
      badge: "MATCHING ENGINE",
      badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shadow-sm",
      title: "AI Career Discovery",
      tagline: "Precision AI Path Matching",
      description: "Discovers high-trajectory careers aligned to your coursework, coding style, and market demand.",
      benefits: [
        "Multi-dimensional capability modeling",
        "Live tech industry salary & hiring alignment",
        "Dynamic transferable skill simulation",
      ],
      colorGlow: "from-cyan-500/20 to-blue-600/10",
      borderColor: "hover:border-cyan-400/60 shadow-[0_0_25px_rgba(6,215,247,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Compass className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Career Fit Matcher</span>
            </div>
            <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 text-[10px] font-extrabold text-cyan-300 shadow-[0_0_10px_rgba(6,215,247,0.3)]">
              94% Match
            </span>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-2.5 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Top Recommended Role</p>
                <p className="text-xs font-extrabold text-white">Cloud Data Architect</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">₹14L–₹22L Avg</span>
            </div>
            <div className="flex gap-1 mt-2">
              <span className="rounded bg-slate-950/80 border border-cyan-400/30 px-1.5 py-0.5 text-[9px] text-cyan-200">
                ⚡ Spark · 92%
              </span>
              <span className="rounded bg-slate-950/80 border border-blue-400/30 px-1.5 py-0.5 text-[9px] text-blue-200">
                ⚙️ Dist. Systems · 89%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-cyan-200/90 z-10">
            <Sparkles className="size-3 text-cyan-400 shrink-0" />
            <span className="truncate">+28% systems advantage over college cohorts</span>
          </div>
        </div>
      ),
    },

    // 2. PERSONALIZED ROADMAP
    {
      id: "roadmap",
      badge: "ADAPTIVE PATH",
      badgeColor: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-300 shadow-sm",
      title: "Personalized Roadmap",
      tagline: "Dynamic Milestone Journey",
      description: "Constructs an adaptive step-by-step curriculum that shifts based on your quiz & code submissions.",
      benefits: [
        "Deterministic mastery gating & unlocks",
        "Micro-missions tailored to college schedules",
        "Context-aware SPAR AI Tutor in workspace",
      ],
      colorGlow: "from-blue-500/20 to-indigo-600/10",
      borderColor: "hover:border-blue-400/60 shadow-[0_0_25px_rgba(0,140,255,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Map className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Adaptive Milestone Path</span>
            </div>
            <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
              Stage 3 / 5 Unlocked
            </span>
          </div>

          {/* Connected Milestone Step Chips */}
          <div className="grid grid-cols-3 gap-1.5 z-10">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-2 text-center">
              <span className="text-[8px] text-emerald-400 font-bold block">01 Data Found.</span>
              <span className="text-[10px] font-extrabold text-white">Mastered ✓</span>
            </div>
            <div className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 p-2 text-center shadow-[0_0_12px_rgba(6,215,247,0.3)]">
              <span className="text-[8px] text-cyan-300 font-bold block">02 Lakehouse</span>
              <span className="text-[10px] font-extrabold text-cyan-200">Active (78%)</span>
            </div>
            <div className="rounded-xl border border-border/40 bg-slate-950/40 p-2 text-center opacity-60">
              <span className="text-[8px] text-muted-foreground font-bold block">03 Dist Engine</span>
              <span className="text-[10px] font-medium text-slate-400">Locked 🔒</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-blue-200/90 z-10">
            <span>Next: PySpark Optimization Lab</span>
            <span className="text-cyan-400 font-bold">Estimated: 35m</span>
          </div>
        </div>
      ),
    },

    // 3. READINESS SCORE
    {
      id: "readiness",
      badge: "BENCHMARK METRICS",
      badgeColor: "border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-300 shadow-sm",
      title: "Readiness Scoring",
      tagline: "Deterministic Capability Index",
      description: "Continuous 0-100 benchmark metric evaluating your practical ability against hiring standards.",
      benefits: [
        "Transparent multi-pillar rubric scoring",
        "Target employer benchmark comparisons",
        "Prescriptive action plan to close weak areas",
      ],
      colorGlow: "from-teal-500/20 to-emerald-600/10",
      borderColor: "hover:border-teal-400/60 shadow-[0_0_25px_rgba(20,184,166,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Award className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Placement Readiness Index</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
              Exceeds Benchmark
            </span>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 border border-teal-500/30 rounded-xl p-3 z-10">
            <div className="relative grid size-14 shrink-0 place-items-center rounded-full border-2 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.4)]">
              <span className="font-display text-lg font-black text-white">82</span>
              <span className="text-[7px] font-bold text-teal-300 -mt-1">/ 100</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-300">Market Ready Threshold (75)</span>
                <span className="text-emerald-400 font-bold">+7 Pts</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 w-[82%]" />
              </div>
              <p className="text-[8px] text-slate-400">Higher than 88% of campus peers</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-teal-200/90 z-10">
            <span>Verified Across 14 Artifacts</span>
            <span className="text-emerald-400 font-bold">Placement Ready ✓</span>
          </div>
        </div>
      ),
    },

    // 4. PRACTICAL PROJECTS
    {
      id: "projects",
      badge: "PROOF OF WORK",
      badgeColor: "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 shadow-sm",
      title: "Practical Projects",
      tagline: "Production-Grade Repositories",
      description: "Build full-stack & distributed systems verified by automated rubrics, test suites & security benchmarks.",
      benefits: [
        "Automated rubric & code test verification",
        "Recruiter-shareable proof badges & GitHub links",
        "Contextual debugging assistance inside IDE",
      ],
      colorGlow: "from-indigo-500/20 to-purple-600/10",
      borderColor: "hover:border-indigo-400/60 shadow-[0_0_25px_rgba(70,87,255,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Terminal className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Project Evaluation</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Verified 96/100
            </span>
          </div>

          {/* Test Matrix Preview */}
          <div className="rounded-xl bg-slate-950/80 border border-indigo-500/30 p-2.5 space-y-1.5 z-10 font-mono text-[9px]">
            <div className="flex items-center justify-between text-indigo-200">
              <span>distributed-event-stream</span>
              <span className="text-muted-foreground text-[8px]">Go / Kafka</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="rounded bg-slate-900 p-1 border border-border/40">
                <span className="text-[7px] text-muted-foreground block">Coverage</span>
                <span className="text-[9px] font-bold text-emerald-400">98.4%</span>
              </div>
              <div className="rounded bg-slate-900 p-1 border border-border/40">
                <span className="text-[7px] text-muted-foreground block">Latency</span>
                <span className="text-[9px] font-bold text-cyan-400">&lt;12ms</span>
              </div>
              <div className="rounded bg-slate-900 p-1 border border-border/40">
                <span className="text-[7px] text-muted-foreground block">Authenticity</span>
                <span className="text-[9px] font-bold text-indigo-300">100% ✓</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-indigo-200/90 z-10">
            <ShieldCheck className="size-3 text-cyan-400 shrink-0" />
            <span className="truncate">SPAR Verified Artifact #SP-9042</span>
          </div>
        </div>
      ),
    },

    // 5. INTERVIEW PREP
    {
      id: "interviews",
      badge: "AI SIMULATION",
      badgeColor: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 shadow-sm",
      title: "Interview Preparation",
      tagline: "Voice & Code Technical Defense",
      description: "Simulate live company interview loops with adaptive AI probing your code complexity & trade-offs.",
      benefits: [
        "Live code reasoning & speech audio analysis",
        "Company-specific question banks & drills",
        "Granular STAR-framework scoring feedback",
      ],
      colorGlow: "from-purple-500/20 to-pink-600/10",
      borderColor: "hover:border-purple-400/60 shadow-[0_0_25px_rgba(130,71,255,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <MessageSquare className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Live AI Technical Drill</span>
            </div>
            <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-[10px] font-bold text-purple-300">
              Live Waveform
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-purple-500/30 p-2.5 space-y-1 z-10">
            <span className="text-[8px] text-muted-foreground block">Interviewer Question:</span>
            <p className="text-[10px] text-purple-200 italic line-clamp-2">
              "How would you handle partition skew when scaling this consumer group to 50 partitions?"
            </p>
          </div>

          {/* Audio Waveform Simulator */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1">
              {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse"
                  style={{ height: `${h * 0.16}px`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-cyan-300">92% Correctness · STAR ✓</span>
          </div>
        </div>
      ),
    },

    // 6. JOB GAP OPTIMIZER
    {
      id: "opportunities",
      badge: "PLACEMENT MATCH",
      badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-sm",
      title: "Job Gap Optimizer",
      tagline: "Role Calibration Engine",
      description: "Compares your capabilities against target campus placement drives to close missing skill gaps.",
      benefits: [
        "Instant JD match percentage & gap detection",
        "1-click targeted remediation projects & drills",
        "Automated handling of required prerequisite skills",
      ],
      colorGlow: "from-amber-500/20 to-orange-600/10",
      borderColor: "hover:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Target className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Target Job Matcher</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              87% Match
            </span>
          </div>

          <div className="space-y-1.5 z-10">
            <div className="flex items-center justify-between text-[10px] bg-slate-950/80 p-1.5 rounded-lg border border-border/40">
              <span className="text-white">Distributed Go Systems</span>
              <span className="text-emerald-400 font-bold">100% ✓</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-slate-950/80 p-1.5 rounded-lg border border-amber-500/30">
              <span className="text-amber-200">Kubernetes Ingress Orchestration</span>
              <span className="text-amber-400 font-bold">+8% Needed</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-amber-200/90 z-10">
            <span>Remediation Available</span>
            <span className="rounded bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 text-[9px]">
              Start Drill ⚡
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Auto-advance carousel every 4.2 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARDS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused, CARDS.length]);

  // Scroll to active card when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? CARDS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  };

  const scrollToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  return (
    <section id="capabilities" className="my-20 scroll-mt-24 space-y-10 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 max-w-[1440px] mx-auto">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Layers className="size-3.5" />
            Full-Stack Career Operating System
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Everything you need to go from{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,215,247,0.35)]">
              curiosity to hired.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            SPAR connects your career path, skills, projects, readiness, and interview preparation into one intelligent student journey.
          </p>
        </div>

        {/* Carousel Controls (Prev/Next, Auto-scroll Pause, Dots) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused((v) => !v)}
            aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            {isPaused ? <Play className="size-4 text-cyan-500" /> : <Pause className="size-4" />}
          </button>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous showcase card"
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next showcase card"
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* SINGLE ROW AUTO-SCROLLING HORIZONTAL SHOWCASE */}
      <div
        className="relative px-4 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-2 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={`snap-center shrink-0 w-[340px] sm:w-[380px] lg:w-[420px] rounded-3xl border border-border/80 bg-card/95 dark:bg-[#090e24]/85 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg ${card.borderColor}`}
            >
              {/* Card Top: Rich Visual Preview Scene */}
              <div className="space-y-4">
                {card.renderVisual()}

                {/* Eyebrow Badge & Title */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      0{idx + 1} / 06
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground tracking-tight">
                    {card.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {card.description}
                  </p>
                </div>

                {/* 3 Benefit Bullets */}
                <div className="space-y-2 pt-1 border-t border-border/50">
                  {card.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-cyan-500 shrink-0" />
                      <span className="text-[11px] text-foreground/90 truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="pt-5 border-t border-border/50 mt-4">
                <a
                  href={`#${card.id}`}
                  className="flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors group"
                >
                  <span>Explore {card.title}</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Step Indicator Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {CARDS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToSlide(idx)}
            aria-label={`Jump to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-8 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md"
                : "w-2 bg-secondary/80 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
