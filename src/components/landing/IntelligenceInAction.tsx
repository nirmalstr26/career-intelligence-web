import React, { useState } from "react";
import {
  Bot,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
} from "lucide-react";

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
            {/* Left: Explanation + Simple, Jargon-Free Benefits */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Adaptive AI Guidance
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                  Contextual mentor in your daily workflow.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  SPAR Coach understands your milestone code, answers questions in context, and recommends your next best step.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Understands what you're working on:</strong> Answers questions directly related to your current project.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Practices real interview questions:</strong> Drills behavioral trade-offs & technical articulation.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span><strong>Recommends your next best step:</strong> Gives immediate, bite-sized corrective actions.</span>
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
          /* TAB 2: READINESS INTELLIGENCE (Interactive Ring + 3 Competency Bars + Strongest/Weakest + Next Best Action) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left: Explanation + Simple, Jargon-Free Benefits */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Objective Placement Scoring
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                  Know where you stand. No guessing.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Multi-dimensional placement readiness tracking based on verified hands-on evidence and objective criteria.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Objective readiness score:</strong> Evaluates technical foundation, project evidence, and problem solving.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Backed by verified proof:</strong> Tied directly to projects you've built and mock interview transcripts.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                  <CheckCircle2 className="size-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Clear roadmap to the next tier:</strong> See your strongest skills, weakest areas, and exactly how to improve.</span>
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

            {/* Right: Readiness Ring + 3 Competency Bars + Strong/Weak + Next Best Action */}
            <div className="rounded-2xl border border-purple-500/30 bg-slate-950 p-5 space-y-4 shadow-2xl">
              {/* 78/100 Readiness Ring Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="relative size-14 flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800 stroke-current"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-purple-500 stroke-current"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-display font-black text-sm text-white">78</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Readiness Score</span>
                    <span className="text-[10px] text-purple-300 font-medium">Nearly Placement-Ready Tier</span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  +8 pts this week
                </span>
              </div>

              {/* 3 Core Competency Bars */}
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
                    <span>Project & Code Evidence</span>
                    <span className="font-bold text-purple-400">88%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[88%] bg-purple-400 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Problem Solving & Communication</span>
                    <span className="font-bold text-blue-400">68%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[68%] bg-blue-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Strongest & Weakest Skill Split */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-xl bg-slate-900/90 border border-emerald-500/30 p-2 text-[10px]">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Strongest Area
                  </span>
                  <span className="text-slate-200 truncate block mt-0.5 font-medium">Distributed Querying (92%)</span>
                </div>
                <div className="rounded-xl bg-slate-900/90 border border-amber-500/30 p-2 text-[10px]">
                  <span className="text-amber-400 font-bold block flex items-center gap-1">
                    <AlertTriangle className="size-3" /> Weakest Area
                  </span>
                  <span className="text-slate-200 truncate block mt-0.5 font-medium">Behavioral Rationale (60%)</span>
                </div>
              </div>

              {/* Next Best Action CTA Drill */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-2.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200">Next Best Action: <strong>15-Min Mock Interview</strong></span>
                </div>
                <a href="#signup" className="text-[10px] font-bold text-cyan-300 underline">
                  Start Drill →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
