import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, Star } from "lucide-react";

import { Chip, PageError, PageLoading, SectionCard, humanizeCode } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { useCareerIntelligence, useCareerExplorations, useMakePrimaryCareer } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/explore")({
  component: ExplorePage,
});

const CAREER_CLUSTERS = [
  "SOFTWARE_ENGINEERING",
  "DATA_SCIENCE",
  "ARTIFICIAL_INTELLIGENCE",
  "CLOUD_DEVOPS",
  "CYBERSECURITY",
  "PRODUCT_MANAGEMENT",
  "UX_DESIGN",
  "BUSINESS_ANALYST",
  "DIGITAL_MARKETING",
  "FINANCE_FINTECH",
];

function ExplorePage() {
  const ciQuery = useCareerIntelligence();
  const explorationsQuery = useCareerExplorations();
  const makePrimary = useMakePrimaryCareer();

  if (ciQuery.isLoading || explorationsQuery.isLoading)
    return <PageLoading label="Loading career explorer…" />;
  if (ciQuery.isError) return <PageError onRetry={() => void ciQuery.refetch()} />;

  const ci = ciQuery.data!;
  const explorations = explorationsQuery.data ?? [];
  const primaryCareer = ci.career_direction.primary_career;
  const exploringSet = new Set(ci.career_direction.exploring);

  // Build aligned careers from intelligence
  const alignedMap = new Map(
    ci.career_landscape.map((item) => [item.career_cluster_code, item.alignment_score]),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Explore Careers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover where you align and set your career direction.
        </p>
      </header>

      {primaryCareer && (
        <SectionCard className="border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3">
            <Star className="size-5 text-primary fill-current" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Primary Career</p>
              <p className="font-display text-lg font-bold">{humanizeCode(primaryCareer)}</p>
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Career Clusters" description="Tap to explore, star to set as primary.">
        <div className="grid gap-3 sm:grid-cols-2">
          {CAREER_CLUSTERS.map((code) => {
            const alignScore = alignedMap.get(code);
            const isPrimary = primaryCareer === code;
            const isExploring = exploringSet.has(code);

            return (
              <div
                key={code}
                className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                  isPrimary
                    ? "border-primary/40 bg-primary/5"
                    : isExploring
                      ? "border-border bg-secondary/40"
                      : "border-border bg-background hover:bg-secondary/30"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{humanizeCode(code)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {alignScore !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(alignScore)}% aligned
                      </span>
                    )}
                    {isPrimary && <Chip className="text-[10px]">Primary</Chip>}
                    {isExploring && !isPrimary && <Chip className="text-[10px]">Exploring</Chip>}
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  {isPrimary ? (
                    <CheckCircle className="size-5 text-primary" />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full text-xs"
                      disabled={makePrimary.isPending}
                      onClick={() => makePrimary.mutate(code)}
                    >
                      <Star className="size-3" />
                      Set Primary
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {explorations.length > 0 && (
        <SectionCard title="Your Explorations">
          <div className="flex flex-wrap gap-2">
            {explorations.map((e) => (
              <Chip key={e.career_cluster_code} className={e.status === "PRIMARY" ? "border-primary/50 bg-primary/10 text-primary" : ""}>
                {humanizeCode(e.career_cluster_code)}
                {e.status === "PRIMARY" ? " ★" : ""}
              </Chip>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
