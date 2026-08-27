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

// ---------------------------------------------------------------------------
// Domain 22 — Opportunities, Matching & Application Tracking
// ---------------------------------------------------------------------------

export interface SkillMatchDetail {
  skill_code: string;
  skill_name: string;
  is_mandatory: boolean;
  status: "VERIFIED" | "LEARNING" | "MISSING";
  student_score?: number | null;
  min_required_score: number;
  provenance_sources: string[];
}

export interface OpportunitySkillRequirement {
  id: string;
  skill_code: string;
  skill_name: string;
  is_mandatory: boolean;
  min_proficiency_score: number;
  weight: number;
}

export interface OpportunitySummary {
  id: string;
  career_cluster_code: string;
  title: string;
  company: string;
  location: string;
  work_mode: "REMOTE" | "HYBRID" | "ONSITE";
  opportunity_type: "INTERNSHIP" | "FULL_TIME" | "GRADUATE_PROGRAM";
  stipend_or_salary?: string | null;
  application_deadline?: string | null;
  graduation_year_min?: number | null;
  graduation_year_max?: number | null;
  match_score: number;
  match_category: "READY_TO_APPLY" | "APPLY_WHILE_IMPROVING" | "PREPARE_FIRST";
  verified_strengths_count: number;
  learning_skills_count: number;
  missing_skills_count: number;
  key_skills: string[];
}

export interface OpportunityDetail {
  id: string;
  career_cluster_code: string;
  title: string;
  company: string;
  location: string;
  work_mode: string;
  opportunity_type: string;
  description: string;
  responsibilities: string[];
  stipend_or_salary?: string | null;
  application_deadline?: string | null;
  graduation_year_min?: number | null;
  graduation_year_max?: number | null;
  min_cgpa?: number | null;
  source_url?: string | null;
  skill_requirements: OpportunitySkillRequirement[];
}

export interface StudentOpportunityFit {
  opportunity: OpportunityDetail;
  match_score: number;
  match_category: "READY_TO_APPLY" | "APPLY_WHILE_IMPROVING" | "PREPARE_FIRST";
  fit_explanation: string;
  risk_factors: string;
  verified_strengths: SkillMatchDetail[];
  learning_skills: SkillMatchDetail[];
  missing_skills: SkillMatchDetail[];
  suggested_resume_tailoring: string[];
  has_existing_application: boolean;
  existing_application_id?: string | null;
  existing_application_status?: string | null;
}

export interface ParsedJDSkillItem {
  skill_code: string;
  skill_name: string;
  is_mandatory: boolean;
  status: "VERIFIED" | "LEARNING" | "MISSING";
  student_score?: number | null;
}

export interface JobDescriptionParseResult {
  extracted_title: string;
  extracted_company: string;
  extracted_experience: string;
  extracted_responsibilities: string[];
  extracted_skills: ParsedJDSkillItem[];
  match_score: number;
  match_category: "READY_TO_APPLY" | "APPLY_WHILE_IMPROVING" | "PREPARE_FIRST";
  fit_explanation: string;
  risk_factors: string;
  suggested_resume_tailoring: string[];
}

export interface ApplicationStatusHistoryItem {
  id: string;
  from_status?: string | null;
  to_status: string;
  notes?: string | null;
  changed_at: string;
}

export interface InterviewPrepPlan {
  focus_modules_to_review: Array<{ code: string; title: string }>;
  project_questions_to_prepare: string[];
  technical_drill_areas: string[];
  recommended_mock_interview_code: string;
  coach_briefing: string;
}

export interface JobApplicationItem {
  id: string;
  student_id: string;
  opportunity_id?: string | null;
  company: string;
  role: string;
  job_url?: string | null;
  status: "SAVED" | "PREPARING" | "APPLIED" | "ONLINE_ASSESSMENT" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";
  applied_at?: string | null;
  interview_date?: string | null;
  next_action_date?: string | null;
  notes?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  salary_or_stipend?: string | null;
  interview_prep_plan?: InterviewPrepPlan | null;
  status_history: ApplicationStatusHistoryItem[];
  created_at: string;
}

export interface PlacementActivitySummary {
  opportunities_reviewed: number;
  applications_submitted: number;
  active_interviews: number;
  offers_received: number;
  recent_applications: JobApplicationItem[];
  active_interview_prep?: InterviewPrepPlan | null;
}

// ---------------------------------------------------------------------------
// Domain 23 — College & Placement Coordinator Pilot
// ---------------------------------------------------------------------------

export interface PlacementCoordinatorProfile {
  id: string;
  institution_id: string;
  name: string;
  email: string;
  designation: string;
  department?: string | null;
  institution_name: string;
}

