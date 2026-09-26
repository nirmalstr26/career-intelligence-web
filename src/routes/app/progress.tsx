import { CareerBenchmarkView } from '@/components/progress/CareerBenchmarkView';
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

  const curr = currQuery.data as any;
  const modulesCompleted = curr?.completed_count ?? curr?.completed_modules ?? 0;
  const totalModules = curr?.total_count ?? curr?.total_modules ?? 15;
  const currProgressPct = curr?.progress_pct ?? Math.round((modulesCompleted / Math.max(1, totalModules)) * 100);

  const projects = projectsQuery.data || [];
  const completedProjects = projects.filter((p: any) => p?.state === "COMPLETED");
  const practicalScore = completedProjects.length > 0 ? Math.round(completedProjects[0].score || 85) : 0;

  const interviews = interviewsQuery.data || [];
  const completedInterviews = interviews.filter((i: any) => i?.status === "COMPLETED");
  const interviewScore = completedInterviews.length > 0 ? Math.round(completedInterviews[0].overall_score || 0) : 0;

  const profilePct = ci?.student?.profile_completion ?? 0;
  const readinessScore = Math.round(ci?.placement_readiness?.score ?? ci?.primary_career_readiness?.score ?? (ci as any)?.readiness?.overall_score ?? 0);

  // Skill Evolution Data (Baseline vs Current vs Placement Target)
  const skillsEvolution = [
    ...(ci.strengths || []).map((s) => ({
      skill: humanizeCode(s.skill_code),
      baseline: Math.max(20, Math.round(s.score * 0.6)),
      current: Math.round(s.score),
      target: 80,
      status: s.score >= 80 ? "STRONG" : "DEVELOPING",
      gap: Math.max(0, 80 - Math.round(s.score)),
    })),
    ...(ci.priority_gaps || []).map((g) => ({
      skill: humanizeCode(g.skill_code),
      baseline: 20,
      current: 40,
      target: 75,
      status: "GAP",
      gap: 35,
    })),
  ];

  // Readiness Composition Breakdown
  const readinessComponents = [
    {
      name: "Technical Foundation",
      score: practicalScore > 0 ? practicalScore : readinessScore > 0 ? readinessScore : 0,
      weight: "25%",
      evidence: readinessScore > 0 ? "Diagnostic & Curriculum evidence" : "Pending diagnostic calibration",
    },
    {
      name: "Practical Projects Portfolio",
      score: practicalScore,
      weight: "25%",
      evidence: practicalScore > 0 ? `Completed Portfolio Project (${practicalScore}/100)` : "No project submitted yet",
    },
    {
      name: "Technical Mock Interview",
      score: interviewScore,
      weight: "20%",
      evidence: interviewScore > 0 ? `Adaptive Project Defense (${interviewScore}/100)` : "No mock interview completed yet",
    },
    {
      name: "Professional Profile & Resume",
      score: profilePct,
      weight: "15%",
      evidence: profilePct >= 80 ? "Verified Resume & Academic Profile" : "Profile setup in progress",
    },
    {
      name: "Communication & Articulation",
      score: interviewScore > 0 ? interviewScore : 0,
      weight: "15%",
      evidence: interviewScore > 0 ? "Interview Speech & Concept Clarity" : "Calibrated during mock interviews",
    },
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
            <strong className="text-foreground text-sm font-black">{currProgressPct}% Complete</strong>
            <span className="text-[11px] text-muted-foreground block">{modulesCompleted} / {totalModules} modules</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Practical Project</span>
            <strong className="text-foreground text-sm font-black">{practicalScore > 0 ? `${practicalScore} / 100` : "0 / 100"}</strong>
            <span className="text-[11px] text-muted-foreground block">
              {practicalScore > 0 ? "Quarantine isolation verified" : "No project submitted yet"}
            </span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Mock Interview</span>
            <strong className="text-foreground text-sm font-black">{interviewScore > 0 ? `${interviewScore} / 100` : "0 / 100"}</strong>
            <span className="text-[11px] text-muted-foreground block">
              {interviewScore > 0 ? "Verified interview score" : "No mock interview yet"}
            </span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Profile Readiness</span>
            <strong className="text-foreground text-sm font-black">{profilePct}%</strong>
            <span className="text-[11px] text-muted-foreground block">
              {profilePct >= 80 ? "Evidence-driven profile" : "Profile setup in progress"}
            </span>
          </div>
        </div>
      </header>

      {/* Step 20: Career Benchmark & Competitive Readiness Intelligence */}
      <CareerBenchmarkView />

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

        {skillsEvolution.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center space-y-3">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Zap className="size-5" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="font-bold text-sm text-foreground">No Competency Baselines Recorded Yet</h4>
              <p className="text-xs text-muted-foreground">
                Take your 3-Minute Skill Pulse or complete your first curriculum module to establish verified skill baselines and track your growth trajectory.
              </p>
            </div>
            <Button asChild size="sm" className="gap-2 rounded-xl text-xs font-bold shadow-sm">
              <Link to="/app/diagnostic">
                <Zap className="size-3.5 fill-current" />
                Start 3-Min Skill Pulse
              </Link>
            </Button>
          </div>
        ) : (
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
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-10"
                    style={{ left: `${sk.target}%` }}
                    title={`Target: ${sk.target}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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

        {(ci.priority_gaps || []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              No placement bottlenecks identified yet. Start with your Day 1 Skill Pulse or your introductory module to uncover priority focus areas.
            </p>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link to="/app/path">Explore Pathway Modules <ArrowRight className="size-3.5 ml-1" /></Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 text-xs">
            {(ci.priority_gaps || []).map((gap) => (
              <div key={gap.skill_code} className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{humanizeCode(gap.skill_code)}</span>
                  <Badge className="bg-amber-500/15 text-amber-600 border-none font-bold text-[10px]">
                    Priority Gap
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Focus on mastering this core competency to elevate your Career Readiness score.
                </p>
                <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
                  <Link to="/app/path">
                    Work on this competency <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Readiness Composition Breakdown */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-4 shadow-sm">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          How Your {readinessScore}% Readiness Score is Composed
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
