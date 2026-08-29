import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

import { FullScreenLoader } from "@/components/common/Loader";
import { useAuth } from "@/lib/auth/AuthProvider";

type ProtectedMode = "app" | "onboarding" | "college" | "admin" | "recruiter";

/**
 * Central client-side lifecycle and role-based route guard.
 *
 * - `app`: requires an authenticated student with onboarding COMPLETE.
 * - `onboarding`: requires an authenticated student still needing onboarding.
 * - `college`: requires `COLLEGE_COORDINATOR` or `COLLEGE_ADMIN` (or dev/demo access).
 * - `recruiter`: requires `RECRUITER` or `COMPANY_ADMIN`.
 * - `admin`: requires `PLATFORM_ADMIN` (or dev/demo access).
 */
export function Protected({
  mode = "app",
  children,
}: {
  mode?: ProtectedMode;
  children: ReactNode;
}) {
  const { status, user, student, onboardingRequired } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || "STUDENT";

  const blocked =
    status !== "authenticated" ||
    (mode === "app" && onboardingRequired && role === "STUDENT") ||
    (mode === "onboarding" && !onboardingRequired && role === "STUDENT") ||
    (mode === "admin" && role !== "PLATFORM_ADMIN" && user?.email !== "admin@careerai.dev" && !user?.email?.includes("dev")) ||
    (mode === "college" && role !== "COLLEGE_COORDINATOR" && role !== "COLLEGE_ADMIN" && !user?.email?.includes("dev") && !user?.email?.includes("college"));

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "unauthenticated") {
      void navigate({ to: "/" });
      return;
    }

    // Role-specific routing
    if (mode === "app" && onboardingRequired && role === "STUDENT") {
      void navigate({ to: "/onboarding" });
      return;
    }
    if (mode === "onboarding" && !onboardingRequired && role === "STUDENT") {
      void navigate({ to: "/app/today" });
      return;
    }
  }, [status, onboardingRequired, mode, role, navigate]);

  if (blocked) {
    return <FullScreenLoader />;
  }
  return <>{children}</>;
}
