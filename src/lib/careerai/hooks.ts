import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import { careerai } from "@/lib/careerai/client";

/** The authenticated student's id, or "" when not yet resolved. */
export function useStudentId(): string {
  const { student } = useAuth();
  return student?.id ?? "";
}

export function useCareerIntelligence() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-intelligence", studentId],
    queryFn: () => careerai.getCareerIntelligence(studentId),
    enabled: studentId !== "",
  });
}

export function useProfile() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["profile", studentId],
    queryFn: () => careerai.getProfile(studentId),
    enabled: studentId !== "",
  });
}

export function useSkills() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["skills", studentId],
    queryFn: () => careerai.getSkills(studentId),
    enabled: studentId !== "",
  });
}

export function useSkillEvidence(skillCode: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["skill-evidence", studentId, skillCode],
    queryFn: () => careerai.getSkillEvidence(studentId, skillCode),
    enabled: studentId !== "" && skillCode !== "",
  });
}

export function useCareerLandscape() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-landscape", studentId],
    queryFn: () => careerai.getCareerLandscape(studentId),
    enabled: studentId !== "",
  });
}

export function useCareerClusterDetail(clusterCode: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-cluster", studentId, clusterCode],
    queryFn: () => careerai.getCareerClusterDetail(studentId, clusterCode),
    enabled: studentId !== "" && clusterCode !== "",
  });
}

export function useReadiness() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["readiness", studentId],
    queryFn: () => careerai.getReadiness(studentId),
    enabled: studentId !== "",
  });
}

export function useCareerExplorations() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-explorations", studentId],
    queryFn: () => careerai.getCareerExplorations(studentId),
    enabled: studentId !== "",
  });
}

export function useRefreshIntelligence() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => careerai.refreshIntelligence(studentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    },
  });
}

export function useMakePrimaryCareer() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clusterCode: string) => careerai.makePrimaryCareer(studentId, clusterCode),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["career-explorations", studentId] });
    },
  });
}


// --- Curriculum Hooks -------------------------------------------------------

export function useCurriculum(careerClusterCode?: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["curriculum", studentId, careerClusterCode],
    queryFn: () => careerai.getCurriculum(studentId, careerClusterCode!),
    enabled: studentId !== "" && Boolean(careerClusterCode),
  });
}

export function useNextModules(careerClusterCode?: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["curriculum-next", studentId, careerClusterCode],
    queryFn: () => careerai.getNextModules(studentId, careerClusterCode!),
    enabled: studentId !== "" && Boolean(careerClusterCode),
  });
}

export function useModuleDetail(moduleCode?: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["curriculum-module", studentId, moduleCode],
    queryFn: () => careerai.getModuleDetail(studentId, moduleCode!),
    enabled: studentId !== "" && Boolean(moduleCode),
  });
}

export function useStartModule() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleCode: string) => careerai.startModule(studentId, moduleCode),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["curriculum", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["curriculum-next", studentId] });
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-module", studentId, data.module.code],
      });
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    },
  });
}

export function useCompleteModule() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      module_code: string;
      assessment_score?: number;
      time_spent_minutes?: number;
      ai_feedback?: string;
    }) => careerai.completeModule(studentId, body),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["curriculum", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["curriculum-next", studentId] });
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-module", studentId, data.module.code],
      });
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    },
  });
}

export function useRecordModuleAssessment() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { module_code: string; score: number }) =>
      careerai.recordModuleAssessment(studentId, body),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["curriculum", studentId] });
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-module", studentId, data.module_code],
      });
    },
  });
}


// --- Practical Projects (Domain 19) ----------------------------------------

export function useProjects(careerClusterCode?: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["projects", studentId, careerClusterCode],
    queryFn: () => careerai.listProjects(studentId, careerClusterCode),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  });
}

export function useProjectDetail(projectCode: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["project-detail", studentId, projectCode],
    queryFn: () => careerai.getProject(studentId, projectCode),
    enabled: Boolean(studentId && projectCode),
    staleTime: 10_000,
  });
}

export function useStartProject() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectCode: string) => careerai.startProject(studentId, projectCode),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["projects", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["project-detail", studentId, data.code] });
    },
  });
}

export function useSaveProjectStage() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectCode, stage, data }: { projectCode: string; stage: string; data: Record<string, any> }) =>
      careerai.saveProjectStage(studentId, projectCode, stage, data),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["projects", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["project-detail", studentId, data.code] });
    },
  });
}

