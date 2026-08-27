import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  Award,
  AlertTriangle,
  FolderGit2,
} from "lucide-react";
import { useCareerIntelligence, useCurriculum, useProjects } from "@/lib/careerai/hooks";
import { CareerIntelligence } from "@/lib/careerai/types";

import { SectionCard, humanizeCode } from "@/components/app/ui";
import { EmptyState } from "@/components/app/ui";
import { InlineSpinner } from "@/components/app/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";

export const Route = createFileRoute("/app/practice")({
  component: PracticePage,
});

function PracticePage() {
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
          title="Could not load practice data"
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

  return <PracticeContent ci={query.data} />;
}

function PracticeContent({ ci }: { ci: CareerIntelligence }) {
  const primaryCareerCode = ci.career_direction.primary_career ?? "DATA_ENGINEER";
  const currQuery = useCurriculum(primaryCareerCode);
  const projectsQuery = useProjects(primaryCareerCode);

  const curr = currQuery.data;
  const projects = projectsQuery.data ?? [];

  // Active missions
  const missions = ci.active_missions ?? [
    {
      id: "m-1",
      title: "SQL Aggregate & Join Mastery",
      description: "Solve 5 multi-table aggregation challenges using GROUP BY and HAVING clauses.",
      skill_name: "SQL & Databases",
      estimated_minutes: 15,
      xp: 150,
      difficulty: "INTERMEDIATE",
    },
    {
      id: "m-2",
      title: "Python Data Transformation Script",
      description: "Write a clean Python function to parse raw JSON logs and compute daily metrics.",
      skill_name: "Python Programming",
      estimated_minutes: 20,
      xp: 200,
      difficulty: "INTERMEDIATE",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Practice & Hands-on Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Engineering projects, diagnostics, and coding missions to build verified portfolio evidence.
          </p>
        </div>

        <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 text-xs px-3 py-1 font-semibold">
          {curr?.career_cluster_name || humanizeCode(primaryCareerCode)} Practice
        </Badge>
      </header>

      {/* 1. Hands-on Practical Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="size-5 text-primary" />
              Practical Engineering Projects
            </h3>
            <p className="text-xs text-muted-foreground">
              End-to-end portfolio projects evaluated by AI rubrics to create verified platform evidence.
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            {projects.length} Project Available
          </Badge>
        </div>

        <div className="grid gap-4">
          {projects.map((proj) => (
            <div
              key={proj.code}
              className="surface-panel hover-lift rounded-3xl p-6 sm:p-7 border border-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={`text-xs font-semibold ${
                      proj.state === "COMPLETED"
                        ? "bg-success/20 text-success border-success/30"
                        : proj.state === "NEEDS_IMPROVEMENT"
                        ? "bg-warning/20 text-warning border-warning/30"
                        : proj.state === "IN_PROGRESS"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {proj.state.replace("_", " ")}
                  </Badge>

                  {proj.latest_score !== null && proj.latest_score !== undefined && (
                    <Badge variant="outline" className="text-xs font-mono font-bold text-foreground">
                      Score: {proj.latest_score} / 100
                    </Badge>
                  )}

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    ~{proj.estimated_hours} hours · {proj.difficulty}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{proj.description}</p>
                </div>

                {/* Skills Tested */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.skill_codes.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                    >
                      {sk.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <Button asChild size="lg" variant="hero" className="rounded-2xl font-bold text-xs gap-2">
                  <Link to="/app/projects/$projectCode" params={{ projectCode: proj.code }}>
                    {proj.state === "COMPLETED"
                      ? "View Project Submission"
                      : proj.state === "IN_PROGRESS"
                      ? "Continue Workspace"
                      : "Open Project Workspace"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {proj.attempt_count > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    {proj.attempt_count} submission attempt{proj.attempt_count > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Baseline Diagnostic Banner */}
      <section className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/[0.08] via-card to-surface p-6 sm:p-8 backdrop-blur shadow-md">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                Baseline Diagnostic
              </Badge>
              <span className="text-xs text-muted-foreground">10-15 minutes</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              Career Readiness Diagnostic
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Assesses your technical reasoning, problem-solving, and foundational knowledge to calibrate your roadmap and calculate your starting readiness score.
            </p>
          </div>

          <Button asChild size="lg" variant="hero" className="shrink-0 font-bold gap-2">
            <Link to="/app/diagnostic">
              Launch Diagnostic
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3. Active Skill Missions */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Active Skill Missions</h3>
          <p className="text-xs text-muted-foreground">
            Complete targeted missions to fill identified skill gaps and earn verified evidence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {missions.map((m) => (
            <div
              key={m.id}
              className="surface-panel hover-lift rounded-2xl p-5 border border-border/70 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-secondary text-foreground">
                    {m.skill_name}
                  </Badge>
                  <span className="text-[10px] font-semibold text-primary">+{m.xp} XP</span>
                </div>

                <h4 className="font-semibold text-sm text-foreground">{m.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  ~{m.estimated_minutes} mins · {m.difficulty}
                </span>

                <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1">
                  <Link to="/app/missions">
                    Start Mission
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR Coach on Practical Projects"
        subtitle="Need help designing your pipeline architecture or passing the data-quality rubric?"
        prompts={[
          "How do I structure my data pipeline repository?",
          "What validation checks are essential for order data?",
          "Can you review my pipeline design before I submit?",
        ]}
      />
    </div>
  );
}
