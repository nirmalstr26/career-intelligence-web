/** TypeScript contracts mirroring the CareerAI FastAPI backend (`/api/v1`). */

// --- Profile -----------------------------------------------------------------

export interface StudentIdentity {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  country_code: string | null;
  state: string | null;
  city: string | null;
  profile_status: string;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  institution_type: string | null;
  city: string | null;
  state: string | null;
  country_code: string;
  affiliated_university: string | null;
}

export interface Program {
  id: string;
  degree_type: string;
  department: string;
  program_name: string;
  duration_years: number | null;
}

export type GradingSystem = "PERCENTAGE" | "CGPA_10" | "CGPA_4" | "GPA" | "LETTER";
export type AcademicStatus = "ACTIVE" | "GRADUATED" | "DROPPED" | "ON_LEAVE";

export interface AcademicProfile {
  id: string;
  institution: Institution;
  program: Program;
  current_year: number;
  current_semester: number;
  expected_graduation_year: number;
  grading_system: string;
  current_grade: number | null;
  active_backlogs: number;
  academic_status: string;
}

export type PostGraduationIntent =
  | "JOB"
  | "HIGHER_STUDIES"
  | "JOB_AND_HIGHER_STUDIES"
  | "ENTREPRENEURSHIP"
  | "GOVERNMENT_EXAMS"
  | "UNSURE";
export type CareerClarity = "CLEAR" | "EXPLORING" | "UNSURE";

export interface CareerPreferences {
  id: string;
  post_graduation_intent: string;
  career_clarity: string;
  job_interest: boolean;
  higher_study_interest: boolean;
  entrepreneurship_interest: boolean;
  preferred_location: string | null;
  career_notes: string | null;
}

export interface StudentInterest {
  interest_area_code: string;
  interest_area_name: string;
  interest_level: string;
  level_value: number | null;
  source: string;
}

export interface FullProfile {
  student: StudentIdentity;
  academic_profile: AcademicProfile | null;
  career_preferences: CareerPreferences | null;
  interests: StudentInterest[];
  career_context: string | null;
  profile_completion: number;
}

export interface InterestArea {
  id: string;
  code: string;
  name: string;
  description: string | null;
  display_order: number;
}

// --- Onboarding request bodies ----------------------------------------------

export interface IdentityUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  country_code?: string;
  state?: string;
  city?: string;
}

export interface InstitutionInput {
  name: string;
  country_code: string;
  institution_type?: string;
  city?: string;
  state?: string;
  affiliated_university?: string;
}

export interface ProgramInput {
  degree_type: string;
  department: string;
  program_name: string;
  duration_years?: number;
}

export interface AcademicsUpdate {
  institution?: InstitutionInput;
  program?: ProgramInput;
  current_year: number;
  current_semester: number;
  expected_graduation_year: number;
  grading_system: GradingSystem;
  current_grade?: number;
  active_backlogs?: number;
  academic_status: AcademicStatus;
}

export interface CareerPreferencesUpdate {
  post_graduation_intent: PostGraduationIntent;
  career_clarity: CareerClarity;
  job_interest: boolean;
  higher_study_interest: boolean;
  entrepreneurship_interest: boolean;
  preferred_location?: string;
  career_notes?: string;
}

export interface InterestSelectionInput {
  interest_area_code: string;
  interest_level: number;
}

export interface InterestsUpdate {
  interests: InterestSelectionInput[];
}

export type ConsentType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "CAREER_PROFILE_PROCESSING"
  | "AI_ANALYSIS"
  | "GITHUB_ACCESS"
  | "COLLEGE_DATA_SHARING"
  | "RECRUITER_DATA_SHARING"
  | "VOICE_ANALYSIS";

export interface ConsentInput {
  consent_type: ConsentType;
  consent_version: string;
  granted: boolean;
}

// --- Career Intelligence (home) ---------------------------------------------

export interface CIStudent {
  student_id: string;
  first_name: string;
  current_year: number | null;
  department: string | null;
  career_clarity: string | null;
  profile_completion: number;
}

export interface CareerDirection {
  primary_career: string | null;
  exploring: string[];
}

export interface CareerLandscapeItem {
  career_cluster_code: string;
  alignment_score: number;
  confidence: number;
  calculation_version: string;
}

export interface PlacementReadiness {
  score: number;
  confidence: number;
  calculation_version: string;
}

export interface PrimaryCareerReadiness {
  career_cluster_code: string;
  score: number;
  confidence: number;
  calculation_version: string;
}

export interface StrengthItem {
  skill_code: string;
  score: number;
  verification_level: string;
}

export interface GapItem {
  skill_code: string;
  state: string;
  priority: string;
}

export interface NeedsValidationItem {
  skill_code: string;
  state: string;
}

export interface NextBestAction {
  student_action_id: string | null;
  action_code: string;
  action_type: string | null;
  title: string | null;
  estimated_minutes: number | null;
  status: string | null;
  priority_score: number | null;
  reason_code: string | null;
  rationale: string | null;
}

export interface IntelligenceMetadata {
  skill_state_version: string;
  career_alignment_version: string;
  career_readiness_version: string;
  placement_readiness_version: string;
  next_best_action_version: string;
  last_updated_at: string | null;
  refresh_status: string;
  last_intelligence_refresh_at: string | null;
}

export interface CareerGraphSummary {
  projection_status: string;
  projection_version: string | null;
  primary_career: string | null;
  exploring_careers: string[];
  strong_skill_connections: string[];
  evidence_connection_count: number;
  next_action_skill_connections: string[];
}

export interface CareerIntelligence {
  student: CIStudent;
  career_direction: CareerDirection;
  career_landscape: CareerLandscapeItem[];
  placement_readiness: PlacementReadiness | null;
  primary_career_readiness: PrimaryCareerReadiness | null;
  strengths: StrengthItem[];
  priority_gaps: GapItem[];
  needs_validation: NeedsValidationItem[];
  next_best_action: NextBestAction | null;
  intelligence_metadata: IntelligenceMetadata;
  career_graph_summary: CareerGraphSummary;
}

// --- Assessments / diagnostic ------------------------------------------------

export interface AssessmentSummary {
  id: string;
  code: string;
  name: string;
  assessment_type: string;
  version: string;
  status: string;
  estimated_minutes: number | null;
}

export interface AttemptQuestionOption {
  key: string;
  text: string;
}

export interface AttemptQuestion {
  id: string;
  display_order: number;
  skill_code: string | null;
  question_type: string;
  question_text: string;
  difficulty: string;
  max_score: number;
  options: AttemptQuestionOption[];
}

export interface StartedAttempt {
  attempt_id: string;
  status: string;
  assessment: AssessmentSummary;
  questions: AttemptQuestion[];
}

export interface SaveResponseResult {
  attempt_id: string;
  question_id: string;
  selected: string[];
  saved: boolean;
  answered_count: number;
  total_questions: number;
}

export interface SkillResult {
  skill_code: string;
  score: number;
  questions_answered: number;
  confidence: number;
}

export interface AttemptResult {
  attempt_id: string;
  status: string;
  overall_score: number;
  scoring_version: string;
  skill_results: SkillResult[];
  completed_at: string | null;
  evidence_id: string | null;
}
