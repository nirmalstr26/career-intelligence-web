import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target } from "lucide-react";

import { StartDiagnosticCta } from "@/components/app/StartDiagnosticCta";
import { Chip, PageError, PageLoading, SectionCard, humanizeCode } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { useCareerIntelligence } from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/missions")({
  component: MissionsPage,
});

function MissionsPage() {
  const query = useCareerIntelligence();

  if (query.isLoading) return <PageLoading label="Loading your missions\u2026" />;
  if (query.isError || query.data === undefined)
    return <PageError onRetry={() => void query.refetch()} />;

  const ci = query.data;
  const action = ci.next_best_action;
  const hasContent =
    action !== null || ci.priority_gaps.length > 0 || ci.needs_validation.length > 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Missions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Focused actions to close gaps and prove your skills.
        </p>
      </header>

      {!hasContent ? (
        <SectionCard>
          <StartDiagnosticCta
            title="No missions yet"
            description="Complete a diagnostic and CareerAI will recommend your next moves."
          />
        </SectionCard>
      ) : null}

      {action !== null ? (
        <SectionCard title="Next best action">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Target className="size-5" />
              </span>
              <div>
                <p className="font-medium">{action.title ?? humanizeCode(action.action_code)}</p>
                {action.rationale !== null ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">{action.rationale}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  {action.action_type !== null ? (
                    <Chip>{humanizeCode(action.action_type)}</Chip>
                  ) : null}
                  {action.estimated_minutes !== null ? (
                    <Chip>~{action.estimated_minutes} min</Chip>
                  ) : null}
                </div>
              </div>
            </div>
            <Button asChild variant="hero">
              <Link to="/app/diagnostic">
                Start
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </SectionCard>
      ) : null}

      {ci.priority_gaps.length > 0 ? (
        <SectionCard title="Priority gaps" description="Skills to strengthen next.">
          <ul className="space-y-2">
            {ci.priority_gaps.map((gap) => (
              <li
                key={gap.skill_code}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-2.5 text-sm"
              >
                <span>{humanizeCode(gap.skill_code)}</span>
                <Chip>{humanizeCode(gap.priority)}</Chip>
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : null}

      {ci.needs_validation.length > 0 ? (
        <SectionCard title="Needs validation" description="Claimed skills to verify with evidence.">
          <div className="flex flex-wrap gap-2">
            {ci.needs_validation.map((item) => (
              <Chip key={item.skill_code}>{humanizeCode(item.skill_code)}</Chip>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
