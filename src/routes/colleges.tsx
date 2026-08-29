import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck,
  GraduationCap,
  Layers,
  Lock,
  PlusCircle,
  School,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { UnifiedAuthModal } from "@/components/auth/UnifiedAuthModal";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  useInstitutionSearch,
  useMyCollegeRegistrations,
  useRegisterCollege,
} from "@/lib/careerai/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/colleges")({
  component: CollegeLandingRoute,
});

function CollegeLandingRoute() {
  const { isAuthenticated, user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Registration wizard state
  const [instSearchQuery, setInstSearchQuery] = useState("");
  const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
  const [isCustomInst, setIsCustomInst] = useState(false);
  const [instName, setInstName] = useState("");
  const [contactName, setContactName] = useState(user?.name || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");
  const [designation, setDesignation] = useState("Placement Coordinator");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [website, setWebsite] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const { data: instData, isLoading: isInstLoading } = useInstitutionSearch(instSearchQuery, countryCode);
  const registerCollegeMutation = useRegisterCollege();
  const { data: myRegistrations } = useMyCollegeRegistrations();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;

    try {
      await registerCollegeMutation.mutateAsync({
        institution_name: isCustomInst ? instName.trim() : (instData?.items.find((i) => i.id === selectedInstId)?.name || instName.trim()),
        institution_id: isCustomInst ? undefined : (selectedInstId || undefined),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || undefined,
        designation: designation.trim(),
        department: department.trim() || undefined,
        website: website.trim() || undefined,
        country_code: countryCode,
        city: city.trim() || undefined,
        state_region: stateRegion.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error("College registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/brand/icon/spar-ai-icon-64.png"
              srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
              alt="SPAR AI"
              className="size-8 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-display text-lg font-bold">
              SPAR <span className="text-cyan-400">for Colleges</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              user?.role === "COLLEGE_COORDINATOR" || user?.role === "COLLEGE_ADMIN" ? (
                <Link
                  to="/college/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  <BarChart3 className="size-4" />
                  College Dashboard
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="rounded-full px-4 text-xs font-semibold"
                  onClick={() => setRegisterModalOpen(true)}
                >
                  Register Your College
                </Button>
              )
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium"
                  onClick={() => setAuthModalOpen(true)}
                >
                  College Sign In
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-4 text-xs font-semibold"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setAuthModalOpen(true);
                    } else {
                      setRegisterModalOpen(true);
                    }
                  }}
                >
                  Register Your College
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <Building2 className="size-4" />
            <span>Institution Placement & Cohort Intelligence</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground max-w-4xl mx-auto leading-tight">
            Help your students become <span className="text-primary">placement-ready</span> with verified proof of capability.
          </h1>

          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Move beyond static resumes. SPAR gives placement directors and department coordinators real-time readiness analytics, benchmark gap diagnosis, and recruiter-ready candidate portfolios.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 py-3 text-sm font-bold shadow-md gap-2"
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalOpen(true);
                } else {
                  setRegisterModalOpen(true);
                }
              }}
            >
              Register Your College
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 py-3 text-sm font-semibold"
              onClick={() => setAuthModalOpen(true)}
            >
              Coordinator Sign In
            </Button>
          </div>

          {/* Quick Pillar Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3 text-left">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <BarChart3 className="size-5" />
              </div>
              <h2 className="font-semibold text-sm text-foreground">Cohort Readiness Visibility</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Track your entire batch's readiness score, distribution by competency, and benchmark position across branches.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <TrendingUp className="size-5" />
              </div>
              <h2 className="font-semibold text-sm text-foreground">Curriculum Gap Diagnosis</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Instantly identify high-frequency skill gaps (SQL, Cloud, System Design) before recruiter drives commence.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Briefcase className="size-5" />
              </div>
              <h2 className="font-semibold text-sm text-foreground">Recruiter Match Pipeline</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Connect verified top candidates with active employer opportunities without compromising student privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Registration Wizard Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setRegisterModalOpen(false);
                setSubmittedSuccess(false);
              }}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            {!submittedSuccess ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
                    <School className="size-3.5" />
                    <span>College Onboarding</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Register Your Institution</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Connect your college placement office with SPAR AI.
                  </p>
                </div>

                {/* Institution Search or Custom */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Institution / College *
                  </label>
                  {!isCustomInst ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={instSearchQuery}
                          onChange={(e) => setInstSearchQuery(e.target.value)}
                          placeholder="Type to search verified colleges…"
                          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      {instData?.items && instData.items.length > 0 && (
                        <div className="max-h-40 overflow-y-auto rounded-xl border border-border bg-card p-1 space-y-1">
                          {instData.items.map((it) => (
                            <button
                              key={it.id}
                              type="button"
                              onClick={() => {
                                setSelectedInstId(it.id);
                                setInstName(it.name);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                                selectedInstId === it.id
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "hover:bg-secondary text-foreground"
                              )}
                            >
                              <span>{it.name} ({it.city || it.country_code})</span>
                              {selectedInstId === it.id && <CheckCircle2 className="size-3.5" />}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomInst(true);
                          setSelectedInstId(null);
                        }}
                        className="text-xs text-primary hover:underline font-medium block pt-1"
                      >
                        + Can't find my college (Enter new institution details)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={instName}
                          onChange={(e) => setInstName(e.target.value)}
                          placeholder="Full College / University Legal Name"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCustomInst(false)}
                        >
                          Search List
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          value={stateRegion}
                          onChange={(e) => setStateRegion(e.target.value)}
                          placeholder="State / Region"
                          className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Officer Details */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Placement Officer Name *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. placement@mit.edu"
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Designation / Role
                    </label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="Placement Director">Placement Director</option>
                      <option value="Placement Officer">Placement Officer</option>
                      <option value="Department Placement Coordinator">Department Placement Coordinator</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Principal / Dean">Principal / Dean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Official Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://collegename.edu"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Notes / Target Batches (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Preparing 2026 and 2027 CSE / IT placement batches (450 students)"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRegisterModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={registerCollegeMutation.isPending}
                    className="gap-1.5 font-semibold"
                  >
                    {registerCollegeMutation.isPending ? (
                      <>
                        <InlineSpinner className="size-4" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Registration
                        <Send className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* Success confirmation */
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="size-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Registration Submitted!</h2>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                    Thank you, {contactName}. Your college registration request for <strong>{instName || "your institution"}</strong> has been received with status <code>PENDING_VERIFICATION</code>.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground text-left space-y-1.5">
                  <p>✓ Domain validation initiated for <strong>{contactEmail}</strong></p>
                  <p>✓ Verification team assigned</p>
                  <p>✓ Coordinator access credentials will be activated upon review</p>
                </div>
                <Button
                  className="rounded-full px-6 text-xs font-semibold mt-2"
                  onClick={() => {
                    setRegisterModalOpen(false);
                    setSubmittedSuccess(false);
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <UnifiedAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="college"
      />
    </div>
  );
}