export function useSubmitProject() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectCode, payload }: { projectCode: string; payload?: Record<string, any> }) =>
      careerai.submitProject(studentId, projectCode, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["project-detail", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Domain 20 — AI Mock Interviews Hooks
// ---------------------------------------------------------------------------

export function useInterviews(careerClusterCode?: string) {
  const { studentId } = useAuth();
  return useQuery({
    queryKey: ["interviews", studentId, careerClusterCode],
    queryFn: () => careerAiClient.listInterviews(studentId!, careerClusterCode),
    enabled: Boolean(studentId),
    staleTime: 10_000,
  });
}

export function useInterviewDetail(code: string) {
  const { studentId } = useAuth();
  return useQuery({
    queryKey: ["interview-detail", studentId, code],
    queryFn: () => careerAiClient.getInterviewDetail(studentId!, code),
    enabled: Boolean(studentId && code),
    staleTime: 10_000,
  });
}

export function useInterviewSession(sessionId?: string) {
  const { studentId } = useAuth();
  return useQuery({
    queryKey: ["interview-session", studentId, sessionId],
    queryFn: () => careerAiClient.getInterviewSession(studentId!, sessionId!),
    enabled: Boolean(studentId && sessionId),
    staleTime: 2_000,
  });
}

export function useStartInterview() {
  const { studentId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => careerAiClient.startInterview(studentId!, code),
    onSuccess: (data, code) => {
      queryClient.invalidateQueries({ queryKey: ["interviews", studentId] });
      queryClient.invalidateQueries({ queryKey: ["interview-detail", studentId, code] });
      queryClient.setQueryData(["interview-session", studentId, data.session.id], data.session);
    },
  });
}

export function useSubmitInterviewAnswer() {
  const { studentId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      student_answer,
      is_dont_know,
    }: {
      sessionId: string;
      student_answer: string;
      is_dont_know?: boolean;
    }) =>
      careerAiClient.submitInterviewAnswer(studentId!, sessionId, {
        student_answer,
        is_dont_know,
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["interview-session", studentId, variables.sessionId],
        data.session
      );
      if (data.is_completed) {
        queryClient.invalidateQueries({ queryKey: ["interviews", studentId] });
        queryClient.invalidateQueries({ queryKey: ["interview-detail", studentId] });
        queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
      }
    },
  });
}

// -------------------------------------------------------------------------// ---------------------------------------------------------------------------
// Domain 21 — Professional Profile & Resume Intelligence Hooks
// ---------------------------------------------------------------------------

export function useProfessionalProfile() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["professional-profile", studentId],
    queryFn: () => careerai.getProfessionalProfile(studentId),
    enabled: studentId !== "",
    staleTime: 5_000,
  });
}

export function useGenerateProfileSuggestions() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => careerai.generateProfileSuggestions(studentId),
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-profile", studentId], data);
    },
  });
}

export function useResolveProfileSuggestion() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      suggestionId,
      action,
      edited_content,
    }: {
      suggestionId: string;
      action: "ACCEPT" | "EDIT" | "REJECT";
      edited_content?: Record<string, any> | null;
    }) =>
      careerai.resolveProfileSuggestion(
        studentId,
        suggestionId,
        action,
        edited_content
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-profile", studentId], data);
      queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    },
  });
}

export function useUpdateProfileSection() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionType,
      content,
    }: {
      sectionType: string;
      content: Record<string, any>;
    }) => careerai.updateProfileSection(studentId, sectionType, content),
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-profile", studentId], data);
    },
  });
}

export function useUpdateLinkedInProfile() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      headline,
      about,
    }: {
      headline: string;
      about: string;
    }) => careerai.updateLinkedInProfile(studentId, headline, about),
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-profile", studentId], data);
    },
  });
}

export function useRestoreProfileVersion() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: string) =>
      careerai.restoreProfileVersion(studentId, versionId),
    onSuccess: (res) => {
      queryClient.setQueryData(["professional-profile", studentId], res.profile);
    },
  });
}

// ---------------------------------------------------------------------------
// Domain 22 — Opportunities, Matching & Application Tracking Hooks
// ---------------------------------------------------------------------------