export interface CollegeCohortSummary {
  id: string;
  institution_id: string;
  name: string;
  department: string;
  graduation_year: number;
  academic_year: string;
  invite_code: string;
  total_students: number;
  active_students: number;
}

export interface CohortReadinessSummary {
  cohort_id: string;
  cohort_name: string;
  department: string;
  graduation_year: number;
  total_students: number;
  active_students: number;
  overall_readiness_score: number;
  dimension_scores: {
    technical_foundation: number;
    career_specific_skills: number;
    projects: number;
    communication: number;
    interview_readiness: number;
    profile_readiness: number;
  };
  readiness_distribution: {
    placement_ready: number;
    nearly_ready: number;
    developing: number;
    needs_attention: number;
  };
  placement_pipeline_summary: {
    applying_students: number;
    total_applications: number;
    online_assessments: number;
    interviews: number;
    offers: number;
  };
}

export interface PriorityGapItem {
  domain_or_skill: string;
  students_needing_improvement: number;
  percentage_of_cohort: number;
  impact_explanation: string;
  suggested_action_type: string;
  suggested_action_reference: string;
}

export interface CohortGapAnalysis {
  cohort_id: string;
  cohort_name: string;
  total_students_evaluated: number;
  priority_gaps: PriorityGapItem[];
}

export interface CohortStudentListItem {
  student_id: string;
  first_name: string;
  last_name: string;
  email_masked: string;
  department: string;
  graduation_year: number;
  career_path: string;
  career_readiness_score: number;
  curriculum_progress_pct: number;
  project_status: string;
  project_score?: number | null;
  mock_interview_score?: number | null;
  profile_readiness_score: number;
  placement_status: string;
  technical_score: number;
  communication_score: number;
}

export interface CoordinatorStudentDetail {
  student_id: string;
  name: string;
  department: string;
  graduation_year: number;
  career_goal: string;
  career_readiness_score: number;
  verified_strengths: string[];
  current_gaps: string[];
  modules_completed_text: string;
  project_name: string;
  project_score?: number | null;
  project_status: string;
  mock_interview_score?: number | null;
  profile_readiness_score: number;
  total_applications: number;
  active_interviews: number;
  recommended_support: string;
}

export interface CohortAssignmentItem {
  id: string;
  cohort_id: string;
  title: string;
  description: string;
  activity_type: string;
  target_reference: string;
  due_date?: string | null;
  is_mandatory: boolean;
  assigned_count: number;
  started_count: number;
  completed_count: number;
  overdue_count: number;
  average_score?: number | null;
  readiness_before_avg?: number | null;
  readiness_after_avg?: number | null;
  created_at: string;
}

export interface StudentAssignmentStatusItem {
  assignment_id: string;
  title: string;
  activity_type: string;
  target_reference: string;
  due_date?: string | null;
  is_mandatory: boolean;
  status: string;
  score_achieved?: number | null;
  readiness_before?: number | null;
  readiness_after?: number | null;
  college_name: string;
  cohort_name: string;
}

export interface CollegeSessionItem {
  id: string;
  institution_id: string;
  cohort_id?: string | null;
  cohort_name?: string | null;
  title: string;
  description: string;
  session_type: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string | null;
  capacity: number;
  related_career_cluster: string;
  registered_count: number;
  is_registered: boolean;
}

export interface StudentCollegeMembership {
  is_member: boolean;
  college_name?: string | null;
  cohort_name?: string | null;
  department?: string | null;
  graduation_year?: number | null;
  active_assignments: StudentAssignmentStatusItem[];
  upcoming_sessions: CollegeSessionItem[];
}

export interface CollegeAgentQueryResult {
  query: string;
  answer: string;
  data_snapshot: Record<string, any>;
}

// ---------------------------------------------------------------------------
// Domain 24 — Recruiter Pilot & Candidate Pipeline
// ---------------------------------------------------------------------------

export interface RecruiterCompany {
  id: string;
  name: string;
  website?: string | null;
  location: string;
  industry?: string | null;
  verified: boolean;
}

export interface RecruiterProfile {
  id: string;
  company_id: string;
  company_name: string;
  name: string;
  email: string;
  job_title: string;
  status: string;
  role: string;
  hiring_location?: string | null;
}

export interface RecruiterOpportunitySummary {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  opportunity_type: string;
  work_mode: string;
  location: string;
  mandatory_skills: string[];
  preferred_skills: string[];
  stipend_or_salary?: string | null;
  application_deadline?: string | null;
  total_matches_count: number;
  invited_count: number;
  interested_count: number;
  shortlisted_count: number;
  interview_count: number;
  offer_count: number;
  is_active: boolean;
  created_at: string;
}

