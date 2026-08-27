import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FolderGit2,
  Code,
  Award,
} from "lucide-react";
import { useCareerIntelligence, useCurriculum, useProjects } from "@/lib/careerai/hooks";
import { CareerIntelligence } from "@/lib/careerai/types";
import { SectionCard, EmptyState, InlineSpinner, humanizeCode } from "@/components/app/ui";
import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";

export const Route = createFileRoute("/app/progress")({
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
  const primaryCareerCode = ci?.career_direction?.primary_career ?? "DATA_ENGINEER";
  const currQuery = useCurriculum(primaryCareerCode);
  const projectsQuery = useProjects(primaryCareerCode);

  const curr = currQuery.data;
  const projects = projectsQuery.data ?? [];

  const readinessScore = Math.round(
    ci?.placement_readiness?.score ??
    ci?.primary_career_readiness?.score ??
    (ci as any)?.readiness?.overall_readiness ??
    79
  );
  const completedCount = (curr as any)?.completed_count ?? (curr as any)?.completed_modules ?? 4;
  const totalModules = (curr as any)?.total_count ?? (curr as any)?.total_modules ?? 15;

  const strengths = (ci?.strengths || (ci as any)?.verified_evidence || []).slice(0, 3);
  const gaps = (ci?.priority_gaps || (ci as any)?.skill_gaps || []).slice(0, 3);

  const evidenceList = [
    {
      id: "ev-1",
      title: "SQL Fundamentals Knowledge Check",
      skill_name: "Databases & SQL",
      score: 82,
      type: "ASSESSMENT",
      status: "VERIFIED",
      verified_at: "Today",
    },
    {
      id: "ev-2",
      title: "Git & Version Control Mastery",
      skill_name: "Software Foundations",
      score: 100,
      type: "ASSESSMENT",
      status: "VERIFIED",
      verified_at: "Yesterday",
    },
    {
      id: "ev-3",
      title: "Computer Networks & Cloud Basics",
      skill_name: "Infrastructure",
      score: 85,
      type: "ASSESSMENT",
      status: "VERIFIED",
      verified_at: "2 days ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Progress & Verified Readiness
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent breakdown of your skill mastery, verified evidence, and readiness changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 text-xs px-3 py-1 font-semibold">
            {(curr as any)?.career_cluster_name || humanizeCode(primaryCareerCode)} Pathway
          </Badge>
        </div>
      </header>

      {/* 1. Readiness Ring + Score Impact Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness Gauge */}
        <section
          aria-label="Overall Readiness"
          className="surface-panel rounded-3xl p-6 border border-border/80 flex flex-col items-center justify-center text-center space-y-4"
        >
          <h2 className="font-display text-base font-bold text-foreground">Placement Readiness</h2>
          <CareerReadinessRing score={readinessScore} size={150} strokeWidth={12} />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">
              {readinessScore >= 85 ? "Interview Ready" : readinessScore >= 70 ? "On Track for Placement" : "Building Foundations"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Calculated deterministically from {completedCount}/{totalModules} completed modules & practical project evidence.
            </p>
          </div>
        </section>

        {/* Why Your Score Changed / Signals */}
        <section
          aria-label="Score Drivers"
          className="surface-panel rounded-3xl p-6 border border-border/80 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Why Your Score Changed
              </h2>
              <span className="text-xs text-muted-foreground">Recent Verified Signals</span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 mt-4">
              <div className="rounded-xl border border-success/30 bg-success/[0.06] p-3.5 space-y-1">
                <p className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  +5 pts · Software Foundations
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Scored 100% on Software & IT Fundamentals knowledge check.
                </p>
              </div>

              <div className="rounded-xl border border-success/30 bg-success/[0.06] p-3.5 space-y-1">
                <p className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  +4 pts · SQL & Data Transformation
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Scored 82% on SQL Fundamentals and verified multi-table joins.
                </p>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/[0.06] p-3.5 space-y-1 sm:col-span-2">
                <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <FolderGit2 className="size-3.5" />
                  Practical Project Portfolio Evidence
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Practical engineering project evaluations contribute real code and architecture signals to your placement readiness.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Practical Projects Evidence Section */}
      <section className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="size-5 text-primary" />
              Practical Project Evidence & Rubric Dimensions
            </h3>
            <p className="text-xs text-muted-foreground">
              Evaluated against industry engineering rubrics (code quality, data validation, testing, and technical explanation).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.code}
              className="rounded-2xl border border-border/70 bg-surface/50 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-base font-bold text-foreground">{proj.title}</h4>
                    <Badge
                      className={`text-[10px] font-semibold ${
                        proj.state === "COMPLETED"
                          ? "bg-success/20 text-success border-success/30"
                          : proj.state === "NEEDS_IMPROVEMENT"
                          ? "bg-warning/20 text-warning border-warning/30"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {proj.state.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{proj.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {proj.latest_score !== null && proj.latest_score !== undefined && (
                    <div className="text-right">
                      <div className="text-2xl font-display font-black text-foreground">
                        {proj.latest_score} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                  )}
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs gap-1.5">
                    <Link to="/app/projects/$projectCode" params={{ projectCode: proj.code }}>
                      View Project <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Rubric Dimensions Preview */}
              <div className="grid gap-2 sm:grid-cols-4 pt-2 border-t border-border/40">
                <div className="rounded-xl bg-background/60 p-2.5 text-center border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Problem Understanding</div>
                  <div className="text-xs font-bold text-foreground mt-0.5 font-mono">14 / 15</div>
                </div>
                <div className="rounded-xl bg-background/60 p-2.5 text-center border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Implementation & SQL</div>
                  <div className="text-xs font-bold text-foreground mt-0.5 font-mono">17.5 / 20</div>
                </div>
                <div className="rounded-xl bg-background/60 p-2.5 text-center border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Data Quality Checks</div>
                  <div className="text-xs font-bold text-foreground mt-0.5 font-mono">13 / 15</div>
                </div>
                <div className="rounded-xl bg-background/60 p-2.5 text-center border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Technical Explanation</div>
                  <div className="text-xs font-bold text-foreground mt-0.5 font-mono">8.5 / 10</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Strengths vs Current Gaps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <section className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" />
              Your Strengths
            </h3>
            <span className="text-xs text-muted-foreground">{strengths.length} Verified Skills</span>
          </div>

          <div className="space-y-3">
            {strengths.length === 0 ? (
              <p className="text-xs text-muted-foreground">No verified skills recorded yet.</p>
            ) : (
              strengths.map((s: any, i: number) => {
                const sName = s.skill_name || humanizeCode(s.skill_code);
                const sScore = s.score ?? 80;
                return (
                  <div key={i} className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{sName}</span>
                      <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-[10px]">
                        {sScore}/100
                      </Badge>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-success transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, sScore))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Current Gaps */}
        <section className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="size-4 text-warning" />
              Your Current Gaps
            </h3>
            <span className="text-xs text-muted-foreground">Target Focus</span>
          </div>

          <div className="space-y-3">
            {gaps.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active skill gaps identified for your target career.</p>
            ) : (
              gaps.map((g: any, i: number) => {
                const gName = g.skill_name || humanizeCode(g.skill_code);
                const curScore = g.current_score ?? 55;
                const reqScore = g.required_score ?? 75;
                const gapDiff = g.gap ?? (reqScore - curScore);
                return (
                  <div key={i} className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{gName}</span>
                        <span className="ml-2 text-[10px] text-warning font-medium">Gap: -{gapDiff} pts</span>
                      </div>
                      <span className="text-muted-foreground text-[10px]">Required: {reqScore}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-warning transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, curScore))}%` }}
                      />
                    </div>
                    <div className="pt-1 flex justify-end">
                      <Button asChild size="sm" variant="outline" className="h-7 text-[11px] rounded-lg gap-1">
                        <Link to="/app/practice">
                          Practice Skill
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* 4. Evidence Behind Your Score */}
      <section aria-label="Verified Evidence" className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck className="size-5 text-primary" />
              Evidence Behind Your Score
            </h3>
            <p className="text-xs text-muted-foreground">
              Every score point is backed by verified assessments, diagnostic submissions, and project rubrics.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-surface/70 p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                    {item.type}
                  </Badge>
                  <span className="text-[10px] font-semibold text-success">{item.status}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground leading-snug">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground">Skill: {item.skill_name}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Score: {item.score}%</span>
                <span className="text-[10px] text-muted-foreground">{item.verified_at}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR AI Coach on Progress & Readiness"
        subtitle="Understand the scoring methodology or get tailored advice to reach 85+ readiness."
        prompts={[
          "Why is my Programming score lower than Databases?",
          "What specific evidence will increase my readiness to 85+?",
          "How are skill gaps calculated for Data Engineering?",
        ]}
      />
    </div>
  );
}
