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
