import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, TrendingUp } from "lucide-react";

import { StartDiagnosticCta } from "@/components/app/StartDiagnosticCta";
import { Chip, PageError, PageLoading, SectionCard, humanizeCode } from "@/components/app/ui";
import { useCareerIntelligence } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/evidence")({
  component: EvidencePage,
});

function EvidencePage() {
  const query = useCareerIntelligence();

  if (query.isLoading) return <PageLoading label="Loading your evidence\u2026" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const ci = query.data;
  const strengths = [...ci.strengths].sort((a, b) => b.score - a.score);
  const graph = ci.career_graph_summary;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Evidence</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your verified strengths and the signals backing them.
        </p>
      </header>

      <SectionCard
        title="Verified strengths"
        description="Skills backed by assessment or project evidence."
      >
        {strengths.length > 0 ? (
          <ul className="space-y-3">
            {strengths.map((s) => (
              <li
                key={s.skill_code}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4 text-primary" />
                  {humanizeCode(s.skill_code)}
                </span>
                <span className="flex items-center gap-3">
                  <Chip>{humanizeCode(s.verification_level)}</Chip>
                  <span className="numeric text-sm font-semibold">{s.score}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <StartDiagnosticCta
            title="No evidence yet"
            description="Complete a diagnostic to start building verified evidence of your skills."
          />
        )}
      </SectionCard>

      <SectionCard title="Career graph">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4 text-center">
            <p className="numeric text-2xl font-bold">{graph.evidence_connection_count}</p>
            <p className="mt-1 text-xs text-muted-foreground">Evidence links</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-center">
            <p className="numeric text-2xl font-bold">{graph.strong_skill_connections.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Strong skills</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-center">
            <p className="flex items-center justify-center gap-1 text-sm font-medium">
              <BadgeCheck className="size-4 text-primary" />
              {humanizeCode(graph.projection_status)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Graph status</p>
          </div>
        </div>
        {graph.strong_skill_connections.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {graph.strong_skill_connections.map((code) => (
              <Chip key={code}>{humanizeCode(code)}</Chip>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
