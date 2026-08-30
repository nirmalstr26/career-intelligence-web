import React, { useState } from "react";
import {
  Bot,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function IntelligenceInAction() {
  const [activeTab, setActiveTab] = useState<"coach" | "readiness">("coach");

  return (
    <section id="intelligence" className="my-24 scroll-mt-24 space-y-10 select-none">
      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5 text-purple-500" />
          Intelligence in Action
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Intelligence that{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            stays with you.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          SPAR continuously understands your progress, identifies gaps, and recommends the next best action.
        </p>

        {/* Interactive Tab Switcher */}
        <div className="inline-flex rounded-2xl border border-border/80 bg-secondary/60 dark:bg-[#090e24]/90 p-1 shadow-md backdrop-blur mt-2">
          <button
            type="button"
            onClick={() => setActiveTab("coach")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all ${
              activeTab === "coach"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="size-3.5" />
            <span>AI Coach</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("readiness")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all ${
              activeTab === "readiness"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="size-3.5" />
            <span>Readiness Intelligence</span>
          </button>
        </div>
      </div>

      {/* 2-Column Interactive Showcase Container */}
      <div className="mx-auto max-w-5xl rounded-3xl border border-border/80 bg-card/90 dark:bg-[#090e24]/85 p-6 sm:p-10 backdrop-blur-2xl shadow-xl transition-all">
        {activeTab === "coach" ? (
          /* TAB 1: AI COACH */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left: Explanation + 3 Concise Benefits */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Adaptive AI Guidance
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                  Contextual mentor in your daily workflow.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  SPAR Coach understands your exact milestone code, past quiz results, and target job roles to provide relevant, ungeneric answers.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Context-Aware:</strong> Analyzes your actual project files and test outputs.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Interview Readiness:</strong> Drills behavioral trade-offs & articulation depth.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Actionable Next Steps:</strong> Recommends immediate 15-minute corrective drills.</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#signup"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline group"
                >
                  <span>Try SPAR Coach in Workspace</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right: Simulated Conversation */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-4 sm:p-5 space-y-3.5 shadow-2xl font-sans text-xs">
              {/* User Message */}
              <div className="flex items-start gap-2.5 justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2.5 text-white max-w-[85%] shadow-md">
                  <p className="font-medium text-[11px]">
                    "How do I optimize partitioning in Spark when processing 50M records with skew?"
                  </p>
                </div>
              </div>

              {/* Coach Response */}
              <div className="flex items-start gap-2.5">
                <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/90 p-3.5 text-slate-200 max-w-[90%] space-y-2">
                  <p className="text-[11px] leading-relaxed">
                    Use <strong>Salting</strong> or dynamic partition pruning: append an isolated salt key (0–N) to skewed keys before shuffling.
                  </p>
                  <div className="rounded-lg bg-black/60 p-2 font-mono text-[10px] text-cyan-300 border border-cyan-500/20">
                    df.withColumn("salt", rand() * 10).repartition("key", "salt")
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-400 font-semibold">
                    <Zap className="size-3" />
                    <span>Applied in Lab: event-stream-engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: READINESS INTELLIGENCE */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left: Explanation + 3 Concise Benefits */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Objective Placement Scoring
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                  Know exactly where you stand.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Replace guesswork with continuous multi-dimensional evaluation across technical foundation, code verification, system design, and communication.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>6-Dimensional Index:</strong> Granular evaluation across real employer criteria.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Evidence-Backed:</strong> Tied to verified repositories and AI mock transcripts.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Clear Remediation:</strong> Specific recommendations to reach the next tier.</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#signup"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline group"
                >
                  <span>Calculate Your Placement Readiness</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right: Readiness Score Dashboard Simulation */}
            <div className="rounded-2xl border border-purple-500/30 bg-slate-950 p-5 space-y-4 shadow-2xl">
              {/* Overall Score Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-purple-300 font-display font-black text-xl">
                    78
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Overall Readiness Score</span>
                    <span className="text-[10px] text-purple-400 font-medium">Nearly Placement-Ready Tier</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  +8 pts this week
                </span>
              </div>

              {/* 4 Competency Bars */}
              <div className="space-y-2.5 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Technical Foundation</span>
                    <span className="font-bold text-cyan-400">84%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[84%] bg-cyan-400 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Project & Code Proof</span>
                    <span className="font-bold text-purple-400">88%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[88%] bg-purple-400 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>System Architecture</span>
                    <span className="font-bold text-blue-400">76%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[76%] bg-blue-400 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Communication & Articulation</span>
                    <span className="font-bold text-amber-400">64%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[64%] bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Identified Weak Area & Prescribed Action */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-300 block">Priority Remediation Area</span>
                    <span className="text-[10px] text-slate-300">Practice behavioral trade-off rationale</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-400 underline">Start Drill →</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
