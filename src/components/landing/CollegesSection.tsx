import React from "react";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollegesSection() {
  return (
    <section id="colleges" className="my-24 scroll-mt-24 select-none">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-secondary/30 dark:from-[#090e24]/90 dark:via-[#070c20]/95 dark:to-[#040612] p-6 sm:p-10 backdrop-blur-2xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT: Heading, 1 Sentence, 3 Benefits, CTA */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
                <Building2 className="size-3.5 text-cyan-500" />
                For Universities & Colleges
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Career readiness intelligence for{" "}
                <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
                  entire cohorts.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Empower your placement and career guidance teams with real-time cohort visibility, skill gap diagnostics, and automated mock interview dispatch.
              </p>
            </div>

            {/* 3 Core Institutional Benefits */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Real-Time Cohort Analytics:</strong> Track department readiness benchmarks across batches.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Batch Gap Diagnostics:</strong> Spot curriculum bottlenecks early before placement drives.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                <CheckCircle2 className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Automated Assignment Dispatch:</strong> Distribute role-specific AI mock interviews to students.</span>
              </div>
            </div>

            {/* Single Clear CTA */}
            <div>
              <a
                href="/colleges"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.35)] hover:brightness-110 transition-all group"
              >
                <span>Explore SPAR for Colleges</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* RIGHT: Animated Cohort Readiness Dashboard Preview */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 grid place-items-center text-cyan-400">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">SPAR Institute of Technology</span>
                  <span className="text-[10px] text-muted-foreground">B.Tech CSE · 2026 Batch</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Active Cohort
              </span>
            </div>

            {/* Aggregate Score & Readiness Distribution */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-center">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Cohort Avg Score</span>
                <span className="font-display text-xl font-black text-cyan-400">74%</span>
                <span className="text-[9px] text-emerald-400 block font-semibold">+12% vs last term</span>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-center">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Placement Ready</span>
                <span className="font-display text-xl font-black text-emerald-400">42%</span>
                <span className="text-[9px] text-slate-400 block font-medium">46% nearly ready</span>
              </div>
            </div>

            {/* Readiness Distribution Breakdown */}
            <div className="space-y-2 text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Placement Ready (&gt;75)</span>
                  <span className="font-bold text-emerald-400">42%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[42%] bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Developing / Progressing (50–75)</span>
                  <span className="font-bold text-cyan-400">46%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[46%] bg-cyan-400 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Foundational (&lt;50)</span>
                  <span className="font-bold text-amber-400">12%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[12%] bg-amber-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Verified Activities Status */}
            <div className="rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-2.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan-400" />
                <span className="text-slate-200">Verified Project Submissions: <strong>142</strong></span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono font-bold">100% Audited</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
