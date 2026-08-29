import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Lock,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  useCompleteOnboarding,
  useInstitutionSearch,
  useOnboardingReference,
  useOnboardingStatus,
  useSaveStep1About,
  useSaveStep2Education,
  useSaveStep3Goals,
} from "@/lib/careerai/hooks";
import { cn } from "@/lib/utils";

const CONSENT_VERSION = "1.0";

const STEPS = [
  { key: "about", title: "About You", subtitle: "Confirm your details" },
  { key: "education", title: "Education", subtitle: "Your academic stage" },
  { key: "goals", title: "Your Goal", subtitle: "What you want to achieve" },
];

const DEFAULT_COUNTRIES = [
  { value: "IN", label: "India (IN)" },
  { value: "US", label: "United States (US)" },
  { value: "GB", label: "United Kingdom (UK)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "SG", label: "Singapore (SG)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "AE", label: "United Arab Emirates (AE)" },
];

const DEFAULT_DEGREES = [
  { value: "B_TECH", label: "B.Tech / B.E. (Bachelor of Technology / Engineering)" },
  { value: "BCA", label: "BCA (Bachelor of Computer Applications)" },
  { value: "B_SC", label: "B.Sc (Bachelor of Science)" },
  { value: "M_TECH", label: "M.Tech / M.E. (Master of Technology)" },
  { value: "MCA", label: "MCA (Master of Computer Applications)" },
  { value: "M_SC", label: "M.Sc (Master of Science)" },
  { value: "OTHER", label: "Other Degree / Program" },
];

const DEFAULT_DEPARTMENTS = [
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "IT", label: "Information Technology" },
  { value: "AI_DS", label: "Artificial Intelligence & Data Science" },
  { value: "ECE", label: "Electronics & Communication" },
  { value: "EEE", label: "Electrical & Electronics" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "OTHER", label: "Other Department" },
];

const GOAL_OPTIONS = [
  { value: "JOB", label: "Prepare for a job", description: "Targeting entry-level or junior roles" },
  { value: "INTERNSHIP", label: "Prepare for internships", description: "Seeking practical industry exposure" },
  { value: "SKILLS", label: "Build technical skills", description: "Closing domain and tech gaps" },
  { value: "PROJECTS", label: "Build verified projects", description: "Creating portfolio evidence" },
  { value: "INTERVIEW", label: "Improve interview skills", description: "Mock drills and communication" },
  { value: "EXPLORE", label: "Explore career options", description: "Discovering high-fit paths" },
];

const CLARITY_OPTIONS = [
  { value: "CONFIDENT", label: "I know exactly what I want", description: "Ready to focus and prepare" },
  { value: "SOME_IDEA", label: "I have a few ideas", description: "Deciding between 2-3 paths" },
  { value: "EXPLORING", label: "I'm exploring", description: "Need guidance on best-fit roles" },
  { value: "NO_IDEA", label: "I have no idea yet", description: "Starting fresh from zero" },
];

