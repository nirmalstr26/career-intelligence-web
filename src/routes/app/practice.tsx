import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Code,
  CheckCircle2,
  Briefcase,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  Award,
  AlertTriangle,
  FolderGit2,
  Video,
  ShieldCheck,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  useCareerIntelligence,
  useCurriculum,
  useProjects,
  useInterviews,
  useStartInterview,
} from "@/lib/careerai/hooks";
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
  const navigate = useNavigate();
  const query = useCareerIntelligence();
  const primaryCareerCode = query.data?.career_direction?.primary_career || "DATA_ENGINEER";
  const curriculumQuery = useCurriculum(primaryCareerCode);
  const projectsQuery = useProjects(primaryCareerCode);
  const interviewsQuery = useInterviews(primaryCareerCode);
  const startInterviewMutation = useStartInterview();

  if (query.isLoading || curriculumQuery.isLoading) {
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

  const ci: CareerIntelligence = query.data;
  const curr = curriculumQuery.data;
  const projects = projectsQuery.data || [];
  const interviews = interviewsQuery.data || [];
  const primaryInterview = interviews[0];

  const handleStartInterview = async (code: string, activeSessionId?: string | null) => {
    if (activeSessionId) {
      navigate({
        to: "/app/interview/$interviewId",
        params: { interviewId: activeSessionId },
      });
      return;
    }
    try {
      const res = await startInterviewMutation.mutateAsync(code);
      navigate({
        to: "/app/interview/$interviewId",
        params: { interviewId: res.session.id },
      });
    } catch (err) {
      console.error("Failed to start interview:", err);
    }
  };

  const missions = [
    {
      id: "m-sql-1",
      title: "SQL Window Functions & Aggregations",
      skill_code: "SQL",
      skill_name: "SQL",
      difficulty: "INTERMEDIATE",
      estimated_minutes: 25,
      xp: 120,
      description: "Write queries using RANK(), DENSE_RANK(), and PARTITION BY to solve analytical business problems.",
    },
    {
      id: "m-py-1",
      title: "Memory-Efficient JSON Streaming in Python",
      skill_code: "PYTHON",
      skill_name: "Python",
      difficulty: "ADVANCED",
      estimated_minutes: 35,
      xp: 150,
      description: "Build custom generator iterators to stream and transform large datasets without exceeding RAM constraints.",
    },
    {
      id: "m-de-1",
      title: "Designing Idempotent Pipeline Ingestion",
      skill_code: "DATA_ENGINEERING",
      skill_name: "Data Engineering",
      difficulty: "INTERMEDIATE",
      estimated_minutes: 30,
      xp: 140,
      description: "Implement atomic staging table swaps and quarantine dead-letter isolation rules for robust ETL pipelines.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-2">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/20 text-primary border-none text-[11px] font-semibold">
              Practical Workspace
            </Badge>
            <span className="text-xs text-muted-foreground">Level up through real problem-solving</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Practice & Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Build real software pipelines, defend your architecture in AI Mock Interviews, and complete targeted skill challenges.
          </p>
        </div>

        <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 text-xs px-3 py-1 font-semibold">
          {curr?.career_cluster_name || humanizeCode(primaryCareerCode)} Practice
        </Badge>
      </header>

      {/* 1. AI Mock Technical & Project Defense Interview (Step 6 Highlight) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              AI Technical & Project Defense Mock Interview
            </h3>
            <p className="text-xs text-muted-foreground">
              Turn-by-turn conversational interview testing technical knowledge, pipeline design, and completed project defense.
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            Adaptive 7-Question Flow
          </Badge>
        </div>

        {primaryInterview ? (
          <div className="surface-panel hover-lift rounded-3xl p-6 sm:p-7 border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                  Technical + Project Defense
                </Badge>

                {primaryInterview.latest_score !== null && primaryInterview.latest_score !== undefined ? (
                  <Badge
                    variant="outline"
                    className={`text-xs font-mono font-bold ${
                      primaryInterview.latest_score >= 80
                        ? "text-emerald-600 border-emerald-500/40 bg-emerald-500/10"
                        : primaryInterview.latest_score >= 65
                        ? "text-amber-600 border-amber-500/40 bg-amber-500/10"
                        : "text-rose-600 border-rose-500/40 bg-rose-500/10"
                    }`}
                  >
                    Latest Score: {primaryInterview.latest_score.toFixed(1)} / 100 ({primaryInterview.latest_readiness_level})
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Not Attempted Yet
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  ~{primaryInterview.duration_minutes} mins · {primaryInterview.target_question_count} Questions
                </span>
              </div>

              <div>
                <h4 className="font-display text-lg font-bold text-foreground">
                  {primaryInterview.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {primaryInterview.description}
                </p>
              </div>

              {/* Competencies Tested */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {primaryInterview.competencies.map((comp) => (
                  <span
                    key={comp}
                    className="rounded-lg bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/50"
                  >
                    {comp.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <Button
                size="lg"
                variant="hero"
                className="rounded-2xl font-bold text-xs gap-2"
                onClick={() =>
                  handleStartInterview(primaryInterview.code, primaryInterview.active_session_id)
                }
                disabled={startInterviewMutation.isPending}
              >
                {startInterviewMutation.isPending ? (
                  <InlineSpinner className="size-4" />
                ) : (
                  <Bot className="size-4" />
                )}
                {primaryInterview.active_session_id
                  ? "Resume Active Interview"
                  : primaryInterview.attempt_count > 0
                  ? `Retake Mock Interview (Attempt #${primaryInterview.attempt_count + 1})`
                  : "Start Mock Interview"}
                <ArrowRight className="size-4" />
              </Button>

              {primaryInterview.attempt_count > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {primaryInterview.attempt_count} completed attempt{primaryInterview.attempt_count > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border text-center text-muted-foreground text-sm">
            Mock interviews are being prepared for this pathway.
          </div>
        )}
      </section>

      {/* 2. Hands-on Practical Projects Section */}
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

      {/* 3. Active Skill Missions */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Targeted Skill Missions</h3>
          <p className="text-xs text-muted-foreground">
            Complete focused exercises to fill identified skill gaps and earn verified evidence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
                  ~{m.estimated_minutes} mins
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
        title="SPAR Coach for Technical Interviews & Projects"
        subtitle="Need help preparing for interview follow-ups or answering pipeline scaling questions?"
        prompts={[
          "How did I perform in my mock interview?",
          "Explain how to design idempotent data pipelines in Python and SQL.",
          "What questions will interviewers ask about my data pipeline project?",
        ]}
      />
    </div>
  );
}
