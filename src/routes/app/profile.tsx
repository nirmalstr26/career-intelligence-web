import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LinkedInIntelligenceV2View } from "@/components/profile/LinkedInIntelligenceV2View";
import {
  LogOut,
  Sparkles,
  FileText,
  Linkedin,
  Github,
  Award,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Clock,
  ShieldCheck,
  Edit3,
  Trash2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Code,
  User,
  GraduationCap,
  Layers,
  Zap,
} from "lucide-react";

import {
  Chip,
  Meter,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
  InlineSpinner,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  useProfile,
  useProfessionalProfile,
  useResolveProfileSuggestion,
  useUpdateLinkedInProfile,
  useRestoreProfileVersion,
  useGenerateProfileSuggestions,
} from "@/lib/careerai/hooks";
import { ResumeSuggestion, ResumeSectionItem } from "@/lib/careerai/types";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const baseProfileQuery = useProfile();
  const proProfileQuery = useProfessionalProfile();
  const resolveSuggestionMutation = useResolveProfileSuggestion();
  const updateLinkedInMutation = useUpdateLinkedInProfile();
  const restoreVersionMutation = useRestoreProfileVersion();
  const generateSuggestionsMutation = useGenerateProfileSuggestions();

  const [activeTab, setActiveTab] = useState<"resume" | "linkedin" | "portfolio" | "readiness" | "academics">("resume");
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingLinkedIn, setEditingLinkedIn] = useState(false);
  const [linkedInHeadline, setLinkedInHeadline] = useState("");
  const [linkedInAbout, setLinkedInAbout] = useState("");

  if ((!baseProfileQuery.data && !baseProfileQuery.isError) || (!proProfileQuery.data && !proProfileQuery.isError)) {
    return <PageLoading label="Loading your profile…" />;
  }

  if (baseProfileQuery.isError || proProfileQuery.isError || !baseProfileQuery.data || !proProfileQuery.data) {
    return (
      <PageError
        onRetry={() => {
          void baseProfileQuery.refetch();
          void proProfileQuery.refetch();
        }}
      />
    );
  }

  const { student, academic_profile, career_preferences, interests, career_context } = baseProfileQuery.data;
  const pro = proProfileQuery.data;
  const fallback = "—";

  const pendingSuggestions = pro?.pending_suggestions || [];
  const readiness = pro?.profile_readiness || {
    overall_score: 0,
    readiness_level: "DEVELOPING",
    dimensions: [],
    missing_items: [],
    next_improvement_steps: [],
  };
  const verifiedSkills = pro?.skills_breakdown?.verified_skills || [];
  const learningSkills = pro?.skills_breakdown?.learning_skills || [];
  const selfDeclaredSkills = pro?.skills_breakdown?.self_declared_skills || [];
  const portfolioItems = pro?.github_portfolio || [];
  const versionHistory = pro?.version_history || [];
  const resumeSections = pro?.sections || [];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResolveSuggestion = async (
    suggestionId: string,
    action: "ACCEPT" | "EDIT" | "REJECT",
    editedContent?: Record<string, any>
  ) => {
    try {
      await resolveSuggestionMutation.mutateAsync({
        suggestionId,
        action,
        edited_content: editedContent,
      });
      setEditingSuggestionId(null);
    } catch (err) {
      console.error("Failed to resolve suggestion:", err);
    }
  };

  const handleSaveLinkedIn = async () => {
    try {
      await updateLinkedInMutation.mutateAsync({
        headline: linkedInHeadline || pro?.linkedin_headline || "",
        about: linkedInAbout || pro?.linkedin_about || "",
      });
      setEditingLinkedIn(false);
    } catch (err) {
      console.error("Failed to update LinkedIn:", err);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await restoreVersionMutation.mutateAsync(versionId);
    } catch (err) {
      console.error("Failed to restore version:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-semibold">
              Professional Assets & Resume
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              Version {pro?.current_version_number ?? 1}.0
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
            {student.first_name} {student.last_name}'s Professional Profile
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Readiness Pill */}
          <div className="flex items-center gap-2 rounded-xl bg-card border px-3 py-1.5 shadow-sm">
            <div className="text-right">
              <div className="text-xs font-bold text-foreground">
                {readiness.overall_score.toFixed(0)}%
              </div>
              <div className="text-[9px] text-muted-foreground uppercase font-medium">
                Profile Readiness
              </div>
            </div>
            <div
              className={`size-2.5 rounded-full ${
                readiness.overall_score >= 85
                  ? "bg-emerald-500"
                  : readiness.overall_score >= 70
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />
          </div>

          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut className="size-4 mr-1.5" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("resume")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "resume"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-3.5" />
          Evidence-Driven Resume
          {pendingSuggestions.length > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
              {pendingSuggestions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("linkedin");
            setLinkedInHeadline(pro?.linkedin_headline || "");
            setLinkedInAbout(pro?.linkedin_about || "");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "linkedin"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Linkedin className="size-3.5" />
          LinkedIn Intelligence
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "portfolio"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Github className="size-3.5" />
          GitHub & Projects ({portfolioItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("readiness")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "readiness"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="size-3.5" />
          Profile Readiness ({readiness.overall_score.toFixed(0)}%)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("academics")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "academics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="size-3.5" />
          Academics & Account
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: EVIDENCE-DRIVEN RESUME */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          {/* Pending Evidence Suggestions Alert Box */}
          {pendingSuggestions.length > 0 && (
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">
                    New AI Resume Suggestions From Verified Evidence ({pendingSuggestions.length})
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Review and accept to incorporate into your resume
                </span>
              </div>

              <div className="grid gap-3">
                {pendingSuggestions.map((sugg) => (
                  <div
                    key={sugg.id}
                    className="rounded-xl border bg-card p-4 space-y-3 shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                          {sugg.section_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {sugg.provenance_label || "Verified Evidence"}
                        </span>
                      </div>
                      {sugg.source_score && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px] font-mono font-bold">
                          Score: {sugg.source_score.toFixed(0)}/100
                        </Badge>
                      )}
                    </div>

                    {/* Suggestion Body */}
                    {editingSuggestionId === sugg.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          rows={4}
                          className="w-full text-xs font-mono rounded-lg border p-2.5 bg-background text-foreground"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingSuggestionId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const content =
                                sugg.section_type === "SUMMARY"
                                  ? { text: editedText }
                                  : sugg.suggested_content;
                              handleResolveSuggestion(sugg.id, "EDIT", content);
                            }}
                          >
                            Save & Accept
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sugg.section_type === "SUMMARY" ? (
                          <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                            {sugg.suggested_content.text}
                          </p>
                        ) : sugg.section_type === "PROJECTS" ? (
                          <div className="space-y-1.5 text-xs text-foreground/90">
                            <div className="font-semibold text-primary">
                              {sugg.suggested_content.title}
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {(sugg.suggested_content.bullet_points || []).map((b: string, i: number) => (
                                <li key={i} className="text-[11px] leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-sans">
                            {JSON.stringify(sugg.suggested_content, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    {editingSuggestionId !== sugg.id && (
                      <div className="flex items-center justify-between pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResolveSuggestion(sugg.id, "REJECT")}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Reject
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSuggestionId(sugg.id);
                              setEditedText(
                                sugg.suggested_content.text ||
                                  JSON.stringify(sugg.suggested_content, null, 2)
                              );
                            }}
                            className="text-xs"
                          >
                            <Edit3 className="size-3 mr-1" />
                            Edit Before Accept
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleResolveSuggestion(sugg.id, "ACCEPT")}
                            className="text-xs font-semibold gap-1"
                          >
                            <Check className="size-3.5" />
                            Accept Into Resume
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Resume Preview Card */}
          <div className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 space-y-6 bg-card shadow-sm">
            {/* Resume Header */}
            <div className="border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {pro?.headline || "Computer Science Student | Aspiring Data Engineer"}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-1.5">
                  <span>{student.email}</span>
                  <span>·</span>
                  <span>{academic_profile?.institution?.name || "University"}</span>
                  <span>·</span>
                  <span>Expected Graduation {academic_profile?.expected_graduation_year || "2026"}</span>
                </div>
              </div>

              <Badge variant="outline" className="text-xs font-mono font-bold bg-secondary/50">
                Resume Version #{pro?.current_version_number ?? 1}
              </Badge>
            </div>

            {/* Section 1: Professional Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                Professional Summary
              </h3>
              {pro?.summary ? (
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-secondary/20 p-3.5 rounded-xl border border-border/50">
                  {pro?.summary}
                </p>
              ) : (
                <div className="p-4 rounded-xl border border-dashed text-xs text-muted-foreground flex items-center justify-between">
                  <span>No summary accepted yet. Check AI recommendations above.</span>
                </div>
              )}
            </div>

            {/* Section 2: Technical Skills (Demonstrated vs Learning) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code className="size-3.5 text-primary" />
                Technical Skills & Verified Proficiencies
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Verified Skills */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      Verified Skills
                    </span>
                    <span className="text-[10px] text-muted-foreground">Demonstrated</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {verifiedSkills.map((sk) => (
                      <Badge
                        key={sk.skill_code}
                        variant="outline"
                        className="text-[11px] bg-background border-emerald-500/40 text-foreground"
                      >
                        {sk.skill_name.split(" ")[0]} ({sk.score.toFixed(0)}%)
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Skills */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.02] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="size-3.5" />
                      In Progress / Learning
                    </span>
                    <span className="text-[10px] text-muted-foreground">Curriculum</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {learningSkills.map((sk) => (
                      <Badge
                        key={sk.skill_code}
                        variant="outline"
                        className="text-[11px] bg-background border-amber-500/40 text-foreground/80"
                      >
                        {sk.skill_name.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Self-Declared */}
                <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <User className="size-3.5" />
                      Self-Declared Tools
                    </span>
                    <span className="text-[10px] text-muted-foreground">Tools</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selfDeclaredSkills.map((sk) => (
                      <Badge key={sk} variant="secondary" className="text-[11px]">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Engineering Projects */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Github className="size-3.5 text-primary" />
                Practical Engineering Projects
              </h3>

              {(() => {
                const projSec = resumeSections.find((s) => s.section_type === "PROJECTS");
                const items = projSec?.content?.items || [];
                if (items.length === 0) {
                  return (
                    <div className="p-4 rounded-xl border border-dashed text-xs text-muted-foreground">
                      No engineering projects added yet. Review pending suggestions above.
                    </div>
                  );
                }
                return (
                  <div className="space-y-3">
                    {items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl border bg-secondary/10 p-4 space-y-2 border-border/60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                              {item.title}
                            </h4>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(item.technologies || []).map((t: string) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border/50 text-muted-foreground"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {item.source_score && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono font-bold text-emerald-600 border-emerald-500/30"
                            >
                              Evidence: {item.source_score}/100
                            </Badge>
                          )}
                        </div>

                        <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pt-1">
                          {(item.bullet_points || []).map((b: string, j: number) => (
                            <li key={j} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Section 4: Education */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-primary" />
                Education
              </h3>
              <div className="rounded-xl border bg-card p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div>
                  <div className="font-semibold text-foreground">
                    {academic_profile?.program?.program_name || "B.Tech Computer Science & Engineering"}
                  </div>
                  <div className="text-muted-foreground">
                    {academic_profile?.institution?.name || "Engineering College"} · Year {academic_profile?.current_year || 3}
                  </div>
                </div>
                <div className="text-muted-foreground sm:text-right">
                  Graduation: {academic_profile?.expected_graduation_year || "2026"}
                </div>
              </div>
            </div>
          </div>

          {/* Version History Drawer */}
          <SectionCard title="Resume Version History & Restore">
            <p className="text-xs text-muted-foreground mb-4">
              Every accepted suggestion or direct edit is saved as an immutable version snapshot. You can inspect or revert to previous iterations anytime.
            </p>

            <div className="space-y-2">
              {versionHistory.map((ver) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-card text-xs hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
                      v{ver.version_number}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">{ver.label}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(ver.created_at).toLocaleString()} {ver.created_by_reason && `· ${ver.created_by_reason}`}
                      </div>
                    </div>
                  </div>

                  <div>
                    {ver.version_number === pro?.current_version_number ? (
                      <Badge className="bg-primary/20 text-primary border-none text-[10px]">
                        Active Version
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreVersion(ver.id)}
                        disabled={restoreVersionMutation.isPending}
                        className="text-[11px] h-7 gap-1"
                      >
                        <RotateCcw className="size-3" />
                        Restore Version
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: LINKEDIN & PROFESSIONAL PROFILE INTELLIGENCE V2             */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "linkedin" && (
        <LinkedInIntelligenceV2View
          activeCareerCode="DATA_ENGINEER"
          onAskSpar={(prompt) => {
            void navigate({ to: "/app/coach", search: { query: prompt } as any });
          }}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: GITHUB & PORTFOLIO */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Github className="size-5 text-primary" />
                Verified GitHub & Engineering Portfolio
              </h2>
              <p className="text-xs text-muted-foreground">
                Projects evaluated and backed by verified rubric evidence ready for your developer portfolio.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {portfolioItems.map((proj) => (
              <div
                key={proj.project_code}
                className="surface-panel rounded-2xl p-6 border border-border/80 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{proj.title}</h3>
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px] font-mono">
                        Score: {proj.score}/100
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{proj.short_description}</p>
                  </div>

                  <Button asChild size="sm" variant="outline" className="text-xs gap-1 shrink-0">
                    <Link to="/app/projects/$projectCode" params={{ projectCode: proj.project_code }}>
                      View Project
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>

                {/* Tech & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-muted-foreground text-[11px] uppercase">
                      Technologies Used
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-muted-foreground text-[11px] uppercase">
                      Demonstrated Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skills_demonstrated.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="text-[11px] border-primary/30 text-primary"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* README Improvements */}
                {proj.readme_suggestions && proj.readme_suggestions.length > 0 && (
                  <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4 space-y-2">
                    <span className="font-semibold text-xs text-primary flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      AI README Enhancement Recommendations
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                      {proj.readme_suggestions.map((rec, i) => (
                        <li key={i} className="leading-relaxed">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: PROFILE READINESS */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "readiness" && (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-xs font-semibold">
                  Professional Profile Readiness
                </Badge>
                <span className="text-xs text-muted-foreground">5 Holistic Dimensions</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {readiness.readiness_level.replace("_", " ")} ({readiness.overall_score.toFixed(0)}%)
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Measures how completely your verified coursework, project evidence, and mock interview performance are converted into internship-ready resume and LinkedIn assets.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl border">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-primary">
                  {readiness.overall_score.toFixed(0)}%
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                  Asset Score
                </div>
              </div>
            </div>
          </div>

          {/* 5 Dimensions Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readiness.dimensions.map((dim) => (
              <div
                key={dim.dimension_id}
                className="rounded-2xl border bg-card p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    {dim.dimension_name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono font-bold ${
                      dim.status === "COMPLETED" ? "text-emerald-600 border-emerald-500/30" : "text-amber-600"
                    }`}
                  >
                    {dim.score.toFixed(1)} / {dim.max_score.toFixed(0)}
                  </Badge>
                </div>

                <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dim.status === "COMPLETED" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, (dim.score / dim.max_score) * 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">{dim.details}</p>
              </div>
            ))}
          </div>

          {/* Missing Items Checklist */}
          {readiness.missing_items && readiness.missing_items.length > 0 && (
            <SectionCard title="Actionable Profile Checklist">
              <ul className="space-y-2">
                {readiness.missing_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold mt-0.5">
                      !
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: ACADEMICS & ACCOUNT */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "academics" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Personal Details">
            <Row label="Name" value={`${student.first_name} ${student.last_name}`.trim()} />
            <Row label="Email" value={student.email} />
            <Row label="Country" value={student.country_code ?? fallback} />
            <Row label="City" value={student.city ?? fallback} />
            <Row label="State" value={student.state ?? fallback} />
            <Row label="Phone" value={student.phone ?? fallback} />
          </SectionCard>

          <SectionCard title="Academic Profile">
            {academic_profile ? (
              <>
                <Row label="Institution" value={academic_profile.institution?.name ?? fallback} />
                <Row label="Program" value={academic_profile.program?.program_name ?? fallback} />
                <Row label="Degree" value={academic_profile.program?.degree_type ?? fallback} />
                <Row label="Department" value={academic_profile.program?.department ?? fallback} />
                <Row label="Year" value={academic_profile.current_year ?? fallback} />
                <Row label="Semester" value={academic_profile.current_semester ?? fallback} />
                <Row label="Graduation" value={academic_profile.expected_graduation_year ?? fallback} />
                <Row label="Status" value={academic_profile.academic_status ? humanizeCode(academic_profile.academic_status) : fallback} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No academic details yet.</p>
            )}
          </SectionCard>

          <SectionCard title="Career Intent">
            {career_preferences ? (
              <>
                <Row label="Intent" value={career_preferences.post_graduation_intent ? humanizeCode(career_preferences.post_graduation_intent) : fallback} />
                <Row label="Clarity" value={career_preferences.career_clarity ? humanizeCode(career_preferences.career_clarity) : fallback} />
                <Row
                  label="Preferred location"
                  value={career_preferences.preferred_location ?? fallback}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No career preferences yet.</p>
            )}
          </SectionCard>

          <SectionCard title="Interests">
            {(interests || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Chip key={interest.interest_area_code}>
                    {interest.interest_area_name} {"·"} {humanizeCode(interest.interest_level)}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No interests selected yet.</p>
            )}
          </SectionCard>
        </div>
      )}

      {/* Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR Coach on Resume & Professional Assets"
        subtitle="Get personalized advice on how to phrase your achievements or highlight your data pipeline experience."
        prompts={[
          "What should I add to my resume?",
          "How should I describe my data pipeline project?",
          "Which skills can I confidently list?",
          "What should my LinkedIn headline say?",
          "Is my resume ready for a Data Engineer internship?",
        ]}
      />
    </div>
  );
}
