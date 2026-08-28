import { CareerKnowledgeGraph } from "@/components/graph/CareerKnowledgeGraph";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Map,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  AlertTriangle,
  Check,
  Zap,
  Target,
  Clock,
  ChevronRight,
  ListFilter,
  Eye,
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
    meta: [{ title: "My Path — Guided Career Roadmap & Journey Map · CareerAI" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    view: (typeof search.view === "string" ? search.view : undefined) as "guided" | "graph" | "full" | undefined,
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

  const search = Route.useSearch();
  const [viewMode, setViewMode] = useState<"guided" | "graph" | "full">(
    search?.view === "graph" || search?.view === "full" ? search.view : "guided"
  );
  const navigate = useNavigate();

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
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header with Active Career & View Mode Switcher */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                Active Career Pathway
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {humanizeCode(primaryCareerCode)}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {curr?.career_cluster_name || humanizeCode(primaryCareerCode)} Roadmap
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phase 2 of 5: <strong className="text-foreground">{journey.dailySummary.currentPhase}</strong> · 4 of 15 Modules Completed (27%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border bg-secondary/30 p-1 flex items-center gap-1">
              <Button
                size="sm"
                variant={viewMode === "guided" ? "default" : "ghost"}
                onClick={() => setViewMode("guided")}
                className="text-xs h-7 rounded-full font-semibold px-3"
              >
                Guided View
              </Button>
              <Button
                size="sm"
                variant={viewMode === "graph" ? "default" : "ghost"}
                onClick={() => setViewMode("graph")}
                className="text-xs h-7 rounded-full font-semibold px-3 flex items-center gap-1.5"
              >
                <Map className="size-3.5 text-primary" />
                Journey Map (Graph)
              </Button>
              <Button
                size="sm"
                variant={viewMode === "full" ? "default" : "ghost"}
                onClick={() => setViewMode("full")}
                className="text-xs h-7 rounded-full font-semibold px-3"
              >
                Full Roadmap
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSwitchModalOpen(true)}
              className="text-xs font-semibold rounded-full"
            >
              Change Career
            </Button>
          </div>
        </div>
      </header>

      {/* GUIDED VIEW (DEFAULT) */}
      {viewMode === "guided" && (
        <div className="space-y-6">
          {/* Current Focus Anchor */}
          <div className="surface-panel rounded-3xl p-6 sm:p-8 border-2 border-primary/40 bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-bold text-xs py-1 px-3">
                  CURRENT ACTIVE MODULE
                </Badge>
                <Badge variant="outline" className="text-xs">
                  In Progress
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                <Clock className="size-3.5 text-primary" /> ~25 minutes remaining
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                SQL Fundamentals & Window Functions
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Master complex SQL aggregations, window framing, subqueries, and analytical CTEs for production ETL pipelines.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border bg-secondary/15 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Latest Assessment Score: <strong className="text-foreground">82%</strong> (Passing target: 65%)
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-600 border-none font-bold">
                Benchmark Met
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
              <span className="text-xs text-muted-foreground">
                Completing this module unlocks: <strong className="text-foreground">Python Fundamentals</strong>
              </span>

              <Button asChild size="sm" data-primary-action="true" className="font-bold text-xs gap-1.5 px-5">
                <Link to="/app/learn/$moduleCode" params={{ moduleCode: curr?.tracks?.[0]?.phases?.[0]?.modules?.[0]?.code || "SW_IT_FUNDAMENTALS" }}>
                  Continue Module <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Next 3 Upcoming Sequential Modules */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Next Modules in Sequence
            </h3>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-2xl border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-bold">Step 2 · Available Next</Badge>
                <h4 className="font-bold text-foreground text-sm">Python for Data Engineering</h4>
                <p className="text-muted-foreground text-[11px]">Object-oriented pipeline design, exception handling, and PyTest suites.</p>
              </div>

              <div className="p-4 rounded-2xl border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-bold">Step 3 · Locked</Badge>
                <h4 className="font-bold text-foreground text-sm">Relational Data Modeling</h4>
                <p className="text-muted-foreground text-[11px]">Star & Snowflake schemas, SCD Type 2 dimension management.</p>
              </div>

              <div className="p-4 rounded-2xl border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-bold">Step 4 · Project Milestone</Badge>
                <h4 className="font-bold text-foreground text-sm">Build a Simple Data Pipeline</h4>
                <p className="text-muted-foreground text-[11px]">Automated quarantine logic & SQLite batch transformations.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL ROADMAP VIEW */}
            {viewMode === "graph" && (
        <CareerKnowledgeGraph
          careerTitle={humanizeCode(journey.selectedCareerCode || "DATA_ENGINEER")}
          careerCode={journey.selectedCareerCode || "DATA_ENGINEER"}
          onAskSpar={(prompt) => {
            navigate({ to: "/app/coach", search: { query: prompt } as any });
          }}
        />
      )}

      {viewMode === "full" && curr?.tracks && (
        <RoadmapTimeline tracks={curr.tracks} />
      )}

      {/* Switch Career Modal */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-bold text-foreground">Change Target Career Direction</h3>
              <p className="text-xs text-muted-foreground">Select a new engineering pathway to update your guided curriculum.</p>
            </div>

            <div className="space-y-2 text-xs">
              {ALL_CAREER_OPTIONS.map((c) => (
                <div
                  key={c.code}
                  onClick={() => setSelectedNewCareer(c.code)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedNewCareer === c.code
                      ? "border-primary bg-primary/[0.06] font-semibold text-primary"
                      : "border-border/60 hover:bg-secondary/20 text-foreground"
                  }`}
                >
                  <div className="font-bold">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button size="sm" variant="ghost" onClick={() => setSwitchModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmCareerSwitch} disabled={switching} className="text-xs font-semibold">
                {switching ? "Switching..." : "Confirm Switch"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
