import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Lock,
  Bot,
  HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStudentBenchmark, useBenchmarkActions } from "@/lib/careerai/hooks";

interface CareerBenchmarkViewProps {
  onAskSpar?: (prompt: string) => void;
}

export const CareerBenchmarkView: React.FC<CareerBenchmarkViewProps> = ({ onAskSpar }) => {
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const benchmarkQuery = useStudentBenchmark();
  const actionsQuery = useBenchmarkActions();

  if (benchmarkQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-8 text-center animate-pulse">
        <div className="h-6 w-48 bg-muted rounded-full mx-auto mb-4" />
        <div className="h-20 w-full max-w-md bg-muted/50 rounded-2xl mx-auto" />
      </div>
    );
  }

  const data = benchmarkQuery.data;

  // Insufficient cohort / coming soon state
  if (!data || data.insufficient_sample || !data.available) {
    return (
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card to-muted/30 p-8 text-center space-y-4">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Users className="size-6" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-display font-extrabold text-lg text-foreground">
            Your Benchmark is Coming Soon
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            SPAR needs a reliable comparison group of at least 30 comparable learners preparing for {data?.career_title || "this career"} before displaying percentile distributions. Your absolute Career Readiness score remains fully active.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] font-mono">
          Current Cohort Sample: {data?.cohort_size || 14} / 30 required
        </Badge>
      </div>
    );
  }

  const distToTop20 = data.thresholds?.distance_to_top_20 || 0;
  const percentile = data.percentile;
  const readiness = data.readiness_score;

  return (
    <div className="space-y-6">
      {/* 1. HERO BENCHMARK BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.05] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-extrabold uppercase tracking-wider">
                Competitive Intelligence
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">
                <Users className="size-3 mr-1" />
                {data.cohort_size} Comparable Learners
              </Badge>
              <button
                onClick={() => setMethodologyOpen(true)}
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold underline underline-offset-2 ml-1"
              >
                <HelpCircle className="size-3" /> How is this calculated?
              </button>
            </div>

            <h2 className="font-display font-extrabold text-xl lg:text-2xl text-foreground">
              Your Career Benchmark & Cohort Standing
            </h2>

            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              {data.spar_explanation}
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Readiness Score
              </span>
              <span className="font-display font-extrabold text-2xl text-foreground">
                {Math.round(readiness)}%
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                Target: {data.career_target_score || 85}%
              </span>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-primary/[0.04] p-3.5 text-center shadow-xs">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Percentile Standing
              </span>
              <span className="font-display font-extrabold text-2xl text-primary">
                {percentile}
                <span className="text-sm font-sans font-bold">th</span>
              </span>
              <span className="text-[10px] text-primary/80 block mt-0.5 font-semibold">
                Among Cohort
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs flex flex-col justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Competitive Band
              </span>
              <span className="font-display font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                {(data.competitive_band || "STRONG").replace("_", " ")}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                Placement Track
              </span>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE PERCENTILE RAIL */}
        <div className="mt-8 pt-6 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-primary" />
              Cohort Readiness Distribution (0 - 100)
            </span>
            {distToTop20 > 0 ? (
              <span className="text-primary font-bold text-xs bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                {distToTop20} readiness pts to Top 20% Tier
              </span>
            ) : (
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]">
                Reached Top 20% Placement Tier
              </Badge>
            )}
          </div>

          <div className="relative pt-6 pb-2">
            {/* The Rail Bar */}
            <div className="h-3 w-full rounded-full bg-secondary/70 overflow-hidden relative">
              {/* Colored zone for Top 20% (P80 to P100) */}
              <div
                className="absolute top-0 bottom-0 right-0 bg-emerald-500/20 border-l border-emerald-500/40"
                style={{ width: "20%" }}
                title="Top 20% Tier (84+ score)"
              />
            </div>

            {/* Threshold Markers */}
            <div className="absolute top-0 left-[50%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-[9px] font-bold text-muted-foreground font-mono">P50 (67%)</span>
              <div className="h-2 w-0.5 bg-border mt-0.5" />
            </div>

            <div className="absolute top-0 left-[80%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">Top 20% (84%)</span>
              <div className="h-2 w-0.5 bg-emerald-500 mt-0.5" />
            </div>

            {/* Student Position Indicator */}
            <div
              className="absolute -top-1 transition-all duration-500 flex flex-col items-center z-10"
              style={{ left: `${Math.min(95, Math.max(5, percentile))}%`, transform: "translateX(-50%)" }}
            >
              <div className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground shadow-md">
                You ({percentile}th)
              </div>
              <div className="size-2 bg-primary rotate-45 -mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPETENCY BENCHMARK MATRIX */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b">
          <div>
            <h3 className="font-display font-extrabold text-base text-foreground">
              Competency Breakdown vs. Cohort Benchmarks
            </h3>
            <p className="text-xs text-muted-foreground">
              Compare your evidence-backed scores with the cohort median and Top 20% placement threshold.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {data.competencies?.map((comp, idx) => {
            const isAboveTop20 = comp.status === "ABOVE_TOP_20";
            const isGap = comp.status === "COMPETITIVE_GAP";

            return (
              <div
                key={idx}
                className="rounded-2xl border p-4 bg-muted/10 hover:bg-muted/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{comp.skill_name}</span>
                    <Badge
                      className={`text-[9px] font-bold border-none ${
                        isAboveTop20
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : isGap
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {isAboveTop20 ? "Above Top 20%" : isGap ? "Competitive Gap" : "On Track"}
                    </Badge>
                  </div>
                  {comp.why_matters && (
                    <p className="text-xs text-muted-foreground">{comp.why_matters}</p>
                  )}
                </div>

                {/* Score Comparison Bars */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Your Score</span>
                    <span className={`font-mono font-extrabold text-sm ${isAboveTop20 ? "text-emerald-600" : isGap ? "text-amber-600" : "text-foreground"}`}>
                      {comp.student_score !== null ? `${comp.student_score}%` : "—"}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Cohort Median</span>
                    <span className="font-mono font-bold text-sm text-muted-foreground">
                      {comp.cohort_median}%
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Top 20% Tier</span>
                    <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {comp.top_20_benchmark}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. "WHAT GETS ME TO TOP 20% FASTEST?" (ACTION-IMPACT RANKING) */}
      {actionsQuery.data && actionsQuery.data.actions.length > 0 && (
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                What Gets Me to the Top 20% Fastest?
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked by gap size, downstream milestone unlocks, and estimated effort.
              </p>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-bold">
              Highest Leverage Actions
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {actionsQuery.data.actions.map((act, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card p-4 space-y-3 flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold">
                      {act.impact_level.replace("_", " ")}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
                      <Clock className="size-3" /> ~{act.estimated_effort_minutes} mins
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-foreground leading-snug">
                    {act.title}
                  </h4>

                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {act.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40">
                  {act.cta_link ? (
                    <Button asChild size="sm" className="w-full text-xs font-bold gap-1 h-8">
                      <Link to={act.cta_link as any}>
                        {act.cta_label}
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full text-xs font-bold gap-1 h-8">
                      {act.cta_label}
                      <ArrowRight className="size-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HISTORICAL BENCHMARK TRAJECTORY */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
        <div className="space-y-1 pb-3 border-b">
          <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
            <Award className="size-4 text-primary" />
            Competitive Position History
          </h3>
          <p className="text-xs text-muted-foreground">
            How your verified percentile standing has improved across completed milestones.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.trajectory?.map((point, idx) => (
            <div key={idx} className="rounded-2xl border bg-muted/10 p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                Step {idx + 1}
              </span>
              <h5 className="font-bold text-xs text-foreground line-clamp-1">
                {point.milestone_event}
              </h5>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-extrabold text-primary font-mono">
                  {point.percentile}th percentile
                </span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  {Math.round(point.readiness_score)}% ready
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* METHODOLOGY & PRIVACY MODAL */}
      <Dialog open={methodologyOpen} onOpenChange={setMethodologyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Benchmark Methodology & Privacy Guarantee
            </DialogTitle>
            <DialogDescription className="text-xs">
              How SPAR computes cohort percentiles without exposing student identities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs text-foreground/90 leading-relaxed py-2">
            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">Evidence-Backed Only</h5>
              <p className="text-muted-foreground">
                Percentiles are derived strictly from verified skill assessments, rubric-graded projects, and AI mock technical defenses. They do not factor in login streaks, chat counts, or time on site.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">Strict Privacy & Zero Leaderboards</h5>
              <p className="text-muted-foreground">
                SPAR never displays public leaderboards, ranks, or peer names. All benchmarks reflect anonymous statistical distributions across learners preparing for the same career path.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">Minimum Sample Size Rule</h5>
              <p className="text-muted-foreground">
                A minimum cohort size of 30 active learners is required before percentiles are unlocked, ensuring all comparative data is statistically reliable and un-hallucinated.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setMethodologyOpen(false)} className="text-xs font-semibold">
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
