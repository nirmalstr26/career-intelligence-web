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
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Bot,
  FileCode2,
  Lock,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorySlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  headline: string;
  description: string;
  benefits: {
    title: string;
    desc: string;
  }[];
  ctaText: string;
  ctaHref: string;
  renderVisual: () => React.ReactNode;
}

export function PlatformCapabilities() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const SLIDES: StorySlide[] = [
    // SLIDE 1: AI CAREER DISCOVERY
    {
      id: "discovery",
      badge: "MATCHING ENGINE",
      badgeColor: "border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,215,247,0.2)]",
      title: "AI Career Discovery",
      headline: "Discover the ideal career path for your strengths.",
      description:
        "SPAR's AI engine analyzes your coursework, diagnostic assessments, problem-solving style, and industry demand to reveal high-trajectory career fits.",
      benefits: [
        {
          title: "Multi-Dimensional Capability Modeling",
          desc: "Evaluates coding depth, algorithmic thinking, and domain interests.",
        },
        {
          title: "Real-Time Market Alignment",
          desc: "Cross-references live tech industry hiring demand and placement salary percentiles.",
        },
        {
          title: "Dynamic Trajectory Simulation",
          desc: "Test different paths and discover transferable skill overlaps in seconds.",
        },
      ],
      ctaText: "Explore Career Discovery",
      ctaHref: "#discovery",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-cyan-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(6,215,247,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Compass className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">AI Career Fit Matcher</p>
                <p className="text-[10px] text-muted-foreground">Deterministic Affinity Graph</p>
              </div>
            </div>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
              Top Match: 94%
            </span>
          </div>

          {/* Primary Career Match Card */}
          <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/30 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 size-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Primary Recommendation</span>
                <h4 className="font-display text-base font-extrabold text-white">Cloud Data Architect</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">High Demand · ₹14L–₹22L Avg Campus Tier 1</p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl border border-cyan-400/40 bg-cyan-500/20 text-cyan-300 font-extrabold text-sm shadow-[0_0_15px_rgba(6,215,247,0.3)]">
                94%
              </div>
            </div>

            {/* Orbiting Capability Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/40">
              <span className="rounded-lg bg-[#0d1436] border border-cyan-400/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                ⚡ Apache Spark · 92%
              </span>
              <span className="rounded-lg bg-[#0d1436] border border-blue-400/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                ⚙️ Distributed Systems · 89%
              </span>
              <span className="rounded-lg bg-[#0d1436] border border-purple-400/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                🐍 Python / PyTorch · 95%
              </span>
            </div>
          </div>

          {/* Secondary Path Matches */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/60 bg-[#0d1436]/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">AI Full-Stack Eng</span>
                <span className="text-[10px] font-bold text-blue-400">88%</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">High Transferability (+12% overlap)</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-[#0d1436]/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">MLOps Engineer</span>
                <span className="text-[10px] font-bold text-purple-400">85%</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">Direct Infrastructure Synergy</p>
            </div>
          </div>

          {/* AI Reasoning Pill */}
          <div className="flex items-start gap-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-2.5 text-[10px] text-cyan-200">
            <Sparkles className="size-3.5 shrink-0 text-cyan-400 mt-0.5" />
            <span>
              <strong>SPAR Takeaway:</strong> Strong algorithmic foundation in systems engineering gives you a +28% advantage in Data Architecture over average college cohorts.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 2: PERSONALIZED ROADMAP
    {
      id: "roadmap",
      badge: "ADAPTIVE PATH",
      badgeColor: "border-blue-500/40 bg-blue-950/40 text-blue-300 shadow-[0_0_12px_rgba(0,140,255,0.2)]",
      title: "Personalized Roadmap",
      headline: "A dynamic curriculum tailored to your unique goals.",
      description:
        "No generic course playlists. SPAR constructs an adaptive step-by-step milestone roadmap that adjusts dynamically based on your quiz results and coding submissions.",
      benefits: [
        {
          title: "Deterministic Mastery Gating",
          desc: "Unlock advanced topics only when core concept proficiency is verified.",
        },
        {
          title: "Micro-Missions & Code Drills",
          desc: "Bite-sized hands-on exercises that fit seamlessly into college schedules.",
        },
        {
          title: "Context-Aware SPAR AI Tutor",
          desc: "Instant hints and architectural explanations directly inside your workspace.",
        },
      ],
      ctaText: "View Interactive Roadmap",
      ctaHref: "#roadmap",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-blue-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,140,255,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Map className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Adaptive Learning Path</p>
                <p className="text-[10px] text-muted-foreground">Calibrated for Cloud Data Architect</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
              Stage 2 of 4 Active
            </span>
          </div>

          {/* Roadmap Milestone Steps */}
          <div className="space-y-2.5">
            {/* Step 1: Completed */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">1. Core Data Pipelines & ETL</p>
                  <p className="text-[10px] text-muted-foreground">3 Modules · 4 Verified Artifacts</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">100% Passed</span>
            </div>

            {/* Step 2: Active In Progress */}
            <div className="rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 p-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
                    <Cpu className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">2. Distributed Concurrency & Spark</p>
                    <p className="text-[10px] text-cyan-300">Active Focus · 72% Progress</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-400">In Progress</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-secondary/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-[72%]" />
              </div>
            </div>

            {/* Step 3: Locked */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-[#0d1436]/40 p-3 opacity-60">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-secondary text-muted-foreground">
                  <Lock className="size-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">3. Production Cloud Deploy & K8s</p>
                  <p className="text-[9px] text-muted-foreground/80">Unlocks at 80% Readiness</p>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground">Locked</span>
            </div>
          </div>

          {/* Coach Context Prescription */}
          <div className="flex items-start gap-2 rounded-xl bg-blue-950/30 border border-blue-500/20 p-2.5 text-[10px] text-blue-200">
            <Bot className="size-3.5 shrink-0 text-blue-400 mt-0.5" />
            <span>
              <strong>SPAR Coach Next Action:</strong> Complete the Apache Spark Distributed Module practice drill to boost your readiness score by +8%.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 3: READINESS INTELLIGENCE
    {
      id: "readiness",
      badge: "VERIFIED SCORING",
      badgeColor: "border-teal-500/40 bg-teal-950/40 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]",
      title: "Readiness Intelligence",
      headline: "Continuous readiness scoring based on real evidence.",
      description:
        "Stop guessing if you're placement-ready. SPAR tracks your capability index across 6 core competency dimensions with deterministic benchmark scoring.",
      benefits: [
        {
          title: "Evidence-Backed Capability Index",
          desc: "Every score is directly tied to validated code, quizzes, and project repositories.",
        },
        {
          title: "Cohort Percentile Benchmarks",
          desc: "See how you compare anonymously against thousands of peers across top universities.",
        },
        {
          title: "Actionable Remediation Engine",
          desc: "Instant prescriptions targeting your highest-priority placement gaps.",
        },
      ],
      ctaText: "Explore Readiness Scores",
      ctaHref: "#readiness",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-teal-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(20,184,166,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Award className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Student Readiness Index</p>
                <p className="text-[10px] text-muted-foreground">Deterministic Assessment Matrix</p>
              </div>
            </div>
            <span className="rounded-full bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 text-[10px] font-bold text-teal-300">
              Tier 1 Placement Ready
            </span>
          </div>

          {/* Core Readiness Score Gauge & Benchmark */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-teal-400/30 bg-teal-950/20 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall Readiness</span>
              <div className="my-2 font-display text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                82<span className="text-xs text-teal-400 font-bold">/100</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                +14 pts in 30 days
              </span>
            </div>

            <div className="rounded-2xl border border-blue-400/30 bg-blue-950/20 p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cohort Benchmark</span>
              <div className="my-2 font-display text-4xl font-extrabold text-cyan-300 tracking-tight flex items-baseline gap-1">
                Top 12%
              </div>
              <span className="text-[9px] text-muted-foreground">Across 500K+ Learners</span>
            </div>
          </div>

          {/* Competency Pillar Bars */}
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">System Architecture</span>
                <span className="text-white font-bold">88%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full w-[88%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Algorithm Efficiency</span>
                <span className="text-white font-bold">84%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[84%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Interview Defense</span>
                <span className="text-white font-bold">81%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full w-[81%]" />
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: PRACTICAL PROJECTS
    {
      id: "projects",
      badge: "PROOF OF WORK",
      badgeColor: "border-indigo-500/40 bg-indigo-950/40 text-indigo-300 shadow-[0_0_12px_rgba(70,87,255,0.2)]",
      title: "Practical Projects",
      headline: "Build production artifacts recruiters actually trust.",
      description:
        "Move beyond tutorial clones. Build production-grade full-stack and distributed projects evaluated by automated test suites and architectural rubrics.",
      benefits: [
        {
          title: "Automated Rubric & Test Verification",
          desc: "Code is verified for test coverage, modularity, security, and edge cases.",
        },
        {
          title: "Recruiter-Shareable Proof Link",
          desc: "Generate verified capability badges and GitHub proof points recruiters can inspect.",
        },
        {
          title: "System Design Architecture Defense",
          desc: "Defend your architectural trade-offs to prove engineering authenticity.",
        },
      ],
      ctaText: "Explore Practical Projects",
      ctaHref: "#projects",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-indigo-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(70,87,255,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Terminal className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Project Evaluation Engine</p>
                <p className="text-[10px] text-muted-foreground">Automated Rubric & Test Suite</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              Verified 96/100
            </span>
          </div>

          {/* Active Project Card */}
          <div className="rounded-2xl border border-indigo-400/40 bg-gradient-to-br from-indigo-950/40 to-purple-950/30 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Production Artifact</span>
                <h4 className="font-display text-sm font-bold text-white">distributed-event-stream-engine</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">High-throughput event consumer with fault-tolerant checkpointing</p>
              </div>
              <span className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300 font-bold">
                Go / Kafka
              </span>
            </div>

            {/* Test Matrix */}
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/40 pt-3 text-center">
              <div className="rounded-xl bg-[#0d1436] p-2 border border-border/60">
                <span className="text-[9px] text-muted-foreground block">Test Coverage</span>
                <span className="text-xs font-bold text-emerald-400">98.4%</span>
              </div>
              <div className="rounded-xl bg-[#0d1436] p-2 border border-border/60">
                <span className="text-[9px] text-muted-foreground block">Latency p99</span>
                <span className="text-xs font-bold text-cyan-400">&lt;12ms</span>
              </div>
              <div className="rounded-xl bg-[#0d1436] p-2 border border-border/60">
                <span className="text-[9px] text-muted-foreground block">Authenticity</span>
                <span className="text-xs font-bold text-indigo-300">Verified ✓</span>
              </div>
            </div>
          </div>

          {/* SPAR Verified Badge */}
          <div className="flex items-center justify-between rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-2.5 text-[11px] text-indigo-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-cyan-400" />
              <span>SPAR Verified Artifact #SP-9042</span>
            </div>
            <span className="text-[10px] font-semibold text-cyan-300">Shareable Proof ↗</span>
          </div>
        </div>
      ),
    },

    // SLIDE 5: INTERVIEW PREPARATION
    {
      id: "interviews",
      badge: "AI SIMULATION",
      badgeColor: "border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_12px_rgba(130,71,255,0.2)]",
      title: "Interview Preparation",
      headline: "Realistic technical & behavioral interview drills.",
      description:
        "Practice with an adaptive AI technical interviewer that probes your code logic, asks follow-up questions on edge cases, and simulates real company hiring loops.",
      benefits: [
        {
          title: "Live Code Reasoning & Voice Drills",
          desc: "Articulate your algorithmic complexity, system trade-offs, and design choices.",
        },
        {
          title: "Company-Specific Question Banks",
          desc: "Prepare for specific hiring patterns at leading tech enterprises and startups.",
        },
        {
          title: "Granular Behavioral & Speech Rubrics",
          desc: "Detailed feedback on answer structure (STAR method), clarity, and confidence.",
        },
      ],
      ctaText: "Start Mock Interview",
      ctaHref: "#interviews",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-purple-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(130,71,255,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <MessageSquare className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Live Technical Defense Drill</p>
                <p className="text-[10px] text-muted-foreground">Round 2 · Distributed Systems Architecture</p>
              </div>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 animate-pulse">
              Live Session
            </span>
          </div>

          {/* AI Interviewer Dialogue Box */}
          <div className="rounded-2xl border border-purple-400/30 bg-purple-950/20 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-300">
              <Bot className="size-3.5 text-purple-400" />
              <span>SPAR AI Technical Interviewer:</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              "How would you handle partition skew when scaling this Kafka consumer group from 10 to 50 partitions under peak load?"
            </p>
          </div>

          {/* Student Audio & Reasoning Simulation Bar */}
          <div className="rounded-xl bg-[#0d1436] p-3 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Candidate Reasoning Audio</span>
              <span className="text-emerald-400 font-bold">Clear Speech · 142 WPM</span>
            </div>
            <div className="flex items-center gap-1 h-5 justify-center">
              {[40, 75, 55, 90, 60, 80, 100, 70, 45, 65, 85, 95, 50, 70, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Real-time Feedback Rubric */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="rounded-lg bg-secondary/80 p-2 border border-border/60">
              <span className="text-muted-foreground block text-[9px]">Correctness</span>
              <span className="font-bold text-emerald-400">92%</span>
            </div>
            <div className="rounded-lg bg-secondary/80 p-2 border border-border/60">
              <span className="text-muted-foreground block text-[9px]">Clarity</span>
              <span className="font-bold text-cyan-400">89%</span>
            </div>
            <div className="rounded-lg bg-secondary/80 p-2 border border-border/60">
              <span className="text-muted-foreground block text-[9px]">STAR Structure</span>
              <span className="font-bold text-purple-300">95%</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: JOB-SPECIFIC GAP OPTIMIZER
    {
      id: "opportunities",
      badge: "PLACEMENT MATCH",
      badgeColor: "border-amber-500/40 bg-amber-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      title: "Job Gap Optimizer",
      headline: "Pinpoint & close skill gaps for target job openings.",
      description:
        "Paste any job description or select target campus placement drives. SPAR computes an instant gap analysis and gives you an optimized preparation roadmap.",
      benefits: [
        {
          title: "Instant JD Match Percentage",
          desc: "See how well your verified portfolio matches employer requirements.",
        },
        {
          title: "Targeted Gap Remediation",
          desc: "1-click generation of the exact projects and quizzes needed to close missing requirements.",
        },
        {
          title: "Campus Placement Intelligence",
          desc: "Integrated with college placement drives, deadlines, and coordinator alerts.",
        },
      ],
      ctaText: "Optimize Target Job Match",
      ctaHref: "#opportunities",
      renderVisual: () => (
        <div className="relative w-full rounded-3xl border border-amber-500/30 bg-[#090e24]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Target className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Target Job Gap Analyzer</p>
                <p className="text-[10px] text-muted-foreground">Google Cloud Systems Engineer Drive</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              87% Match
            </span>
          </div>

          {/* Match Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-2.5">
              <span className="text-[11px] font-semibold text-white">Go / Python Distributed Systems</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> 100% Verified
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-2.5">
              <span className="text-[11px] font-semibold text-white">Distributed Caching (Redis/Memcached)</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> 100% Verified
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-amber-950/30 border border-amber-500/40 p-2.5">
              <div>
                <span className="text-[11px] font-semibold text-white block">Kubernetes Orchestration</span>
                <span className="text-[9px] text-amber-300">Missing +8% match boost</span>
              </div>
              <span className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                Action Required
              </span>
            </div>
          </div>

          {/* One-Click Action CTA */}
          <div className="rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-500/30 p-3 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[11px] font-bold text-white">Targeted Remediation Mission</p>
              <p className="text-[9px] text-muted-foreground">Complete K8s Ingress Drill to hit 95% match</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 text-[11px] font-extrabold shadow-md transition-all flex items-center gap-1"
            >
              Start Drill <Zap className="size-3" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="capabilities" className="my-20 scroll-mt-24 space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
          <Layers className="size-3.5" />
          Full-Stack Career Operating System
        </span>
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight">
          Everything you need to go from{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,215,247,0.3)]">
            curiosity to hired.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          SPAR connects your career path, skills, projects, readiness, and interview preparation into one intelligent student journey.
        </p>
      </div>

      {/* Floating Interactive Step Selector Navigation Bar */}
      <div className="sticky top-20 z-30 flex justify-center px-4">
        <div className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-border/80 bg-[#090e24]/90 p-1.5 shadow-2xl backdrop-blur-2xl overflow-x-auto max-w-full">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSlide(idx);
                const el = document.getElementById(`story-slide-${s.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeSlide === idx
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,215,247,0.4)]"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-white"
              }`}
            >
              <span className="text-[10px] opacity-75 font-mono">0{idx + 1}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6 Rich Alternating Story Slides */}
      <div className="space-y-20 lg:space-y-32">
        {SLIDES.map((slide, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={slide.id}
              id={`story-slide-${slide.id}`}
              className="scroll-mt-36"
              onMouseEnter={() => setActiveSlide(idx)}
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
              >
                {/* TEXT SIDE (5 cols) */}
                <div
                  className={`space-y-6 lg:col-span-5 ${
                    isEven ? "lg:order-1" : "lg:order-2 lg:col-start-8"
                  }`}
                >
                  {/* Eyebrow Label Pill */}
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold ${slide.badgeColor}`}
                  >
                    <Sparkles className="size-3" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Headline & Description */}
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {slide.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  {/* 3 Mini Bullet Benefits */}
                  <div className="space-y-3 pt-2">
                    {slide.benefits.map((b) => (
                      <div key={b.title} className="flex items-start gap-3">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5 border border-cyan-500/30">
                          <CheckCircle2 className="size-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{b.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtle Action CTA */}
                  <div className="pt-2">
                    <a
                      href={slide.ctaHref}
                      className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>

                {/* RICH VISUAL SIDE (7 cols) */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? "lg:order-2" : "lg:order-1 lg:col-start-1"
                  }`}
                >
                  <div className="relative group">
                    {/* Ambient visual background glow */}
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-70 blur-2xl group-hover:opacity-100 transition-all duration-500" />
                    {slide.renderVisual()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Architecture Bottom Statement */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 p-6 sm:p-10 text-center backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
        <div className="flex justify-center mb-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,215,247,0.4)]">
            <Sparkles className="size-6" />
          </span>
        </div>
        <h4 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Unified Career Intelligence Architecture
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Unlike ordinary course platforms, SPAR connects every diagnostic quiz, code challenge, project repository, and mock interview into a single authoritative readiness profile that proves your capability to recruiters.
        </p>
      </div>
    </section>
  );
}
