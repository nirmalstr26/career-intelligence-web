/** Typed CareerAI backend calls, grouped by domain. All go through {@link api}. */

import { api } from "@/lib/api";
import type {
  AcademicProfile,
  AcademicsUpdate,
  AgentReply,
  AssessmentSummary,
  AttemptResult,
  CareerClusterExplain,
  CareerExploration,
  CareerIntelligence,
  CareerLandscapeDetail,
  CareerPreferences,
  CareerPreferencesUpdate,
  ConsentInput,
  EvidenceItem,
  FullProfile,
  IdentityUpdate,
  InterestArea,
  InterestsUpdate,
  ReadinessDetail,
  RefreshResult,
  SaveResponseResult,
  SkillState,
  StartedAttempt,
  StudentIdentity,
  StudentInterest,
  CurriculumData,
  CurriculumModule,
  StartModuleResult,
  CompleteModuleResult,
  RecordAssessmentResult,
} from "@/lib/careerai/types";

export const careerai = {
  // Profile + onboarding
  getProfile: (studentId: string) => api.get<FullProfile>(`/students/${studentId}/profile`),
  updateIdentity: (studentId: string, body: IdentityUpdate) =>
    api.patch<StudentIdentity>(`/students/${studentId}`, { body }),
  updateAcademics: (studentId: string, body: AcademicsUpdate) =>
    api.put<AcademicProfile>(`/students/${studentId}/academics`, { body }),
  updateCareerPreferences: (studentId: string, body: CareerPreferencesUpdate) =>
    api.put<CareerPreferences>(`/students/${studentId}/career-preferences`, { body }),
  updateInterests: (studentId: string, body: InterestsUpdate) =>
    api.put<StudentInterest[]>(`/students/${studentId}/interests`, { body }),
  updateCareerContext: (studentId: string, content: string) =>
    api.put<{ content: string | null }>(`/students/${studentId}/career-context`, {
      body: { content },
    }),
  recordConsent: (studentId: string, body: ConsentInput) =>
    api.post<unknown>(`/students/${studentId}/consents`, { body }),
  listInterestAreas: () => api.get<InterestArea[]>(`/interest-areas`),

  // Home
  getCareerIntelligence: (studentId: string) =>
    api.get<CareerIntelligence>(`/students/${studentId}/career-intelligence`),
  refreshIntelligence: (studentId: string) =>
    api.post<RefreshResult>(`/students/${studentId}/career-intelligence/refresh`, {
      body: { reason: "MANUAL_REFRESH" },
    }),

  // Diagnostic
  listAssessments: () => api.get<AssessmentSummary[]>(`/assessments`),
  startAttempt: (studentId: string, assessmentId: string) =>
    api.post<StartedAttempt>(`/students/${studentId}/assessments/${assessmentId}/attempts`, {
      body: {},
    }),
  saveResponse: (attemptId: string, questionId: string, selected: string[]) =>
    api.put<SaveResponseResult>(`/assessment-attempts/${attemptId}/responses/${questionId}`, {
      body: { selected },
    }),
  completeAttempt: (attemptId: string) =>
    api.post<AttemptResult>(`/assessment-attempts/${attemptId}/complete`, { body: {} }),

  // Skills & evidence
  getSkills: (studentId: string) => api.get<SkillState[]>(`/students/${studentId}/skills`),
  getSkillEvidence: (studentId: string, skillCode: string) =>
    api.get<EvidenceItem[]>(`/students/${studentId}/skills/${skillCode}/evidence`),

  // Career landscape
  getCareerLandscape: (studentId: string) =>
    api.get<CareerLandscapeDetail[]>(`/students/${studentId}/career-landscape`),
  getCareerClusterDetail: (studentId: string, clusterCode: string) =>
    api.get<CareerClusterExplain>(`/students/${studentId}/career-landscape/${clusterCode}`),

  // Readiness
  getReadiness: (studentId: string) => api.get<ReadinessDetail>(`/students/${studentId}/readiness`),

  // Career exploration
  getCareerExplorations: (studentId: string) =>
    api.get<CareerExploration[]>(`/students/${studentId}/career-explorations`),
  setCareerExploration: (studentId: string, clusterCode: string) =>
    api.post<CareerExploration>(`/students/${studentId}/career-explorations/${clusterCode}`, {
      body: {},
    }),
  makePrimaryCareer: (studentId: string, clusterCode: string) =>
    api.post<CareerExploration>(
      `/students/${studentId}/career-explorations/${clusterCode}/make-primary`,
      { body: {} },
    ),

  // Next best action
  getNextBestAction: (studentId: string) =>
    api.get<CareerIntelligence["next_best_action"]>(`/students/${studentId}/next-best-action`),
  startAction: (studentId: string, actionId: string) =>
    api.post<unknown>(`/students/${studentId}/actions/${actionId}/start`, { body: {} }),
  completeAction: (studentId: string, actionId: string) =>
    api.post<unknown>(`/students/${studentId}/actions/${actionId}/complete`, { body: {} }),

  // Agent
  chat: ({
    student_id,
    message,
    conversation_id,
  }: {
    student_id: string;
    message: string;
    conversation_id?: string;
  }) =>
    api.post<AgentReply>(`/students/${student_id}/career-agent/messages`, {
      body: { message, conversation_id: conversation_id ?? null },
    }),
  sendAgentMessage: (studentId: string, message: string, conversationId?: string) =>
    api.post<AgentReply>(`/students/${studentId}/career-agent/messages`, {
      body: { message, conversation_id: conversationId ?? null },
    }),
  getLatestConversation: (studentId: string) =>
    api.get<ConversationHistoryResponse | null>(`/students/${studentId}/career-agent/conversations/latest`),

  // Curriculum (Domain 18)
  getCurriculum: (studentId: string, careerClusterCode: string) =>
    api.get<CurriculumData>(`/students/${studentId}/curriculum/${careerClusterCode}`),
  getNextModules: (studentId: string, careerClusterCode: string) =>
    api.get<CurriculumModule[]>(`/students/${studentId}/curriculum/${careerClusterCode}/next`),
  getModuleDetail: (studentId: string, moduleCode: string) =>
    api.get<CurriculumModule>(`/students/${studentId}/curriculum/module/${moduleCode}`),
  startModule: (studentId: string, moduleCode: string) =>
    api.post<StartModuleResult>(`/students/${studentId}/curriculum/module/start`, {
      body: { module_code: moduleCode },
    }),
  completeModule: (
    studentId: string,
    body: {
      module_code: string;
      assessment_score?: number;
      time_spent_minutes?: number;
      ai_feedback?: string;
    },
  ) =>
    api.post<CompleteModuleResult>(`/students/${studentId}/curriculum/module/complete`, {
      body,
    }),
  recordModuleAssessment: (
    studentId: string,
    body: { module_code: string; score: number },
  ) =>
    api.post<RecordAssessmentResult>(
      `/students/${studentId}/curriculum/module/assessment`,
      { body },
    ),
  recalculateCurriculumUnlocks: (studentId: string, careerClusterCode: string) =>
    api.post<{ newly_available: CurriculumModule[]; count: number }>(
      `/students/${studentId}/curriculum/${careerClusterCode}/recalculate`,
      { body: {} },
    ),
  getCurriculumAgentContext: (studentId: string, careerClusterCode: string) =>
    api.get<Record<string, unknown>>(
      `/students/${studentId}/curriculum/${careerClusterCode}/agent-context`,
    ),
  // Projects (Domain 19)
  listProjects: (studentId: string, careerClusterCode?: string) =>
    api.get<ProjectSummary[]>(`/students/${studentId}/projects${careerClusterCode ? `?career_cluster_code=${careerClusterCode}` : ""}`),
  getProject: (studentId: string, projectCode: string) =>
    api.get<ProjectDetail>(`/students/${studentId}/projects/${projectCode}`),
  startProject: (studentId: string, projectCode: string) =>
    api.post<ProjectDetail>(`/students/${studentId}/projects/${projectCode}/start`),
  saveProjectStage: (studentId: string, projectCode: string, stage: string, data: Record<string, any>) =>
    api.put<ProjectDetail>(`/students/${studentId}/projects/${projectCode}/stage`, {
      body: { stage, data },
    }),
  submitProject: (studentId: string, projectCode: string, submissionPayload?: Record<string, any>) =>
    api.post<ProjectSubmission>(`/students/${studentId}/projects/${projectCode}/submit`, {
      body: { submission_payload: submissionPayload },
    }),
  getProjectSubmissions: (studentId: string, projectCode: string) =>
    api.get<ProjectSubmission[]>(`/students/${studentId}/projects/${projectCode}/submissions`),
  // Mock Interviews (Domain 20)
  listInterviews: (studentId: string, careerClusterCode?: string) =>
    api.get<InterviewDefinitionSummary[]>(
      `/students/${studentId}/interviews${careerClusterCode ? `?career_cluster_code=${careerClusterCode}` : ""}`
    ),
  getInterviewDetail: (studentId: string, code: string) =>
    api.get<InterviewDefinitionDetail>(`/students/${studentId}/interviews/${code}`),
  startInterview: (studentId: string, code: string) =>
    api.post<{ session: InterviewSessionDetail; message: string }>(
      `/students/${studentId}/interviews/${code}/start`
    ),
  getInterviewSession: (studentId: string, sessionId: string) =>
    api.get<InterviewSessionDetail>(`/students/${studentId}/interviews/sessions/${sessionId}`),
  submitInterviewAnswer: (
    studentId: string,
    sessionId: string,
    body: { student_answer: string; is_dont_know?: boolean }
  ) =>
    api.post<{ session: InterviewSessionDetail; is_completed: boolean; message: string }>(
      `/students/${studentId}/interviews/sessions/${sessionId}/answer`,
      { body }
    ),
  // Professional Profile & Resume Intelligence (Domain 21)
  getProfessionalProfile: (studentId: string) =>
    api.get<ProfessionalProfileDetail>(`/students/${studentId}/professional-profile`),
  generateProfileSuggestions: (studentId: string) =>
    api.post<ProfessionalProfileDetail>(`/students/${studentId}/professional-profile/generate-suggestions`),
  resolveProfileSuggestion: (
    studentId: string,
    suggestionId: string,
    action: "ACCEPT" | "EDIT" | "REJECT",
    edited_content?: Record<string, any> | null
  ) =>
    api.post<ProfessionalProfileDetail>(
      `/students/${studentId}/professional-profile/suggestions/${suggestionId}/resolve`,
      { body: { action, edited_content } }
    ),
  updateProfileSection: (studentId: string, sectionType: string, content: Record<string, any>) =>
    api.put<ProfessionalProfileDetail>(
      `/students/${studentId}/professional-profile/sections/${sectionType}`,
      { body: { content } }
    ),
  updateLinkedInProfile: (studentId: string, linkedin_headline: string, linkedin_about: string) =>
    api.put<ProfessionalProfileDetail>(
      `/students/${studentId}/professional-profile/linkedin`,
      { body: { linkedin_headline, linkedin_about } }
    ),
  restoreProfileVersion: (studentId: string, versionId: string) =>
    api.post<{ profile: ProfessionalProfileDetail; restored_version_number: number; message: string }>(
      `/students/${studentId}/professional-profile/versions/${versionId}/restore`
    ),
  // Opportunity Matching & Application Tracking (Domain 22)
  getMatchedOpportunities: (studentId: string, careerClusterCode = "DATA_ENGINEER") =>
    api.get<OpportunitySummary[]>(
      `/students/${studentId}/opportunities?career_cluster_code=${careerClusterCode}`
    ),
  getOpportunityFit: (studentId: string, opportunityId: string) =>
    api.get<StudentOpportunityFit>(`/students/${studentId}/opportunities/${opportunityId}/fit`),
  parseJobDescription: (
    studentId: string,
    raw_jd_text: string,
    role_title?: string,
    company_name?: string
  ) =>
    api.post<JobDescriptionParseResult>(`/students/${studentId}/opportunities/parse-jd`, {
      body: { raw_jd_text, role_title, company_name },
    }),
  getJobApplications: (studentId: string) =>
    api.get<JobApplicationItem[]>(`/students/${studentId}/opportunities/applications`),
  createJobApplication: (
    studentId: string,
    body: {
      opportunity_id?: string | null;
      company: string;
      role: string;
      job_url?: string | null;
      status?: string;
      notes?: string | null;
      contact_name?: string | null;
      contact_email?: string | null;
      salary_or_stipend?: string | null;
    }
  ) =>
    api.post<JobApplicationItem>(`/students/${studentId}/opportunities/applications`, {
      body,
    }),
  updateJobApplicationStatus: (
    studentId: string,
    applicationId: string,
    body: {
      status: string;
      notes?: string | null;
      interview_date?: string | null;
      next_action_date?: string | null;
    }
  ) =>
    api.put<JobApplicationItem>(
      `/students/${studentId}/opportunities/applications/${applicationId}/status`,
      { body }
    ),
  getPlacementActivity: (studentId: string) =>
    api.get<PlacementActivitySummary>(`/students/${studentId}/opportunities/placement-activity`),
  // College & Placement Coordinator Pilot (Domain 23)
  getCoordinatorProfile: (coordinatorId: string) =>
    api.get<PlacementCoordinatorProfile>(`/college/coordinators/${coordinatorId}`),
  getInstitutionCohorts: (institutionId: string) =>
    api.get<CollegeCohortSummary[]>(`/college/institutions/${institutionId}/cohorts`),
  getCohortReadinessSummary: (coordinatorId: string, cohortId: string) =>
    api.get<CohortReadinessSummary>(
      `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/summary`
    ),
  getCohortGapAnalysis: (coordinatorId: string, cohortId: string) =>
    api.get<CohortGapAnalysis>(
      `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/gaps`
    ),
  listCohortStudents: (
    coordinatorId: string,
    cohortId: string,
    search?: string,
    readinessTier?: string
  ) => {
    let url = `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/students`;
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (readinessTier) params.append("readiness_tier", readinessTier);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
    return api.get<CohortStudentListItem[]>(url);
  },
  getCoordinatorStudentDetail: (coordinatorId: string, studentId: string) =>
    api.get<CoordinatorStudentDetail>(
      `/college/coordinators/${coordinatorId}/students/${studentId}`
    ),
  listCohortAssignments: (coordinatorId: string, cohortId: string) =>
    api.get<CohortAssignmentItem[]>(
      `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/assignments`
    ),
  createCohortAssignment: (
    coordinatorId: string,
    cohortId: string,
    body: {
      title: string;
      description: string;
      activity_type: string;
      target_reference: string;
      due_date?: string | null;
      is_mandatory?: boolean;
    }
  ) =>
    api.post<CohortAssignmentItem>(
      `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/assignments`,
      { body }
    ),
  listCollegeSessions: (institutionId: string) =>
    api.get<CollegeSessionItem[]>(`/college/institutions/${institutionId}/sessions`),
  createCollegeSession: (
    coordinatorId: string,
    body: {
      cohort_id?: string | null;
      title: string;
      description: string;
      session_type: string;
      scheduled_at: string;
      duration_minutes?: number;
      meeting_link?: string | null;
      capacity?: number;
      related_career_cluster?: string;
    }
  ) =>
    api.post<CollegeSessionItem>(`/college/coordinators/${coordinatorId}/sessions`, {
      body,
    }),
  queryCollegeIntelligence: (coordinatorId: string, cohortId: string, query: string) =>
    api.post<CollegeAgentQueryResult>(
      `/college/coordinators/${coordinatorId}/cohorts/${cohortId}/agent-query`,
      { body: { cohort_id: cohortId, query } }
    ),
  getStudentCollegeContext: (studentId: string) =>
    api.get<StudentCollegeMembership>(`/students/${studentId}/college/context`),
  joinCollegeCohort: (studentId: string, invite_code: string) =>
    api.post<StudentCollegeMembership>(`/students/${studentId}/college/join`, {
      body: { invite_code },
    }),
  // Recruiter Pilot & Candidate Pipeline (Domain 24)
  registerRecruiter: (body: {
    name: string;
    email: string;
    company_name: string;
    job_title?: string;
    company_website?: string | null;
    hiring_location?: string;
  }) => api.post<RecruiterProfile>("/recruiter/register", { body }),
  getRecruiterProfile: (recruiterId: string) =>
    api.get<RecruiterProfile>(`/recruiter/profile/${recruiterId}`),
  listRecruiterOpportunities: (recruiterId: string) =>
    api.get<RecruiterOpportunitySummary[]>(`/recruiter/${recruiterId}/opportunities`),
  createRecruiterOpportunity: (
    recruiterId: string,
    body: {
      title: string;
      opportunity_type?: string;
      work_mode?: string;
      location: string;
      description: string;
      responsibilities?: string[];
      mandatory_skills?: string[];
      preferred_skills?: string[];
      min_proficiency_score?: number;
      graduation_year_min?: number | null;
      graduation_year_max?: number | null;
      stipend_or_salary?: string | null;
      application_deadline?: string | null;
    }
  ) =>
    api.post<RecruiterOpportunitySummary>(`/recruiter/${recruiterId}/opportunities`, { body }),
  listCandidateMatches: (recruiterId: string, opportunityId: string) =>
    api.get<AnonymizedCandidateMatchItem[]>(
      `/recruiter/${recruiterId}/opportunities/${opportunityId}/matches`
    ),
  inviteCandidateToOpportunity: (
    recruiterId: string,
    opportunityId: string,
    studentId: string
  ) =>
    api.post<AnonymizedCandidateMatchItem>(
      `/recruiter/${recruiterId}/opportunities/${opportunityId}/invite`,
      { body: { student_id: studentId } }
    ),
  getConsentedCandidateProfile: (
    recruiterId: string,
    opportunityId: string,
    studentId: string
  ) =>
    api.get<ConsentedCandidateProfile>(
      `/recruiter/${recruiterId}/opportunities/${opportunityId}/candidates/${studentId}/profile`
    ),
  updateCandidatePipelineStage: (
    recruiterId: string,
    shortlistId: string,
    body: {
      new_stage: string;
      notes?: string | null;
      interview_date?: string | null;
    }
  ) =>
    api.put<ConsentedCandidateProfile>(
      `/recruiter/${recruiterId}/shortlists/${shortlistId}/stage`,
      { body }
    ),
  recordRecruiterFeedback: (
    recruiterId: string,
    shortlistId: string,
    body: {
      technical_score: number;
      communication_score: number;
      problem_solving_score: number;
      project_understanding_score: number;
      recommendation: string;
      feedback_notes: string;
    }
  ) =>
    api.post<RecruiterFeedbackResult>(
      `/recruiter/${recruiterId}/shortlists/${shortlistId}/feedback`,
      { body }
    ),
  queryRecruiterIntelligence: (recruiterId: string, opportunityId: string, query: string) =>
    api.post<RecruiterAgentQueryResult>(
      `/recruiter/${recruiterId}/opportunities/${opportunityId}/agent-query`,
      { body: { opportunity_id: opportunityId, query } }
    ),
  listStudentOpportunityInvitations: (studentId: string) =>
    api.get<StudentOpportunityInvitationItem[]>(
      `/students/${studentId}/recruiter-invitations`
    ),
  respondToOpportunityInvitation: (
    studentId: string,
    opportunityId: string,
    interested: boolean
  ) =>
    api.post<StudentOpportunityInvitationItem>(
      `/students/${studentId}/recruiter-invitations/${opportunityId}/respond`,
      { body: { interested } }
    ),
  // Admin Operations, AI Telemetry & Pilot Safety (Domain 25)
  getAdminOverview: () => api.get<AdminOverviewResponse>("/admin/overview"),
  listAdminUsers: () => api.get<UserManagementItem[]>("/admin/users"),
  approveRecruiterStatus: (recruiterId: string, status: string, notes?: string | null) =>
    api.put<{ status: string; message: string }>(`/admin/recruiters/${recruiterId}/status`, {
      body: { status, notes },
    }),
  getAIOperations: () => api.get<AIOperationsResponse>("/admin/ai-operations"),
  getSystemHealth: () => api.get<SystemHealthResponse>("/admin/health"),
  listPilotFeedbacks: () => api.get<PilotFeedbackItem[]>("/admin/feedback"),
  submitPilotFeedback: (body: {
    category?: string;
    rating: number;
    comment?: string | null;
    milestone_context?: string | null;
  }) => api.post<PilotFeedbackItem>("/admin/feedback", { body }),
  updateFeedbackStatus: (feedbackId: string, status: string) =>
    api.put<{ status: string; message: string }>(`/admin/feedback/${feedbackId}/status`, {
      body: { status },
    }),
  listFeatureFlags: () => api.get<FeatureFlagItem[]>("/admin/feature-flags"),
  toggleFeatureFlag: (flag_name: string, is_enabled: boolean) =>
    api.post<{ status: string; message: string }>("/admin/feature-flags/toggle", {
      body: { flag_name, is_enabled },
    }),
  runDataIntegrityCheck: () => api.get<DataIntegrityReportResponse>("/admin/integrity-check"),
  listSystemAuditLogs: () => api.get<SystemAuditLogItem[]>("/admin/audit-logs"),
};

