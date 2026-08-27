import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  AlertTriangle,
  Check,
} from "lucide-react";

import { EmptyState, SectionCard, Chip } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { InlineSpinner } from "@/components/common/Loader";
import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { RoadmapTimeline } from "@/components/curriculum/RoadmapTimeline";
import { useCareerIntelligence, useCurriculum } from "@/lib/careerai/hooks";
import { resolveStudentJourney } from "@/lib/careerai/journeyResolver";
import { api } from "@/lib/api";
import { humanizeCode } from "@/lib/utils";
import type { CareerIntelligence, CurriculumData } from "@/lib/careerai/types";

const ALL_CAREER_OPTIONS = [
  { code: "DATA_ENGINEER", name: "Data Engineer", desc: "Pipelines, Big Data, SQL, Distributed Computing" },
  { code: "CYBERSECURITY", name: "Cybersecurity", desc: "Network Security, Threat Intelligence, SecOps" },
  { code: "SOFTWARE_ENGINEERING", name: "Software Engineering", desc: "Full-Stack Development, Backend Services, Architecture" },
  { code: "AI_ML", name: "AI / Machine Learning", desc: "Model Development, PyTorch, LLM Applications" },
  { code: "CLOUD_PLATFORM", name: "Cloud & Platform", desc: "DevOps, Kubernetes, Cloud Infrastructure" },
  { code: "DATA_ANALYTICS", name: "Data & Analytics", desc: "Business Intelligence, SQL Analytics, Dashboards" },
];

export const Route = createFileRoute("/app/path")({
  head: () => ({
    meta: [{ title: "My Path — Career Plan & Curriculum · CareerAI" }],
  }),
  component: PathRoute,
});

