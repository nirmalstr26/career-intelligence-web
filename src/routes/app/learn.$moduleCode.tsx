import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";

import {
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModuleContentRenderer } from "@/components/curriculum/ModuleContentRenderer";
import { ModuleAITutor } from "@/components/curriculum/ModuleAITutor";
import { ModuleCompletionModal } from "@/components/curriculum/ModuleCompletionModal";
import { getModuleStateBadge } from "@/components/curriculum/ModuleCard";
import {
  useModuleDetail,
  useStartModule,
  useCompleteModule,
  useCareerIntelligence,
} from "@/lib/careerai/hooks";
import type { CurriculumModule } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/learn/$moduleCode")({
  component: ModuleLearningPage,
});

function ModuleLearningPage() {
  const { moduleCode } = Route.useParams();
  const navigate = useNavigate();

  const moduleQuery = useModuleDetail(moduleCode);
  const ciQuery = useCareerIntelligence();
  const startModuleMutation = useStartModule();
  const completeModuleMutation = useCompleteModule();

  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completionResult, setCompletionResult] = useState<{
    module: CurriculumModule;
    newlyUnlocked: CurriculumModule[];
    score?: number | null;
  } | null>(null);

  // Auto-start module if it's AVAILABLE or RECOMMENDED when opened
  useEffect(() => {
    if (
      moduleQuery.data &&
      (moduleQuery.data.state === "AVAILABLE" || moduleQuery.data.state === "RECOMMENDED") &&
      !startModuleMutation.isPending
    ) {
      void startModuleMutation.mutateAsync(moduleCode);
    }
  }, [moduleQuery.data?.state, moduleCode]);

  if (!moduleQuery.data && !moduleQuery.isError) {
    return <PageLoading label={`Loading ${humanizeCode(moduleCode)}...`} />;
  }

  if (moduleQuery.isError || !moduleQuery.data) {
    return (
      <PageError
        title="Module not found"
        message={`We couldn't load the content for '${humanizeCode(moduleCode)}'.`}
        onRetry={() => void moduleQuery.refetch()}
      />
    );
  }

  const module = moduleQuery.data;
  const activeCareer = ciQuery.data?.career_direction?.primary_career ?? "DATA_ENGINEER";
  const stateBadge = getModuleStateBadge(module.state);
  const StateIcon = stateBadge.icon;

  const isLocked = module.state === "LOCKED";
  const isCompleted =
    module.state === "COMPLETED" || module.state === "SKIPPED_BY_ASSESSMENT";

  const handleAssessmentSubmit = async (score: number, timeSpentMinutes: number) => {
    try {
      const res = await completeModuleMutation.mutateAsync({
        module_code: module.code,
        assessment_score: score,
        time_spent_minutes: timeSpentMinutes || module.estimated_minutes,
      });

      setCompletionResult({
        module: res.module,
        newlyUnlocked: res.newly_unlocked,
        score,
      });
      setCompletionModalOpen(true);
    } catch {
      // Handled via React Query mutation state
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          to="/app/path"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          My Path
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/50" />
        <span className="truncate max-w-[160px] sm:max-w-none">{module.track_name}</span>
        <ChevronRight className="size-3 text-muted-foreground/50" />
        <span className="truncate max-w-[160px] sm:max-w-none">{module.phase_name}</span>
      </nav>

      {/* Module Header Bar */}
      <header className="rounded-3xl border border-border/80 bg-surface/60 p-6 sm:p-8 backdrop-blur shadow-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stateBadge.className}`}
              >
                <StateIcon className="size-3" />
                {stateBadge.label}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono uppercase">
                {module.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>{module.estimated_minutes} mins estimated</span>
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {module.title}
            </h1>

            {module.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {module.description}
              </p>
            ) : null}
          </div>

          {/* Quick Action Button in Header */}
          <div className="flex items-center gap-2 shrink-0">
            {isLocked ? (
              <Badge variant="outline" className="text-muted-foreground gap-1.5 py-1.5 px-3">
                <Lock className="size-3.5" />
                Prerequisites required
              </Badge>
            ) : isCompleted ? (
              <Badge className="bg-success/20 text-success border-success/30 gap-1.5 py-1.5 px-3 text-xs font-semibold">
                <CheckCircle2 className="size-3.5" />
                Completed
              </Badge>
            ) : (
              <Button
                variant="hero"
                size="sm"
                className="font-semibold gap-1.5"
                onClick={() => {
                  const elem = document.querySelector('[aria-label="Knowledge Check"]');
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Sparkles className="size-3.5" />
                Take Knowledge Check
              </Button>
            )}
          </div>
        </div>

        {/* Skills Developed Strip */}
        {module.skill_codes && module.skill_codes.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium">Skills developed:</span>
            {module.skill_codes.map((sk) => (
              <span
                key={sk}
                className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {humanizeCode(sk)}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {/* Main 2-Column Workspace: Content on Left, AI Tutor on Right */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
        {/* Left Column: Learning Content & Knowledge Check */}
        <main className="space-y-8 min-w-0">
          <ModuleContentRenderer
            module={module}
            onSubmitAssessment={handleAssessmentSubmit}
            isSubmitting={completeModuleMutation.isPending}
          />
        </main>

        {/* Right Column: AI Tutor Side Panel */}
        <div className="space-y-6">
          <div className="sticky top-20">
            <ModuleAITutor module={module} careerClusterCode={activeCareer} />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completionResult ? (
        <ModuleCompletionModal
          open={completionModalOpen}
          onOpenChange={setCompletionModalOpen}
          completedModule={completionResult.module}
          newlyUnlocked={completionResult.newlyUnlocked}
          score={completionResult.score}
        />
      ) : null}
    </div>
  );
}
