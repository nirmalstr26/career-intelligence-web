import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  GraduationCap,
  Layers,
  Lock,
  School,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useOnboardingReference } from "@/lib/careerai/hooks";
import { careerai } from "@/lib/careerai/client";
import { cn } from "@/lib/utils";

const CONSENT_VERSION = "1.0";

const STEPS = [
  { key: "about", title: "About you", subtitle: "Confirm your details" },
  { key: "education", title: "Education", subtitle: "Your academic stage" },
  { key: "goals", title: "Goals & Interests", subtitle: "What you want to achieve" },
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

const DEFAULT_GOALS = [
  { value: "JOB", label: "Land a Full-Time Job", description: "Targeting entry-level or junior role" },
  { value: "INTERNSHIP", label: "Find an Internship", description: "Seeking practical industry exposure" },
  { value: "SKILLS", label: "Build Verified Skills", description: "Closing domain and tech gaps" },
  { value: "CAREER_SWITCH", label: "Switch Career Path", description: "Transitioning to a new field" },
  { value: "HIGHER_ED", label: "Higher Studies / Research", description: "Preparing for Masters or PhD" },
];

const DEFAULT_CLARITY = [
  { value: "EXPLORING", label: "Still Exploring", description: "Need guidance on best-fit paths" },
  { value: "SOME_IDEA", label: "Have an Idea", description: "Know general area, deciding role" },
  { value: "CONFIDENT", label: "Target Role Chosen", description: "Ready to focus and prepare" },
];

const DEFAULT_INTERESTS = [
  { value: "DATA", label: "Data Engineering & Analytics" },
  { value: "AI_ML", label: "AI & Machine Learning" },
  { value: "CLOUD", label: "Cloud & DevOps" },
  { value: "FULLSTACK", label: "Full-Stack Development" },
  { value: "CYBER", label: "Cybersecurity & Networks" },
  { value: "PRODUCT", label: "Product & System Design" },
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { session, reloadUser } = useAuth();
  const student = session?.student ?? null;
  const user = session?.user ?? null;

  const { data: refData } = useOnboardingReference();

  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Step 1: About You State ---
  const [firstName, setFirstName] = useState(student?.first_name || user?.email?.split("@")[0] || "");
  const [lastName, setLastName] = useState(student?.last_name || "");
  const [countryCode, setCountryCode] = useState(student?.country_code || "IN");
  const [city, setCity] = useState(student?.city || "");

  // --- Step 2: Education State ---
  const [academicStatus, setAcademicStatus] = useState<string>("COLLEGE");
  const [institutionName, setInstitutionName] = useState("MIT College of Engineering");
  const [isCustomInstitution, setIsCustomInstitution] = useState(false);
  const [degreeType, setDegreeType] = useState("B_TECH");
  const [department, setDepartment] = useState("CSE");
  const [currentYear, setCurrentYear] = useState<number>(3);
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() + 1);

  // --- Step 3: Goals, Interests & Consent State ---
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["JOB", "SKILLS"]);
  const [clarityLevel, setClarityLevel] = useState<string>("EXPLORING");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["DATA", "AI_ML"]);
  const [consentGranted, setConsentGranted] = useState(true);

  // Sync profile when student loads
  useEffect(() => {
    if (student) {
      if (student.first_name) setFirstName(student.first_name);
      if (student.last_name) setLastName(student.last_name);
      if (student.country_code) setCountryCode(student.country_code);
      if (student.city) setCity(student.city);
    }
  }, [student]);

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

  const handleNext = () => {
    setErrorMsg(null);
    if (stepIdx === 0) {
      if (!firstName.trim()) {
        setErrorMsg("Please enter your first name.");
        return;
      }
      if (!countryCode) {
        setErrorMsg("Please select your country.");
        return;
      }
    } else if (stepIdx === 1) {
      if (academicStatus === "COLLEGE" && !institutionName.trim()) {
        setErrorMsg("Please select or enter your institution name.");
        return;
      }
    }
    setStepIdx((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStepIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleCompleteOnboarding = async () => {
    if (!student?.id) return;
    if (!consentGranted) {
      setErrorMsg("Please agree to the SPAR personalized guidance consent to continue.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Update Identity
      await careerai.updateIdentity(student.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        country_code: countryCode,
        city: city.trim() || undefined,
      });

      // 2. Update Academics
      await careerai.updateAcademics(student.id, {
        institution: {
          name: institutionName.trim() || "National University",
          country_code: countryCode,
          institution_type: academicStatus === "SCHOOL" ? "SCHOOL" : "COLLEGE",
          city: city.trim() || undefined,
        },
        program: {
          degree_type: degreeType,
          department: department,
          program_name: `${degreeType} in ${department}`,
          duration_years: 4,
        },
        current_year: currentYear,
        current_semester: (currentYear * 2) - 1,
        expected_graduation_year: graduationYear,
        grading_system: "CGPA_10",
        academic_status: "ACTIVE",
      });

      // 3. Grant Consent
      await careerai.recordConsent(student.id, {
        consent_type: "CAREER_PROFILE_PROCESSING",
        consent_version: CONSENT_VERSION,
      });

      // 4. Reload user & navigate to discovery
      await reloadUser();
      void navigate({ to: "/app/discover" });
    } catch (err: any) {
      console.error("Onboarding submission error:", err);
      setErrorMsg(err?.message || "Failed to complete setup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = refData?.countries && refData.countries.length > 0 ? refData.countries : DEFAULT_COUNTRIES;
  const degrees = refData?.degrees && refData.degrees.length > 0 ? refData.degrees : DEFAULT_DEGREES;
  const departments = refData?.departments && refData.departments.length > 0 ? refData.departments : DEFAULT_DEPARTMENTS;
  const careerGoals = refData?.career_goals && refData.career_goals.length > 0 ? refData.career_goals : DEFAULT_GOALS;
  const clarityLevels = refData?.career_clarity_levels && refData.career_clarity_levels.length > 0 ? refData.career_clarity_levels : DEFAULT_CLARITY;
  const interestAreas = refData?.interest_areas && refData.interest_areas.length > 0 ? refData.interest_areas : DEFAULT_INTERESTS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Header & Step Indicator */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>Quick 2-Minute Setup</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Welcome to SPAR AI
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {STEPS[stepIdx].subtitle} · Step {stepIdx + 1} of {STEPS.length}
        </p>

        {/* Progress Bar */}
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
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {errorMsg}
          </div>
        )}

        {/* --- STEP 1: ABOUT YOU --- */}
        {stepIdx === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20">
                {firstName ? firstName[0].toUpperCase() : <User className="size-6" />}
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Personal Details</h2>
                <p className="text-xs text-muted-foreground">
                  Prefilled from your account. Verify below.
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
                What describes your current academic status? *
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
                  Institution / College *
                </label>
                {!isCustomInstitution ? (
                  <div className="space-y-2">
                    <select
                      value={institutionName}
                      onChange={(e) => {
                        if (e.target.value === "__OTHER__") {
                          setIsCustomInstitution(true);
                          setInstitutionName("");
                        } else {
                          setInstitutionName(e.target.value);
                        }
                      }}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="">Select your institution…</option>
                      <option value="MIT College of Engineering">MIT College of Engineering</option>
                      <option value="National Institute of Technology">National Institute of Technology (NIT)</option>
                      <option value="Indian Institute of Information Technology">IIIT</option>
                      <option value="Delhi Technological University">DTU</option>
                      <option value="Vellore Institute of Technology">VIT</option>
                      <option value="SRM Institute of Science and Technology">SRM Institute</option>
                      <option value="PES University">PES University</option>
                      <option value="Anna University">Anna University</option>
                      <option value="__OTHER__">+ Can't find my institution (Type manually)</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="Enter your college / university name"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomInstitution(false)}
                    >
                      List
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

        {/* --- STEP 3: GOALS & INTERESTS --- */}
        {stepIdx === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl border border-primary/20">
                <Compass className="size-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Goals & Interests</h2>
                <p className="text-xs text-muted-foreground">
                  Personalizes AI career suggestions and milestone pathways.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Primary Career Goal (Select up to 3) *
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {careerGoals.map((g) => {
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
                How clear is your target career direction? *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {clarityLevels.map((lvl) => {
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
                      <div className="text-xs font-semibold">{lvl.label}</div>
                      {lvl.description && (
                        <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {lvl.description}
                        </div>
                      )}
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
                {interestAreas.map((ia) => {
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
                By clicking Complete Setup, you consent to SPAR processing your academic profile, skill assessments, and project artifacts to provide personalized career recommendations and readiness scoring.
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
              disabled={isSubmitting}
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
              className="gap-1.5"
            >
              Next Step
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleCompleteOnboarding}
              disabled={isSubmitting || !consentGranted}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <InlineSpinner className="size-4" />
                  Completing Setup…
                </>
              ) : (
                <>
                  Complete Setup & Discover Careers
                  <Sparkles className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