export function useOpportunities(careerClusterCode = "DATA_ENGINEER") {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["opportunities", studentId, careerClusterCode],
    queryFn: () => careerai.getMatchedOpportunities(studentId, careerClusterCode),
    enabled: studentId !== "",
    staleTime: 10_000,
  });
}

export function useOpportunityFit(opportunityId?: string | null) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["opportunity-fit", studentId, opportunityId],
    queryFn: () => careerai.getOpportunityFit(studentId, opportunityId!),
    enabled: studentId !== "" && Boolean(opportunityId),
    staleTime: 5_000,
  });
}

export function useParseJobDescription() {
  const studentId = useStudentId();
  return useMutation({
    mutationFn: ({
      raw_jd_text,
      role_title,
      company_name,
    }: {
      raw_jd_text: string;
      role_title?: string;
      company_name?: string;
    }) => careerai.parseJobDescription(studentId, raw_jd_text, role_title, company_name),
  });
}

export function useJobApplications() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["job-applications", studentId],
    queryFn: () => careerai.getJobApplications(studentId),
    enabled: studentId !== "",
    staleTime: 5_000,
  });
}

export function useCreateJobApplication() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      opportunity_id?: string | null;
      company: string;
      role: string;
      job_url?: string | null;
      status?: string;
      notes?: string | null;
      contact_name?: string | null;
      contact_email?: string | null;
      salary_or_stipend?: string | null;
    }) => careerai.createJobApplication(studentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications", studentId] });
      queryClient.invalidateQueries({ queryKey: ["placement-activity", studentId] });
      queryClient.invalidateQueries({ queryKey: ["opportunity-fit"] });
    },
  });
}

export function useUpdateJobApplicationStatus() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
      notes,
      interview_date,
      next_action_date,
    }: {
      applicationId: string;
      status: string;
      notes?: string | null;
      interview_date?: string | null;
      next_action_date?: string | null;
    }) =>
      careerai.updateJobApplicationStatus(studentId, applicationId, {
        status,
        notes,
        interview_date,
        next_action_date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications", studentId] });
      queryClient.invalidateQueries({ queryKey: ["placement-activity", studentId] });
    },
  });
}

export function usePlacementActivity() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["placement-activity", studentId],
    queryFn: () => careerai.getPlacementActivity(studentId),
    enabled: studentId !== "",
    staleTime: 5_000,
  });
}

// ---------------------------------------------------------------------------
// Domain 23 — College & Placement Coordinator Hooks
// ---------------------------------------------------------------------------

export const PILOT_COORDINATOR_ID = "c62ec244-2f8e-4a75-9ca9-99e18b4db0ca";
export const PILOT_INSTITUTION_ID = "d23fd1dc-18e2-4d02-9323-0cf9ae6b503c";
export const PILOT_COHORT_ID = "02d01bbf-49ba-452d-876c-341121226e4e";

export function useCoordinatorProfile(coordinatorId = PILOT_COORDINATOR_ID) {
  return useQuery({
    queryKey: ["coordinator-profile", coordinatorId],
    queryFn: () => careerai.getCoordinatorProfile(coordinatorId),
    staleTime: 60_000,
  });
}

export function useCohortReadinessSummary(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID
) {
  return useQuery({
    queryKey: ["cohort-summary", coordinatorId, cohortId],
    queryFn: () => careerai.getCohortReadinessSummary(coordinatorId, cohortId),
    staleTime: 10_000,
  });
}

export function useCohortGapAnalysis(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID
) {
  return useQuery({
    queryKey: ["cohort-gaps", coordinatorId, cohortId],
    queryFn: () => careerai.getCohortGapAnalysis(coordinatorId, cohortId),
    staleTime: 10_000,
  });
}

export function useCohortStudents(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID,
  search?: string,
  readinessTier?: string
) {
  return useQuery({
    queryKey: ["cohort-students", coordinatorId, cohortId, search, readinessTier],
    queryFn: () => careerai.listCohortStudents(coordinatorId, cohortId, search, readinessTier),
    staleTime: 5_000,
  });
}

export function useCoordinatorStudentDetail(
  coordinatorId = PILOT_COORDINATOR_ID,
  studentId?: string | null
) {
  return useQuery({
    queryKey: ["coordinator-student-detail", coordinatorId, studentId],
    queryFn: () => careerai.getCoordinatorStudentDetail(coordinatorId, studentId!),
    enabled: Boolean(studentId),
    staleTime: 5_000,
  });
}

