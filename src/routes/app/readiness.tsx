import { createFileRoute } from "@tanstack/react-router";

import { Chip, PageError, PageLoading, SectionCard, humanizeCode } from "@/components/app/ui";
import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import { StartDiagnosticCta } from "@/components/app/StartDiagnosticCta";
import { useReadiness, useRefreshIntelligence } from "@/lib/careerai/hooks";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/app/readiness")({
  component: ReadinessPage,
});

function ReadinessPage() {
  const query = useReadiness();
  const refresh = useRefreshIntelligence();

  if (query.isLoading) return <PageLoading label="Loading readiness…" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const { placement_readiness, career_readiness } = query.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Readiness</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            How ready you are for placement and your target careers.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={refresh.isPending}
          onClick={() => refresh.mutate()}
        >
          <RefreshCw className={`size-4 ${refresh.isPending ? "animate-spin" : ""}`} />
          {refresh.isPending ? "Refreshing…" : "Refresh"}
        </Button>
      </header>

      {!placement_readiness && career_readiness.length === 0 ? (
        <SectionCard>
          <StartDiagnosticCta
            title="No readiness data yet"
            description="Complete a diagnostic to calculate your placement and career readiness."
          />
        </SectionCard>
      ) : null}

      {placement_readiness && (
        <SectionCard title="Placement Readiness" description="Overall industry-ready score.">
          <div className="flex flex-col items-center gap-4 py-2">
            <CareerReadinessRing
              value={placement_readiness.score}
              label="Placement"
              size={140}
            />
            <p className="text-sm text-muted-foreground">
              {Math.round(placement_readiness.confidence * 100)}% confidence ·{" "}
              {Math.round((placement_readiness.evidence_coverage ?? 0) * 100)}% evidence coverage
            </p>
          </div>

          {placement_readiness.priority_gaps.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Priority Gaps
              </p>
              <ul className="space-y-2">
                {placement_readiness.priority_gaps.map((g) => (
                  <li
                    key={g.skill_code}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm"
                  >
                    <span>{humanizeCode(g.skill_code)}</span>
                    <Chip>{humanizeCode(g.priority)}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {placement_readiness.ready_skills.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ready Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {placement_readiness.ready_skills.map((s) => (
                  <Chip key={s}>{humanizeCode(s)}</Chip>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {career_readiness.length > 0 && (
        <SectionCard title="Career Readiness" description="Readiness per career cluster.">
          <div className="grid gap-6 sm:grid-cols-2">
            {career_readiness.map((cr) => (
              <div
                key={cr.career_cluster_code}
                className="flex flex-col items-center gap-3 rounded-xl border border-border p-4"
              >
                <CareerReadinessRing
                  value={cr.score}
                  label={humanizeCode(cr.career_cluster_code)}
                  size={100}
                />
                <p className="text-sm font-medium">{humanizeCode(cr.career_cluster_code)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(cr.confidence * 100)}% confidence
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
