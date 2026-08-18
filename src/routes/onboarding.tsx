import { createFileRoute } from "@tanstack/react-router";

import { Protected } from "@/components/auth/Protected";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return (
    <Protected mode="onboarding">
      <OnboardingFlow />
    </Protected>
  );
}
