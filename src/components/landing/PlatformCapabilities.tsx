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
  Play,
  Pause,
} from "lucide-react";

interface ShowcaseCard {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  valueStatement: string;
  bullets: [string, string];
  borderColor: string;
  renderVisual: () => React.ReactNode;
}

const CARDS: ShowcaseCard[] = [
  // 1. AI CAREER DISCOVERY
  {
    id: "discovery",
    badge: "Matching Engine",
    badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    title: "AI Career Discovery",
    valueStatement: "Find high-trajectory career paths tailored to your coursework and technical strengths.",
    bullets: [
      "Multi-dimensional capability matching",
      "Dynamic transferable skill modeling",
    ],
    borderColor: "hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,215,247,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 size-28 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Compass className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Career Fit Matcher</span>
          </div>
          <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 text-[10px] font-extrabold text-cyan-300">
            94% Fit
          </span>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-2 z-10">
          <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Top Recommended Path</p>
          <p className="text-xs font-extrabold text-white">Cloud Data Engineer</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-cyan-200/90 z-10">
          <Sparkles className="size-3 text-cyan-400 shrink-0" />
          <span className="truncate">High alignment with Distributed Systems & SQL</span>
        </div>
      </div>
    ),
  },

  // 2. PERSONALIZED ROADMAP
  {
    id: "roadmap",
    badge: "Adaptive Path",
    badgeColor: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-300",
    title: "Personalized Roadmap",
    valueStatement: "Follow an adaptive step-by-step milestone curriculum that updates as you learn.",
    bullets: [
      "Mastery gating with structured unlocks",
      "Bite-sized missions for college schedules",
    ],
    borderColor: "hover:border-blue-400/60 shadow-[0_0_20px_rgba(0,140,255,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 size-28 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Map className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Milestone Navigator</span>
          </div>
          <span className="text-[10px] font-mono text-blue-300 font-semibold">Step 3 of 5</span>
        </div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white font-medium">Distributed Pipeline Engine</span>
            <span className="text-blue-400 font-bold">60% Complete</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-blue-200/90 z-10">
          <CheckCircle2 className="size-3 text-blue-400 shrink-0" />
          <span className="truncate">Next: Build Kafka streaming consumer</span>
        </div>
      </div>
    ),
  },

  // 3. READINESS SCORING
  {
    id: "readiness",
    badge: "Benchmarking",
    badgeColor: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300",
    title: "Readiness Scoring",
    valueStatement: "Track your placement readiness score across coding, system design, and communication.",
    bullets: [
      "Objective 6-dimensional evaluation",
      "Continuous gap analysis with remediation",
    ],
    borderColor: "hover:border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 size-28 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Award className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Readiness Index</span>
          </div>
          <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-[10px] font-extrabold text-purple-300">
            78 / 100
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 z-10">
          <div className="rounded-lg bg-slate-950/70 border border-purple-500/20 p-1.5">
            <span className="text-[9px] text-muted-foreground block">Technical Base</span>
            <span className="text-xs font-bold text-purple-300">84% Ready</span>
          </div>
          <div className="rounded-lg bg-slate-950/70 border border-cyan-500/20 p-1.5">
            <span className="text-[9px] text-muted-foreground block">System Design</span>
            <span className="text-xs font-bold text-cyan-300">76% Ready</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-purple-200/90 z-10">
          <Sparkles className="size-3 text-purple-400 shrink-0" />
          <span className="truncate">Tier: Nearly Placement-Ready</span>
        </div>
      </div>
    ),
  },

  // 4. PRACTICAL PROJECTS
  {
    id: "projects",
    badge: "Portfolio Proof",
    badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    title: "Practical Projects",
    valueStatement: "Build production-grade applications that provide concrete evidence for hiring teams.",
    bullets: [
      "Industry-grade project architectures",
      "Automated verification & code evaluation",
    ],
    borderColor: "hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between font-mono">
        <div className="absolute -top-10 -right-10 size-28 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Terminal className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white font-sans">Lab Workspace</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
            PASS 12/12
          </span>
        </div>
        <div className="rounded-lg bg-black/70 p-2 text-[10px] text-slate-300 space-y-1 z-10">
          <p className="text-amber-400">$ spar test --suite=distributed-sync</p>
          <p className="text-emerald-400 font-bold">✓ Latency &lt; 4ms | Raft consensus OK</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 font-sans z-10">
          <CheckCircle2 className="size-3 text-amber-400 shrink-0" />
          <span className="truncate">Evidence badge attached to profile</span>
        </div>
      </div>
    ),
  },

  // 5. INTERVIEW PREPARATION
  {
    id: "interviews",
    badge: "AI Mock Simulator",
    badgeColor: "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
    title: "Interview Preparation",
    valueStatement: "Practice role-specific mock interviews with real-time AI feedback on communication & logic.",
    bullets: [
      "Dynamic follow-ups based on your answers",
      "Detailed scoring on technical & behavioral depth",
    ],
    borderColor: "hover:border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 size-28 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <MessageSquare className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">AI Interviewer</span>
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">Question 4/8</span>
        </div>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-2 text-[10px] text-white z-10">
          <p className="text-indigo-300 font-bold mb-0.5">SPAR AI Interviewer</p>
          <p className="text-slate-200">"How would you handle cache invalidation during write spikes?"</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-indigo-200/90 z-10">
          <Sparkles className="size-3 text-indigo-400 shrink-0" />
          <span className="truncate">Instant articulation & trade-off scoring</span>
        </div>
      </div>
    ),
  },

  // 6. JOB GAP OPTIMIZER
  {
    id: "optimizer",
    badge: "Gap Remediation",
    badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    title: "Job Gap Optimizer",
    valueStatement: "Compare your skills against target job postings and fix identified gaps before applying.",
    bullets: [
      "Live JD skill & requirement extraction",
      "Targeted micro-learning to bridge gaps",
    ],
    borderColor: "hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
    renderVisual: () => (
      <div className="relative h-40 w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 overflow-hidden flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 size-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Target JD Matcher</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
            +18% Match Boost
          </span>
        </div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white">Profile vs Target JD</span>
            <span className="text-emerald-400 font-bold">88% Coverage</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-200/90 z-10">
          <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
          <span className="truncate">All core role requirements verified</span>
        </div>
      </div>
    ),
  },
];

