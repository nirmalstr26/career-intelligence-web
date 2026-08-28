import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  Target,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Briefcase,
  Award,
  Layers,
  Search,
  Code2,
  Check,
  GitBranch,
  FileText,
  Lock,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  useLinkedInIntelligenceV2,
  useClaimsAudit,
  useCrossPlatformHeatmap,
  useLinkedInCapabilities,
  useOptimizeForJob,
  useConnectLinkedIn,
} from "@/lib/careerai/hooks";

export const LinkedInIntelligenceV2View: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "positioning" | "job_optimize" | "claim_audit" | "heatmap" | "projects" | "certifications"
  >("positioning");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Job Optimization Form State
  const [targetRole, setTargetRole] = useState("Junior Data Engineer");
  const [companyName, setCompanyName] = useState("Acme Data Systems");
  const [rawJdText, setRawJdText] = useState(
    "Seeking a Junior Data Engineer with strong Python and SQL skills. Experience building batch ETL data pipelines, data modeling, and basic familiarity with Apache Spark and Airflow is a plus."
  );

  const liQuery = useLinkedInIntelligenceV2();
  const claimsQuery = useClaimsAudit();
  const heatmapQuery = useCrossPlatformHeatmap();
  const capQuery = useLinkedInCapabilities();
  const optimizeMutation = useOptimizeForJob();
  const connectMutation = useConnectLinkedIn();

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunOptimization = () => {
    optimizeMutation.mutate({
      role_title: targetRole,
      company_name: companyName,
      raw_jd_text: rawJdText,
    });
  };

  if (liQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-12 text-center animate-pulse space-y-4">
        <div className="h-6 w-56 bg-muted rounded-full mx-auto" />
        <div className="h-24 w-full max-w-lg bg-muted/50 rounded-2xl mx-auto" />
      </div>
    );
  }

  const data = liQuery.data;
  if (!data) return null;

  const optData = optimizeMutation.data;

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: EVIDENCE-GROUNDED POSITIONING */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.05] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-extrabold uppercase tracking-wider">
                Professional Profile Intelligence V2
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">
                <ShieldCheck className="size-3 mr-1 text-emerald-600" />
                Evidence Grounded · Zero Fake Credentials
              </Badge>
              <button
                onClick={() => setMethodologyOpen(true)}
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-semibold underline underline-offset-2 ml-1"
              >
                <HelpCircle className="size-3" /> Grounding Rules
              </button>
            </div>

            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-foreground tracking-tight">
              Make your professional profile prove what you can do.
            </h1>

            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              SPAR aligns your LinkedIn and resume positioning with verified capabilities. Never invent employer experience or claim unevidenced production seniority.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Target Role
              </span>
              <span className="font-display font-extrabold text-base text-foreground block truncate">
                {data.target_career_name}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Active Selection
              </span>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-3.5 text-center shadow-xs">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Profile Readiness
              </span>
              <span className="font-display font-extrabold text-2xl text-primary">
                {Math.round(data.readiness_score)}%
              </span>
              <span className="text-[10px] text-primary/80 block mt-0.5 font-semibold">
                High Credibility
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs flex flex-col justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Claim Audit
              </span>
              <span className="font-display font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                12 Verified
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                3 High Impact Fixes
              </span>
            </div>
          </div>
        </div>

        {/* 3-WAY GAP ALERT BANNER */}
        {data.high_impact_actions && data.high_impact_actions.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Highest Impact Action: Feature your Simple Data Pipeline project
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Your strongest verified Data Engineering artifact (88/100) is invisible on LinkedIn. Adding it closes your primary visibility gap.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setActiveTab("projects")}
                className="text-xs font-bold shrink-0 h-8 gap-1.5"
              >
                Feature Project <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/70 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("positioning")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "positioning"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Target className="size-3.5" />
          Target Career Positioning
        </button>

        <button
          onClick={() => setActiveTab("job_optimize")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "job_optimize"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Briefcase className="size-3.5" />
          Optimize for a Job & 3-Way Matrix
        </button>

        <button
          onClick={() => setActiveTab("claim_audit")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "claim_audit"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <ShieldCheck className="size-3.5" />
          Claim Audit & Defensibility
        </button>

        <button
          onClick={() => setActiveTab("heatmap")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "heatmap"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Layers className="size-3.5" />
          Cross-Platform Heatmap
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "projects"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Code2 className="size-3.5" />
          Featured Projects Studio
        </button>

        <button
          onClick={() => setActiveTab("certifications")}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "certifications"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Award className="size-3.5" />
          Certifications Hub
        </button>
      </div>

      {/* 3. TAB CONTENT 1: TARGET CAREER POSITIONING */}
      {activeTab === "positioning" && (
        <div className="space-y-6">
          {/* A. 3 Grounded Headlines */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
              <div>
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  3 Grounded Headline Strategies
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grounded in verified skills (SQL 92%, Python 88%) and "Aspiring" career positioning.
                </p>
              </div>
            </div>

            <div className="grid gap-3.5">
              {data.headline_variants.map((h, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-4 bg-muted/10 hover:bg-muted/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold">
                        {h.title}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {h.character_count} / 220 chars
                      </span>
                    </div>
                    <p className="text-xs font-bold text-foreground leading-snug">
                      {h.headline_text}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {h.rationale}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(h.headline_text, `head-${i}`)}
                    className="text-xs font-semibold gap-1.5 shrink-0 h-8"
                  >
                    {copiedKey === `head-${i}` ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> Copy Headline
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* B. 6-Part Modular About Framework */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
              <div>
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  6-Part Evidence-Backed About Framework
                </h3>
                <p className="text-xs text-muted-foreground">
                  Structured narrative with direct provenance for every claim. No generic motivational fluff.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(data.modular_about.full_text, "about-full")}
                className="text-xs font-semibold gap-1.5 h-8"
              >
                {copiedKey === "about-full" ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" /> Copied Full About!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" /> Copy Full About Section
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-3">
              {data.modular_about.parts.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl border bg-muted/15 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                      Part {idx + 1}: {p.heading}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground">
                      {p.evidence_backing}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                    {p.suggested_text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* C. Role-Ordered Skill Pins */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Recommended Skill Pin Order
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked by Data Engineer role relevance and verified evidence strength (not alphabetical).
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.skill_ordering.map((sk, idx) => (
                <div key={idx} className="rounded-2xl border p-3.5 bg-muted/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      #{idx + 1} {sk.name}
                    </span>
                    {sk.is_top_pin_recommended && (
                      <Badge className="bg-primary/20 text-primary border-none text-[9px] font-extrabold">
                        Top Pin
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Evidence: {sk.evidence_status}</span>
                    {sk.score && <span className="font-mono font-bold text-foreground">{sk.score}%</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {sk.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT 2: OPTIMIZE FOR A SPECIFIC JOB & 3-WAY MATRIX */}
      {activeTab === "job_optimize" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                Target Opportunity JD Tailoring
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste a job description to compare: <strong className="text-foreground">Job Requirements</strong> vs <strong className="text-foreground">What You Can Prove</strong> vs <strong className="text-foreground">What Your Profile Shows</strong>.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Role Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs rounded-xl border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs rounded-xl border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-foreground">Job Description Snippet</label>
                <textarea
                  rows={3}
                  value={rawJdText}
                  onChange={(e) => setRawJdText(e.target.value)}
                  className="w-full text-xs rounded-xl border bg-background p-3 text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleRunOptimization}
                disabled={optimizeMutation.isPending}
                className="text-xs font-bold gap-1.5"
              >
                {optimizeMutation.isPending ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <Zap className="size-3.5" />
                )}
                Run 3-Way Fit Analysis
              </Button>
            </div>
          </div>

          {/* 3-WAY OPPORTUNITY MATRIX RESULTS */}
          {optData && (
            <div className="space-y-6">
              {/* Fit Summary */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border bg-card p-4 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Profile Alignment</span>
                  <div className="font-display font-extrabold text-2xl text-foreground">
                    {optData.current_linkedin_fit_pct}%
                  </div>
                  <p className="text-[11px] text-muted-foreground">What recruiters currently see on your profile</p>
                </div>

                <div className="rounded-2xl border border-primary/40 bg-primary/[0.04] p-4 space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase">Potential Evidence-Backed Fit</span>
                  <div className="font-display font-extrabold text-2xl text-primary">
                    {optData.potential_evidence_fit_pct}%
                  </div>
                  <p className="text-[11px] text-primary/80">Fit achievable by featuring your verified pipeline project</p>
                </div>
              </div>

              {/* 5-Column Opportunity Matrix */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
                <div className="pb-3 border-b">
                  <h4 className="font-display font-extrabold text-base text-foreground">
                    5-Column Capability Matrix for {optData.target_role}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Deterministic breakdown of requirements, verified capabilities, and required positioning actions.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                        <th className="p-3">Capability</th>
                        <th className="p-3 text-center">Can Prove (SPAR)</th>
                        <th className="p-3 text-center">Profile Shows</th>
                        <th className="p-3 text-center">Job Needs</th>
                        <th className="p-3 text-right">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {optData.opportunity_matrix.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/15 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{row.capability}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className={`text-[10px] font-bold ${row.can_prove === "YES" ? "text-emerald-600 border-emerald-500/40" : "text-amber-600"}`}>
                              {row.can_prove}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className={`text-[10px] font-bold ${row.profile_shows === "YES" ? "text-primary border-primary/40" : "text-muted-foreground"}`}>
                              {row.profile_shows}
                            </Badge>
                          </td>
                          <td className="p-3 text-center font-semibold text-muted-foreground">
                            {row.job_needs}
                          </td>
                          <td className="p-3 text-right">
                            <Badge
                              className={`text-[9px] font-bold ${
                                row.action === "ADD_NOW"
                                  ? "bg-amber-500/20 text-amber-600"
                                  : row.action === "STRONG_ALIGNMENT"
                                  ? "bg-emerald-500/20 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {row.action.replace("_", " ")}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4-Step Action Plan */}
              <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card to-primary/[0.03] p-6 space-y-3 shadow-sm">
                <h4 className="font-display font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  Tailored Action Plan for {optData.company_name}
                </h4>
                <div className="space-y-2">
                  {optData.action_plan.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-card border text-xs text-foreground/90 font-medium">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT 3: CLAIM AUDIT & INTERVIEW DEFENSIBILITY */}
      {activeTab === "claim_audit" && claimsQuery.data && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
              <div>
                <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Professional Claim Audit & Interview Defensibility
                </h3>
                <p className="text-xs text-muted-foreground">
                  Audits your claims to prevent interview traps and protect your credibility.
                </p>
              </div>

              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none font-bold text-xs">
                {claimsQuery.data.credibility_score}% Credibility Score
              </Badge>
            </div>

            <div className="grid gap-3">
              {claimsQuery.data.claims.map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-4 bg-muted/10 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">"{c.claim_text}"</span>
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {c.section}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Proof: {c.evidence_details}
                    </p>
                    <p className="text-[11px] text-foreground/80 leading-tight">
                      {c.rationale}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase block">Defensibility</span>
                      <Badge
                        className={`text-[9px] font-bold border-none ${
                          c.interview_defensibility === "HIGH"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : c.interview_defensibility === "MEDIUM"
                            ? "bg-blue-500/20 text-blue-600"
                            : "bg-amber-500/20 text-amber-600"
                        }`}
                      >
                        {c.interview_defensibility}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase block">Action</span>
                      <Badge variant="outline" className="text-[9px] font-bold">
                        {c.recommended_action.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT 4: CROSS-PLATFORM VISIBILITY HEATMAP */}
      {activeTab === "heatmap" && heatmapQuery.data && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Cross-Platform Multi-Source Visibility Heatmap
              </h3>
              <p className="text-xs text-muted-foreground">
                Comparing proof points across <strong className="text-foreground">SPAR Verified</strong>, <strong className="text-foreground">LinkedIn</strong>, <strong className="text-foreground">Resume</strong>, <strong className="text-foreground">GitHub</strong>, and <strong className="text-foreground">Target Job</strong>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                    <th className="p-3">Competency</th>
                    <th className="p-3 text-center">SPAR Verified</th>
                    <th className="p-3 text-center">LinkedIn</th>
                    <th className="p-3 text-center">Resume</th>
                    <th className="p-3 text-center">GitHub</th>
                    <th className="p-3 text-center">Target Job</th>
                    <th className="p-3 text-right">Visibility State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {heatmapQuery.data.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/15 transition-colors">
                      <td className="p-3 font-semibold text-foreground">{row.competency}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{row.is_verified_spar ? "✓" : "△"}</td>
                      <td className="p-3 text-center font-bold">{row.is_present_linkedin ? "✓" : "✕"}</td>
                      <td className="p-3 text-center font-bold">{row.is_present_resume ? "✓" : "✕"}</td>
                      <td className="p-3 text-center font-bold">{row.is_present_github ? "✓" : "✕"}</td>
                      <td className="p-3 text-center font-bold text-primary">{row.is_required_target_job ? "✓" : "—"}</td>
                      <td className="p-3 text-right">
                        <Badge
                          className={`text-[9px] font-bold ${
                            row.visibility_status === "UNDERSELLING"
                              ? "bg-amber-500/20 text-amber-600"
                              : row.visibility_status === "OVERCLAIMED"
                              ? "bg-rose-500/20 text-rose-600"
                              : row.visibility_status === "WELL_REPRESENTED"
                              ? "bg-emerald-500/20 text-emerald-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {row.visibility_status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT 5: FEATURED PROJECTS STUDIO */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                LinkedIn Featured Projects Studio
              </h3>
              <p className="text-xs text-muted-foreground">
                Copy-ready project cards formatted specifically for LinkedIn Featured sections with verified rubric bullets.
              </p>
            </div>

            <div className="grid gap-4">
              {data.featured_projects.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl border bg-muted/15 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{proj.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{proj.one_line_hook}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/40 shrink-0">
                      {proj.evidence_provenance}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Achievement Bullets</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-foreground/90">
                      {proj.bullet_points.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skills_demonstrated.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-[9px] font-semibold">
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(proj.bullet_points.join("\n"), `proj-${idx}`)}
                      className="text-xs font-semibold gap-1.5 h-8"
                    >
                      {copiedKey === `proj-${idx}` ? (
                        <>
                          <Check className="size-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Copy Bullets
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT 6: CERTIFICATIONS HUB */}
      {activeTab === "certifications" && (
        <div className="space-y-6">
          {/* Held Credentials */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Award className="size-4 text-emerald-600" />
                Credentials You Hold (Confirmed)
              </h3>
              <p className="text-xs text-muted-foreground">
                Only student-confirmed and verifiable credentials appear here.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {data.held_certifications.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl border bg-muted/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-foreground">{c.name}</h5>
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-none text-[9px] font-bold">
                      Confirmed
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Issuer: {c.authority} · Issued {c.issue_date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Credentials with Prerequisites */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b">
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Target className="size-4 text-primary" />
                Recommended Target Credentials & Prerequisite Readiness
              </h3>
              <p className="text-xs text-muted-foreground">
                Evaluated against your active Data Engineer path. Never presented as completed credentials.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {data.recommended_certifications.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl border bg-muted/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold">
                        {rec.priority} Priority
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        ~{rec.estimated_study_weeks} weeks prep
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-foreground leading-snug">{rec.name}</h5>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.why_it_matters}</p>

                    <div className="p-2.5 rounded-xl bg-background border text-[10px] text-foreground/90 space-y-1">
                      <span className="font-bold text-primary block">Prerequisite Readiness: {Math.round(rec.prerequisite_readiness_pct)}%</span>
                      <p className="text-muted-foreground">{rec.prerequisite_summary}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex justify-between">
                    <span>Est. Cost: {rec.estimated_cost}</span>
                    <span className="font-semibold text-primary">{rec.authority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GROUNDING RULES MODAL */}
      <Dialog open={methodologyOpen} onOpenChange={setMethodologyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              SPAR Professional Profile Grounding Rules
            </DialogTitle>
            <DialogDescription className="text-xs">
              How SPAR protects student integrity and interview credibility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs text-foreground/90 leading-relaxed py-2">
            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">1. Zero Fabricated Experience</h5>
              <p className="text-muted-foreground">
                SPAR will never generate fake employer histories, senior production titles, or unverified certifications. Positioning is anchored strictly in verifiable projects and assessments.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">2. Interview Defensibility Guarantee</h5>
              <p className="text-muted-foreground">
                Every claim on your profile is audited for technical defensibility to ensure you can confidently explain and defend your work during recruiter and engineering screenings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border space-y-1.5">
              <h5 className="font-bold text-foreground">3. Compliant LinkedIn Integration</h5>
              <p className="text-muted-foreground">
                SPAR operates exclusively via approved OpenID Connect protocols and student-controlled data exports. No unauthorized web scraping or automated browser manipulation is ever performed.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setMethodologyOpen(false)} className="text-xs font-semibold">
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
