import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import {
  Chip,
  EmptyState,
  Meter,
  SectionCard,
  formatDateTime,
  humanizeCode,
} from "@/components/app/ui";
import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useCareerIntelligence, useRefreshIntelligence } from "@/lib/careerai/hooks";
import type { CareerIntelligence } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/home")({
  component: HomePage,
});

function HomePage() {
  const query = useCareerIntelligence();

  if (query.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <InlineSpinner className="mr-2" /> Loading your career intelligence&hellip;
      </div>
    );
  }

  if (query.isError || query.data === undefined) {
    return (
      <SectionCard title="We couldn't load your dashboard">
        <p className="text-sm text-muted-foreground">
          Something went wrong fetching your career intelligence. Please try again.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => void query.refetch()}>
          <RefreshCw />
          Retry
        </Button>
      </SectionCard>
    );
  }

  return <HomeContent ci={query.data} refreshing={query.isFetching} />;
}

function HomeContent({ ci, refreshing }: { ci: CareerIntelligence; refreshing: boolean }) {
  const { student } = ci;
  const hasSignals =
    ci.career_landscape.length > 0 || ci.placement_readiness !== null || ci.strengths.length > 0;

  const subtitleParts = [
    student.department,
    student.current_year !== null ? `Year ${student.current_year}` : null,
  ].filter((p): p is string => p !== null && p !== "");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Welcome back, {student.first_name}
          </h1>
          {subtitleParts.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitleParts.join(" \u00b7 ")}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip>{student.profile_completion}% profile</Chip>
          <Chip className="gap-1.5">
            {refreshing ? <InlineSpinner className="size-3" /> : null}
            {humanizeCode(ci.intelligence_metadata.refresh_status)}
          </Chip>
        </div>
      </header>

      {!hasSignals ? (
        <SectionCard className="border-primary/30">
          <EmptyState
            icon={<Sparkles className="size-6" />}
            title="Let's build your career intelligence"
            description="Take a short diagnostic so CareerAI can map your strengths, spot gaps, and rank careers that fit you."
            action={
              <Button asChild variant="hero" size="lg">
                <Link to="/app/diagnostic">
                  Start diagnostic
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
        </SectionCard>
      ) : null}

      {ci.next_best_action !== null ? (
        <SectionCard
          title="Your next best action"
          description="The single most valuable thing to do next."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Target className="size-5" />
              </span>
              <div>
                <p className="font-medium">
                  {ci.next_best_action.title ?? humanizeCode(ci.next_best_action.action_code)}
                </p>
                {ci.next_best_action.rationale !== null ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {ci.next_best_action.rationale}
                  </p>
                ) : null}
                {ci.next_best_action.estimated_minutes !== null ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ~{ci.next_best_action.estimated_minutes} min
                  </p>
                ) : null}
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/app/diagnostic">
                Take action
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </SectionCard>
      ) : null}

      {hasSignals ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <SectionCard
              title="Career landscape"
              description="How your profile aligns with career clusters."
            >
              {ci.career_landscape.length > 0 ? (
                <div className="space-y-4">
                  {[...ci.career_landscape]
                    .sort((a, b) => b.alignment_score - a.alignment_score)
                    .slice(0, 5)
                    .map((item) => (
                      <Meter
                        key={item.career_cluster_code}
                        label={humanizeCode(item.career_cluster_code)}
                        value={item.alignment_score}
                        caption={`${Math.round(item.confidence * 100)}% confidence`}
                      />
                    ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Compass className="size-6" />}
                  title="No alignments yet"
                  description="Complete a diagnostic to see which careers fit you."
                />
              )}
            </SectionCard>

            {ci.career_direction.primary_career !== null ||
            ci.career_direction.exploring.length > 0 ? (
              <SectionCard title="Career direction">
                {ci.career_direction.primary_career !== null ? (
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Primary</p>
                    <p className="mt-1 font-display text-lg font-semibold">
                      {humanizeCode(ci.career_direction.primary_career)}
                    </p>
                  </div>
                ) : null}
                {ci.career_direction.exploring.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ci.career_direction.exploring.map((code) => (
                      <Chip key={code}>{humanizeCode(code)}</Chip>
                    ))}
                  </div>
                ) : null}
              </SectionCard>
            ) : null}
          </div>

          <div className="space-y-6">
            <SectionCard title="Placement readiness">
              {ci.placement_readiness !== null ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <CareerReadinessRing
                    value={ci.placement_readiness.score}
                    label="Placement readiness"
                    size={128}
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(ci.placement_readiness.confidence * 100)}% confidence
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not enough data yet. Complete a diagnostic to unlock your readiness score.
                </p>
              )}
            </SectionCard>

            <SectionCard title="Top strengths">
              {ci.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {[...ci.strengths]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((s) => (
                      <li key={s.skill_code} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm">
                          <TrendingUp className="size-4 text-primary" />
                          {humanizeCode(s.skill_code)}
                        </span>
                        <span className="numeric text-sm font-semibold">{s.score}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your verified strengths will appear here.
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      ) : null}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ClipboardList className="size-3.5" />
        Last updated {formatDateTime(ci.intelligence_metadata.last_updated_at)}
      </p>
    </div>
  );
}
