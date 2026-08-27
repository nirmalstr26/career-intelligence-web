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

// --- Skills ------------------------------------------------------------------

export interface SkillState {
  skill_code: string;
  skill_name: string;
  score: number | null;
  confidence: number | null;
  verification_level: string;
  evidence_count: number;
  last_updated_at: string | null;
}

export interface EvidenceItem {
  evidence_id: string;
  evidence_type: string;
  score: number | null;
  confidence: number | null;
  observed_at: string | null;
}

// --- Career Landscape -------------------------------------------------------

export interface CareerLandscapeDetail {
  career_cluster_code: string;
  alignment_score: number;
  capability_alignment: number;
  interest_alignment: number;
  evidence_coverage: number;
  confidence: number;
  category: string;
  strengths: string[];
  exploration: string[];
  calculation_version: string;
}

export interface CareerClusterExplain {
  career_cluster_code: string;
  important_skills: { skill_code: string; current_level: string; known: boolean }[];
  unknown_skills: string[];
  interest_signal: number | null;
  strengths: string[];
  explore: string[];
}

// --- Readiness --------------------------------------------------------------

export interface ReadinessDetail {
  placement_readiness: {
    score: number;
    confidence: number;
    evidence_coverage: number;
    ready_skills: string[];
    priority_gaps: { skill_code: string; state: string; priority: string }[];
    needs_validation: string[];
    calculation_version: string;
  } | null;
  career_readiness: {
    career_cluster_code: string;
    score: number;
    confidence: number;
    evidence_coverage: number;
    ready_skills: string[];
    priority_gaps: { skill_code: string; state: string; priority: string }[];
    needs_validation: string[];
    calculation_version: string;
  }[];
}

// --- Career Exploration -----------------------------------------------------

export interface CareerExploration {
  career_cluster_code: string;
  status: string;
  set_at: string;
}

// --- Agent ------------------------------------------------------------------

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RecommendedAction {
  type: "MODULE" | "DIAGNOSTIC" | "PRACTICE" | "CAREER_PATH" | string;
  title: string;
  target?: string;
  reason?: string;
  cta_text?: string;
}

export interface AgentReply {
  conversation_id?: string;
  message: string;
  response_type: string;
  referenced_careers: string[];
  referenced_skills: string[];
  suggested_action: {
    student_action_id?: string;
    action_code: string;
  } | null;
  recommended_action?: RecommendedAction | null;
  tool_calls: Array<{
    name: string;
    arguments: Record<string, string>;
  }>;
}

export interface ConversationHistoryMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "user" | "assistant";
  content: string;
  created_at: string;
  message_metadata?: Record<string, any>;
}

export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: ConversationHistoryMessage[];
}

// --- Intelligence Refresh ---------------------------------------------------

export interface RefreshResult {
  status: string;
  stages_executed: string[];
  duration_ms: number;
  intelligence: CareerIntelligence;
}


// --- Curriculum (Domain 18) ------------------------------------------------

export type ModuleState =
  | "LOCKED"
  | "AVAILABLE"
  | "RECOMMENDED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NEEDS_IMPROVEMENT"
  | "SKIPPED_BY_ASSESSMENT";

export interface KnowledgeQuestion {
  id: string;
  text: string;
  choices: string[];
  correct: string;
}

export interface ModuleContentSection {
  type: "text" | "exercise" | "knowledge_check" | "code" | "callout" | string;
  heading?: string;
  body?: string;
  code?: string;
  language?: string;
  prompt?: string;
  solution?: string;
  questions?: KnowledgeQuestion[];
}

export interface ModuleContent {
  sections?: ModuleContentSection[];
}

export interface CurriculumModule {
  id: string;
  code: string;
  title: string;
  description: string | null;
  learning_objective: string | null;
  why_it_matters: string | null;
  estimated_minutes: number;
  difficulty: string;
  display_order: number;
  requires_assessment: boolean;
  min_pass_score: number | null;
  track_code: string;
  track_name: string;
  phase_code: string;
  phase_name: string;
  state: ModuleState;
  started_at: string | null;
  completed_at: string | null;
  content_progress_pct: number;
  assessment_score: number | null;
  passed_assessment: boolean;
  time_spent_minutes: number;
  ai_feedback: string | null;
  prerequisite_module_codes: string[];
  content: ModuleContent | null;
  skill_codes: string[];
}

