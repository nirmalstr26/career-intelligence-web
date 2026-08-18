import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

import { FullScreenLoader } from "@/components/common/Loader";
import { useAuth } from "@/lib/auth/AuthProvider";

type ProtectedMode = "app" | "onboarding";

/**
 * Client-side route guard.
 *
 * - `app`: requires an authenticated session with onboarding COMPLETE. Sends
 *   unauthenticated users to `/` and not-yet-onboarded users to `/onboarding`.
 * - `onboarding`: requires an authenticated session that still needs onboarding.
 *   Sends unauthenticated users to `/` and finished users to `/app/home`.
 *
 * While the session is resolving (or a redirect is pending) a loader is shown so
 * protected content never flashes.
 */
export function Protected({ mode, children }: { mode: ProtectedMode; children: ReactNode }) {
  const { status, onboardingRequired } = useAuth();
  const navigate = useNavigate();

  const blocked =
    status !== "authenticated" ||
    (mode === "app" && onboardingRequired) ||
    (mode === "onboarding" && !onboardingRequired);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "unauthenticated") {
      void navigate({ to: "/" });
      return;
    }
    if (mode === "app" && onboardingRequired) {
      void navigate({ to: "/onboarding" });
      return;
    }
    if (mode === "onboarding" && !onboardingRequired) {
      void navigate({ to: "/app/home" });
    }
  }, [status, onboardingRequired, mode, navigate]);

  if (blocked) {
    return <FullScreenLoader />;
  }
  return <>{children}</>;
}
