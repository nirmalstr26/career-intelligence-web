import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";

import { Chip, PageError, PageLoading, SectionCard, humanizeCode } from "@/components/app/ui";
import { StartDiagnosticCta } from "@/components/app/StartDiagnosticCta";
import { useSkills, useSkillEvidence } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/skills")({
  component: SkillsPage,
});

function EvidenceList({ skillCode }: { skillCode: string }) {
  const { data, isLoading } = useSkillEvidence(skillCode);
  if (isLoading) return <p className="text-xs text-muted-foreground">Loading evidence…</p>;
  if (!data || data.length === 0)
    return <p className="text-xs text-muted-foreground">No evidence yet.</p>;

  return (
    <ul className="mt-2 space-y-1.5">
      {data.map((ev) => (
        <li
          key={ev.evidence_id}
          className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs"
        >
          <span className="text-muted-foreground">{humanizeCode(ev.evidence_type)}</span>
          <span className="font-semibold">{ev.score !== null ? ev.score : "—"}</span>
        </li>
      ))}
    </ul>
  );
}

function SkillRow({ skill }: { skill: ReturnType<typeof useSkills>["data"] extends (infer T)[] | undefined ? T : never }) {
  const [expanded, setExpanded] = useState(false);
  if (!skill) return null;

  return (
    <li className="rounded-xl border border-border">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/40 transition-colors rounded-xl"
        onClick={() => setExpanded((v) => !v)}
      >
        <TrendingUp className="size-4 shrink-0 text-primary" />
        <span className="flex-1 text-sm font-medium">{humanizeCode(skill.skill_code)}</span>
        <span className="flex items-center gap-2">
          {skill.verification_level && (
            <Chip className="hidden sm:flex items-center gap-1">
              <BadgeCheck className="size-3" />
              {humanizeCode(skill.verification_level)}
            </Chip>
          )}
          <span className="numeric text-sm font-bold">
            {skill.score !== null ? skill.score : "—"}
          </span>
          {expanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-border px-4 pb-3 pt-2">
          <p className="mb-1 text-xs text-muted-foreground">
            Confidence: {skill.confidence !== null ? `${Math.round(skill.confidence * 100)}%` : "—"} ·
            Evidence: {skill.evidence_count}
          </p>
          <EvidenceList skillCode={skill.skill_code} />
        </div>
      )}
    </li>
  );
}

function SkillsPage() {
  const query = useSkills();

  if (query.isLoading) return <PageLoading label="Loading your skills…" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const skills = [...query.data].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your skill scores and verification evidence.
        </p>
      </header>

      <SectionCard
        title="All Skills"
        description={`${skills.length} tracked skills`}
      >
        {skills.length > 0 ? (
          <ul className="space-y-2">
            {skills.map((skill) => (
              <SkillRow key={skill.skill_code} skill={skill} />
            ))}
          </ul>
        ) : (
          <StartDiagnosticCta
            title="No skills tracked yet"
            description="Complete a diagnostic to start building your skill profile."
          />
        )}
      </SectionCard>
    </div>
  );
}
