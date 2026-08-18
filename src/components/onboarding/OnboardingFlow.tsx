import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import {
  SelectField,
  TextAreaField,
  TextField,
  type SelectOption,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api";
import { careerai } from "@/lib/careerai/client";
import type {
  AcademicsUpdate,
  CareerPreferencesUpdate,
  FullProfile,
  GradingSystem,
  IdentityUpdate,
  InterestArea,
  PostGraduationIntent,
} from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

const CONSENT_VERSION = "1.0";

const COUNTRIES: readonly SelectOption[] = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
];

const GRADING_SYSTEMS: readonly SelectOption[] = [
  { value: "PERCENTAGE", label: "Percentage (0\u2013100)" },
  { value: "CGPA_10", label: "CGPA (out of 10)" },
  { value: "CGPA_4", label: "CGPA (out of 4)" },
  { value: "GPA", label: "GPA" },
  { value: "LETTER", label: "Letter grade" },
];

const ACADEMIC_STATUSES: readonly SelectOption[] = [
  { value: "ACTIVE", label: "Currently studying" },
  { value: "GRADUATED", label: "Graduated" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "DROPPED", label: "Dropped out" },
];

const INTENTS: readonly SelectOption[] = [
  { value: "JOB", label: "Get a job" },
  { value: "HIGHER_STUDIES", label: "Higher studies" },
  { value: "JOB_AND_HIGHER_STUDIES", label: "Job and higher studies" },
  { value: "ENTREPRENEURSHIP", label: "Start a venture" },
  { value: "GOVERNMENT_EXAMS", label: "Government exams" },
  { value: "UNSURE", label: "Still deciding" },
];

const CLARITIES: readonly SelectOption[] = [
  { value: "CLEAR", label: "I know what I want" },
  { value: "EXPLORING", label: "I'm exploring options" },
  { value: "UNSURE", label: "I'm unsure" },
];

const INTEREST_LEVELS: ReadonlyArray<{ level: number; label: string }> = [
  { level: 2, label: "Low" },
  { level: 3, label: "Medium" },
  { level: 5, label: "High" },
];

const STEPS = [
  { key: "about", title: "About you", subtitle: "Tell us who you are." },
  { key: "academics", title: "Academics", subtitle: "Your current program." },
  { key: "intent", title: "Career intent", subtitle: "Where you're headed." },
  { key: "interests", title: "Interests", subtitle: "What excites you." },
  { key: "context", title: "Context & consent", subtitle: "A little more, then done." },
] as const;

interface Errors {
  first_name?: string;
  last_name?: string;
  country_code?: string;
  institution_name?: string;
  institution_country?: string;
  degree_type?: string;
  department?: string;
  program_name?: string;
  current_year?: string;
  current_semester?: string;
  expected_graduation_year?: string;
  grading_system?: string;
  post_graduation_intent?: string;
  career_clarity?: string;
  interests?: string;
  content?: string;
  consent?: string;
}

interface AboutState {
  first_name: string;
  last_name: string;
  phone: string;
  country_code: string;
  state: string;
  city: string;
}

interface AcademicsState {
  institution_name: string;
  institution_country: string;
  institution_type: string;
  institution_city: string;
  degree_type: string;
  department: string;
  program_name: string;
  duration_years: string;
  current_year: string;
  current_semester: string;
  expected_graduation_year: string;
  grading_system: string;
  current_grade: string;
  active_backlogs: string;
  academic_status: string;
}

interface IntentState {
  post_graduation_intent: string;
  career_clarity: string;
  job_interest: boolean;
  higher_study_interest: boolean;
  entrepreneurship_interest: boolean;
  preferred_location: string;
}

interface ContextState {
  content: string;
  consent: boolean;
}

const EMPTY_ABOUT: AboutState = {
  first_name: "",
  last_name: "",
  phone: "",
  country_code: "",
  state: "",
  city: "",
};

