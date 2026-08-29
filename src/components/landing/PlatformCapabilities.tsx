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
      badgeColor: "border-cyan-500/40 bg-cyan-950/50 text-cyan-300 shadow-[0_0_12px_rgba(6,215,247,0.25)]",
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
        <div className="relative h-48 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
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

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-2.5 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Top Recommended Role</p>
                <p className="text-xs font-extrabold text-white">Cloud Data Architect</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">₹14L–₹22L Avg</span>
            </div>
            <div className="flex gap-1 mt-2">
              <span className="rounded bg-[#090e24] border border-cyan-400/30 px-1.5 py-0.5 text-[9px] text-cyan-200">
                ⚡ Spark · 92%
              </span>
              <span className="rounded bg-[#090e24] border border-blue-400/30 px-1.5 py-0.5 text-[9px] text-blue-200">
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
      badgeColor: "border-blue-500/40 bg-blue-950/50 text-blue-300 shadow-[0_0_12px_rgba(0,140,255,0.25)]",
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
        <div className="relative h-48 w-full rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Map className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Adaptive Learning Path</span>
            </div>
            <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
              Stage 2 of 4 Active
            </span>
          </div>

          <div className="space-y-1.5 z-10">
            <div className="flex items-center justify-between rounded-lg bg-emerald-950/30 border border-emerald-500/30 px-2.5 py-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span className="text-[10px] font-semibold text-white">1. Core Data Pipelines</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400">100% Passed</span>
            </div>

            <div className="rounded-lg bg-blue-950/40 border border-cyan-400/40 px-2.5 py-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="size-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-white">2. Distributed Concurrency</span>
                </div>
                <span className="text-[9px] font-bold text-cyan-400">72% Progress</span>
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[72%]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-blue-200/90 z-10">
            <Bot className="size-3 text-blue-400 shrink-0" />
            <span className="truncate">Next drill: Spark Partitioning (+8% score boost)</span>
          </div>
        </div>
      ),
    },

    // 3. READINESS INTELLIGENCE
    {
      id: "readiness",
      badge: "VERIFIED SCORING",
      badgeColor: "border-teal-500/40 bg-teal-950/50 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.25)]",
      title: "Readiness Intelligence",
      tagline: "Continuous Evidence Index",
      description: "Tracks your capability across 6 competency pillars with deterministic benchmark scoring.",
      benefits: [
        "Evidence-backed capability index",
        "Cohort percentile benchmarks vs 500K+ peers",
        "Actionable remediation targeting weak spots",
      ],
      colorGlow: "from-teal-500/20 to-emerald-600/10",
      borderColor: "hover:border-teal-400/60 shadow-[0_0_25px_rgba(20,184,166,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Award className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Readiness Index</span>
            </div>
            <span className="rounded-full bg-teal-500/20 border border-teal-400/40 px-2 py-0.5 text-[10px] font-bold text-teal-300">
              Tier 1 Placement
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 z-10">
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-2.5 text-center">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Overall Score</span>
              <span className="font-display text-2xl font-extrabold text-white">82<span className="text-[10px] text-teal-400">/100</span></span>
              <span className="text-[8px] font-bold text-emerald-400 block">+14 pts this month</span>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-2.5 text-center">
              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Cohort Rank</span>
              <span className="font-display text-2xl font-extrabold text-cyan-300">Top 12%</span>
              <span className="text-[8px] text-muted-foreground block">500K+ Learners</span>
            </div>
          </div>

          <div className="space-y-1 z-10">
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Architecture 88%</span>
              <span>Algorithms 84%</span>
              <span>Defense 81%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-secondary overflow-hidden flex gap-1">
              <div className="bg-teal-400 h-full w-[88%]" />
              <div className="bg-cyan-400 h-full w-[84%]" />
              <div className="bg-indigo-400 h-full w-[81%]" />
            </div>
          </div>
        </div>
      ),
    },

    // 4. PRACTICAL PROJECTS
    {
      id: "projects",
      badge: "PROOF OF WORK",
      badgeColor: "border-indigo-500/40 bg-indigo-950/50 text-indigo-300 shadow-[0_0_12px_rgba(70,87,255,0.25)]",
      title: "Practical Projects",
      tagline: "Verified Production Artifacts",
      description: "Build full-stack & distributed systems verified by automated rubrics, test suites & security benchmarks.",
      benefits: [
        "Automated rubric & code test verification",
        "Recruiter-shareable proof badges & GitHub links",
        "System design architectural trade-off defense",
      ],
      colorGlow: "from-indigo-500/20 to-purple-600/10",
      borderColor: "hover:border-indigo-400/60 shadow-[0_0_25px_rgba(70,87,255,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Terminal className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Project Evaluation</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Verified 96/100
            </span>
          </div>

          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-2.5 z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white truncate">distributed-event-stream</span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">Go / Kafka</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2 text-center">
              <div className="rounded bg-[#090e24] p-1 border border-border/40">
                <span className="text-[8px] text-muted-foreground block">Coverage</span>
                <span className="text-[10px] font-bold text-emerald-400">98.4%</span>
              </div>
              <div className="rounded bg-[#090e24] p-1 border border-border/40">
                <span className="text-[8px] text-muted-foreground block">Latency</span>
                <span className="text-[10px] font-bold text-cyan-400">&lt;12ms</span>
              </div>
              <div className="rounded bg-[#090e24] p-1 border border-border/40">
                <span className="text-[8px] text-muted-foreground block">Authenticity</span>
                <span className="text-[10px] font-bold text-indigo-300">100% ✓</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-indigo-200/90 z-10">
            <ShieldCheck className="size-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">SPAR Verified Artifact #SP-9042</span>
          </div>
        </div>
      ),
    },

    // 5. INTERVIEW PREPARATION
    {
      id: "interviews",
      badge: "AI SIMULATION",
      badgeColor: "border-purple-500/40 bg-purple-950/50 text-purple-300 shadow-[0_0_12px_rgba(130,71,255,0.25)]",
      title: "Interview Preparation",
      tagline: "Realistic Tech & Behavioral Drills",
      description: "Simulate live company interview loops with adaptive AI probing your code complexity & trade-offs.",
      benefits: [
        "Live code reasoning & speech audio analysis",
        "Company-specific question banks & drills",
        "Granular STAR structure & clarity scoring",
      ],
      colorGlow: "from-purple-500/20 to-pink-600/10",
      borderColor: "hover:border-purple-400/60 shadow-[0_0_25px_rgba(130,71,255,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <MessageSquare className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Live AI Technical Drill</span>
            </div>
            <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-[10px] font-bold text-purple-300 animate-pulse">
              Live Waveform
            </span>
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2.5 z-10">
            <p className="text-[9px] text-purple-300 font-bold">Interviewer Question:</p>
            <p className="text-[11px] text-white font-medium line-clamp-2 mt-0.5">
              "How would you handle partition skew when scaling this consumer group to 50 partitions?"
            </p>
          </div>

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1 h-4">
              {[40, 80, 60, 100, 70, 90, 50, 85, 45, 75, 95, 65].map((h, i) => (
                <span key={i} className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full" style={{ height: `${h}%` }} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-emerald-400">92% Correctness · STAR ✓</span>
          </div>
        </div>
      ),
    },

    // 6. JOB GAP OPTIMIZER
    {
      id: "opportunities",
      badge: "PLACEMENT MATCH",
      badgeColor: "border-amber-500/40 bg-amber-950/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      title: "Job Gap Optimizer",
      tagline: "Target Role Gap Calibration",
      description: "Compares your capabilities against target campus placement drives to close missing skill gaps.",
      benefits: [
        "Instant JD match percentage & gap detection",
        "1-click targeted remediation projects & drills",
        "Integrated with college placement drive schedules",
      ],
      colorGlow: "from-amber-500/20 to-orange-600/10",
      borderColor: "hover:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.12)]",
      renderVisual: () => (
        <div className="relative h-48 w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#0b1438] to-[#070b1e] p-4 overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 size-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Target className="size-4" />
              </span>
              <span className="text-[11px] font-bold text-white">Target Job Gap Matcher</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              87% Match
            </span>
          </div>

          <div className="space-y-1.5 z-10">
            <div className="flex items-center justify-between text-[10px] bg-[#090e24] p-1.5 rounded-lg border border-border/40">
              <span className="text-white">Distributed Go Systems</span>
              <span className="text-emerald-400 font-bold">100% ✓</span>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-[#090e24] p-1.5 rounded-lg border border-amber-500/30">
              <span className="text-amber-200">Kubernetes Ingress Orchestration</span>
              <span className="text-amber-400 font-bold">+8% Needed</span>
            </div>
          </div>

          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] text-muted-foreground">Remediation Available</span>
            <span className="rounded bg-amber-500 text-black font-extrabold px-2 py-0.5 text-[9px] flex items-center gap-1 shadow-sm">
              Start Drill <Zap className="size-2.5" />
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Auto-scroll logic along single horizontal row
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % CARDS.length;
        if (scrollContainerRef.current) {
          const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 400;
          scrollContainerRef.current.scrollTo({
            left: next * (cardWidth + 24),
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, CARDS.length]);

  const scrollToSlide = (idx: number) => {
    setCurrentIndex(idx);
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 400;
      scrollContainerRef.current.scrollTo({
        left: idx * (cardWidth + 24),
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    const prev = currentIndex === 0 ? CARDS.length - 1 : currentIndex - 1;
    scrollToSlide(prev);
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % CARDS.length;
    scrollToSlide(next);
  };

  return (
    <section id="capabilities" className="my-20 scroll-mt-24 space-y-10 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 max-w-[1440px] mx-auto">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Layers className="size-3.5" />
            Full-Stack Career Operating System
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Everything you need to go from{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,215,247,0.35)]">
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
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-[#090e24]/90 text-muted-foreground hover:text-white hover:border-cyan-400/40 transition-all backdrop-blur shadow-sm"
          >
            {isPaused ? <Play className="size-4 text-cyan-400" /> : <Pause className="size-4" />}
          </button>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous showcase card"
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-[#090e24]/90 text-muted-foreground hover:text-white hover:border-cyan-400/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next showcase card"
            className="grid size-10 place-items-center rounded-2xl border border-border/80 bg-[#090e24]/90 text-muted-foreground hover:text-white hover:border-cyan-400/40 transition-all backdrop-blur shadow-sm"
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
              className={`snap-center shrink-0 w-[340px] sm:w-[380px] lg:w-[420px] rounded-3xl border border-border/80 bg-[#090e24]/85 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${card.borderColor}`}
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

                  <h3 className="font-display text-xl font-bold text-white tracking-tight">
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
                      <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
                      <span className="text-[11px] text-white/90 truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="pt-5 border-t border-border/50 mt-4">
                <a
                  href={`#${card.id}`}
                  className="flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
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
                ? "w-8 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(6,215,247,0.5)]"
                : "w-2 bg-secondary/80 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Unified Platform Statement Box */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
        <div className="flex justify-center mb-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,215,247,0.4)]">
            <Sparkles className="size-5" />
          </span>
        </div>
        <h4 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Unified Career Intelligence Architecture
        </h4>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Unlike ordinary course platforms, SPAR connects every diagnostic quiz, code challenge, project repository, and mock interview into a single authoritative readiness profile that proves your capability to recruiters.
        </p>
      </div>
    </section>
  );
}
