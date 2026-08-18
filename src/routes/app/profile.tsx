import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import {
  Chip,
  Meter,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useProfile } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ProfilePage() {
  const query = useProfile();
  const { user, logout } = useAuth();

  if (query.isLoading) return <PageLoading label="Loading your profile\u2026" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const { student, academic_profile, career_preferences, interests, career_context } = query.data;
  const fallback = "\u2014";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          <LogOut />
          Sign out
        </Button>
      </header>

      <SectionCard title="Completion">
        <Meter
          label="Profile completeness"
          value={student.profile_completion}
          caption={humanizeCode(student.profile_status)}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="About you">
          <Row label="Name" value={`${student.first_name} ${student.last_name}`.trim()} />
          <Row label="Email" value={student.email} />
          <Row label="Country" value={student.country_code ?? fallback} />
          <Row label="City" value={student.city ?? fallback} />
          <Row label="State" value={student.state ?? fallback} />
          <Row label="Phone" value={student.phone ?? fallback} />
        </SectionCard>

        <SectionCard title="Academics">
          {academic_profile !== null ? (
            <>
              <Row label="Institution" value={academic_profile.institution.name} />
              <Row label="Program" value={academic_profile.program.program_name} />
              <Row label="Degree" value={academic_profile.program.degree_type} />
              <Row label="Department" value={academic_profile.program.department} />
              <Row label="Year" value={academic_profile.current_year} />
              <Row label="Semester" value={academic_profile.current_semester} />
              <Row label="Graduation" value={academic_profile.expected_graduation_year} />
              <Row label="Status" value={humanizeCode(academic_profile.academic_status)} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No academic details yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Career intent">
          {career_preferences !== null ? (
            <>
              <Row label="Intent" value={humanizeCode(career_preferences.post_graduation_intent)} />
              <Row label="Clarity" value={humanizeCode(career_preferences.career_clarity)} />
              <Row
                label="Preferred location"
                value={career_preferences.preferred_location ?? fallback}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No career preferences yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Interests">
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Chip key={interest.interest_area_code}>
                  {interest.interest_area_name} {"\u00b7"} {humanizeCode(interest.interest_level)}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No interests selected yet.</p>
          )}
        </SectionCard>
      </div>

      {career_context !== null && career_context.trim() !== "" ? (
        <SectionCard title="Career context">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{career_context}</p>
        </SectionCard>
      ) : null}
    </div>
  );
}
