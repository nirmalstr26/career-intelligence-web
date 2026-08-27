import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wrench,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  FileCode2,
  MessageSquare,
  Bot,
  Layers,
} from "lucide-react";

import { SectionCard, EmptyState } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InlineSpinner } from "@/components/common/Loader";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { useCareerIntelligence, useCurriculum } from "@/lib/careerai/hooks";
import { humanizeCode } from "@/lib/utils";
import type { CareerIntelligence } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/practice")({
  head: () => ({
    meta: [{ title: "Practice — Challenges, Diagnostic & Missions · CareerAI" }],
  }),
  component: PracticeRoute,
});

function PracticeRoute() {
  const query = useCareerIntelligence();

  if (query.isPending) {
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
  const curr = currQuery.data;

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
            Practice & Challenges
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hands-on exercises, diagnostics, and coding missions to build verified portfolio evidence.
          </p>
        </div>

        <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 text-xs px-3 py-1 font-semibold">
          {curr?.career_cluster_name || humanizeCode(primaryCareerCode)} Practice
        </Badge>
      </header>

      {/* 1. Baseline Diagnostic Banner */}
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

      {/* 2. Active Skill Missions */}
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

      {/* 3. Upcoming Practice Simulations (Preview) */}
      <section className="surface-panel rounded-3xl p-6 border border-border/70 space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Upcoming Practice Modules (In Development)
          </h3>
          <p className="text-xs text-muted-foreground">
            Advanced practice experiences scheduled for your upcoming preparation milestones.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-1.5 opacity-85">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Bot className="size-4 text-primary" />
                AI Mock Technical Interview
              </span>
              <Badge variant="outline" className="text-[9px]">Unlocks at Phase 4</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Real-time voice & coding interview simulator covering SQL, Python data structures, and pipeline architecture questions.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-1.5 opacity-85">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileCode2 className="size-4 text-primary" />
                End-to-End Capstone Project Review
              </span>
              <Badge variant="outline" className="text-[9px]">Unlocks at Phase 5</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Submit your GitHub repository for automated code review, data quality scoring, and architectural evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR Coach on Practice"
        subtitle="Need hints for a challenge or want custom practice problems?"
        prompts={[
          "Can you give me a SQL challenge involving CTEs?",
          "How do I prepare for technical assessments?",
          "What is the best way to practice Python for data engineering?",
        ]}
      />
    </div>
  );
}
