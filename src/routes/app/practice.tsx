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
  Target,
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
  head: () => ({
    meta: [{ title: "Practice — Practical Projects & Interviews · CareerAI" }],
  }),
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
      description: "Write queries using RANK(), DENSE_RANK(), and PARTITION BY to solve analytical business problems.",
    },
    {
      id: "m-py-1",
      title: "Memory-Efficient JSON Streaming in Python",
      skill_code: "PYTHON",
      skill_name: "Python",
      difficulty: "ADVANCED",
      estimated_minutes: 35,
      description: "Build custom generator iterators to stream and transform large datasets without exceeding RAM constraints.",
    },
    {
      id: "m-de-1",
      title: "Designing Idempotent Pipeline Ingestion",
      skill_code: "DATA_ENGINEERING",
      skill_name: "Data Engineering",
      difficulty: "INTERMEDIATE",
      estimated_minutes: 30,
      description: "Implement atomic staging table swaps and quarantine dead-letter isolation rules for robust ETL pipelines.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header with Practice Progress Strip */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                Practical Competency Center
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {curr?.career_cluster_name || humanizeCode(primaryCareerCode)}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Practice, Projects & Interview Defense
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Build production software pipelines, defend your design in AI mock interviews, and solve targeted skill challenges.
            </p>
          </div>
        </div>

        {/* 3 Pillars Quick Stat Strip */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs text-center">
          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Projects</span>
            <strong className="text-foreground text-sm font-black">1 / 2 Built</strong>
            <span className="text-[11px] text-emerald-600 font-semibold block">Score: 88/100</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Mock Interviews</span>
            <strong className="text-foreground text-sm font-black">Score: 68.5/100</strong>
            <span className="text-[11px] text-primary font-semibold block">+12 pts improvement</span>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Skill Missions</span>
            <strong className="text-foreground text-sm font-black">3 Available</strong>
            <span className="text-[11px] text-muted-foreground block">Hands-on exercises</span>
          </div>
        </div>
      </header>

      {/* 1. Practical Engineering Projects */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="size-5 text-primary" />
              Practical Engineering Projects (Portfolio Evidence)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multi-phase engineering implementations evaluated against verified 5-dimension rubrics.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((proj) => (
            <div
              key={proj.code}
              className="p-5 rounded-3xl border bg-secondary/15 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                    Phase {proj.phase} Project
                  </Badge>
                  {proj.rubric_score ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 font-mono font-bold text-xs border-none">
                      Score: {proj.rubric_score}/100
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Available</Badge>
                  )}
                </div>

                <h4 className="font-bold text-base text-foreground">{proj.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Est: <strong>~{proj.estimated_hours} hours</strong>
                </span>
                <Button asChild size="sm" className="text-xs font-semibold gap-1">
                  <Link to={`/app/projects/${proj.code}`}>
                    Open Project Workspace <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. AI Technical & Project Defense Mock Interview */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              Technical & Project Defense Mock Interview
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Turn-by-turn conversational technical interview evaluating system design and completed project defense.
            </p>
          </div>
        </div>

        {primaryInterview && (
          <div className="p-6 rounded-3xl border border-primary/30 bg-primary/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                  Data Engineer Interview Defense
                </Badge>
                {primaryInterview.latest_score && (
                  <Badge className="bg-emerald-500/15 text-emerald-600 font-mono font-bold text-xs border-none">
                    Score: {primaryInterview.latest_score}/100
                  </Badge>
                )}
              </div>

              <h4 className="font-display text-xl font-bold text-foreground">{primaryInterview.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Adaptive 7-question technical interview testing SQL aggregation logic, Python pipeline exception handling, and trade-off defense for your Simple Data Pipeline project.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => handleStartInterview(primaryInterview.code, primaryInterview.active_session_id)}
              disabled={startInterviewMutation.isPending}
              className="font-bold text-xs gap-1.5 px-6 shrink-0"
            >
              <Sparkles className="size-4" />
              {primaryInterview.latest_score ? "Retake Interview Defense" : "Start Mock Interview"}
            </Button>
          </div>
        )}
      </section>

      {/* 3. Granular Skill Missions */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Code className="size-5 text-primary" />
              Interactive Skill Practice Challenges
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Targeted short-form coding exercises to verify individual competency gaps.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          {missions.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl border bg-secondary/15 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-bold">{m.skill_name}</Badge>
                  <span className="text-[10px] text-muted-foreground font-semibold">{m.difficulty}</span>
                </div>
                <h5 className="font-bold text-foreground text-sm">{m.title}</h5>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-semibold">Est: ~{m.estimated_minutes}m</span>
                <Button asChild size="sm" variant="outline" className="text-[11px] h-7 px-3">
                  <Link to="/app/path">Solve <ArrowRight className="size-3" /></Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