export function useCohortAssignments(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID
) {
  return useQuery({
    queryKey: ["cohort-assignments", coordinatorId, cohortId],
    queryFn: () => careerai.listCohortAssignments(coordinatorId, cohortId),
    staleTime: 5_000,
  });
}

export function useCreateCohortAssignment(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      activity_type: string;
      target_reference: string;
      due_date?: string | null;
      is_mandatory?: boolean;
    }) => careerai.createCohortAssignment(coordinatorId, cohortId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohort-assignments", coordinatorId, cohortId] });
      queryClient.invalidateQueries({ queryKey: ["student-college-context"] });
    },
  });
}

export function useCollegeSessions(institutionId = PILOT_INSTITUTION_ID) {
  return useQuery({
    queryKey: ["college-sessions", institutionId],
    queryFn: () => careerai.listCollegeSessions(institutionId),
    staleTime: 10_000,
  });
}

export function useCreateCollegeSession(coordinatorId = PILOT_COORDINATOR_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      cohort_id?: string | null;
      title: string;
      description: string;
      session_type: string;
      scheduled_at: string;
      duration_minutes?: number;
      meeting_link?: string | null;
      capacity?: number;
      related_career_cluster?: string;
    }) => careerai.createCollegeSession(coordinatorId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["student-college-context"] });
    },
  });
}

export function useQueryCollegeIntelligence(
  coordinatorId = PILOT_COORDINATOR_ID,
  cohortId = PILOT_COHORT_ID
) {
  return useMutation({
    mutationFn: (query: string) =>
      careerai.queryCollegeIntelligence(coordinatorId, cohortId, query),
  });
}

export function useStudentCollegeContext() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["student-college-context", studentId],
    queryFn: () => careerai.getStudentCollegeContext(studentId),
    enabled: studentId !== "",
    staleTime: 5_000,
  });
}

export function useJoinCollegeCohort() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invite_code: string) => careerai.joinCollegeCohort(studentId, invite_code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-college-context", studentId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Domain 24 — Recruiter Pilot & Candidate Pipeline Hooks
// ---------------------------------------------------------------------------

export const PILOT_RECRUITER_ID = "518682a8-ce27-4575-afc9-e3ea0ae92096";
export const PILOT_COMPANY_OPP_ID = "455dfda7-4d25-495a-b756-6c2d09a36b50";

export function useRecruiterProfile(recruiterId = PILOT_RECRUITER_ID) {
  return useQuery({
    queryKey: ["recruiter-profile", recruiterId],
    queryFn: () => careerai.getRecruiterProfile(recruiterId),
    staleTime: 60_000,
  });
}

export function useRecruiterOpportunities(recruiterId = PILOT_RECRUITER_ID) {
  return useQuery({
    queryKey: ["recruiter-opportunities", recruiterId],
    queryFn: () => careerai.listRecruiterOpportunities(recruiterId),
    staleTime: 5_000,
  });
}

export function useCreateRecruiterOpportunity(recruiterId = PILOT_RECRUITER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
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
    }) => careerai.createRecruiterOpportunity(recruiterId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-opportunities", recruiterId] });
    },
  });
}

export function useCandidateMatches(
  recruiterId = PILOT_RECRUITER_ID,
  opportunityId = PILOT_COMPANY_OPP_ID
) {
  return useQuery({
    queryKey: ["candidate-matches", recruiterId, opportunityId],
    queryFn: () => careerai.listCandidateMatches(recruiterId, opportunityId),
    enabled: Boolean(opportunityId),
    staleTime: 5_000,
  });
}

export function useInviteCandidate(
  recruiterId = PILOT_RECRUITER_ID,
  opportunityId = PILOT_COMPANY_OPP_ID
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) =>
      careerai.inviteCandidateToOpportunity(recruiterId, opportunityId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-matches", recruiterId, opportunityId] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-opportunities", recruiterId] });
    },
  });
}

export function useConsentedCandidateProfile(
  recruiterId = PILOT_RECRUITER_ID,
  opportunityId = PILOT_COMPANY_OPP_ID,
  studentId?: string | null
) {
  return useQuery({
    queryKey: ["consented-candidate-profile", recruiterId, opportunityId, studentId],
    queryFn: () => careerai.getConsentedCandidateProfile(recruiterId, opportunityId, studentId!),
    enabled: Boolean(opportunityId) && Boolean(studentId),
    staleTime: 5_000,
  });
}

