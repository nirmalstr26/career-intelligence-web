import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
  CheckCircle2,
  Play,
  RotateCcw,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import {
  Chip,
  EmptyState,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoadmapTimeline } from "@/components/curriculum/RoadmapTimeline";
import {
  useCareerIntelligence,
  useCurriculum,
  useStartModule,
} from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/plan")({
  component: CareerPlanPage,
});

function CareerPlanPage() {
  const ciQuery = useCareerIntelligence();
  const primaryCareerCode = ciQuery.data?.career_direction.primary_career ?? "DATA_ENGINEER";

  const curriculumQuery = useCurriculum(primaryCareerCode);
  const startModuleMutation = useStartModule();

  if (ciQuery.isLoading || curriculumQuery.isLoading) {
    return <PageLoading label="Loading your personalized career plan..." />;
  }

  if (ciQuery.isError || curriculumQuery.isError || !curriculumQuery.data) {
    return (
      <PageError
        onRetry={() => {
          void ciQuery.refetch();
          void curriculumQuery.refetch();
        }}
      />
    );
  }

  const ci = ciQuery.data!;
  const curr = curriculumQuery.data;

  // Empty state: No active career selected
  if (!ci.career_direction.primary_career) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">My Career Plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A step-by-step roadmap from foundations to placement-ready.
          </p>
        </header>
        <SectionCard>
          <EmptyState
            icon={<Compass className="size-6 text-primary" />}
            title="Choose a career path to create your personalized learning plan"
            description="Explore our industry-standard career pathways and choose a primary path to generate your tailored curriculum."
            action={
              <Button asChild variant="hero" size="lg">
                <Link to="/app/explore">
                  Explore Career Paths
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            }
          />
        </SectionCard>
      </div>
    );
  }

  // Next recommended module
  const nextMod = curr.next_available?.[0] ?? curr.current_module;
  const inProgressMod = curr.current_module;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold text-xs">
              Active Career Path
            </Badge>
            <span className="text-xs text-muted-foreground">
              {curr.tracks.length} Tracks · {curr.total_count} Modules
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
            {curr.career_cluster_name || humanizeCode(curr.career_cluster_code)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your structured pathway from foundational skills to production-grade competency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
            <Link to="/app/explore">
              <Compass className="mr-1.5 size-3.5" />
              Explore other paths
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
            <Link to="/app/readiness">
              <TrendingUp className="mr-1.5 size-3.5 text-primary" />
              View Readiness
            </Link>
          </Button>
        </div>
      </header>

      {/* Top Metrics Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
          <p className="text-xs font-medium text-muted-foreground">Curriculum Progress</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="font-display text-2xl font-bold text-foreground">
              {curr.progress_pct}%
            </p>
            <span className="text-xs font-semibold text-primary">
              {curr.completed_count} / {curr.total_count} Done
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${curr.progress_pct}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
          <p className="text-xs font-medium text-muted-foreground">In Progress</p>
          <p className="mt-2 font-display text-lg font-bold text-foreground truncate">
            {inProgressMod ? inProgressMod.title : "None currently active"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {inProgressMod ? `${inProgressMod.estimated_minutes} min lesson` : "Ready to start next module"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
          <p className="text-xs font-medium text-muted-foreground">Available to Learn</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {curr.next_available.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Prerequisites satisfied & unlocked
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
          <p className="text-xs font-medium text-muted-foreground">Career Readiness</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {ci.placement_readiness ? `${ci.placement_readiness.score}/100` : "Diagnostic pending"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Independent platform intelligence
          </p>
        </div>
      </div>

      {/* Next Recommended Module Hero Card */}
      {nextMod ? (
        <div className="relative overflow-hidden rounded-3xl border border-primary/50 bg-gradient-to-r from-primary/[0.08] via-card/80 to-surface p-6 sm:p-8 backdrop-blur shadow-lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Sparkles className="size-3" />
                  {inProgressMod?.code === nextMod.code ? "Continue Learning" : "Next Recommended Module"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Phase: {nextMod.phase_name}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                {nextMod.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {nextMod.description ?? nextMod.learning_objective}
              </p>
            </div>

            <Button asChild size="lg" variant="hero" className="shrink-0 font-semibold gap-2">
              <Link to="/app/learn/$moduleCode" params={{ moduleCode: nextMod.code }}>
                <Play className="size-4 fill-current" />
                {inProgressMod?.code === nextMod.code ? "Continue Module" : "Start Module"}
              </Link>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Visual Roadmap Timeline */}
      <section aria-label="Curriculum Roadmap">
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            Curriculum Roadmap
          </h2>
          <p className="text-xs text-muted-foreground">
            Follow the guided sequence across all tracks and phases. Modules unlock automatically as prerequisites are completed.
          </p>
        </div>

        <RoadmapTimeline
          tracks={curr.tracks}
          onStartModule={(modCode) => {
            void startModuleMutation.mutateAsync(modCode);
          }}
          isStarting={startModuleMutation.isPending}
        />
      </section>
    </div>
  );
}