export interface CurriculumPhase {
  id: string;
  code: string;
  name: string;
  description: string | null;
  display_order: number;
  modules: CurriculumModule[];
}

export interface CurriculumTrack {
  id: string;
  code: string;
  name: string;
  description: string | null;
  display_order: number;
  phases: CurriculumPhase[];
}

export interface CurriculumData {
  career_cluster_code: string;
  career_cluster_name: string;
  tracks: CurriculumTrack[];
  current_module: CurriculumModule | null;
  next_available: CurriculumModule[];
  completed_count: number;
  total_count: number;
  progress_pct: number;
}

export interface StartModuleResult {
  module: CurriculumModule;
  message: string;
}

export interface CompleteModuleResult {
  module: CurriculumModule;
  newly_unlocked: CurriculumModule[];
  message: string;
}

export interface RecordAssessmentResult {
  module_code: string;
  score: number;
  passed: boolean;
  state: string;
  message: string;
}


// --- Practical Projects (Domain 19) ----------------------------------------

export interface ProjectRubricCriterion {
  id: string;
  name: string;
  max_score: number;
  description: string;
}

export interface ProjectRubricScoreItem {
  criterion_id: string;
  criterion_name: string;
  max_score: number;
  score: number;
  feedback: string;
}

export interface ProjectSummary {
  id: string;
  code: string;
  title: string;
  career_cluster_code: string;
  difficulty: string;
  estimated_hours: number;
  description: string;
  skill_codes: string[];
  min_pass_score: number;
  state: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "NEEDS_IMPROVEMENT" | "COMPLETED";
  current_stage: "understand" | "design" | "build" | "test" | "explain" | "review";
  latest_score?: number | null;
  attempt_count: number;
}

export interface ProjectSubmission {
  id: string;
  attempt_number: number;
  status: "UNDER_REVIEW" | "NEEDS_IMPROVEMENT" | "COMPLETED";
  total_score: number;
  rubric_scores: ProjectRubricScoreItem[];
  strengths: string[];
  gaps: string[];
  required_improvements: string[];
  interview_questions: string[];
  overall_feedback: string;
  submitted_at: string;
}

export interface ProjectDetail {
  id: string;
  code: string;
  title: string;
  career_cluster_code: string;
  difficulty: string;
  estimated_hours: number;
  description: string;
  business_scenario: string;
  requirements: string[];
  input_data_spec: Record<string, any>;
  expected_output_spec: Record<string, any>;
  constraints: string[];
  rubric: ProjectRubricCriterion[];
  skill_codes: string[];
  min_pass_score: number;
  state: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "NEEDS_IMPROVEMENT" | "COMPLETED";
  current_stage: "understand" | "design" | "build" | "test" | "explain" | "review";
  stage_data: Record<string, any>;
  started_at?: string | null;
  completed_at?: string | null;
  latest_score?: number | null;
  attempt_count: number;
  latest_submission?: ProjectSubmission | null;
}

// ---------------------------------------------------------------------------
// Domain 20 — AI Mock Interviews
// ---------------------------------------------------------------------------

export interface InterviewRubricCriterion {
  criterion_id: string;
  criterion_name: string;
  max_score: number;
  description: string;
}

export interface InterviewRubricScoreItem {
  criterion_id: string;
  criterion_name: string;
  max_score: number;
  score: number;
  feedback: string;
}

export interface InterviewImprovementAction {
  id: string;
  title: string;
  reason: string;
  action_type: "COACH" | "PRACTICE" | "MODULE" | "PROJECT";
  cta_text: string;
  cta_link: string;
}

export interface InterviewTurn {
  id: string;
  turn_number: number;
  competency: string;
  question_text: string;
  student_answer?: string | null;
  is_followup: boolean;
  is_dont_know: boolean;
  score?: number | null;
  what_was_good?: string | null;
  what_was_missing?: string | null;
  better_answer_structure?: string | null;
  evaluation_notes?: string | null;
  created_at: string;
  answered_at?: string | null;
}

export interface InterviewDefinitionSummary {
  id: string;
  code: string;
  title: string;
  description: string;
  career_cluster_code: string;
  duration_minutes: number;
  target_question_count: number;
  competencies: string[];
  attempt_count: number;
  latest_score?: number | null;
  latest_readiness_level?: string | null;
  active_session_id?: string | null;
}