export function useUpdateCandidatePipelineStage(recruiterId = PILOT_RECRUITER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      shortlistId,
      newStage,
      notes,
      interviewDate,
    }: {
      shortlistId: string;
      newStage: string;
      notes?: string | null;
      interviewDate?: string | null;
    }) =>
      careerai.updateCandidatePipelineStage(recruiterId, shortlistId, {
        new_stage: newStage,
        notes,
        interview_date: interviewDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate-matches"] });
      queryClient.invalidateQueries({ queryKey: ["consented-candidate-profile"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["placement-activity"] });
    },
  });
}

export function useRecordRecruiterFeedback(recruiterId = PILOT_RECRUITER_ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      shortlistId,
      body,
    }: {
      shortlistId: string;
      body: {
        technical_score: number;
        communication_score: number;
        problem_solving_score: number;
        project_understanding_score: number;
        recommendation: string;
        feedback_notes: string;
      };
    }) => careerai.recordRecruiterFeedback(recruiterId, shortlistId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consented-candidate-profile"] });
    },
  });
}

export function useQueryRecruiterIntelligence(
  recruiterId = PILOT_RECRUITER_ID,
  opportunityId = PILOT_COMPANY_OPP_ID
) {
  return useMutation({
    mutationFn: (query: string) =>
      careerai.queryRecruiterIntelligence(recruiterId, opportunityId, query),
  });
}

export function useStudentOpportunityInvitations() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["student-opportunity-invitations", studentId],
    queryFn: () => careerai.listStudentOpportunityInvitations(studentId),
    enabled: studentId !== "",
    staleTime: 5_000,
  });
}

export function useRespondToOpportunityInvitation() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      opportunityId,
      interested,
    }: {
      opportunityId: string;
      interested: boolean;
    }) => careerai.respondToOpportunityInvitation(studentId, opportunityId, interested),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-opportunity-invitations", studentId] });
      queryClient.invalidateQueries({ queryKey: ["job-applications", studentId] });
      queryClient.invalidateQueries({ queryKey: ["placement-activity", studentId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Domain 25 — Admin Operations, Telemetry, and Pilot Safety Hooks
// ---------------------------------------------------------------------------

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => careerai.getAdminOverview(),
    staleTime: 5_000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => careerai.listAdminUsers(),
    staleTime: 10_000,
  });
}

export function useApproveRecruiter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recruiterId,
      status,
      notes,
    }: {
      recruiterId: string;
      status: string;
      notes?: string | null;
    }) => careerai.approveRecruiterStatus(recruiterId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
}

export function useAIOperations() {
  return useQuery({
    queryKey: ["admin-ai-operations"],
    queryFn: () => careerai.getAIOperations(),
    staleTime: 5_000,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin-system-health"],
    queryFn: () => careerai.getSystemHealth(),
    staleTime: 10_000,
  });
}

export function usePilotFeedbacks() {
  return useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: () => careerai.listPilotFeedbacks(),
    staleTime: 5_000,
  });
}

export function useSubmitPilotFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      category?: string;
      rating: number;
      comment?: string | null;
      milestone_context?: string | null;
    }) => careerai.submitPilotFeedback(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] });
    },
  });
}

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ feedbackId, status }: { feedbackId: string; status: string }) =>
      careerai.updateFeedbackStatus(feedbackId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] });
    },
  });
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["admin-feature-flags"],
    queryFn: () => careerai.listFeatureFlags(),
    staleTime: 5_000,
  });
}

export function useToggleFeatureFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ flagName, isEnabled }: { flagName: string; isEnabled: boolean }) =>
      careerai.toggleFeatureFlag(flagName, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feature-flags"] });
    },
  });
}

export function useDataIntegrityCheck() {
  return useQuery({
    queryKey: ["admin-integrity-check"],
    queryFn: () => careerai.runDataIntegrityCheck(),
    staleTime: 10_000,
  });
}

export function useSystemAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => careerai.listSystemAuditLogs(),
    staleTime: 10_000,
  });
}

// --- Step 16: Career Discovery & Reference Hooks ---------------------------