const INTEREST_PILLS = [
  { value: "SOFTWARE", label: "Software" },
  { value: "DATA", label: "Data" },
  { value: "AI", label: "AI & ML" },
  { value: "CYBER", label: "Cybersecurity" },
  { value: "CLOUD", label: "Cloud & DevOps" },
  { value: "PRODUCT", label: "Product" },
  { value: "EXPLORING", label: "Still exploring" },
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { user, student, refreshSession } = useAuth();

  const { data: statusData, isLoading: isStatusLoading } = useOnboardingStatus();
  const { data: refData } = useOnboardingReference();

  const saveStep1Mutation = useSaveStep1About();
  const saveStep2Mutation = useSaveStep2Education();
  const saveStep3Mutation = useSaveStep3Goals();
  const completeMutation = useCompleteOnboarding();

  const [stepIdx, setStepIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState(0);

  // --- Step 1 State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [city, setCity] = useState("");

  // --- Step 2 State ---
  const [academicStatus, setAcademicStatus] = useState("COLLEGE");
  const [instSearchQuery, setInstSearchQuery] = useState("");
  const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
  const [selectedInstName, setSelectedInstName] = useState("");
  const [isCustomInst, setIsCustomInst] = useState(false);
  const [degreeType, setDegreeType] = useState("B_TECH");
  const [department, setDepartment] = useState("CSE");
  const [currentYear, setCurrentYear] = useState<number>(3);
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() + 1);

  // --- Step 3 State ---
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["JOB", "SKILLS"]);
  const [clarityLevel, setClarityLevel] = useState<string>("EXPLORING");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["DATA", "AI"]);
  const [consentGranted, setConsentGranted] = useState(true);

  // Master institution search
  const { data: instData } = useInstitutionSearch(instSearchQuery, countryCode);

  // Populate state from authoritative backend status or session on mount
  useEffect(() => {
    if (statusData) {
      if (statusData.current_step && statusData.current_step >= 1) {
        setStepIdx(statusData.current_step - 1);
      }
      const pre = statusData.prefilled_data || {};
      if (pre.first_name) setFirstName(pre.first_name);
      if (pre.last_name) setLastName(pre.last_name);
      if (pre.country_code) setCountryCode(pre.country_code);
      if (pre.city) setCity(pre.city);
      if (pre.academic_status) setAcademicStatus(pre.academic_status);
      if (pre.institution_id) setSelectedInstId(pre.institution_id);
      if (pre.degree_type) setDegreeType(pre.degree_type);
      if (pre.department) setDepartment(pre.department);
      if (pre.current_year) setCurrentYear(pre.current_year);
      if (pre.expected_graduation_year) setGraduationYear(pre.expected_graduation_year);
      if (pre.primary_goal) setSelectedGoals([pre.primary_goal]);
      if (pre.clarity_level) setClarityLevel(pre.clarity_level);
      if (pre.interests && pre.interests.length > 0) setSelectedInterests(pre.interests);
    } else if (user) {
      if (user.name) {
        const parts = user.name.trim().split(/\s+/);
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      } else if (user.email) {
        setFirstName(user.email.split("@")[0] || "Student");
      }
    }
  }, [statusData, user]);

  const currentYearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = current; y <= current + 7; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const toggleGoal = (code: string) => {
    if (selectedGoals.includes(code)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== code));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, code]);
      }
    }
  };

  const toggleInterest = (code: string) => {
    if (selectedInterests.includes(code)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== code));
    } else {
      setSelectedInterests([...selectedInterests, code]);
    }
  };

  const handleNext = async () => {
    setErrorMsg(null);

    // Validate and Autosave Step 1
    if (stepIdx === 0) {
      if (!firstName.trim()) {
        setErrorMsg("Please enter your first name.");
        return;
      }
      try {
        await saveStep1Mutation.mutateAsync({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          country_code: countryCode,
          city: city.trim() || undefined,
        });
        setStepIdx(1);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to save personal details. Please try again.");
      }
    }
    // Validate and Autosave Step 2
    else if (stepIdx === 1) {
      if (academicStatus === "COLLEGE" && !selectedInstId && !selectedInstName.trim() && !isCustomInst) {
        setErrorMsg("Please select or enter your institution name.");
        return;
      }
      try {
        await saveStep2Mutation.mutateAsync({
          academic_status: academicStatus,
          institution_id: isCustomInst ? undefined : (selectedInstId || undefined),
          custom_institution_name: isCustomInst ? selectedInstName.trim() : (selectedInstName.trim() || undefined),
          degree_type: degreeType,
          department: department,
          current_year: currentYear,
          expected_graduation_year: graduationYear,
        });
        setStepIdx(2);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to save education details. Please try again.");
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStepIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleMeetSPAR = async () => {
    if (!consentGranted) {
      setErrorMsg("Please agree to SPAR AI Career Intelligence processing to continue.");
      return;
    }

    setErrorMsg(null);
    setTransitioning(true);
    setTransitionStage(1);

    try {
      // 1. Save Step 3 Goals
      await saveStep3Mutation.mutateAsync({
        primary_goal: selectedGoals[0] || "JOB",
        secondary_goals: selectedGoals.slice(1),
        career_clarity_level: clarityLevel,
        interest_area_codes: selectedInterests,
      });

      // 2. Transition animation stage 2
      setTransitionStage(2);

      // 3. Complete Onboarding atomically
      const completeRes = await completeMutation.mutateAsync(CONSENT_VERSION);

      // 4. Transition animation stage 3
      setTransitionStage(3);
      await refreshSession();

      // 5. Navigate to Career Discovery
      setTimeout(() => {
        void navigate({ to: completeRes.next_route || "/app/discover" });
      }, 1200);
    } catch (err: any) {
      console.error("Onboarding completion error:", err);
      setTransitioning(false);
      setErrorMsg(err?.message || "Failed to complete setup. Please try again.");
    }
  };

  const countries = refData?.countries && refData.countries.length > 0 ? refData.countries : DEFAULT_COUNTRIES;
  const degrees = refData?.degrees && refData.degrees.length > 0 ? refData.degrees : DEFAULT_DEGREES;
  const departments = refData?.departments && refData.departments.length > 0 ? refData.departments : DEFAULT_DEPARTMENTS;

  // --- TRANSITION SCREEN ("Meet SPAR") ---
  if (transitioning) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="relative mb-6">
          <img
            src="/brand/icon/spar-ai-icon-128.png"
            srcSet="/brand/icon/spar-ai-icon-128.png 1x, /brand/icon/spar-ai-icon-256.png 2x"
            alt="SPAR AI"
            className="size-20 object-contain drop-shadow-[0_0_20px_rgba(6,215,247,0.5)] animate-pulse mx-auto"
          />
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Preparing Your Career Discovery
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          SPAR AI is calibrating your personalized career landscape…
        </p>

        <div className="mt-8 w-full max-w-sm space-y-3 text-left">
          <div className={cn("flex items-center gap-3 rounded-xl border p-3.5 transition-all", transitionStage >= 1 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-semibold" : "border-border text-muted-foreground")}>
            <CheckCircle2 className="size-4" />
            <span className="text-xs">Profile & Academic baseline saved</span>
          </div>

          <div className={cn("flex items-center gap-3 rounded-xl border p-3.5 transition-all", transitionStage >= 2 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-semibold" : "border-border text-muted-foreground")}>
            <CheckCircle2 className="size-4" />
            <span className="text-xs">Goals & Readiness calibration indexed</span>
          </div>

          <div className={cn("flex items-center gap-3 rounded-xl border p-3.5 transition-all", transitionStage >= 3 ? "border-primary/40 bg-primary/10 text-primary font-bold shadow-xs" : "border-border text-muted-foreground")}>
            <Sparkles className="size-4 animate-spin" />
            <span className="text-xs">Launching SPAR Career Discovery…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Header & Step Indicator */}
      <div className="mb-8 text-center">
        <img
          src="/brand/icon/spar-ai-icon-64.png"
          srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
          alt="SPAR AI"
          className="size-12 object-contain mx-auto mb-3 drop-shadow-sm"
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Sparkles className="size-3.5 text-cyan-400" />
          <span>Quick 2-Minute Profile</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Welcome to SPAR <span className="text-cyan-400">AI</span>
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {STEPS[stepIdx].subtitle} · Step {stepIdx + 1} of {STEPS.length}
        </p>

        {/* Progress Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {STEPS.map((s, idx) => (
            <div
              key={s.key}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === stepIdx
                  ? "w-12 bg-primary"
                  : idx < stepIdx
                    ? "w-8 bg-primary/50"
                    : "w-8 bg-secondary"
              )}
            />
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        {/* --- STEP 1: ABOUT YOU --- */}
        {stepIdx === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20 overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={firstName} className="size-full object-cover" />
                ) : firstName ? (
                  firstName[0].toUpperCase()
                ) : (
                  <User className="size-6" />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Personal Details</h2>
                <p className="text-xs text-muted-foreground">
                  {user?.email ? `Authenticated as ${user.email}` : "Confirm your profile identity below."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Rivera"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Country *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  City (Optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Austin, London"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: EDUCATION --- */}
        {stepIdx === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Education & Degree</h2>
                <p className="text-xs text-muted-foreground">
                  Helps calibrate skill assessments and timeline.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                Where are you currently? *
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {[
                  { value: "COLLEGE", label: "College Student", icon: GraduationCap },
                  { value: "GRADUATE", label: "Graduate", icon: Briefcase },
                  { value: "SCHOOL", label: "School Student", icon: School },
                  { value: "WORKING_PROFESSIONAL", label: "Working Pro", icon: Layers },
                  { value: "OTHER", label: "Other", icon: Compass },
                ].map((st) => {
                  const Icon = st.icon;
                  const isSelected = academicStatus === st.value;
                  return (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setAcademicStatus(st.value)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-5 mb-1.5" />
                      <span className="text-xs">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  College / Institution *
                </label>
                {!isCustomInst ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={instSearchQuery}
                        onChange={(e) => setInstSearchQuery(e.target.value)}
                        placeholder="Search your college name…"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    {instData?.items && instData.items.length > 0 && (
                      <div className="max-h-36 overflow-y-auto rounded-xl border border-border bg-card p-1 space-y-1">
                        {instData.items.map((it) => (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => {
                              setSelectedInstId(it.id);
                              setSelectedInstName(it.name);
                              setInstSearchQuery(it.name);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                              selectedInstId === it.id
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-secondary text-foreground"
                            )}
                          >
                            <span>{it.name} ({it.city || it.country_code})</span>
                            {selectedInstId === it.id && <Check className="size-3.5" />}
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
                      + Can't find my college (Type manually)
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedInstName}
                      onChange={(e) => setSelectedInstName(e.target.value)}
                      placeholder="Enter your college / university name"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
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
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Degree *
                  </label>
                  <select
                    value={degreeType}
                    onChange={(e) => setDegreeType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {degrees.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Department / Field *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Current Year *
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value={1}>Year 1 (Freshman)</option>
                    <option value={2}>Year 2 (Sophomore)</option>
                    <option value={3}>Year 3 (Junior)</option>
                    <option value={4}>Year 4 (Senior)</option>
                    <option value={5}>Year 5 (Extended / Dual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Expected Graduation *
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {currentYearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: YOUR GOAL --- */}
        {stepIdx === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20">
                <Compass className="size-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Your Goal & Interests</h2>
                <p className="text-xs text-muted-foreground">
                  Personalizes AI career suggestions and milestone pathways.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                What would you like SPAR to help you with? (Select up to 3) *
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = selectedGoals.includes(g.value);
                  return (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => toggleGoal(g.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-md border text-[10px]",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border"
                        )}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{g.label}</div>
                        {g.description && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {g.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                How clear are you about your career direction? *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CLARITY_OPTIONS.map((lvl) => {
                  const isSelected = clarityLevel === lvl.value;
                  return (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setClarityLevel(lvl.value)}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <div className="text-xs font-semibold leading-tight">{lvl.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Areas of Interest *
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_PILLS.map((ia) => {
                  const isSelected = selectedInterests.includes(ia.value);
                  return (
                    <button
                      key={ia.value}
                      type="button"
                      onClick={() => toggleInterest(ia.value)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {ia.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy & Consent Note */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <ShieldCheck className="size-4" />
                <span>SPAR Privacy & AI Career Guidance Consent</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By clicking Meet SPAR, you consent to SPAR processing your academic profile, skill assessments, and project artifacts to provide personalized career recommendations and readiness scoring.
              </p>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded border-border size-4 text-primary"
                />
                <span className="text-xs font-medium text-foreground">
                  I agree to SPAR Career Intelligence processing (v{CONSENT_VERSION})
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          {stepIdx > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={saveStep1Mutation.isPending || saveStep2Mutation.isPending || completeMutation.isPending}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {stepIdx < STEPS.length - 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={saveStep1Mutation.isPending || saveStep2Mutation.isPending}
              className="gap-1.5 font-semibold"
            >
              {saveStep1Mutation.isPending || saveStep2Mutation.isPending ? (
                <>
                  <InlineSpinner className="size-4" />
                  Saving…
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleMeetSPAR}
              disabled={completeMutation.isPending || !consentGranted}
              className="gap-2 font-bold px-6 bg-gradient-to-r from-primary to-indigo-600 shadow-md"
            >
              Meet SPAR
              <Sparkles className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
