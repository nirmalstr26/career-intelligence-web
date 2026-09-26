import { TodayBenchmarkCard } from '@/components/today/TodayBenchmarkCard';
import React from "react";
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
  GraduationCap,
  Building2,
  Calendar,
  Video,
  ShieldCheck,
  Zap,
  Flame,
  Bot,
} from "lucide-react";

import { EmptyState, SectionCard, Chip } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { InlineSpinner } from "@/components/common/Loader";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";
import { ReadinessTrajectoryChart } from "@/components/common/ReadinessTrajectoryChart";
import { PaceProjectionCard } from "@/components/common/PaceProjectionCard";
import { CareerMilestoneRail } from "@/components/common/CareerMilestoneRail";
import { AchievementShowcase } from "@/components/common/AchievementShowcase";
import {
  useCareerIntelligence,
  useCurriculum,
  useStudentCollegeContext,
  useStudentOpportunityInvitations,
  useRespondToOpportunityInvitation,
} from "@/lib/careerai/hooks";
import { resolveStudentJourney } from "@/lib/careerai/journeyResolver";
import type { CareerIntelligence } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/today")({
  head: () => ({
    meta: [{ title: "Today — Career Cockpit · CareerAI" }],
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
  const student = ci?.student || ({} as any);
  const primaryCareerCode = ci?.career_direction?.primary_career ?? "DATA_ENGINEER";
  const curriculumQuery = useCurriculum(primaryCareerCode);
  const curr = curriculumQuery.data;

  const collegeQuery = useStudentCollegeContext();
  const collegeData = collegeQuery.data;

  const invitesQuery = useStudentOpportunityInvitations();
  const respondInviteMutation = useRespondToOpportunityInvitation();
  const invitations = invitesQuery.data || [];

  // Resolve full guided journey
  const journey = resolveStudentJourney(ci, curr);
  const primary = journey.primaryAction;

  const readinessScore = Math.round(ci.placement_readiness?.score ?? ci.primary_career_readiness?.score ?? (ci as any)?.readiness?.overall_score ?? 0);
  const firstName = student?.first_name || user?.name?.split(" ")[0] || "Student";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* =================================================================== */}
      {/* LEVEL 1: PERSONALIZED CAREER HEADER                                  */}
      {/* =================================================================== */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Flame className="size-3.5 text-amber-500 fill-amber-500" />
                Momentum Streak
              </span>
              <Badge variant="outline" className="text-[10px]">
                {student.department || "Engineering"} · Class of {(student as any).expected_graduation_year || 2027}
              </Badge>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Active Focus: <strong className="text-foreground">{journey.activeCareerName || "Target"} Career Pathway</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-3 sm:p-4 text-center min-w-[120px]">
              <div className="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight">
                {readinessScore}%
              </div>
              <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
                Career Readiness
              </div>
            </div>
          </div>
        </div>

        {/* Cockpit quick stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs">
          <div className="p-3 rounded-2xl border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Curriculum</span>
              <strong className="text-foreground text-sm font-black">4 / 15 Modules</strong>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">27%</Badge>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Project Rubric</span>
              <strong className="text-foreground text-sm font-black">88 / 100</strong>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px]">Verified</Badge>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Mock Interview</span>
              <strong className="text-foreground text-sm font-black">68.5 / 100</strong>
            </div>
            <Badge className="bg-primary/15 text-primary border-none text-[10px]">+12 pts</Badge>
          </div>

          <div className="p-3 rounded-2xl border bg-card/60 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Profile Ready</span>
              <strong className="text-foreground text-sm font-black">82%</strong>
            </div>
            <Badge className="bg-purple-500/15 text-purple-600 border-none text-[10px]">Resume v1.0</Badge>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* LEVEL 2: HERO — YOUR NEXT MOVE (VISUAL ANCHOR)                       */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/[0.08] via-card to-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-sm">
                <Sparkles className="size-3.5" />
                YOUR NEXT MOVE
              </span>
              <Badge variant="outline" className="text-xs">
                {primary?.phaseName || "Phase 2: Programming & SQL"}
              </Badge>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {primary?.title || 'Continue Learning'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {primary?.subtitle || 'Continue your guided career curriculum.'}
              </p>
            </div>

            {/* Score Benchmark */}
            {primary.currentScore !== undefined && primary.requiredScore !== undefined && (
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-warning/30 bg-warning/[0.06] p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-warning">
                  <AlertCircle className="size-4" />
                  <span>Latest Score: <strong>{primary.currentScore}%</strong> (Target: {primary.requiredScore}%)</span>
                </div>
                {primary.estimatedMinutes && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>Est: ~{primary.estimatedMinutes} minutes remaining</span>
                  </div>
                )}
              </div>
            )}

            {/* Why This Matters */}
            <div className="grid gap-3 pt-1 text-xs sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-surface/70 p-3.5 space-y-1">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Target className="size-3.5 text-primary" /> Why this matters now
                </p>
                <p className="text-muted-foreground leading-relaxed">{primary.whyItMatters}</p>
              </div>

              {primary.whatHappensNext && (
                <div className="rounded-2xl border border-border/80 bg-surface/70 p-3.5 space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-success" /> What unlocks next
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{primary.whatHappensNext}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 shrink-0 lg:w-72">
            <Button asChild size="lg" data-primary-action="true" className="w-full gap-2 text-sm font-bold shadow-lg py-6">
              {primary?.moduleCode ? (
                <Link to="/app/learn/$moduleCode" params={{ moduleCode: primary.moduleCode }}>
                  {primary?.ctaText || 'Continue'}
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link to={primary?.ctaLink || '/app/path'}>
                  {primary?.ctaText || 'Continue'}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </Button>

            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link to="/app/coach">
                <Bot className="size-3.5 mr-1 text-primary" />
                Ask SPAR Coach About This
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
              <Link to="/app/path">
                <Compass className="size-3.5 mr-1" />
                View Full Guided Roadmap
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* LEVEL 2.5: INTERVIEW KNOWLEDGE PREP & SKILL SCORECARD                */}
      {/* =================================================================== */}
      <section className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-br from-card via-card to-primary/[0.03] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
                <Target className="size-3.5" />
                Continuous Interview Readiness
              </span>
              <Badge className="bg-primary/15 text-primary border-none text-[10px] font-bold">
                {(journey.interviewPrep?.score ?? 0) === 0 ? "Not Started" :
                 journey.interviewPrep?.level === "PLACEMENT_READY" ? "Placement Ready" :
                 journey.interviewPrep?.level === "INTERVIEW_READY" ? "Interview Ready" : "Developing"}
              </Badge>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Interview Knowledge Prep Scorecard
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real-time competency breakdown based on completed curriculum modules, project defense, and technical assessments.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-primary/[0.06] border border-primary/20 rounded-2xl p-4 shrink-0">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-primary font-mono tracking-tight">
                {journey.interviewPrep?.score ?? 0}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                Interview Prep Score
              </div>
            </div>
            <div className="h-10 w-px bg-border/80" />
            <Button asChild size="sm" className="font-bold text-xs">
              <Link to="/app/interview/$interviewId" params={{ interviewId: "de-mock-interview-1" }}>
                <Video className="size-3.5 mr-1.5" />
                Practice Interview
              </Link>
            </Button>
          </div>
        </div>

        {/* 2-Column Competency Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Column 1: Areas Improved & Strengths */}
          <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Areas Improved & Verified Strengths
              </h4>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                {journey.interviewPrep?.areasImproved?.length ?? 0} Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Skills validated through passing quiz scores and project rubric evaluations.
            </p>

            <div className="space-y-2.5 pt-1">
              {(journey.interviewPrep?.areasImproved?.length ?? 0) === 0 ? (
                <div className="rounded-xl border border-dashed border-border/80 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    No verified skills yet. Complete your Day 1 3-Min Skill Pulse to benchmark your technical foundation.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-2.5 text-xs font-semibold">
                    <Link to="/app/diagnostic">Start 3-Min Skill Pulse</Link>
                  </Button>
                </div>
              ) : (
                journey.interviewPrep?.areasImproved?.map((item) => (
                  <div
                    key={item.skillCode}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/80 text-xs shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        {item.name}
                        {item.recentGain && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">
                            {item.recentGain}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Category: {item.category || "Core"} · Status: {item.level}
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-foreground text-sm">
                      {item.score}
                      <span className="text-[10px] font-normal text-muted-foreground">/100</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Areas to Improve Breakdown */}
          <div className="space-y-3 rounded-2xl border border-warning/30 bg-warning/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <AlertCircle className="size-4 text-warning" />
                Areas to Improve (Priority Gaps)
              </h4>
              <Badge variant="outline" className="text-[10px] text-warning border-warning/30">
                {journey.interviewPrep?.areasToImprove?.length ?? 0} Priority Gaps
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Targeted concepts requiring focus to reach the 80%+ placement benchmark.
            </p>

            <div className="space-y-2.5 pt-1">
              {(journey.interviewPrep?.areasToImprove?.length ?? 0) === 0 ? (
                <div className="rounded-xl border border-dashed border-border/80 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    No priority gaps identified yet. Take the baseline diagnostic to calibrate priority learning targets.
                  </p>
                </div>
              ) : (
                journey.interviewPrep?.areasToImprove?.map((item) => (
                  <div
                    key={item.skillCode}
                    className="p-3 rounded-xl border border-border/60 bg-card/80 text-xs space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{item.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-muted-foreground">{item.currentScore}</span>
                        <span className="text-[10px] text-muted-foreground">/</span>
                        <span className="text-primary font-bold">{item.targetScore}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-warning transition-all"
                        style={{ width: `${Math.min(100, Math.round((item.currentScore / item.targetScore) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        Gap: <strong>-{item.gapMagnitude} pts</strong> to target
                      </span>
                      <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-[11px] font-bold text-primary hover:text-primary">
                        <Link to={item.actionLink || "/app/practice"}>
                          Resolve Gap <ArrowRight className="size-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Uninterrupted Flow Notification Strip */}
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Zap className="size-4 text-primary shrink-0" />
            <span className="text-muted-foreground">
              <strong className="text-foreground font-bold">Uninterrupted Learning Progression:</strong> Passing each module knowledge check automatically unlocks your next challenge and recalibrates your Interview Knowledge Score in real-time.
            </span>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 text-xs font-bold">
            <Link to="/app/path">
              <BookOpen className="size-3.5 mr-1" />
              View Next Module in Pathway
            </Link>
          </Button>
        </div>
      </section>

      {/* =================================================================== */}
      {/* LEVEL 3: READINESS TRAJECTORY & PACE PROJECTION                      */}
      {/* =================================================================== */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReadinessTrajectoryChart targetScore={85} />
        </div>

        <div>
          <PaceProjectionCard
            currentScore={readinessScore}
            targetScore={85}
            weeklyGrowth={3.2}
            completedActivitiesCount={3}
            hoursInvested="4h 20m"
            readinessGain={4}
          />
        </div>
      </section>

      {/* =================================================================== */}
      {/* LEVEL 4: CAREER MILESTONE RAIL                                       */}
      {/* =================================================================== */}
      <CareerMilestoneRail />

      {/* =================================================================== */}
      {/* LEVEL 5: RECRUITER INVITATIONS & COLLEGE COHORTS                     */}
      {/* =================================================================== */}
      {/* Recruiter Direct Invitations */}
      {invitations.length > 0 && (
        <section className="surface-panel rounded-3xl p-6 sm:p-7 border border-primary/30 bg-gradient-to-r from-primary/[0.05] via-card to-card space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                Recruiter Direct Invitation
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                Explicit Consent Required
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Verified Employer Matching
            </span>
          </div>

          {invitations.map((inv) => (
            <div
              key={inv.invitation_id}
              className="p-4 rounded-2xl border bg-card/90 space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    {inv.role_title} · {inv.company_name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Location: <strong>{inv.company_location}</strong> · Mode: <strong>{inv.work_mode}</strong> · Stipend: <strong>{inv.stipend_or_salary || "Competitive"}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xl font-black text-primary">{inv.match_score.toFixed(0)}%</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground">SPAR Fit</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-primary/[0.03] border border-primary/15 p-3 text-xs leading-relaxed text-foreground/90">
                <strong className="text-primary font-semibold block mb-0.5">Why you were matched:</strong>
                {inv.fit_explanation}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t text-xs">
                <span className="text-muted-foreground text-[11px]">
                  {inv.status === "INTERESTED"
                    ? "✓ You opted in! Recruiter has access to your verified profile."
                    : "Choosing 'I\'m Interested' shares your verified project & skill profile with this recruiter."}
                </span>

                <div className="flex items-center gap-2">
                  {inv.status === "INVITED" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          respondInviteMutation.mutate({
                            opportunityId: inv.opportunity_id,
                            interested: false,
                          })
                        }
                        disabled={respondInviteMutation.isPending}
                        className="text-xs"
                      >
                        Not Interested
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          respondInviteMutation.mutate({
                            opportunityId: inv.opportunity_id,
                            interested: true,
                          })
                        }
                        disabled={respondInviteMutation.isPending}
                        className="text-xs font-semibold gap-1.5"
                      >
                        <CheckCircle2 className="size-3.5" />
                        I'm Interested
                      </Button>
                    </>
                  ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-none font-bold text-xs py-1 px-3">
                      Consent Granted ({inv.status})
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* College Cohort Assignments Section */}
      {collegeData?.is_member && (
        <section className="surface-panel rounded-3xl p-6 sm:p-7 border border-primary/25 bg-gradient-to-r from-primary/[0.04] via-card to-card space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[10px] font-semibold">
                  College Cohort
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {collegeData.cohort_name}
                </Badge>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mt-1 flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                {collegeData.college_name}
              </h3>
            </div>

            <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1">
              <Link to="/college/dashboard">
                <Building2 className="size-3.5 text-primary" />
                Placement Portal
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="size-3.5 text-primary" />
                Assigned Preparation Activities ({(collegeData.active_assignments || []).length})
              </span>

              <div className="space-y-2">
                {(collegeData.active_assignments || []).map((asgn) => (
                  <div
                    key={asgn.assignment_id}
                    className="p-3.5 rounded-2xl border bg-card/80 flex items-center justify-between text-xs space-x-2"
                  >
                    <div>
                      <span className="font-semibold text-foreground block">{asgn.title}</span>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        Due {asgn.due_date ? new Date(asgn.due_date).toLocaleDateString() : "Soon"}
                      </div>
                    </div>

                    <Badge
                      className={`text-[10px] font-bold border-none ${
                        asgn.status === "COMPLETED"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {asgn.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                Upcoming Placement Workshops ({(collegeData.upcoming_sessions || []).length})
              </span>

              <div className="space-y-2">
                {(collegeData.upcoming_sessions || []).map((ses) => (
                  <div
                    key={ses.id}
                    className="p-3.5 rounded-2xl border bg-card/80 flex items-center justify-between text-xs space-x-2"
                  >
                    <div>
                      <span className="font-semibold text-foreground block">{ses.title}</span>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {new Date(ses.scheduled_at).toLocaleDateString()}
                      </div>
                    </div>

                    {ses.meeting_link && (
                      <a
                        href={ses.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <Video className="size-3.5" />
                        Join
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* LEVEL 6: ACHIEVEMENTS & CONTEXTUAL SPAR COACH                        */}
      {/* =================================================================== */}
      {/* Competitive Position & Benchmark Snapshot */}
      <TodayBenchmarkCard />

      <section className="grid gap-6 lg:grid-cols-2">
        <AchievementShowcase compact />

        <div className="space-y-4">
          <ContextualCoachCard ci={ci} />
        </div>
      </section>
    </div>
  );
}