function PathRoute() {
  const ciQuery = useCareerIntelligence();

  if (ciQuery.isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <InlineSpinner className="size-6 text-primary" />
      </div>
    );
  }

  if (ciQuery.isError || ciQuery.data === undefined) {
    return (
      <SectionCard className="border-destructive/30">
        <EmptyState
          title="Could not load career path"
          description={ciQuery.error?.message ?? "An error occurred while loading your profile."}
          action={
            <Button variant="outline" onClick={() => void ciQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </SectionCard>
    );
  }

  return <PathContent ci={ciQuery.data} refreshing={ciQuery.isFetching} onRefresh={() => void ciQuery.refetch()} />;
}

function PathContent({
  ci,
  refreshing,
  onRefresh,
}: {
  ci: CareerIntelligence;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const primaryCareerCode = ci.career_direction.primary_career ?? "DATA_ENGINEER";
  const curriculumQuery = useCurriculum(primaryCareerCode);
  const curr = curriculumQuery.data;

  const journey = resolveStudentJourney(ci, curr);
  const student = ci.student;

  // Career Switch Dialog State
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [selectedNewCareer, setSelectedNewCareer] = useState(primaryCareerCode);
  const [switching, setSwitching] = useState(false);

  async function handleConfirmCareerSwitch() {
    if (selectedNewCareer === primaryCareerCode) {
      setSwitchModalOpen(false);
      return;
    }

    setSwitching(true);
    try {
      await api.post("/auth/dev-login", {
        body: {
          email: ci.student.user_id ? "dev@careerai.dev" : "test@spar.dev",
          first_name: student.first_name,
          last_name: student.last_name,
          is_new_registration: false,
          target_career: selectedNewCareer,
        },
      });
      setSwitchModalOpen(false);
      onRefresh();
      void curriculumQuery.refetch();
    } catch {
      alert("Failed to update career path. Please try again.");
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Header with Active Career & Action Buttons */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 font-semibold text-xs">
              Active Career Path
            </Badge>
            <span className="text-xs text-muted-foreground">Only 1 active path at a time</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            {curr?.career_cluster_name || humanizeCode(primaryCareerCode)}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Current Phase: <strong className="text-foreground">{journey.dailySummary.currentPhase}</strong> · Focus: <strong className="text-primary">{journey.primaryAction.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSwitchModalOpen(true)}
            className="rounded-full text-xs font-semibold gap-1.5"
          >
            <Compass className="size-3.5 text-primary" />
            Explore Another Career
          </Button>

          {journey.primaryAction.moduleCode && (
            <Button asChild size="sm" variant="hero" className="rounded-full text-xs font-semibold gap-1.5 shadow-md">
              <Link to={journey.primaryAction.ctaLink}>
                {journey.primaryAction.ctaText}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* 2. Key Metrics Banner: Learning Progress vs Career Readiness (Clearly Distinguished) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Metric 1: Learning Progress */}
        <div className="surface-panel rounded-2xl p-5 border border-border/70 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <BookOpen className="size-4 text-primary" />
                <span>Learning Progress</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                {journey.learningProgressPct}%
              </p>
              <p className="text-xs text-muted-foreground">
                {journey.modulesCompleted} of {journey.totalModules} modules completed
              </p>
            </div>

            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Layers className="size-5" />
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 shrink-0 text-muted-foreground/80" />
            <span><strong>Learning Progress</strong> = structured curriculum milestones and modules completed.</span>
          </div>
        </div>

        {/* Metric 2: Career Readiness */}
        <div className="surface-panel rounded-2xl p-5 border border-border/70 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <TrendingUp className="size-4 text-success" />
                <span>Career Readiness</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                {journey.readinessScore}<span className="text-lg font-normal text-muted-foreground">/100</span>
              </p>
              <p className="text-xs text-success font-medium">
                Placement Ready Target: 85+
              </p>
            </div>

            <span className="grid size-11 place-items-center rounded-xl bg-success/10 text-success">
              <Award className="size-5" />
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 shrink-0 text-muted-foreground/80" />
            <span><strong>Career Readiness</strong> = demonstrated capability based on verified assessments and evidence.</span>
          </div>
        </div>
      </div>

      {/* 3. Journey Strip */}
      <JourneyStrip stages={journey.stages} />

      {/* 4. Full Visual Roadmap Timeline */}
      {curriculumQuery.isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-border bg-card/40">
          <InlineSpinner className="size-6 text-primary" />
        </div>
      ) : curr ? (
        <section aria-label="Curriculum Roadmap" className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Curriculum Roadmap
            </h2>
            <p className="text-xs text-muted-foreground">
              Step-by-step pathway grouped by Track → Phase → Module. Locked modules show their unlocking prerequisites.
            </p>
          </div>

          <RoadmapTimeline
            tracks={curr.tracks}
            careerClusterName={curr.career_cluster_name}
            careerClusterCode={curr.career_cluster_code}
          />
        </section>
      ) : (
        <SectionCard>
          <EmptyState
            title="Curriculum is being prepared"
            description="The curriculum roadmap for this career pathway is being generated."
          />
        </SectionCard>
      )}

      {/* 5. Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR Coach on My Path"
        subtitle="Need advice on which track to tackle first or how to balance foundational skills?"
        prompts={[
          `Why does ${curr?.career_cluster_name || "Data Engineering"} suit me?`,
          "What track should I prioritize after Technology Fundamentals?",
          "How do prerequisites work in this roadmap?",
        ]}
      />

      {/* Switch Career Confirmation Modal */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-warning/20 text-warning">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Change Primary Career</h3>
                <p className="text-xs text-muted-foreground">You can have only ONE active career path at a time.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface/60 p-3.5 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> Your completed foundational modules (Software Fundamentals, Git, Programming, SQL) will stay completed. Your specialization track and readiness weights will adapt to the new career.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Select Target Career:
              </label>
              <div className="grid gap-2 max-h-60 overflow-y-auto pr-1">
                {ALL_CAREER_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setSelectedNewCareer(opt.code)}
                    className={`flex items-start justify-between rounded-xl border p-3 text-left transition-all ${
                      selectedNewCareer === opt.code
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border/70 bg-surface text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">{opt.name}</p>
                      <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                    </div>
                    {selectedNewCareer === opt.code && (
                      <Check className="size-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSwitchModalOpen(false)}
                disabled={switching}
              >
                Cancel
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => void handleConfirmCareerSwitch()}
                disabled={switching || selectedNewCareer === primaryCareerCode}
                className="gap-1.5"
              >
                {switching ? "Switching..." : "Confirm Career Switch"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