export interface AnonymizedCandidateMatchItem {
  match_id: string;
  student_id: string;
  opportunity_id: string;
  anonymized_alias: string;
  graduation_year: number;
  career_cluster: string;
  match_score: number;
  verified_skills_match: number;
  project_evidence_score?: number | null;
  interview_score?: number | null;
  profile_score?: number | null;
  fit_explanation: string;
  risk_factors: string;
  verified_strengths: string[];
  missing_requirements: string[];
  invitation_status?: string | null;
  pipeline_stage?: string | null;
  has_consented: boolean;
}

export interface VerifiedVsDeclaredSkillItem {
  skill_name: string;
  category: "VERIFIED" | "DECLARED";
  score?: number | null;
  provenance: string;
}

export interface ConsentedCandidateProfile {
  student_id: string;
  opportunity_id: string;
  name: string;
  email: string;
  college_name: string;
  department: string;
  graduation_year: number;
  career_goal: string;
  match_score: number;
  fit_explanation: string;
  risk_factors: string;
  skills_breakdown: VerifiedVsDeclaredSkillItem[];
  project_title: string;
  project_score?: number | null;
  project_rubric_summary: string;
  mock_interview_score?: number | null;
  mock_interview_summary: string;
  profile_readiness_score: number;
  resume_summary: string;
  pipeline_stage: string;
  consent_granted_at: string;
}

export interface StudentOpportunityInvitationItem {
  invitation_id: string;
  opportunity_id: string;
  role_title: string;
  company_name: string;
  company_location: string;
  stipend_or_salary?: string | null;
  work_mode: string;
  match_score: number;
  fit_explanation: string;
  mandatory_skills: string[];
  status: string;
  invitation_sent_at: string;
}

export interface RecruiterFeedbackResult {
  id: string;
  shortlist_id: string;
  recruiter_name: string;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  project_understanding_score: number;
  recommendation: string;
  feedback_notes: string;
  created_at: string;
}

export interface RecruiterAgentQueryResult {
  query: string;
  answer: string;
  data_snapshot: Record<string, any>;
}

// ---------------------------------------------------------------------------
// Domain 25 — Admin Operations, AI Telemetry, Feedback & Pilot Safety
// ---------------------------------------------------------------------------

export interface FunnelStageItem {
  stage_name: string;
  count: number;
  conversion_pct: number;
  drop_off_pct: number;
  description: string;
}

export interface AdminOverviewResponse {
  total_students: number;
  total_colleges: number;
  total_recruiters: number;
  total_opportunities: number;
  diagnostic_completion_pct: number;
  module_completion_pct: number;
  project_completion_pct: number;
  mock_interview_completion_pct: number;
  baseline_readiness_avg: number;
  current_readiness_avg: number;
  readiness_improvement_avg: number;
  total_applications: number;
  interview_stage_count: number;
  offer_count: number;
  ai_requests_count: number;
  ai_success_rate: number;
  ai_avg_latency_sec: number;
  ai_estimated_cost_usd: number;
  pending_recruiters_count: number;
  new_feedbacks_count: number;
  inactive_students_count: number;
  funnel: FunnelStageItem[];
}

export interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "COORDINATOR" | "RECRUITER" | "ADMIN";
  organization: string;
  status: string;
  readiness_or_activity: string;
  last_active_at: string;
  created_at: string;
}

export interface AIInvocationLogItem {
  id: string;
  feature: string;
  provider: string;
  model: string;
  latency_ms: number;
  success: boolean;
  prompt_tokens: number;
  completion_tokens: number;
  estimated_cost_usd: number;
  retry_count: number;
  context_id?: string | null;
  error_category?: string | null;
  created_at: string;
}

export interface AIOperationsResponse {
  total_requests: number;
  success_rate_pct: number;
  average_latency_ms: number;
  total_estimated_cost_usd: number;
  feature_breakdown: Record<string, number>;
  recent_logs: AIInvocationLogItem[];
}

export interface SystemHealthResponse {
  database_status: string;
  neo4j_status: string;
  llm_provider_status: string;
  api_status: string;
  overall_health: string;
  recent_errors: string[];
}

export interface PilotFeedbackItem {
  id: string;
  student_name: string;
  category: string;
  rating: number;
  comment?: string | null;
  milestone_context?: string | null;
  status: string;
  created_at: string;
}

export interface FeatureFlagItem {
  flag_name: string;
  is_enabled: boolean;
  description: string;
}

export interface DataIntegrityIssueItem {
  category: string;
  severity: "WARNING" | "ERROR";
  description: string;
  affected_entity: string;
  recommendation: string;
}

export interface DataIntegrityReportResponse {
  is_clean: boolean;
  total_issues: number;
  issues: DataIntegrityIssueItem[];
  checked_at: string;
}

export interface SystemAuditLogItem {
  id: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: string | null;
  created_at: string;
}
