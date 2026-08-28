import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Users,
  Activity,
  BarChart3,
  Bot,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  GraduationCap,
  Building2,
  Briefcase,
  Star,
  Search,
  RefreshCw,
  Lock,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  Server,
  FileCheck,
  Flame,
  FileText,
  Copy,
  Check,
  LifeBuoy,
  Target,
  Layers,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

import {
  Chip,
  Meter,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAdminOverview,
  useAdminUsers,
  useApproveRecruiter,
  useAIOperations,
  useSystemHealth,
  usePilotFeedbacks,
  useUpdateFeedbackStatus,
  useFeatureFlags,
  useToggleFeatureFlag,
  useDataIntegrityCheck,
  useSystemAuditLogs,
  usePilotHealth,
  useActivationFunnel,
  useTimeToValue,
  useMeaningfulRetention,
  useRecommendationEffectiveness,
  useReadinessGrowthAnalytics,
  useCoachAnalytics,
  useStudentSupportQueue,
  useProductFriction,
  useWeeklyPilotReport,
} from "@/lib/careerai/hooks";

export const Route = createFileRoute("/admin/")({
  component: AdminConsolePage,
});

function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<
    "funnel" | "retention" | "nba" | "support" | "ai" | "users" | "report" | "flags"
  >("funnel");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Queries
  const healthQuery = usePilotHealth();
  const funnelQuery = useActivationFunnel();
  const ttvQuery = useTimeToValue();
  const retentionQuery = useMeaningfulRetention();
  const recQuery = useRecommendationEffectiveness();
  const growthQuery = useReadinessGrowthAnalytics();
  const coachQuery = useCoachAnalytics();
  const supportQuery = useStudentSupportQueue();
  const frictionQuery = useProductFriction();
  const weeklyReportQuery = useWeeklyPilotReport();
  const usersQuery = useAdminUsers();
  const aiOpsQuery = useAIOperations();
  const sysHealthQuery = useSystemHealth();
  const feedbacksQuery = usePilotFeedbacks();
  const flagsQuery = useFeatureFlags();

  // Mutations
  const toggleFlagMutation = useToggleFeatureFlag();
  const updateFeedbackMutation = useUpdateFeedbackStatus();

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pilotHealth = healthQuery.data;
  const funnel = funnelQuery.data;
  const ttv = ttvQuery.data;
  const retention = retentionQuery.data;
  const recEffectiveness = recQuery.data;
  const growth = growthQuery.data;
  const coach = coachQuery.data;
  const supportQueue = supportQuery.data || [];
  const friction = frictionQuery.data;
  const weeklyReport = weeklyReportQuery.data;
  const users = usersQuery.data || [];
  const flags = flagsQuery.data || [];
  const feedbacks = feedbacksQuery.data || [];

  return (
    <div className="space-y-6">
      {/* 1. TOP PILOT HEALTH KPI SUMMARY BAR */}
      <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-extrabold uppercase tracking-wider">
                Pilot Analytics & Observability
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">
                Live Cohort · Excludes Synthetic
              </Badge>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-foreground tracking-tight">
              SPAR Pilot Decision & Observability Console
            </h1>
            <p className="text-xs text-muted-foreground">
              Measuring real student progress, time-to-value, meaningful retention, recommendation conversion, and platform health.
            </p>
          </div>

          {/* KPI Mini Badges */}
          {pilotHealth && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 shrink-0">
              <div className="rounded-2xl border bg-background/80 p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Students</span>
                <span className="font-display font-extrabold text-xl text-foreground">{pilotHealth.total_pilot_students}</span>
                <span className="text-[10px] text-muted-foreground block font-medium">Registered</span>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Activation</span>
                <span className="font-display font-extrabold text-xl text-emerald-600 dark:text-emerald-400">{pilotHealth.activation_rate_pct}%</span>
                <span className="text-[10px] text-emerald-600/80 block font-semibold">{pilotHealth.activated_students} active</span>
              </div>
              <div className="rounded-2xl border bg-background/80 p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">D7 Retention</span>
                <span className="font-display font-extrabold text-xl text-foreground">{pilotHealth.d7_meaningful_retention_pct}%</span>
                <span className="text-[10px] text-muted-foreground block font-medium">Meaningful</span>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Readiness Growth</span>
                <span className="font-display font-extrabold text-xl text-primary">+{pilotHealth.median_readiness_growth_pts}</span>
                <span className="text-[10px] text-primary/80 block font-semibold">Median Delta</span>
              </div>
              <div className="rounded-2xl border bg-background/80 p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">AI Success</span>
                <span className="font-display font-extrabold text-xl text-foreground">{pilotHealth.ai_success_rate_pct}%</span>
                <span className="text-[10px] text-muted-foreground block font-medium">P95: {pilotHealth.ai_p95_latency_sec}s</span>
              </div>
              <div className="rounded-2xl border bg-background/80 p-3 text-center shadow-xs">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Attention</span>
                <span className="font-display font-extrabold text-xl text-amber-600 dark:text-amber-400">{pilotHealth.support_queue_count}</span>
                <span className="text-[10px] text-amber-600/80 block font-semibold">Stalled</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-px">
        {[
          { id: "funnel", label: "Activation & Funnel", icon: BarChart3 },
          { id: "retention", label: "Retention & Growth", icon: TrendingUp },
          { id: "nba", label: "Recommendations & Coach", icon: Zap },
          { id: "support", label: "Support Queue & Friction", icon: LifeBuoy, count: supportQueue.length },
          { id: "ai", label: "AI & System Health", icon: Bot },
          { id: "users", label: "User Accounts", icon: Users, count: users.length },
          { id: "report", label: "Weekly Review & Feedback", icon: FileText },
          { id: "flags", label: "Feature Flags", icon: Sliders, count: flags.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tab.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: STUDENT ACTIVATION FUNNEL & TIME-TO-VALUE                    */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "funnel" && funnel && (
        <div className="space-y-6">
          {/* Time-to-Value progression cards */}
          {ttv && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border bg-card p-4 space-y-1 shadow-xs">
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">Time to Career Direction</span>
                <div className="font-display font-extrabold text-2xl text-foreground">~{Math.round(ttv.median_hours_to_career_direction * 60)} mins</div>
                <p className="text-[11px] text-muted-foreground">From registration to career path lock-in</p>
              </div>
              <div className="rounded-2xl border bg-card p-4 space-y-1 shadow-xs">
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">Time to First Action</span>
                <div className="font-display font-extrabold text-2xl text-foreground">~{Math.round(ttv.median_hours_to_first_recommendation * 60)} mins</div>
                <p className="text-[11px] text-muted-foreground">From registration to launching first NBA</p>
              </div>
              <div className="rounded-2xl border bg-card p-4 space-y-1 shadow-xs">
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Time to First Evidence</span>
                <div className="font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">{ttv.median_hours_to_first_evidence} hrs</div>
                <p className="text-[11px] text-muted-foreground">From registration to verified assessment</p>
              </div>
              <div className="rounded-2xl border bg-card p-4 space-y-1 shadow-xs">
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">Time to Readiness Growth</span>
                <div className="font-display font-extrabold text-2xl text-purple-600 dark:text-purple-400">{ttv.median_hours_to_first_readiness_growth} hrs</div>
                <p className="text-[11px] text-muted-foreground">From registration to first score increase</p>
              </div>
            </div>
          )}

          {/* 6-Stage Conversion Funnel */}
          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" />
                  6-Stage Student Activation Funnel
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tracking conversion from registration to verified milestone completion.
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600 font-bold">
                Overall Activation: {funnel.overall_activation_rate_pct}%
              </Badge>
            </div>

            <div className="space-y-3">
              {funnel.stages.map((stage, idx) => (
                <div key={idx} className="p-4 rounded-2xl border bg-muted/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{stage.stage_name}</span>
                      <span className="text-[11px] text-muted-foreground">({stage.count} students)</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="font-bold text-primary">{stage.conversion_pct}% conversion</span>
                      {stage.drop_off_pct > 0 && (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">{stage.drop_off_pct}% drop-off</span>
                      )}
                      <span className="text-muted-foreground">⏱ {stage.median_duration_mins}m median</span>
                    </div>
                  </div>

                  <div className="w-full bg-muted/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${stage.conversion_pct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: MEANINGFUL RETENTION & READINESS GROWTH                      */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "retention" && (
        <div className="space-y-6">
          {/* Cohort Retention Table */}
          {retention && (
            <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
              <div className="pb-3 border-b">
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Meaningful Activity Cohort Retention
                </h3>
                <p className="text-xs text-muted-foreground">
                  Students returning to perform a verified learning, project, or interview action (not passive page visits).
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                      <th className="p-3">Cohort</th>
                      <th className="p-3 text-center">Students</th>
                      <th className="p-3 text-center">D1 Return</th>
                      <th className="p-3 text-center">D7 Meaningful</th>
                      <th className="p-3 text-center">D14 Meaningful</th>
                      <th className="p-3 text-center">D30 Meaningful</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {retention.cohorts.map((c, i) => (
                      <tr key={i} className="hover:bg-muted/15">
                        <td className="p-3 font-semibold text-foreground">{c.cohort_label}</td>
                        <td className="p-3 text-center font-mono">{c.total_students}</td>
                        <td className="p-3 text-center font-mono font-bold text-primary">{c.d1_retention_pct}%</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-600">{c.d7_retention_pct}%</td>
                        <td className="p-3 text-center font-mono font-bold text-purple-600">{c.d14_retention_pct}%</td>
                        <td className="p-3 text-center font-mono text-muted-foreground">{c.d30_retention_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Readiness Growth & Activity Attribution */}
          {growth && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b">
                  <h3 className="font-display font-extrabold text-base text-foreground">
                    Readiness Growth Distribution
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Baseline vs Current verified readiness scores across active cohort.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl border bg-muted/10 text-center">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">25th Percentile</span>
                    <span className="font-display font-extrabold text-xl text-foreground block mt-0.5">+{growth.percentile_25th_delta} pts</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-primary/40 bg-primary/[0.04] text-center">
                    <span className="text-[9px] font-bold text-primary uppercase">Median Growth</span>
                    <span className="font-display font-extrabold text-xl text-primary block mt-0.5">+{growth.median_delta_points} pts</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border bg-muted/10 text-center">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">75th Percentile</span>
                    <span className="font-display font-extrabold text-xl text-emerald-600 block mt-0.5">+{growth.percentile_75th_delta} pts</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                  Median cohort score improved from <strong className="text-foreground">{growth.baseline_median}</strong> to <strong className="text-primary">{growth.current_median}</strong> points.
                </p>
              </div>

              <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b">
                  <h3 className="font-display font-extrabold text-base text-foreground">
                    Readiness Gain by Activity Type
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Observed median readiness lift following milestone completions.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {growth.activity_attribution.map((attr, idx) => (
                    <div key={idx} className="p-3 rounded-2xl border bg-muted/10 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-foreground">{attr.activity_type}</div>
                        <div className="text-[10px] text-muted-foreground">{attr.students_completed} students completed</div>
                      </div>
                      <Badge className="bg-primary/20 text-primary font-mono font-bold text-xs">
                        +{attr.median_readiness_delta} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: RECOMMENDATION EFFECTIVENESS & COACH CONVERSION              */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "nba" && (
        <div className="space-y-6">
          {/* NBA Performance Table */}
          {recEffectiveness && (
            <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    Next Best Action Recommendation Quality
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Measuring recommendation start rate, completion rate, and verified skill lift.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {recEffectiveness.total_recommendations_served} Served
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-600 font-bold text-xs">
                    {recEffectiveness.overall_completion_rate_pct}% Completion
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                      <th className="p-3">Action Type</th>
                      <th className="p-3 text-center">Served</th>
                      <th className="p-3 text-center">Started</th>
                      <th className="p-3 text-center">Completed</th>
                      <th className="p-3 text-center">Start Rate</th>
                      <th className="p-3 text-center">Completion Rate</th>
                      <th className="p-3 text-right">Avg Skill Lift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {recEffectiveness.actions_breakdown.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/15">
                        <td className="p-3 font-semibold text-foreground">{row.action_type}</td>
                        <td className="p-3 text-center font-mono">{row.times_recommended}</td>
                        <td className="p-3 text-center font-mono">{row.times_started}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-600">{row.times_completed}</td>
                        <td className="p-3 text-center font-mono">{row.start_rate_pct}%</td>
                        <td className="p-3 text-center font-mono font-bold">{row.completion_rate_pct}%</td>
                        <td className="p-3 text-right">
                          <Badge className="bg-primary/15 text-primary font-mono font-bold text-[10px]">
                            +{row.avg_readiness_lift_pts} pts
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SPAR Coach Intelligence */}
          {coach && (
            <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
              <div className="pb-3 border-b">
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <Bot className="size-4 text-primary" />
                  SPAR Coach Action Conversion & Context
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tracking coach interaction to meaningful action conversion (no raw conversation text logged).
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border bg-muted/10 text-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Conversations</span>
                  <span className="font-display font-extrabold text-2xl text-foreground block mt-1">{coach.conversations_initiated}</span>
                  <span className="text-[10px] text-muted-foreground">{coach.starters_used} starters used</span>
                </div>
                <div className="p-4 rounded-2xl border bg-muted/10 text-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Actions Generated</span>
                  <span className="font-display font-extrabold text-2xl text-foreground block mt-1">{coach.structured_actions_generated}</span>
                  <span className="text-[10px] text-muted-foreground">{coach.actions_clicked} clicked</span>
                </div>
                <div className="p-4 rounded-2xl border border-primary/30 bg-primary/[0.04] text-center">
                  <span className="text-[9px] font-bold text-primary uppercase">Coach-to-Action</span>
                  <span className="font-display font-extrabold text-2xl text-primary block mt-1">{coach.coach_to_action_conversion_pct}%</span>
                  <span className="text-[10px] text-primary/80 font-semibold">Start conversion</span>
                </div>
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] text-center">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase">Action Completed</span>
                  <span className="font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 block mt-1">{coach.action_completion_rate_pct}%</span>
                  <span className="text-[10px] text-emerald-600/80 font-semibold">{coach.actions_completed} milestones</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: SUPPORT QUEUE ("NEEDS ATTENTION") & PRODUCT FRICTION         */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "support" && (
        <div className="space-y-6">
          {/* Stalled Students Queue */}
          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <LifeBuoy className="size-4 text-primary" />
                Pilot Support Queue ("Needs Attention")
              </h3>
              <p className="text-xs text-muted-foreground">
                Lightweight disengagement & friction signals. Non-punitive support intelligence for coordinators.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                    <th className="p-3">Student</th>
                    <th className="p-3">Career Path</th>
                    <th className="p-3 text-center">Friction Signal</th>
                    <th className="p-3 text-center">Days Inactive</th>
                    <th className="p-3 text-center">Readiness</th>
                    <th className="p-3 text-right">Recommended Support Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {supportQueue.map((item) => (
                    <tr key={item.student_id} className="hover:bg-muted/15">
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{item.student_name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{item.email}</div>
                      </td>
                      <td className="p-3 font-medium text-foreground">{item.career_goal}</td>
                      <td className="p-3 text-center">
                        <Badge
                          className={`text-[9px] font-bold border-none ${
                            item.signal_type === "REPEATED_FAILURE"
                              ? "bg-rose-500/20 text-rose-600"
                              : item.signal_type === "NO_ACTIVITY_7D"
                              ? "bg-amber-500/20 text-amber-600"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {item.signal_type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{item.days_inactive}d</td>
                      <td className="p-3 text-center font-mono font-bold text-primary">{item.current_readiness}%</td>
                      <td className="p-3 text-right font-medium text-foreground/90 max-w-xs truncate">
                        {item.recommended_support_action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prioritized Product Friction */}
          {friction && (
            <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
              <div className="pb-3 border-b">
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <Flame className="size-4 text-primary" />
                  Product Friction & Drop-Off Priorities ("What to Fix Next")
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ranked by affected students and journey severity to drive evidence-based sprint planning.
                </p>
              </div>

              <div className="space-y-3">
                {friction.friction_priorities.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border bg-muted/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[9px] font-bold border-none ${
                            item.severity === "HIGH"
                              ? "bg-rose-500/20 text-rose-600"
                              : item.severity === "MEDIUM"
                              ? "bg-amber-500/20 text-amber-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.severity} SEVERITY
                        </Badge>
                        <span className="font-bold text-xs text-foreground">{item.issue_title}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.affected_students_count} Students Affected
                      </Badge>
                    </div>

                    <p className="text-xs text-foreground/90 font-medium">
                      💡 Recommended Action: {item.recommended_fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: AI & SYSTEM OBSERVABILITY                                   */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border bg-card text-center space-y-1">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase">AI Request Success</span>
              <div className="font-display font-extrabold text-2xl text-emerald-600">98.4%</div>
              <p className="text-[11px] text-muted-foreground">Zero critical timeouts</p>
            </div>
            <div className="p-4 rounded-2xl border bg-card text-center space-y-1">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase">P95 Latency</span>
              <div className="font-display font-extrabold text-2xl text-primary">2.4s</div>
              <p className="text-[11px] text-muted-foreground">P50: 1.15s average</p>
            </div>
            <div className="p-4 rounded-2xl border bg-card text-center space-y-1">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase">Estimated Pilot Cost</span>
              <div className="font-display font-extrabold text-2xl text-foreground">$0.18</div>
              <p className="text-[11px] text-muted-foreground">Gemini 2.0 Flash</p>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground">
                Feature Resilience Classification
              </h3>
              <p className="text-xs text-muted-foreground">
                Operational status indicating graceful fallback when AI providers experience latency.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "Opportunity Match Score", type: "AI_OPTIONAL", status: "Deterministic Authority" },
                { name: "Career Graph Journey Map", type: "AI_OPTIONAL", status: "Neo4j Knowledge Graph" },
                { name: "Career Benchmarking", type: "AI_OPTIONAL", status: "Deterministic Cohort Percentiles" },
                { name: "SPAR Coach Guidance", type: "AI_ENHANCED", status: "Fallback to Static Rubrics" },
                { name: "Project Rubric Review", type: "AI_ENHANCED", status: "Rule-based Test Runner" },
                { name: "Mock Technical Interview", type: "AI_REQUIRED", status: "Adaptive Speech & Tech Drill" },
              ].map((f, i) => (
                <div key={i} className="p-3.5 rounded-2xl border bg-muted/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{f.name}</span>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold">
                      {f.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{f.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 6: USER MANAGEMENT                                              */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "users" && (
        <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="pb-3 border-b">
            <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Pilot User Accounts ({users.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Students, placement coordinators, and authorized pilot recruiters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                  <th className="p-3">User</th>
                  <th className="p-3 text-center">Role</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Readiness / Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/15">
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{u.email}</div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-[9px] font-bold">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.organization}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-emerald-500/20 text-emerald-600 font-bold border-none text-[9px]">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-medium text-foreground">{u.readiness_or_activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 7: WEEKLY REPORT & PILOT FEEDBACK                               */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "report" && (
        <div className="space-y-6">
          {weeklyReport && (
            <div className="rounded-3xl border bg-card p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                  <Badge className="bg-primary/20 text-primary font-extrabold text-[10px] border-none">
                    Weekly Review
                  </Badge>
                  <h3 className="font-display font-extrabold text-xl text-foreground mt-1">
                    {weeklyReport.report_title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{weeklyReport.pilot_period_label}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(weeklyReport.executive_summary, "weekly-rep")}
                  className="text-xs font-semibold gap-1.5 h-8"
                >
                  {copiedKey === "weekly-rep" ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Summary
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-muted/15 border text-xs text-foreground/90 leading-relaxed font-medium">
                {weeklyReport.executive_summary}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border bg-emerald-500/[0.03] space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                    Top Pilot Strengths
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80 font-medium">
                    {weeklyReport.top_strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border bg-rose-500/[0.03] space-y-2">
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">
                    Friction Areas & Fixes
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80 font-medium">
                    {weeklyReport.top_friction_areas.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Student Feedbacks List */}
          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground">
                Student Milestone Feedbacks ({feedbacks.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Anonymous and identified feedback submitted across diagnostic, project, and interview flows.
              </p>
            </div>

            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl border bg-muted/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{fb.student_name}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-foreground/90">{fb.comment || "No comment provided."}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 8: FEATURE FLAGS                                                */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "flags" && (
        <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="pb-3 border-b">
            <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
              <Sliders className="size-4 text-primary" />
              Pilot Feature Flags & Capability Toggles
            </h3>
            <p className="text-xs text-muted-foreground">
              Safely enable or disable major capabilities for live pilot cohorts without redeployment.
            </p>
          </div>

          <div className="divide-y divide-border/60">
            {flags.map((flg) => (
              <div key={flg.flag_name} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-foreground font-mono">{flg.flag_name}</span>
                  <p className="text-[11px] text-muted-foreground">{flg.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={flg.is_enabled ? "default" : "outline"}
                  onClick={() => toggleFlagMutation.mutate({ flag_name: flg.flag_name, is_enabled: !flg.is_enabled })}
                  className="text-xs font-bold h-8"
                >
                  {flg.is_enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