import {
  getOnboardingReference,
  startCareerDiscovery,
  getCurrentCareerDiscovery,
  respondToCareerDiscovery,
  compareCareerPaths,
  selectDiscoveryCareer,
} from "./client";

export function useOnboardingReference() {
  return useQuery({
    queryKey: ["onboarding-reference"],
    queryFn: getOnboardingReference,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCurrentCareerDiscovery() {
  return useQuery({
    queryKey: ["career-discovery-current"],
    queryFn: getCurrentCareerDiscovery,
  });
}

export function useStartCareerDiscovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resetExisting?: boolean) => startCareerDiscovery(resetExisting),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-discovery-current"] });
    },
  });
}

export function useRespondCareerDiscovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, choiceCodes, message }: { sessionId: string; choiceCodes?: string[]; message?: string }) =>
      respondToCareerDiscovery(sessionId, choiceCodes, message),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-discovery-current"] });
    },
  });
}

export function useSelectDiscoveryCareer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, careerCode }: { sessionId: string; careerCode: string }) =>
      selectDiscoveryCareer(sessionId, careerCode),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-discovery-current"] });
      void queryClient.invalidateQueries({ queryKey: ["career-intelligence"] });
      void queryClient.invalidateQueries({ queryKey: ["career-explorations"] });
    },
  });
}


// ============================================================================
// Benchmark Intelligence & Transferability (Domain 25 - Step 17)
// ============================================================================

export function useStudentBenchmark() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["benchmark", studentId],
    queryFn: () => careerai.getStudentBenchmark(studentId!),
    enabled: Boolean(studentId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTransferabilityAnalysis(targetCareer: string) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["transferability", studentId, targetCareer],
    queryFn: () => careerai.getTransferability(studentId!, targetCareer),
    enabled: Boolean(studentId && targetCareer),
    staleTime: 1000 * 60 * 5,
  });
}


// ============================================================================
// LinkedIn Intelligence V2 Hooks (Domain 21 / Step 18)
// ============================================================================

export function useLinkedInIntelligenceV2(careerCode = "DATA_ENGINEER") {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["linkedin-intelligence-v2", studentId, careerCode],
    queryFn: () => careerai.getLinkedInIntelligenceV2(studentId!, careerCode),
    enabled: Boolean(studentId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useConnectLinkedIn() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { auth_code?: string; member_id?: string; name?: string; email?: string }) =>
      careerai.connectLinkedIn(studentId!, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["linkedin-intelligence-v2", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["professional-profile", studentId] });
    },
  });
}

export function useImportProfile() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      source_type: string;
      headline?: string;
      about?: string;
      experiences?: any[];
      education?: any[];
      skills?: string[];
      certifications?: string[];
      raw_text?: string;
    }) => careerai.importProfile(studentId!, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["linkedin-intelligence-v2", studentId] });
      void queryClient.invalidateQueries({ queryKey: ["professional-profile", studentId] });
    },
  });
}

export function useConfirmCertification() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; authority: string; issue_date?: string; credential_url?: string }) =>
      careerai.confirmCertification(studentId!, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["linkedin-intelligence-v2", studentId] });
    },
  });
}

export function useOptimizeForJob() {
  const studentId = useStudentId();
  return useMutation({
    mutationFn: (body: {
      opportunity_id?: string | null;
      raw_jd_text?: string | null;
      role_title?: string | null;
      company_name?: string | null;
    }) => careerai.optimizeForJob(studentId!, body),
  });
}


// ============================================================================
// Career Graph V2 Hooks (Step 19)
// ============================================================================

export function useCareerGraph(view = "JOURNEY", careerCode = "DATA_ENGINEER") {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-graph-v2", studentId, view, careerCode],
    queryFn: () => careerai.getCareerGraph(studentId!, view, careerCode),
    enabled: Boolean(studentId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useNodeImpact(nodeId: string | null) {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["career-graph-node-impact", studentId, nodeId],
    queryFn: () => careerai.getNodeImpact(studentId!, nodeId!),
    enabled: Boolean(studentId && nodeId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBenchmarkActions() {
  const studentId = useStudentId();
  return useQuery({
    queryKey: ["student-benchmark-actions", studentId],
    queryFn: () => careerai.getBenchmarkActions(studentId!),
    enabled: Boolean(studentId),
    staleTime: 1000 * 60 * 2,
  });
}