// --- Step 16: Career Discovery & Onboarding Reference API Methods ----------

export async function getOnboardingReference(): Promise<OnboardingReferenceData> {
  return fetchJson<OnboardingReferenceData>("/reference/onboarding");
}

export async function startCareerDiscovery(resetExisting = false): Promise<DiscoverySession> {
  return fetchJson<DiscoverySession>("/career-discovery/sessions", {
    method: "POST",
    body: JSON.stringify({ reset_existing: resetExisting }),
  });
}

export async function getCurrentCareerDiscovery(): Promise<DiscoverySession | null> {
  return fetchJson<DiscoverySession | null>("/career-discovery/current");
}

export async function respondToCareerDiscovery(
  sessionId: string,
  choiceCodes: string[] = [],
  message?: string
): Promise<DiscoverySession> {
  return fetchJson<DiscoverySession>(`/career-discovery/${sessionId}/respond`, {
    method: "POST",
    body: JSON.stringify({ choice_codes: choiceCodes, message }),
  });
}

export async function compareCareerPaths(
  sessionId: string,
  careerA: string,
  careerB: string
): Promise<CareerComparisonResponse> {
  return fetchJson<CareerComparisonResponse>(
    `/career-discovery/${sessionId}/compare?career_a=${encodeURIComponent(careerA)}&career_b=${encodeURIComponent(careerB)}`,
    { method: "POST" }
  );
}

export async function selectDiscoveryCareer(
  sessionId: string,
  careerCode: string
): Promise<DiscoverySession> {
  return fetchJson<DiscoverySession>(`/career-discovery/${sessionId}/select`, {
    method: "POST",
    body: JSON.stringify({ career_code: careerCode }),
  });
}