export function PlatformCapabilities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 360;
    scrollContainerRef.current.scrollTo({
      left: index * (cardWidth + 24),
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + CARDS.length) % CARDS.length;
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % CARDS.length;
    scrollToIndex(nextIdx);
  };

  // Subtle 7-second auto-scroll when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  return (
    <section id="capabilities" className="my-20 scroll-mt-24 space-y-10 select-none">
      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 shadow-sm backdrop-blur">
          <Layers className="size-3.5 text-cyan-500" />
          Full-Stack Career Operating System
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Everything you need to go from{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            curiosity to hired.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          SPAR connects your career path, skills, projects, readiness, and interview preparation into one intelligent student journey.
        </p>

        {/* Carousel Navigation Controls & Indicators */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => setIsPaused((v) => !v)}
            aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            {isPaused ? <Play className="size-3.5 text-cyan-500" /> : <Pause className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous capability"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {CARDS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Jump to capability ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md"
                    : "w-2 bg-secondary/80 hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next capability"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL SHOWCASE (Desktop: 3 Visible | Mobile: 1 Visible with Touch-Snap) */}
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
              className={`snap-center shrink-0 w-[300px] sm:w-[360px] lg:w-[calc((100%-48px)/3)] rounded-3xl border border-border/80 bg-card/95 dark:bg-[#090e24]/85 p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-lg ${card.borderColor}`}
            >
              {/* Card Top: Visual preview scene */}
              <div className="space-y-3.5">
                {card.renderVisual()}

                {/* Eyebrow Badge & Title */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      0{idx + 1} / 06
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground">
                    {card.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.valueStatement}
                  </p>
                </div>

                {/* 2 Crisp Supporting Bullets */}
                <div className="space-y-1.5 pt-1 border-t border-border/50">
                  {card.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-foreground/90 font-medium">
                      <CheckCircle2 className="size-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="pt-4 border-t border-border/50 mt-4">
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
    </section>
  );
}
