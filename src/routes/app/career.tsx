import { createFileRoute } from "@tanstack/react-router";

import { StartDiagnosticCta } from "@/components/app/StartDiagnosticCta";
import {
  Chip,
  Meter,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { CareerReadinessRing } from "@/components/career/CareerReadinessRing";
import { useCareerIntelligence } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/career")({
  component: CareerPage,
});

function CareerPage() {
  const query = useCareerIntelligence();

  if (query.isLoading) return <PageLoading label="Loading your career map\u2026" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const ci = query.data;
  const landscape = [...ci.career_landscape].sort((a, b) => b.alignment_score - a.alignment_score);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Career</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Where you align today and how ready you are for your primary direction.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SectionCard title="Career landscape" description="Alignment across career clusters.">
          {landscape.length > 0 ? (
            <div className="space-y-4">
              {landscape.map((item) => (
                <Meter
                  key={item.career_cluster_code}
                  label={humanizeCode(item.career_cluster_code)}
                  value={item.alignment_score}
                  caption={`${Math.round(item.confidence * 100)}% confidence`}
                />
              ))}
            </div>
          ) : (
            <StartDiagnosticCta
              title="No career alignments yet"
              description="Run a diagnostic to see which career clusters fit you best."
            />
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Primary readiness">
            {ci.primary_career_readiness !== null ? (
              <div className="flex flex-col items-center gap-2 py-2 text-center">
                <CareerReadinessRing
                  value={ci.primary_career_readiness.score}
                  label={humanizeCode(ci.primary_career_readiness.career_cluster_code)}
                  size={128}
                />
                <p className="text-sm font-medium">
                  {humanizeCode(ci.primary_career_readiness.career_cluster_code)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Pick or confirm a primary career to track readiness.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Direction">
            {ci.career_direction.primary_career !== null ? (
              <p className="mb-3 font-display text-lg font-semibold">
                {humanizeCode(ci.career_direction.primary_career)}
              </p>
            ) : (
              <p className="mb-3 text-sm text-muted-foreground">No primary career selected yet.</p>
            )}
            {ci.career_direction.exploring.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ci.career_direction.exploring.map((code) => (
                  <Chip key={code}>{humanizeCode(code)}</Chip>
                ))}
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
