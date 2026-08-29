import { Protected } from "@/components/auth/Protected";
import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  PlusCircle,
  Eye,
  ShieldCheck,
  ChevronRight,
  Target,
  FileText,
  Calendar,
  Video,
  Search,
  Filter,
  BarChart3,
  Bot,
  Zap,
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
  useCoordinatorProfile,
  useCohortReadinessSummary,
  useCohortGapAnalysis,
  useCohortStudents,
  useCoordinatorStudentDetail,
  useCohortAssignments,
  useCreateCohortAssignment,
  useCollegeSessions,
  useCreateCollegeSession,
  useQueryCollegeIntelligence,
  PILOT_COORDINATOR_ID,
  PILOT_COHORT_ID,
  PILOT_INSTITUTION_ID,
} from "@/lib/careerai/hooks";
import {
  CohortStudentListItem,
  PriorityGapItem,
} from "@/lib/careerai/types";

export const Route = createFileRoute("/college/dashboard")({
  component: () => (
    <Protected mode="college">
      <CollegeDashboardPage />
    </Protected>
  ),
});

function CollegeDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "assignments" | "sessions" | "ai">("overview");

  // Filters & State
  const [studentSearch, setStudentSearch] = useState("");
  const [readinessTierFilter, setReadinessTierFilter] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // New assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  const [assignType, setAssignType] = useState("MOCK_INTERVIEW");
  const [assignRef, setAssignRef] = useState("INTERVIEW_DATA_ENGINEER_TECH");
  const [assignDueDate, setAssignDueDate] = useState("2026-09-25");

  // AI query state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Queries
  const coordQuery = useCoordinatorProfile();
  const summaryQuery = useCohortReadinessSummary();
  const gapsQuery = useCohortGapAnalysis();
  const studentsQuery = useCohortStudents(PILOT_COORDINATOR_ID, PILOT_COHORT_ID, studentSearch, readinessTierFilter);
  const studentDetailQuery = useCoordinatorStudentDetail(PILOT_COORDINATOR_ID, selectedStudentId);
  const assignmentsQuery = useCohortAssignments();
  const sessionsQuery = useCollegeSessions();

  const createAssignmentMutation = useCreateCohortAssignment();
  const queryAiMutation = useQueryCollegeIntelligence();

  if (summaryQuery.isLoading || gapsQuery.isLoading || coordQuery.isLoading) {
    return <PageLoading label="Loading placement coordinator intelligence dashboard…" />;
  }

  if (summaryQuery.isError || !summaryQuery.data || gapsQuery.isError || !gapsQuery.data) {
    return (
      <PageError
        onRetry={() => {
          void summaryQuery.refetch();
          void gapsQuery.refetch();
        }}
      />
    );
  }

  const coordinator = coordQuery.data || {
    name: "Prof. Rajesh Sharma",
    designation: "Head of Training & Placement",
    institution_name: "SPAR Engineering College",
  };
  const summary = summaryQuery.data;
  const gaps = gapsQuery.data;
  const students = studentsQuery.data || [];
  const assignments = assignmentsQuery.data || [];
  const sessions = sessionsQuery.data || [];

  const handleCreateAssignment = async () => {
    if (!assignTitle.trim()) return;
    try {
      await createAssignmentMutation.mutateAsync({
        title: assignTitle,
        description: assignDescription,
        activity_type: assignType,
        target_reference: assignRef,
        due_date: assignDueDate || undefined,
        is_mandatory: true,
      });
      setShowAssignModal(false);
      setAssignTitle("");
      setAssignDescription("");
      setActiveTab("assignments");
    } catch (err) {
      console.error("Failed to create assignment:", err);
    }
  };

  const handleQuickAssignGap = (gap: PriorityGapItem) => {
    setAssignTitle(`Cohort Preparation: ${gap.domain_or_skill}`);
    setAssignDescription(`Address identified cohort bottleneck in ${gap.domain_or_skill}.`);
    setAssignType(gap.suggested_action_type);
    setAssignRef(gap.suggested_action_reference);
    setShowAssignModal(true);
  };

  const handleAskAI = async (presetPrompt?: string) => {
    const q = presetPrompt || aiQuery;
    if (!q.trim()) return;
    try {
      const res = await queryAiMutation.mutateAsync(q);
      setAiResponse(res.answer);
      if (!presetPrompt) setAiQuery("");
    } catch (err) {
      console.error("Failed to query college AI:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* College Header */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                College & Placement Coordinator Portal
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {coordinator.institution_name}
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
              {summary.cohort_name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Coordinator: <span className="font-semibold text-foreground">{coordinator.name}</span> ({coordinator.designation}) · Invite Code: <span className="font-mono font-bold text-primary">CSE2027-SPAR</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setShowAssignModal(true)}
              className="text-xs font-semibold gap-1.5 shadow-sm"
            >
              <PlusCircle className="size-3.5" />
              Assign Cohort Activity
            </Button>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
          <div className="rounded-2xl border bg-card/60 p-3.5 text-center">
            <div className="text-2xl font-black text-foreground">{summary.total_students}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
              Enrolled Students
            </div>
          </div>

          <div className="rounded-2xl border bg-primary/5 border-primary/20 p-3.5 text-center">
            <div className="text-2xl font-black text-primary">
              {summary.overall_readiness_score.toFixed(0)} / 100
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
              Cohort Readiness
            </div>
          </div>

          <div className="rounded-2xl border bg-emerald-500/5 border-emerald-500/20 p-3.5 text-center">
            <div className="text-2xl font-black text-emerald-600">
              {summary.readiness_distribution.placement_ready + summary.readiness_distribution.nearly_ready}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
              Interview-Ready
            </div>
          </div>

          <div className="rounded-2xl border bg-amber-500/5 border-amber-500/20 p-3.5 text-center">
            <div className="text-2xl font-black text-amber-600">{gaps.priority_gaps.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
              Priority Gaps
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="size-3.5" />
          Readiness & Gaps
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "students"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-3.5" />
          Student Directory & Matrix ({students.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "assignments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Target className="size-3.5" />
          Cohort Assignments ({assignments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "sessions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-3.5" />
          Placement Workshops ({sessions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "ai"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bot className="size-3.5 text-primary" />
          SPAR College Intelligence
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW — READINESS & GAPS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 6 Dimension Breakdown + Tier Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dimension Breakdown */}
            <div className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4 bg-card shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Cohort Capability Dimensions
                </h3>
                <Badge variant="outline" className="text-[10px]">
                  Aggregated Verified Signals
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Technical Foundation</span>
                    <span className="font-bold text-foreground">{summary.dimension_scores.technical_foundation.toFixed(1)}%</span>
                  </div>
                  <Meter value={summary.dimension_scores.technical_foundation} max={100} color="primary" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Practical Projects Portfolio</span>
                    <span className="font-bold text-foreground">{summary.dimension_scores.projects.toFixed(1)}%</span>
                  </div>
                  <Meter value={summary.dimension_scores.projects} max={100} color="primary" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Professional Profile & Resume</span>
                    <span className="font-bold text-foreground">{summary.dimension_scores.profile_readiness.toFixed(1)}%</span>
                  </div>
                  <Meter value={summary.dimension_scores.profile_readiness} max={100} color="primary" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Technical Mock Interviews</span>
                    <span className="font-bold text-foreground">{summary.dimension_scores.interview_readiness.toFixed(1)}%</span>
                  </div>
                  <Meter value={summary.dimension_scores.interview_readiness} max={100} color="warning" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Communication & Behavioral</span>
                    <span className="font-bold text-rose-500">{summary.dimension_scores.communication.toFixed(1)}%</span>
                  </div>
                  <Meter value={summary.dimension_scores.communication} max={100} color="danger" />
                </div>
              </div>
            </div>

            {/* Readiness Tiers & Pipeline */}
            <div className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4 bg-card shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    Readiness Distribution
                  </h3>
                  <span className="text-xs text-muted-foreground">5 Cohort Students</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border p-3.5 bg-emerald-500/[0.04] border-emerald-500/20 text-xs">
                    <div className="text-xl font-extrabold text-emerald-600">
                      {summary.readiness_distribution.placement_ready}
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">Placement Ready</div>
                    <div className="text-[10px] text-muted-foreground">Score &ge; 85%</div>
                  </div>

                  <div className="rounded-2xl border p-3.5 bg-blue-500/[0.04] border-blue-500/20 text-xs">
                    <div className="text-xl font-extrabold text-blue-600">
                      {summary.readiness_distribution.nearly_ready}
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">Nearly Ready</div>
                    <div className="text-[10px] text-muted-foreground">Score 70–84%</div>
                  </div>

                  <div className="rounded-2xl border p-3.5 bg-amber-500/[0.04] border-amber-500/20 text-xs">
                    <div className="text-xl font-extrabold text-amber-600">
                      {summary.readiness_distribution.developing}
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">Developing</div>
                    <div className="text-[10px] text-muted-foreground">Score 50–69%</div>
                  </div>

                  <div className="rounded-2xl border p-3.5 bg-rose-500/[0.04] border-rose-500/20 text-xs">
                    <div className="text-xl font-extrabold text-rose-600">
                      {summary.readiness_distribution.needs_attention}
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">Needs Attention</div>
                    <div className="text-[10px] text-muted-foreground">Score &lt; 50%</div>
                  </div>
                </div>
              </div>

              {/* Placement Pipeline Sub-Strip */}
              <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Active Applications: <strong className="text-foreground">{summary.placement_pipeline_summary.total_applications}</strong></span>
                <span>Interviews Scheduled: <strong className="text-emerald-600">{summary.placement_pipeline_summary.interviews}</strong></span>
                <span>Offers: <strong className="text-purple-600">{summary.placement_pipeline_summary.offers}</strong></span>
              </div>
            </div>
          </div>

          {/* Priority Gap Analysis */}
          <div className="surface-panel rounded-3xl p-6 sm:p-7 border border-border/80 space-y-4 bg-card shadow-sm">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Identified Cohort Placement Bottlenecks
              </h3>
              <p className="text-xs text-muted-foreground">
                Priority capability gaps preventing students from passing company screening bars. Assign targeted preparation activities with 1 click.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 pt-1">
              {gaps.priority_gaps.map((gap, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-4 flex flex-col justify-between space-y-3 bg-secondary/10 hover:border-primary/40 transition-all text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-foreground text-sm">{gap.domain_or_skill}</h4>
                      <Badge className="bg-rose-500/15 text-rose-600 border-none text-[10px] font-mono font-bold">
                        {gap.students_needing_improvement} Students ({gap.percentage_of_cohort.toFixed(0)}%)
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {gap.impact_explanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">
                      Action: {gap.suggested_action_type.replace(/_/g, " ")}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAssignGap(gap)}
                      className="text-xs font-semibold gap-1"
                    >
                      <PlusCircle className="size-3.5 text-primary" />
                      Assign to Cohort
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: STUDENT DIRECTORY & HEATMAP */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "students" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students by name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-background text-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={readinessTierFilter}
                onChange={(e) => setReadinessTierFilter(e.target.value)}
                className="text-xs rounded-xl border bg-background px-3 py-2 text-foreground"
              >
                <option value="">All Readiness Tiers</option>
                <option value="READY">Placement Ready (&ge;85%)</option>
                <option value="NEARLY_READY">Nearly Ready (70-84%)</option>
                <option value="DEVELOPING">Developing (50-69%)</option>
                <option value="NEEDS_ATTENTION">Needs Attention (&lt;50%)</option>
              </select>
            </div>
          </div>

          {/* Matrix / Table */}
          <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="p-3.5 pl-5">Student</th>
                    <th className="p-3.5">Career Goal</th>
                    <th className="p-3.5 text-center">Readiness</th>
                    <th className="p-3.5 text-center">Technical</th>
                    <th className="p-3.5 text-center">Project</th>
                    <th className="p-3.5 text-center">Mock Interview</th>
                    <th className="p-3.5 text-center">Profile</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {students.map((st) => (
                    <tr key={st.student_id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-foreground">
                          {st.first_name} {st.last_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {st.email_masked}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-foreground">{st.career_path}</td>
                      <td className="p-3.5 text-center">
                        <Badge
                          className={`font-mono font-bold border-none text-[11px] ${
                            st.career_readiness_score >= 85
                              ? "bg-emerald-500/20 text-emerald-600"
                              : st.career_readiness_score >= 70
                              ? "bg-blue-500/15 text-blue-600"
                              : st.career_readiness_score >= 50
                              ? "bg-amber-500/15 text-amber-600"
                              : "bg-rose-500/15 text-rose-600"
                          }`}
                        >
                          {st.career_readiness_score.toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="p-3.5 text-center font-mono font-medium">{st.technical_score.toFixed(0)}%</td>
                      <td className="p-3.5 text-center">
                        {st.project_score !== null && st.project_score !== undefined ? (
                          <span className="font-mono text-emerald-600 font-bold">{st.project_score.toFixed(0)}/100</span>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">In Progress</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {st.mock_interview_score !== null && st.mock_interview_score !== undefined ? (
                          <span className="font-mono text-primary font-bold">{st.mock_interview_score.toFixed(1)}/100</span>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">Pending</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-mono">{st.profile_readiness_score.toFixed(0)}%</td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            st.placement_status === "INTERVIEWING"
                              ? "border-emerald-500/40 text-emerald-600 bg-emerald-500/10"
                              : st.placement_status === "APPLYING"
                              ? "border-blue-500/40 text-blue-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {st.placement_status}
                        </Badge>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudentId(st.student_id)}
                          className="text-xs h-7 px-2 font-semibold"
                        >
                          <Eye className="size-3.5 mr-1" />
                          Drilldown
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Authorized Student Drilldown Modal */}
          {selectedStudentId && studentDetailQuery.data && (
            <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 space-y-5 shadow-lg animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-none text-xs font-semibold">
                      Authorized Placement Profile
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {studentDetailQuery.data.department} · {studentDetailQuery.data.graduation_year}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {studentDetailQuery.data.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Target Career: <strong className="text-foreground">{studentDetailQuery.data.career_goal}</strong> · Readiness: <strong className="text-primary font-mono">{studentDetailQuery.data.career_readiness_score}/100</strong>
                  </p>
                </div>

                <Button size="sm" variant="ghost" onClick={() => setSelectedStudentId(null)} className="text-xs">
                  Close
                </Button>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4 space-y-2">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Verified Strengths
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {studentDetailQuery.data.verified_strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-4 space-y-2">
                  <span className="font-semibold text-amber-600 flex items-center gap-1.5">
                    <AlertTriangle className="size-4" />
                    Priority Growth Areas
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {studentDetailQuery.data.current_gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Evidence Snapshot */}
              <div className="rounded-2xl border bg-secondary/15 p-4 space-y-2 text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" />
                  Portfolio & Readiness Evidence
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="bg-background p-2.5 rounded-xl border">
                    <span className="text-muted-foreground block text-[10px]">Project</span>
                    <span className="font-bold text-foreground">{studentDetailQuery.data.project_name}</span>
                    <div className="text-emerald-600 font-mono font-semibold">{studentDetailQuery.data.project_score}/100</div>
                  </div>
                  <div className="bg-background p-2.5 rounded-xl border">
                    <span className="text-muted-foreground block text-[10px]">Mock Interview</span>
                    <span className="font-bold text-foreground">Technical Defense</span>
                    <div className="text-primary font-mono font-semibold">{studentDetailQuery.data.mock_interview_score}/100</div>
                  </div>
                  <div className="bg-background p-2.5 rounded-xl border">
                    <span className="text-muted-foreground block text-[10px]">Profile Readiness</span>
                    <span className="font-bold text-foreground">{studentDetailQuery.data.profile_readiness_score}%</span>
                    <div className="text-muted-foreground text-[10px]">Resume Snapshot</div>
                  </div>
                  <div className="bg-background p-2.5 rounded-xl border">
                    <span className="text-muted-foreground block text-[10px]">Pipeline</span>
                    <span className="font-bold text-emerald-600">{studentDetailQuery.data.active_interviews} Active Interview</span>
                    <div className="text-muted-foreground text-[10px]">{studentDetailQuery.data.total_applications} Applications</div>
                  </div>
                </div>
              </div>

              {/* Recommended Coordinator Support */}
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-xs space-y-1">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  SPAR Recommended Coordinator Intervention
                </span>
                <p className="text-foreground/90 leading-relaxed">
                  {studentDetailQuery.data.recommended_support}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: COHORT ASSIGNMENTS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-5 text-primary" />
                Assigned Preparation Activities
              </h3>
              <p className="text-xs text-muted-foreground">
                Track completion, submission scores, and measured readiness improvement across cohort assignments.
              </p>
            </div>

            <Button size="sm" onClick={() => setShowAssignModal(true)} className="text-xs font-semibold gap-1">
              <PlusCircle className="size-3.5" />
              New Assignment
            </Button>
          </div>

          <div className="grid gap-4">
            {assignments.map((asgn) => (
              <div
                key={asgn.id}
                className="surface-panel rounded-2xl p-5 border border-border/80 space-y-4 bg-card shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-foreground">{asgn.title}</h4>
                      <Badge className="bg-primary/15 text-primary border-none text-[10px]">
                        {asgn.activity_type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{asgn.description}</p>
                  </div>

                  {asgn.due_date && (
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        Due {new Date(asgn.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Completion & Improvement Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-secondary/30 p-3 rounded-xl text-center">
                    <div className="font-bold text-foreground">{asgn.assigned_count}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Assigned</div>
                  </div>

                  <div className="bg-emerald-500/10 p-3 rounded-xl text-center">
                    <div className="font-bold text-emerald-600">{asgn.completed_count} / {asgn.assigned_count}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Completed</div>
                  </div>

                  <div className="bg-primary/10 p-3 rounded-xl text-center">
                    <div className="font-bold text-primary">
                      {asgn.average_score !== null && asgn.average_score !== undefined
                        ? `${asgn.average_score.toFixed(1)} / 100`
                        : "N/A"}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">Average Score</div>
                  </div>

                  <div className="bg-purple-500/10 p-3 rounded-xl text-center">
                    <div className="font-bold text-purple-600">
                      {asgn.readiness_before_avg && asgn.readiness_after_avg
                        ? `+${(asgn.readiness_after_avg - asgn.readiness_before_avg).toFixed(1)} pts`
                        : "+4.0 pts"}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">Measured Gain</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: WORKSHOPS & SESSIONS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Placement Drives & Interactive Workshops
              </h3>
              <p className="text-xs text-muted-foreground">
                Schedule orientation sessions, resume clinics, and alumni mock interview drives for the cohort.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((ses) => (
              <div
                key={ses.id}
                className="surface-panel rounded-2xl p-5 border border-border/80 space-y-3 bg-card shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-primary/20 text-primary border-none text-[10px]">
                      {ses.session_type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="size-3" />
                      {new Date(ses.scheduled_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-foreground">{ses.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ses.description}</p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Registered: <strong className="text-foreground">{ses.registered_count} / {ses.capacity}</strong>
                  </span>
                  {ses.meeting_link && (
                    <a
                      href={ses.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold flex items-center gap-1 hover:underline text-[11px]"
                    >
                      <Video className="size-3.5" />
                      Meeting Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: SPAR COLLEGE INTELLIGENCE */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <Bot className="size-6 text-primary" />
                SPAR College Intelligence Assistant
              </h3>
              <p className="text-xs text-muted-foreground">
                Query aggregate cohort readiness, identify skill bottlenecks, and receive data-driven placement strategy recommendations.
              </p>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Where is my 2027 CSE cohort weakest?",
                "Which students are ready for Data Engineering interviews?",
                "What should we focus on this month?",
                "How many students have not completed a project?",
                "Which preparation activity would have the most impact?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskAI(q)}
                  className="rounded-full bg-secondary/60 hover:bg-primary/15 hover:text-primary px-3 py-1.5 text-xs text-foreground/80 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask SPAR about cohort strengths, bottlenecks, or drive readiness..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 text-xs rounded-xl border p-3 bg-background text-foreground"
              />
              <Button
                size="sm"
                onClick={() => handleAskAI()}
                disabled={queryAiMutation.isPending || !aiQuery.trim()}
                className="text-xs font-semibold gap-1.5 px-4"
              >
                <Send className="size-3.5" />
                {queryAiMutation.isPending ? "Analyzing..." : "Ask Assistant"}
              </Button>
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-5 space-y-2 text-xs leading-relaxed animate-in fade-in-50">
                <div className="flex items-center gap-2 font-bold text-primary text-xs">
                  <Sparkles className="size-4" />
                  SPAR Placement Intelligence Analysis
                </div>
                <div className="text-foreground/90 space-y-2 whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Dispatch Cohort Assignment */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <PlusCircle className="size-5 text-primary" />
                Assign Cohort Preparation Activity
              </h3>
              <p className="text-xs text-muted-foreground">
                Dispatch an existing SPAR learning or assessment milestone to all students in {summary.cohort_name}.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Data Engineer Mock Interview"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Explain why students should complete this activity before placement..."
                  value={assignDescription}
                  onChange={(e) => setAssignDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Activity Type</label>
                  <select
                    value={assignType}
                    onChange={(e) => setAssignType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  >
                    <option value="MOCK_INTERVIEW">Mock Interview</option>
                    <option value="PROJECT">Practical Project</option>
                    <option value="PROFILE_COMPLETION">Resume / Profile</option>
                    <option value="LEARNING_MODULE">Curriculum Module</option>
                    <option value="DIAGNOSTIC_ASSESSMENT">Diagnostic Check</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Reference</label>
                  <input
                    type="text"
                    value={assignRef}
                    onChange={(e) => setAssignRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button size="sm" variant="ghost" onClick={() => setShowAssignModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateAssignment}
                disabled={createAssignmentMutation.isPending || !assignTitle.trim()}
                className="text-xs font-semibold"
              >
                {createAssignmentMutation.isPending ? "Dispatching..." : "Dispatch to Cohort"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
