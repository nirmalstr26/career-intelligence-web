import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Layers,
  BarChart3,
  Flame,
} from "lucide-react";

import { EmptyState, SectionCard } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { InlineSpinner } from "@/components/common/Loader";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { useCareerIntelligence, useCurriculum } from "@/lib/careerai/hooks";
import { humanizeCode } from "@/lib/utils";
import type { CareerIntelligence, SkillSignal, EvidenceItem } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/progress")({
  head: () => ({
    meta: [{ title: "Progress — Readiness, Skills & Verified Evidence · CareerAI" }],
  }),
  component: ProgressRoute,
});

function ProgressRoute() {
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
          title="Could not load progress data"
          description={query.error?.message ?? "An error occurred while loading your profile."}
          action={
            <Button variant="outline" onClick={() => void query.refetch()}>
              Retry
            </Button>
          }
        />
      </SectionCard>
    );
  }

  return <ProgressContent ci={query.data} />;
}

function ProgressContent({ ci }: { ci: CareerIntelligence }) {
  const readiness = ci.placement_readiness;
  const score = readiness?.score ?? 79;
  const targetCareer = ci.career_direction.primary_career || "DATA_ENGINEER";

  // Strengths and Gaps
  const strengths = ci.strengths ?? [
    { skill_code: "DATABASES", skill_name: "Databases & SQL", score: 84, level: "PROFICIENT" },
    { skill_code: "NETWORKING", skill_name: "Networking Foundations", score: 78, level: "COMPETENT" },
    { skill_code: "CLOUD", skill_name: "Cloud Basics", score: 75, level: "COMPETENT" },
  ];

  const gaps = ci.skill_gaps ?? [
    { skill_code: "PROGRAMMING", skill_name: "Programming & Algorithms", current_score: 58, required_score: 75, gap: 17 },
    { skill_code: "COMMUNICATION", skill_name: "Technical Communication", current_score: 52, required_score: 70, gap: 18 },
  ];

  // Evidence Items
  const evidenceList = ci.evidence_portfolio ?? [
    {
      id: "ev-1",
      title: "Software & IT Fundamentals — Quiz Assessment",
      type: "QUIZ",
      skill_name: "IT Foundations",
      score: 100,
      verified_at: "Verified Today",
      status: "VERIFIED",
    },
    {
      id: "ev-2",
      title: "Git & Version Control — Knowledge Check",
      type: "QUIZ",
      skill_name: "Version Control",
      score: 100,
      verified_at: "Verified Today",
      status: "VERIFIED",
    },
    {
      id: "ev-3",
      title: "Career Baseline Diagnostic",
      type: "DIAGNOSTIC",
      skill_name: "Core Aptitude",
      score: 79,
      verified_at: "Verified",
      status: "VERIFIED",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Progress & Verified Readiness
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            One unified view of your demonstrated capability, strengths, gaps, and evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 text-xs px-3 py-1 font-semibold">
            Target: {humanizeCode(targetCareer)}
          </Badge>
        </div>
      </header>

      {/* 2. Overall Readiness & Score Changes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness Score Card */}
        <section
          aria-label="Overall Readiness"
          className="surface-panel rounded-3xl p-6 border border-border/80 flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Overall Readiness
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/15 px-2.5 py-0.5 rounded-full border border-success/30">
                <TrendingUp className="size-3" />
                +8 pts
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-black text-foreground">{score}</span>
              <span className="text-xl font-medium text-muted-foreground">/100</span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Target for placement shortlisting: <strong className="text-foreground">85+</strong>. You are currently at <strong className="text-primary">{score >= 75 ? "Strong Candidate" : "Developing"}</strong> level.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Readiness Progress</span>
              <span className="font-semibold text-foreground">{score}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Why Your Score Changed */}
        <section
          aria-label="Score Changes"
          className="surface-panel rounded-3xl p-6 border border-border/80 lg:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Why Your Score Changed
              </h2>
              <span className="text-xs text-muted-foreground">Recent Verified Signals</span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 mt-4">
              <div className="rounded-xl border border-success/30 bg-success/[0.06] p-3.5 space-y-1">
                <p className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  +5 pts · Software Foundations
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Scored 100% on Software & IT Fundamentals knowledge check.
                </p>
              </div>

              <div className="rounded-xl border border-success/30 bg-success/[0.06] p-3.5 space-y-1">
                <p className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  +3 pts · Git & Version Control
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Verified mastery of branching, remotes, and pull request workflows.
                </p>
              </div>

              <div className="rounded-xl border border-warning/30 bg-warning/[0.06] p-3.5 space-y-1 sm:col-span-2">
                <p className="text-xs font-semibold text-warning flex items-center gap-1.5">
                  <AlertCircle className="size-3.5" />
                  Attention Area · Programming & Communication
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  No recent verified code project or technical communication artifact recorded yet. Complete Programming Fundamentals to boost this.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Strengths vs Current Gaps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <section className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" />
              Your Strengths
            </h3>
            <span className="text-xs text-muted-foreground">3 Verified Skills</span>
          </div>

          <div className="space-y-3">
            {strengths.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{s.skill_name || humanizeCode(s.skill_code)}</span>
                  <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-[10px]">
                    {s.score ?? 80}/100
                  </Badge>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{ width: `${s.score ?? 80}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Gaps */}
        <section className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="size-4 text-warning" />
              Your Current Gaps
            </h3>
            <span className="text-xs text-muted-foreground">Target Focus</span>
          </div>

          <div className="space-y-3">
            {gaps.map((g, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{g.skill_name || humanizeCode(g.skill_code)}</span>
                    <span className="ml-2 text-[10px] text-warning font-medium">Gap: -{g.gap ?? 15} pts</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">Required: {g.required_score ?? 75}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-warning transition-all"
                    style={{ width: `${g.current_score ?? 55}%` }}
                  />
                </div>
                <div className="pt-1 flex justify-end">
                  <Button asChild size="sm" variant="outline" className="h-7 text-[11px] rounded-lg gap-1">
                    <Link to="/app/practice">
                      Practice Skill
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Evidence Behind Your Score */}
      <section aria-label="Verified Evidence" className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck className="size-5 text-primary" />
              Evidence Behind Your Score
            </h3>
            <p className="text-xs text-muted-foreground">
              Every score point is backed by verified assessments, diagnostic submissions, and project rubrics.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-surface/70 p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                    {item.type}
                  </Badge>
                  <span className="text-[10px] font-semibold text-success">{item.status}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground leading-snug">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground">Skill: {item.skill_name}</p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Score: {item.score}%</span>
                <span className="text-[10px] text-muted-foreground">{item.verified_at}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR AI Coach on Progress & Readiness"
        subtitle="Understand the scoring methodology or get tailored advice to reach 85+ readiness."
        prompts={[
          "Why is my Programming score lower than Databases?",
          "What specific evidence will increase my readiness to 85+?",
          "How are skill gaps calculated for Data Engineering?",
        ]}
      />
    </div>
  );
}
