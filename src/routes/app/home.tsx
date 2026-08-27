import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Play,
  CheckCircle2,
  Bot,
  Layers,
  GraduationCap,
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
import { Badge } from "@/components/ui/badge";
import {
  useCareerIntelligence,
  useCurriculum,
  useRefreshIntelligence,
} from "@/lib/careerai/hooks";
import type { CareerIntelligence, CurriculumData } from "@/lib/careerai/types";

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
  const primaryCareerCode = ci.career_direction.primary_career ?? "DATA_ENGINEER";
  const curriculumQuery = useCurriculum(primaryCareerCode);
  const curr = curriculumQuery.data;

  const hasSignals =
    ci.career_landscape.length > 0 || ci.placement_readiness !== null || ci.strengths.length > 0;

  const subtitleParts = [
    student.department,
    student.current_year !== null ? `Year ${student.current_year}` : null,
  ].filter((p): p is string => p !== null && p !== "");

  // Identify active / next module
  const activeModule = curr?.current_module ?? curr?.next_available?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight">
            Welcome back, {student.first_name}
          </h1>
          {subtitleParts.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitleParts.join(" · ")}</p>
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

      {/* 1. Your Career Plan & Continue Learning Hero */}
      {curriculumQuery.isLoading ? (
        <div className="rounded-3xl border border-border/70 bg-card/60 p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading your Career Plan & learning progress...
        </div>
      ) : curr ? (
        <section
          aria-label="Your Career Plan"
          className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/[0.08] via-card/90 to-surface p-6 sm:p-8 backdrop-blur shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40 font-semibold text-xs">
                  Your Career Plan
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {curr.career_cluster_name || humanizeCode(curr.career_cluster_code)}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {curr.completed_count} of {curr.total_count} modules completed ({curr.progress_pct}%)
                </span>
              </div>

              {activeModule ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {activeModule.state === "IN_PROGRESS" ? "Continue Learning" : "Next Recommended"}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground sm:text-2xl">
                    {activeModule.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    Phase: <strong className="text-foreground/80">{activeModule.phase_name}</strong> · ~{activeModule.estimated_minutes} mins · {activeModule.difficulty}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    You're on track with your Career Plan!
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Explore deeper modules or test your readiness with our career diagnostics.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center shrink-0">
              {activeModule ? (
                <Button asChild size="lg" variant="hero" className="font-semibold gap-2 shadow-lg">
                  <Link to="/app/learn/$moduleCode" params={{ moduleCode: activeModule.code }}>
                    <Play className="size-4 fill-current" />
                    {activeModule.state === "IN_PROGRESS" ? "Continue Module" : "Start Learning"}
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="lg" className="text-xs font-semibold">
                <Link to="/app/plan">
                  <Layers className="mr-1.5 size-4" />
                  View Full Roadmap
                </Link>
              </Button>
            </div>
          </div>

          {/* Mini progress track bar */}
          <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Overall Roadmap Completion</span>
            <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${curr.progress_pct}%` }}
                />
              </div>
              <span className="font-mono text-foreground font-bold">{curr.progress_pct}%</span>
            </div>
          </div>
        </section>
      ) : !hasSignals ? (
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

      {/* 2. Top 3 Ranked Next Best Actions */}
      <section aria-label="Next Best Actions" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="size-5 text-primary" />
              Ranked Next Best Actions
            </h2>
            <p className="text-xs text-muted-foreground">
              Prioritized recommendations to maximize your career readiness.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Action 1: Curriculum module */}
          <div className="flex flex-col justify-between rounded-2xl border border-primary/40 bg-card/60 p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  #1 Priority
                </Badge>
                <span className="text-[11px] text-muted-foreground">Learning Module</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">
                {activeModule ? activeModule.title : "Start Data Engineering Foundations"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {activeModule?.description ?? "Advance your foundational skills in software, SQL, and data pipelines."}
              </p>
            </div>
            <Button asChild size="sm" variant="hero" className="mt-4 w-full font-semibold">
              {activeModule ? (
                <Link to="/app/learn/$moduleCode" params={{ moduleCode: activeModule.code }}>
                  {activeModule.state === "IN_PROGRESS" ? "Continue" : "Start Module"}
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              ) : (
                <Link to="/app/plan">
                  Open Plan
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              )}
            </Button>
          </div>

          {/* Action 2: Diagnostic / NBA */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">
                  #2 Priority
                </Badge>
                <span className="text-[11px] text-muted-foreground">Skill Validation</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">
                {ci.next_best_action?.title ?? "Take Skill Diagnostic"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {ci.next_best_action?.rationale ?? "Assess your core technical competencies to uncover verified strengths."}
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="mt-4 w-full">
              <Link to="/app/diagnostic">
                Take Diagnostic
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Action 3: AI Advisor Review */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">
                  #3 Priority
                </Badge>
                <span className="text-[11px] text-muted-foreground">AI Coaching</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">
                Review Career Strategy with SPAR AI
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Ask your dedicated AI advisor about interview preparation and skill gap closure.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="mt-4 w-full">
              <Link to="/app/agent">
                <Bot className="mr-1.5 size-3.5 text-primary" />
                Talk to Advisor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Landscape & Readiness Grids */}
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
