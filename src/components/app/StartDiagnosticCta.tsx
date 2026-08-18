import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/ui";
import { Button } from "@/components/ui/button";

interface StartDiagnosticCtaProps {
  title?: string;
  description?: string;
}

/** Shared empty-state prompting the student to run a diagnostic. */
export function StartDiagnosticCta({
  title = "No signals yet",
  description = "Take a short diagnostic so CareerAI can generate this for you.",
}: StartDiagnosticCtaProps) {
  return (
    <EmptyState
      icon={<Sparkles className="size-6" />}
      title={title}
      description={description}
      action={
        <Button asChild variant="hero">
          <Link to="/app/diagnostic">
            Start diagnostic
            <ArrowRight />
          </Link>
        </Button>
      }
    />
  );
}
