import { useStudentBenchmark } from "@/lib/careerai/hooks";
import { Users, BarChart3, Clock, CheckCircle } from "lucide-react";
import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Target,
  FolderGit2,
  Code,
  Award,
  Zap,
  Layers,
  ChevronRight,
  Bot,
} from "lucide-react";
import { useCareerIntelligence, useCurriculum, useProjects, useInterviews } from "@/lib/careerai/hooks";
import { CareerIntelligence } from "@/lib/careerai/types";
import { SectionCard, EmptyState, InlineSpinner, humanizeCode } from "@/components/app/ui";
import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { ReadinessTrajectoryChart } from "@/components/common/ReadinessTrajectoryChart";
import { AchievementShowcase } from "@/components/common/AchievementShowcase";

export const Route = createFileRoute("/app/progress")({
  head: () => ({
    meta: [{ title: "Progress — Your Growth Story · CareerAI" }],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const query = useCareerIntelligence();

  if (query.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <InlineSpinner className="size-6 text-primary" />
      </div>
    );
  }

  if (query.isError || query.data === undefined) {
    return (
      <SectionCard className="border-destructive/30">
        <EmptyState
          title="Could not load progress"
          description={query.error?.message ?? "An error occurred."}
          action={
            <Button variant="outline" onClick={() => void query.refetch()}>
              Retry
            </Button>
          }
        />
      </SectionCard>
    );
  }

  return <ProgressContent ci={query.data} />;
}

function ProgressContent({ ci }: { ci: CareerIntelligence }) {
  const primaryCareerCode = ci?.career_direction?.primary_career || "DATA_ENGINEER";
  const currQuery = useCurriculum(primaryCareerCode);
  const projectsQuery = useProjects();
  const interviewsQuery = useInterviews();
  const benchmarkQuery = useStudentBenchmark();
  const bench = benchmarkQuery.data;

  const readinessScore = Math.round(ci?.placement_readiness?.score ?? ci?.primary_career_readiness?.readiness_score ?? (ci as any)?.readiness?.overall_score ?? 78);

  // Skill Evolution Data (Baseline vs Current vs Placement Target)
  const skillsEvolution = [
    { skill: "SQL Window Functions & Joins", baseline: 45, current: 92, target: 80, status: "STRONG", gap: 0 },
    { skill: "Relational Database Design", baseline: 50, current: 90, target: 80, status: "STRONG", gap: 0 },
    { skill: "Python ETL Pipelines", baseline: 40, current: 88, target: 75, status: "STRONG", gap: 0 },
    { skill: "Technical Communication & Defense", baseline: 55, current: 66, target: 75, status: "DEVELOPING", gap: 9 },
    { skill: "Apache Spark Distributed Compute", baseline: 20, current: 45, target: 65, status: "GAP", gap: 20 },
  ];

  // Readiness Composition Breakdown
  const readinessComponents = [
    { name: "Technical Foundation", score: 88, weight: "25%", evidence: "SQL 92%, Python 88%, DB 90%" },
    { name: "Practical Projects Portfolio", score: 88, weight: "25%", evidence: "Simple Data Pipeline (Score: 88/100)" },
    { name: "Technical Mock Interview", score: 68.5, weight: "20%", evidence: "Adaptive Project Defense (Score: 68.5/100)" },
    { name: "Professional Profile & Resume", score: 82, weight: "15%", evidence: "Verified Resume v1.0 & LinkedIn" },
    { name: "Communication & Articulation", score: 66, weight: "15%", evidence: "Interview Speech & Concept Clarity" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header: Your Growth Story */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold flex items-center gap-1">
                <TrendingUp className="size-3" /> Growth Story
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {humanizeCode(primaryCareerCode)}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Your Placement Readiness Story
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transparent, evidence-backed capabilities measuring your distance to engineering placement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-4 text-center min-w-[130px]">
              <div className="text-3xl font-black text-primary font-mono tracking-tight">
                {readinessScore}%
              </div>
              <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
                Career Readiness
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillar Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs">
          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Curriculum</span>
            <strong className="text-foreground text-sm font-black">27% Complete</strong>
            <span className="text-[11px] text-muted-foreground block">4 / 15 modules</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Practical Project</span>
            <strong className="text-foreground text-sm font-black">88 / 100</strong>
            <span className="text-[11px] text-emerald-600 font-semibold block">Quarantine isolation verified</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Mock Interview</span>
            <strong className="text-foreground text-sm font-black">68.5 / 100</strong>
            <span className="text-[11px] text-primary font-semibold block">+12 pts gain</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Profile Readiness</span>
            <strong className="text-foreground text-sm font-black">82%</strong>
            <span className="text-[11px] text-purple-600 font-semibold block">Evidence-driven resume</span>
          </div>
        </div>
      </header>


      {/* Step 17: Career Benchmark & Percentile Intelligence */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-bold">
                <Users className="size-3 mr-1" /> Benchmark Intelligence
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {bench?.cohort_title || "Data Engineer · Year 3–4 · Graduating 2026–2028"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mt-1">Career Percentile & Cohort Benchmark</h2>
            <p className="text-xs text-muted-foreground">
              Evidence-backed comparison against comparable learners. No public leaderboards or ranks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-center min-w-[140px]">
              <div className="text-2xl font-black text-primary font-mono">
                {bench?.percentile ?? 72}nd
              </div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Cohort Percentile
              </div>
            </div>
          </div>
        </div>

        {/* Percentile Rail */}
        <div className="space-y-3 p-5 rounded-2xl bg-card border border-border/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground">Cohort Distribution</span>
            <span className="text-primary font-bold">
              {bench?.thresholds?.distance_to_top_20 === 0
                ? "You have achieved the Top 20% benchmark!"
                : `You are ${bench?.thresholds?.distance_to_top_20 ?? 4} readiness points away from Top 20%`}
            </span>
          </div>

          {/* Visual Track */}
          <div className="relative h-4 rounded-full bg-muted/60 overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
              style={{ width: `${bench?.percentile ?? 72}%` }}
            />
            {/* Threshold Markers */}
            <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-foreground/20" title="Top 50% Median" />
            <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-amber-500/50" title="Top 20% Tier" />
            <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-emerald-500/60" title="Top 10% Tier" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1">
            <span>Bottom 10%</span>
            <span>Top 50% ({bench?.thresholds?.p50_threshold ?? 64}%)</span>
            <span className="text-primary font-bold">Top 20% ({bench?.thresholds?.p80_threshold ?? 82}%)</span>
            <span>Top 5% ({bench?.thresholds?.p95_threshold ?? 94}%)</span>
          </div>
        </div>

        {/* Competency Benchmark Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="size-3.5 text-primary" /> Competency Breakdown vs Benchmark Medians
          </h3>
          <div className="rounded-2xl border border-border/80 overflow-hidden bg-card text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/80">
                  <th className="p-3.5">Skill / Competency</th>
                  <th className="p-3.5 text-center">Your Score</th>
                  <th className="p-3.5 text-center">Cohort Median</th>
                  <th className="p-3.5 text-center">Top 20% Tier</th>
                  <th className="p-3.5 text-center">Career Target</th>
                  <th className="p-3.5 text-right">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(bench?.competencies && bench.competencies.length > 0
                  ? bench.competencies
                  : [
                      { skill_name: "SQL & Query Optimization", student_score: 92, cohort_median: 68, top_20_benchmark: 85, career_target: 80, status: "STRONG" },
                      { skill_name: "Python & Data Structures", student_score: 88, cohort_median: 65, top_20_benchmark: 84, career_target: 80, status: "STRONG" },
                      { skill_name: "Data Modeling & Warehousing", student_score: 65, cohort_median: 58, top_20_benchmark: 80, career_target: 75, status: "ON_TRACK" },
                      { skill_name: "Distributed Systems / Spark", student_score: 45, cohort_median: 42, top_20_benchmark: 74, career_target: 70, status: "GAP" },
                      { skill_name: "Technical Interview Defense", student_score: 68, cohort_median: 62, top_20_benchmark: 80, career_target: 75, status: "ON_TRACK" },
                    ]
                ).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 font-medium text-foreground">{row.skill_name}</td>
                    <td className="p-3.5 text-center font-bold text-foreground">
                      {row.student_score !== null ? `${row.student_score}%` : "—"}
                    </td>
                    <td className="p-3.5 text-center text-muted-foreground">{row.cohort_median}%</td>
                    <td className="p-3.5 text-center text-primary font-semibold">{row.top_20_benchmark}%</td>
                    <td className="p-3.5 text-center text-muted-foreground">{row.career_target}%</td>
                    <td className="p-3.5 text-right">
                      <Badge
                        className={`text-[10px] font-bold ${
                          row.status === "STRONG"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : row.status === "GAP"
                            ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                            : "bg-primary/15 text-primary border-primary/30"
                        }`}
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SPAR Takeaway */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
          <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/90 leading-relaxed">
            {bench?.spar_explanation ||
              "You are currently in the 72nd percentile among 184 comparable Data Engineer learners. Your SQL (92%) and Python (88%) exceed the Top 20% benchmark. Your main opportunity for movement is Apache Spark (45%)."}
          </p>
        </div>
      </section>


      {/* Trajectory Graph with Milestone Markers */}
      <ReadinessTrajectoryChart targetScore={85} />

      {/* Skills Evolution: Baseline vs Current vs Placement Target */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Competency Evolution vs Placement Target
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compare your initial baseline scores against verified present capability and benchmark expectations.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {skillsEvolution.map((sk, i) => (
            <div key={i} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-2">
                  {sk.skill}
                  <Badge
                    className={`text-[9px] font-bold border-none ${
                      sk.status === "STRONG"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : sk.status === "DEVELOPING"
                        ? "bg-amber-500/15 text-amber-600"
                        : "bg-rose-500/15 text-rose-600"
                    }`}
                  >
                    {sk.status === "STRONG" ? "Benchmark Met" : `Gap: -${sk.gap}%`}
                  </Badge>
                </span>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-muted-foreground">Baseline: {sk.baseline}%</span>
                  <span className="text-primary font-bold">Current: {sk.current}%</span>
                  <span className="text-emerald-600 font-semibold">Target: {sk.target}%</span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="relative w-full h-3 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 left-0 bg-primary/40 rounded-full"
                  style={{ width: `${sk.baseline}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all"
                  style={{ width: `${sk.current}%` }}
                />
                {/* Target line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-10"
                  style={{ left: `${sk.target}%` }}
                  title={`Target: ${sk.target}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Separates You From Your Target? (High-Impact Gaps) */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="size-5 text-amber-500" />
              What Separates You From Placement Readiness?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Priority bottlenecks identified by SPAR capability intelligence.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 text-xs">
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">Apache Spark Distributed Compute</span>
              <Badge className="bg-amber-500/15 text-amber-600 border-none font-bold text-[10px]">
                Gap: -20%
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your score is currently 45% (target 65%). Completing the Spark Distributed Transformations module will close this gap.
            </p>
            <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
              <Link to="/app/path">
                Work on this module <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">Technical Concept Defense & Clarity</span>
              <Badge className="bg-amber-500/15 text-amber-600 border-none font-bold text-[10px]">
                Gap: -9%
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your interview defense scored 66% (target 75%). Practice explaining partition skew and trade-offs in an adaptive mock interview.
            </p>
            <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
              <Link to="/app/practice">
                Practice Mock Interview <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Readiness Composition Breakdown */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-4 shadow-sm">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          How Your 78% Readiness Score is Composed
        </h3>

        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          {readinessComponents.map((comp, i) => (
            <div key={i} className="p-3.5 rounded-2xl border bg-secondary/15 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{comp.name}</span>
                <span className="font-mono text-primary font-bold">{comp.score}% ({comp.weight})</span>
              </div>
              <span className="text-[11px] text-muted-foreground block">{comp.evidence}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Full Achievements Showcase */}
      <AchievementShowcase />
    </div>
  );
}
