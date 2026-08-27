import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Award,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Target,
  Compass,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

import { EmptyState, SectionCard, Chip } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { InlineSpinner } from "@/components/common/Loader";
import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { useCareerIntelligence, useCurriculum } from "@/lib/careerai/hooks";
import { resolveStudentJourney } from "@/lib/careerai/journeyResolver";
import type { CareerIntelligence } from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/today")({
  head: () => ({
    meta: [{ title: "Today — Guided Career Journey · CareerAI" }],
  }),
  component: TodayRoute,
});

function TodayRoute() {
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
          title="Could not load your daily journey"
          description={
            query.error?.message ?? "An error occurred while loading your career intelligence."
          }
          action={
            <Button variant="outline" onClick={() => void query.refetch()}>
              Retry
            </Button>
          }
        />
      </SectionCard>
    );
  }

  return <TodayContent ci={query.data} refreshing={query.isFetching} />;
}

function TodayContent({ ci, refreshing }: { ci: CareerIntelligence; refreshing: boolean }) {
  const student = ci.student;
  const primaryCareerCode = ci.career_direction.primary_career ?? "DATA_ENGINEER";
  const curriculumQuery = useCurriculum(primaryCareerCode);
  const curr = curriculumQuery.data;

  // Resolve full guided journey
  const journey = resolveStudentJourney(ci, curr);
  const primary = journey.primaryAction;

  const subtitleParts = [
    student.department,
    student.current_year !== null ? `Year ${student.current_year}` : null,
    student.expected_graduation_year !== null ? `Graduating ${student.expected_graduation_year}` : null,
  ].filter(Boolean);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* 1. Header & Personalized Daily Summary */}
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}, {student.first_name}
            </h1>
            <p className="mt-1 text-sm font-medium text-primary">
              {journey.dailySummary.headline}
            </p>
            {subtitleParts.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitleParts.join(" · ")}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-card text-foreground border-border/80 text-xs px-3 py-1">
              Current Phase: <strong className="ml-1 text-primary">{journey.dailySummary.currentPhase}</strong>
            </Badge>
            <Chip className="gap-1.5">
              {refreshing ? <InlineSpinner className="size-3" /> : null}
              {journey.modulesCompleted} / {journey.totalModules} modules ({journey.learningProgressPct}%)
            </Chip>
          </div>
        </div>

        {/* Personalized Daily Insight paragraph */}
        <div className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 backdrop-blur">
          <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
            {journey.dailySummary.summaryText}
          </p>
        </div>
      </header>

      {/* 2. Journey Strip (You are here) */}
      <JourneyStrip stages={journey.stages} />

      {/* 3. The ONE Primary "Continue Your Journey" Hero Card */}
      <section aria-label="Primary Next Action" className="relative">
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/[0.10] via-card to-surface p-6 sm:p-8 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                  <Sparkles className="size-3.5" />
                  Primary Next Step
                </span>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold",
                    primary.priority === "URGENT"
                      ? "bg-warning/20 text-warning border-warning/40"
                      : "bg-primary/20 text-primary border-primary/40",
                  )}
                >
                  {primary.badgeText}
                </Badge>

                {primary.phaseName && (
                  <span className="text-xs text-muted-foreground">
                    Phase: <strong className="text-foreground">{primary.phaseName}</strong>
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {primary.title}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {primary.subtitle}
                </p>
              </div>

              {/* Assessment / Score context banner if needs improvement */}
              {primary.currentScore !== undefined && primary.requiredScore !== undefined && (
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-warning/30 bg-warning/[0.08] p-3.5 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-warning">
                    <AlertCircle className="size-4" />
                    <span>Score: <strong>{primary.currentScore}%</strong> (Required: {primary.requiredScore}%)</span>
                  </div>
                  {primary.estimatedMinutes && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>Estimated time: ~{primary.estimatedMinutes} minutes</span>
                    </div>
                  )}
                </div>
              )}

              {/* Why This Matters & What Happens Next */}
              <div className="grid gap-2.5 pt-1 text-xs sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                  <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                    <Target className="size-3.5 text-primary" />
                    Why this matters
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{primary.whyItMatters}</p>
                </div>

                {primary.whatHappensNext && (
                  <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
                    <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="size-3.5 text-success" />
                      What happens next
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{primary.whatHappensNext}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action CTA Block */}
            <div className="flex flex-col gap-3 shrink-0 lg:w-64 pt-2">
              <Button asChild size="xl" variant="hero" className="w-full gap-2 text-base font-bold shadow-lg">
                <Link to={primary.ctaLink}>
                  {primary.ctaText}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm" className="w-full text-xs">
                <Link to="/app/path">
                  <Compass className="size-3.5 mr-1" />
                  View Full Roadmap
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Secondary Actions — Maximum 3 ("Also worth doing") */}
      <section aria-label="Secondary Actions" className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
            Also worth doing
          </h3>
          <p className="text-xs text-muted-foreground">
            Personalized recommendations derived from your verified skill signals.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {journey.secondaryActions.map((action) => (
            <div
              key={action.id}
              className="surface-panel hover-lift flex flex-col justify-between rounded-2xl p-5 border border-border/70 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-secondary text-foreground">
                    {action.badge || "Recommended"}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm text-foreground">{action.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40">
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 justify-between">
                  <Link to={action.ctaLink}>
                    <span>{action.ctaText}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contextual SPAR Coach at Bottom */}
      <ContextualCoachCard
        title="SPAR AI Coach on Today"
        subtitle="Ask questions about your daily focus, roadmap timing, or skill priorities."
        prompts={[
          "What should I focus on today?",
          `Why is ${journey.primaryAction.title} my highest priority?`,
          "How does my readiness compare to other students in Data Engineering?",
        ]}
      />
    </div>
  );
}