const EMPTY_ACADEMICS: AcademicsState = {
  institution_name: "",
  institution_country: "",
  institution_type: "",
  institution_city: "",
  degree_type: "",
  department: "",
  program_name: "",
  duration_years: "",
  current_year: "",
  current_semester: "",
  expected_graduation_year: "",
  grading_system: "",
  current_grade: "",
  active_backlogs: "0",
  academic_status: "ACTIVE",
};

const EMPTY_INTENT: IntentState = {
  post_graduation_intent: "",
  career_clarity: "",
  job_interest: false,
  higher_study_interest: false,
  entrepreneurship_interest: false,
  preferred_location: "",
};

function firstIncompleteStep(profile: FullProfile): number {
  if (profile.academic_profile === null) return 0;
  if (profile.career_preferences === null) return 2;
  if (profile.interests.filter((i) => i.source === "SELF_DECLARED").length === 0) return 3;
  if (profile.career_context === null || profile.career_context.trim() === "") return 4;
  return 0;
}

export function OnboardingFlow() {
  const { student, refreshSession } = useAuth();
  const navigate = useNavigate();
  const studentId = student?.id ?? "";

  const profileQuery = useQuery({
    queryKey: ["profile", studentId],
    queryFn: () => careerai.getProfile(studentId),
    enabled: studentId !== "",
  });
  const interestAreasQuery = useQuery({
    queryKey: ["interest-areas"],
    queryFn: () => careerai.listInterestAreas(),
  });

  const [step, setStep] = useState(0);
  const [about, setAbout] = useState<AboutState>(EMPTY_ABOUT);
  const [academics, setAcademics] = useState<AcademicsState>(EMPTY_ACADEMICS);
  const [intent, setIntent] = useState<IntentState>(EMPTY_INTENT);
  const [interests, setInterests] = useState<Record<string, number>>({});
  const [context, setContext] = useState<ContextState>({ content: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const initialized = useRef(false);

  // Hydrate the form once the profile loads (supports resuming onboarding).
  useEffect(() => {
    const profile = profileQuery.data;
    if (profile === undefined || initialized.current) {
      return;
    }
    initialized.current = true;

    setAbout({
      first_name: profile.student.first_name,
      last_name: profile.student.last_name,
      phone: profile.student.phone ?? "",
      country_code: profile.student.country_code ?? "",
      state: profile.student.state ?? "",
      city: profile.student.city ?? "",
    });

    const ap = profile.academic_profile;
    if (ap !== null) {
      setAcademics({
        institution_name: ap.institution.name,
        institution_country: ap.institution.country_code,
        institution_type: ap.institution.institution_type ?? "",
        institution_city: ap.institution.city ?? "",
        degree_type: ap.program.degree_type,
        department: ap.program.department,
        program_name: ap.program.program_name,
        duration_years: ap.program.duration_years?.toString() ?? "",
        current_year: ap.current_year.toString(),
        current_semester: ap.current_semester.toString(),
        expected_graduation_year: ap.expected_graduation_year.toString(),
        grading_system: ap.grading_system,
        current_grade: ap.current_grade?.toString() ?? "",
        active_backlogs: ap.active_backlogs.toString(),
        academic_status: ap.academic_status,
      });
    }

    const cp = profile.career_preferences;
    if (cp !== null) {
      setIntent({
        post_graduation_intent: cp.post_graduation_intent,
        career_clarity: cp.career_clarity,
        job_interest: cp.job_interest,
        higher_study_interest: cp.higher_study_interest,
        entrepreneurship_interest: cp.entrepreneurship_interest,
        preferred_location: cp.preferred_location ?? "",
      });
    }

    const selected: Record<string, number> = {};
    for (const item of profile.interests) {
      if (item.source === "SELF_DECLARED") {
        selected[item.interest_area_code] = item.level_value ?? 3;
      }
    }
    setInterests(selected);
    setContext({ content: profile.career_context ?? "", consent: false });
    setStep(firstIncompleteStep(profile));
  }, [profileQuery.data]);

  const interestAreas: InterestArea[] = interestAreasQuery.data ?? [];
  const progress = useMemo(() => Math.round((step / STEPS.length) * 100), [step]);

  if (studentId === "" || profileQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <InlineSpinner className="mr-2" /> Loading your profile&hellip;
      </div>
    );
  }

  function validateAbout(): boolean {
    const next: Errors = {};
    if (about.first_name.trim() === "") next.first_name = "Please enter your first name.";
    if (about.last_name.trim() === "") next.last_name = "Please enter your last name.";
    if (about.country_code === "") next.country_code = "Please select your country.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateAcademics(): boolean {
    const next: Errors = {};
    if (academics.institution_name.trim() === "") next.institution_name = "Required.";
    if (academics.institution_country === "") next.institution_country = "Required.";
    if (academics.degree_type.trim() === "") next.degree_type = "Required.";
    if (academics.department.trim() === "") next.department = "Required.";
    if (academics.program_name.trim() === "") next.program_name = "Required.";
    const year = Number.parseInt(academics.current_year, 10);
    if (Number.isNaN(year) || year < 1 || year > 10)
      next.current_year = "Enter a year (1\u201310).";
    const sem = Number.parseInt(academics.current_semester, 10);
    if (Number.isNaN(sem) || sem < 1 || sem > 12)
      next.current_semester = "Enter a semester (1\u201312).";
    const grad = Number.parseInt(academics.expected_graduation_year, 10);
    if (Number.isNaN(grad) || grad < 1950 || grad > 2100)
      next.expected_graduation_year = "Enter a valid year.";
    if (academics.grading_system === "") next.grading_system = "Required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateIntent(): boolean {
    const next: Errors = {};
    if (intent.post_graduation_intent === "") next.post_graduation_intent = "Please choose one.";
    if (intent.career_clarity === "") next.career_clarity = "Please choose one.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateInterests(): boolean {
    const next: Errors = {};
    if (Object.keys(interests).length === 0) next.interests = "Pick at least one area.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateContext(): boolean {
    const next: Errors = {};
    if (context.content.trim().length < 10) {
      next.content = "Tell us a little about your goals (at least 10 characters).";
    }
    if (!context.consent) next.consent = "Please accept to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function persistStep(current: number): Promise<void> {
    if (current === 0) {
      const body: IdentityUpdate = {
        first_name: about.first_name.trim(),
        last_name: about.last_name.trim(),
        country_code: about.country_code,
      };
      if (about.phone.trim() !== "") body.phone = about.phone.trim();
      if (about.state.trim() !== "") body.state = about.state.trim();
      if (about.city.trim() !== "") body.city = about.city.trim();
      await careerai.updateIdentity(studentId, body);
    } else if (current === 1) {
      const body: AcademicsUpdate = {
        institution: {
          name: academics.institution_name.trim(),
          country_code: academics.institution_country,
        },
        program: {
          degree_type: academics.degree_type.trim(),
          department: academics.department.trim(),
          program_name: academics.program_name.trim(),
        },
        current_year: Number.parseInt(academics.current_year, 10),
        current_semester: Number.parseInt(academics.current_semester, 10),
        expected_graduation_year: Number.parseInt(academics.expected_graduation_year, 10),
        grading_system: academics.grading_system as GradingSystem,
        academic_status: (academics.academic_status ||
          "ACTIVE") as AcademicsUpdate["academic_status"],
        active_backlogs: Number.parseInt(academics.active_backlogs || "0", 10),
      };
      if (academics.institution_type.trim() !== "" && body.institution) {
        body.institution.institution_type = academics.institution_type.trim();
      }
      if (academics.institution_city.trim() !== "" && body.institution) {
        body.institution.city = academics.institution_city.trim();
      }
      const duration = Number.parseInt(academics.duration_years, 10);
      if (!Number.isNaN(duration) && body.program) body.program.duration_years = duration;
      const grade = Number.parseFloat(academics.current_grade);
      if (academics.grading_system !== "LETTER" && !Number.isNaN(grade)) {
        body.current_grade = grade;
      }
      await careerai.updateAcademics(studentId, body);
    } else if (current === 2) {
      const body: CareerPreferencesUpdate = {
        post_graduation_intent: intent.post_graduation_intent as PostGraduationIntent,
        career_clarity: intent.career_clarity as CareerPreferencesUpdate["career_clarity"],
        job_interest: intent.job_interest,
        higher_study_interest: intent.higher_study_interest,
        entrepreneurship_interest: intent.entrepreneurship_interest,
      };
      if (intent.preferred_location.trim() !== "") {
        body.preferred_location = intent.preferred_location.trim();
      }
      await careerai.updateCareerPreferences(studentId, body);
    } else if (current === 3) {
      await careerai.updateInterests(studentId, {
        interests: Object.entries(interests).map(([code, level]) => ({
          interest_area_code: code,
          interest_level: level,
        })),
      });
    } else if (current === 4) {
      await careerai.updateCareerContext(studentId, context.content.trim());
      for (const consentType of [
        "TERMS_OF_SERVICE",
        "PRIVACY_POLICY",
        "CAREER_PROFILE_PROCESSING",
        "AI_ANALYSIS",
      ] as const) {
        await careerai.recordConsent(studentId, {
          consent_type: consentType,
          consent_version: CONSENT_VERSION,
          granted: true,
        });
      }
    }
  }

  function validateStep(current: number): boolean {
    switch (current) {
      case 0:
        return validateAbout();
      case 1:
        return validateAcademics();
      case 2:
        return validateIntent();
      case 3:
        return validateInterests();
      default:
        return validateContext();
    }
  }

  async function handleNext() {
    setBanner(null);
    if (!validateStep(step)) return;
    setSaving(true);
    try {
      await persistStep(step);
      if (step === STEPS.length - 1) {
        // Keep `onboardingRequired` true (stale) so the completion screen stays
        // rendered; the session is refreshed when the student continues.
        setDone(true);
        return;
      }
      setStep((s) => s + 1);
      setErrors({});
    } catch (cause) {
      setBanner(
        cause instanceof ApiError ? cause.message : "We couldn't save this step. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function finishToDashboard() {
    await refreshSession();
    void navigate({ to: "/app/home" });
  }

  function handleBack() {
    setBanner(null);
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function toggleInterest(code: string) {
    setInterests((prev) => {
      const next = { ...prev };
      if (code in next) {
        delete next[code];
      } else {
        next[code] = 3;
      }
      return next;
    });
  }

  if (done) {
    return <OnboardingComplete onContinue={() => void finishToDashboard()} />;
  }

  const current = STEPS[step] ?? STEPS[0];

  return (
    <div className="mx-auto grid w-full max-w-[980px] gap-8 px-4 py-10 lg:grid-cols-[240px_1fr] lg:px-6">
      <aside className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Setup</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Build your profile</h1>
        <ol className="mt-6 space-y-1">
          {STEPS.map((item, index) => {
            const state = index < step ? "done" : index === step ? "active" : "todo";
            return (
              <li key={item.key} className="flex items-center gap-3 py-2">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                    state === "done" && "border-primary bg-primary text-primary-foreground",
                    state === "active" && "border-primary text-primary",
                    state === "todo" && "border-border text-muted-foreground",
                  )}
                >
                  {state === "done" ? <Check className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    state === "active" ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </span>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="surface-panel rounded-3xl p-6 sm:p-8">
        <div className="mb-6 lg:hidden">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full gradient-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="font-display text-xl font-bold sm:text-2xl">{current.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>

        {banner !== null ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-foreground"
          >
            {banner}
          </p>
        ) : null}

        <div className="mt-6 space-y-4">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="first_name"
                label="First name"
                required
                value={about.first_name}
                error={errors.first_name}
                onChange={(v) => setAbout((s) => ({ ...s, first_name: v }))}
              />
              <TextField
                id="last_name"
                label="Last name"
                required
                value={about.last_name}
                error={errors.last_name}
                onChange={(v) => setAbout((s) => ({ ...s, last_name: v }))}
              />
              <SelectField
                id="country_code"
                label="Country"
                required
                placeholder="Select country"
                options={COUNTRIES}
                value={about.country_code}
                error={errors.country_code}
                onChange={(v) => setAbout((s) => ({ ...s, country_code: v }))}
              />
              <TextField
                id="city"
                label="City"
                value={about.city}
                onChange={(v) => setAbout((s) => ({ ...s, city: v }))}
              />
              <TextField
                id="state"
                label="State / region"
                value={about.state}
                onChange={(v) => setAbout((s) => ({ ...s, state: v }))}
              />
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                value={about.phone}
                onChange={(v) => setAbout((s) => ({ ...s, phone: v }))}
              />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="institution_name"
                label="Institution"
                required
                value={academics.institution_name}
                error={errors.institution_name}
                onChange={(v) => setAcademics((s) => ({ ...s, institution_name: v }))}
              />
              <SelectField
                id="institution_country"
                label="Institution country"
                required
                placeholder="Select country"
                options={COUNTRIES}
                value={academics.institution_country}
                error={errors.institution_country}
                onChange={(v) => setAcademics((s) => ({ ...s, institution_country: v }))}
              />
              <TextField
                id="degree_type"
                label="Degree"
                required
                placeholder="e.g. B.Tech"
                value={academics.degree_type}
                error={errors.degree_type}
                onChange={(v) => setAcademics((s) => ({ ...s, degree_type: v }))}
              />
              <TextField
                id="department"
                label="Department"
                required
                placeholder="e.g. CSE"
                value={academics.department}
                error={errors.department}
                onChange={(v) => setAcademics((s) => ({ ...s, department: v }))}
              />
              <TextField
                id="program_name"
                label="Program"
                required
                placeholder="e.g. Computer Science"
                value={academics.program_name}
                error={errors.program_name}
                onChange={(v) => setAcademics((s) => ({ ...s, program_name: v }))}
              />
              <SelectField
                id="academic_status"
                label="Status"
                options={ACADEMIC_STATUSES}
                value={academics.academic_status}
                onChange={(v) => setAcademics((s) => ({ ...s, academic_status: v }))}
              />
              <TextField
                id="current_year"
                label="Current year"
                type="number"
                required
                value={academics.current_year}
                error={errors.current_year}
                onChange={(v) => setAcademics((s) => ({ ...s, current_year: v }))}
              />
              <TextField
                id="current_semester"
                label="Current semester"
                type="number"
                required
                value={academics.current_semester}
                error={errors.current_semester}
                onChange={(v) => setAcademics((s) => ({ ...s, current_semester: v }))}
              />
              <TextField
                id="expected_graduation_year"
                label="Graduation year"
                type="number"
                required
                value={academics.expected_graduation_year}
                error={errors.expected_graduation_year}
                onChange={(v) => setAcademics((s) => ({ ...s, expected_graduation_year: v }))}
              />
              <SelectField
                id="grading_system"
                label="Grading system"
                required
                placeholder="Select"
                options={GRADING_SYSTEMS}
                value={academics.grading_system}
                error={errors.grading_system}
                onChange={(v) => setAcademics((s) => ({ ...s, grading_system: v }))}
              />
              {academics.grading_system !== "LETTER" ? (
                <TextField
                  id="current_grade"
                  label="Current grade"
                  type="number"
                  value={academics.current_grade}
                  onChange={(v) => setAcademics((s) => ({ ...s, current_grade: v }))}
                />
              ) : null}
              <TextField
                id="active_backlogs"
                label="Active backlogs"
                type="number"
                value={academics.active_backlogs}
                onChange={(v) => setAcademics((s) => ({ ...s, active_backlogs: v }))}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="post_graduation_intent"
                  label="After graduation, I want to"
                  required
                  placeholder="Select"
                  options={INTENTS}
                  value={intent.post_graduation_intent}
                  error={errors.post_graduation_intent}
                  onChange={(v) => setIntent((s) => ({ ...s, post_graduation_intent: v }))}
                />
                <SelectField
                  id="career_clarity"
                  label="How clear are you?"
                  required
                  placeholder="Select"
                  options={CLARITIES}
                  value={intent.career_clarity}
                  error={errors.career_clarity}
                  onChange={(v) => setIntent((s) => ({ ...s, career_clarity: v }))}
                />
                <TextField
                  id="preferred_location"
                  label="Preferred location"
                  value={intent.preferred_location}
                  onChange={(v) => setIntent((s) => ({ ...s, preferred_location: v }))}
                />
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">I'm interested in</legend>
                {(
                  [
                    ["job_interest", "Jobs & internships"],
                    ["higher_study_interest", "Higher studies"],
                    ["entrepreneurship_interest", "Entrepreneurship"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-2.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={intent[key]}
                      onChange={(e) => setIntent((s) => ({ ...s, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              {errors.interests ? <p className="text-xs text-coral">{errors.interests}</p> : null}
              {interestAreasQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">
                  <InlineSpinner className="mr-2 inline" /> Loading areas&hellip;
                </p>
              ) : (
                <div className="space-y-2">
                  {interestAreas.map((area) => {
                    const selected = area.code in interests;
                    return (
                      <div
                        key={area.id}
                        className={cn(
                          "rounded-xl border p-3 transition-colors",
                          selected ? "border-primary/60 bg-primary/5" : "border-border",
                        )}
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 size-4 accent-primary"
                            checked={selected}
                            onChange={() => toggleInterest(area.code)}
                          />
                          <span>
                            <span className="text-sm font-medium">{area.name}</span>
                            {area.description !== null ? (
                              <span className="block text-xs text-muted-foreground">
                                {area.description}
                              </span>
                            ) : null}
                          </span>
                        </label>
                        {selected ? (
                          <div className="mt-3 flex gap-2 pl-7">
                            {INTEREST_LEVELS.map((lvl) => (
                              <button
                                key={lvl.level}
                                type="button"
                                onClick={() =>
                                  setInterests((prev) => ({ ...prev, [area.code]: lvl.level }))
                                }
                                className={cn(
                                  "rounded-full border px-3 py-1 text-xs transition-colors",
                                  interests[area.code] === lvl.level
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground",
                                )}
                              >
                                {lvl.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <TextAreaField
                id="career_context"
                label="What are your career goals right now?"
                required
                rows={5}
                maxLength={5000}
                placeholder="e.g. I want to become a data engineer at a product company; I'm strong in Python but want to improve system design."
                value={context.content}
                error={errors.content}
                hint="This helps CareerAI personalize your guidance."
                onChange={(v) => setContext((s) => ({ ...s, content: v }))}
              />
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={context.consent}
                  onChange={(e) => setContext((s) => ({ ...s, consent: e.target.checked }))}
                />
                <span>
                  I agree to CareerAI processing my profile and using AI analysis to generate my
                  career intelligence.
                  {errors.consent ? (
                    <span className="mt-1 block text-xs text-coral">{errors.consent}</span>
                  ) : null}
                </span>
              </label>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || saving}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button variant="hero" onClick={() => void handleNext()} disabled={saving}>
            {saving ? <InlineSpinner /> : null}
            {step === STEPS.length - 1 ? "Finish setup" : "Continue"}
            {!saving ? <ArrowRight /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OnboardingComplete({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="surface-panel w-full max-w-md rounded-3xl p-8 text-center">
        <span
          className="mx-auto grid size-14 place-items-center rounded-2xl"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <PartyPopper className="size-7 text-primary-foreground" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold">You're all set!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your profile is complete. CareerAI has started building your career intelligence.
        </p>
        <Button variant="hero" size="lg" className="mt-6 w-full" onClick={onContinue}>
          Go to my dashboard
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
