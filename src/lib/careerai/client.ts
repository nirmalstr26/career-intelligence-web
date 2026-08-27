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
} as const;
