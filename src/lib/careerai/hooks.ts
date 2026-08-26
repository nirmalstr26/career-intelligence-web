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