export interface InterviewSessionSummary {
  id: string;
  attempt_number: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  current_turn_index: number;
  total_turns: number;
  total_score?: number | null;
  readiness_level?: string | null;
  started_at: string;
  completed_at?: string | null;
}

export interface InterviewSessionDetail {
  id: string;
  interview_definition_id: string;
  interview_code: string;
  interview_title: string;
  career_cluster_code: string;
  attempt_number: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  current_turn_index: number;
  total_turns: number;
  total_score?: number | null;
  readiness_level?: string | null;
  rubric_scores: InterviewRubricScoreItem[];
  strongest_areas: string[];
  needs_improvement: string[];
  improvement_actions: InterviewImprovementAction[];
  overall_feedback?: string | null;
  started_at: string;
  completed_at?: string | null;
  turns: InterviewTurn[];
  current_turn?: InterviewTurn | null;
}

export interface InterviewDefinitionDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  career_cluster_code: string;
  duration_minutes: number;
  target_question_count: number;
  competencies: string[];
  rubric: InterviewRubricCriterion[];
  past_attempts: InterviewSessionSummary[];
  active_session?: InterviewSessionDetail | null;
}

// ---------------------------------------------------------------------------
// Domain 21 — Professional Profile, Resume & LinkedIn Intelligence
// ---------------------------------------------------------------------------

export interface VerifiedSkillItem {
  skill_code: string;
  skill_name: string;
  score: number;
  confidence: number;
  evidence_count: number;
  provenance_sources: string[];
}

export interface LearningSkillItem {
  skill_code: string;
  skill_name: string;
  current_phase: string;
  status: string;
}

export interface SkillCategoryBreakdown {
  verified_skills: VerifiedSkillItem[];
  learning_skills: LearningSkillItem[];
  self_declared_skills: string[];
}

export interface ResumeSuggestion {
  id: string;
  section_type: "SUMMARY" | "PROJECTS" | "SKILLS" | "LINKEDIN_HEADLINE" | "LINKEDIN_ABOUT" | "GITHUB_README";
  state: "PENDING" | "ACCEPTED" | "EDITED" | "REJECTED";
  suggested_content: Record<string, any>;
  edited_content?: Record<string, any> | null;
  source_evidence_type?: string | null;
  source_reference?: string | null;
  source_score?: number | null;
  provenance_label?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

export interface ResumeSectionItem {
  id: string;
  section_type: "SUMMARY" | "EDUCATION" | "SKILLS" | "PROJECTS" | "EXPERIENCE" | "CERTIFICATIONS" | "ACHIEVEMENTS";
  title: string;
  content: Record<string, any>;
  display_order: number;
}

export interface ResumeVersionSummary {
  id: string;
  version_number: number;
  label: string;
  created_by_reason?: string | null;
  created_at: string;
}

export interface GitHubPortfolioItem {
  project_code: string;
  title: string;
  short_description: string;
  technologies: string[];
  skills_demonstrated: string[];
  score: number;
  verification_status: string;
  readme_suggestions: string[];
  repo_url?: string | null;
}

export interface ProfileReadinessDimension {
  dimension_id: string;
  dimension_name: string;
  score: number;
  max_score: number;
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  details: string;
}

export interface ProfileReadiness {
  overall_score: number;
  readiness_level: "NEEDS_FOUNDATION" | "DEVELOPING" | "INTERNSHIP_READY" | "PLACEMENT_READY";
  dimensions: ProfileReadinessDimension[];
  missing_items: string[];
  next_improvement_steps: string[];
}

export interface ProfessionalProfileDetail {
  id: string;
  student_id: string;
  headline?: string | null;
  summary?: string | null;
  linkedin_headline?: string | null;
  linkedin_about?: string | null;
  current_version_number: number;
  profile_readiness: ProfileReadiness;
  skills_breakdown: SkillCategoryBreakdown;
  github_portfolio: GitHubPortfolioItem[];
  sections: ResumeSectionItem[];
  pending_suggestions: ResumeSuggestion[];
  all_suggestions: ResumeSuggestion[];
  version_history: ResumeVersionSummary[];
}
