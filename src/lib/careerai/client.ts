/** Typed CareerAI backend calls, grouped by domain. All go through {@link api}. */

import { api } from "@/lib/api";
import type {
  AcademicProfile,
  AcademicsUpdate,
  AssessmentSummary,
  AttemptResult,
  CareerIntelligence,
  CareerPreferences,
  CareerPreferencesUpdate,
  ConsentInput,
  FullProfile,
  IdentityUpdate,
  InterestArea,
  InterestsUpdate,
  SaveResponseResult,
  StartedAttempt,
  StudentIdentity,
  StudentInterest,
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
} as const;
