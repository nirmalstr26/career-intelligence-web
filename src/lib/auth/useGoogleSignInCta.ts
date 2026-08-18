import { useCallback } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Landing-page CTA handler: bring the Google sign-in card into view and, when
 * configured, trigger Google One Tap. Used by the Hero and Navbar buttons so
 * every entry point leads to the same Google-only sign-in.
 */
export function useGoogleSignInCta() {
  const { promptGoogleSignIn, googleConfigured } = useAuth();

  return useCallback(() => {
    if (typeof document !== "undefined") {
      document
        .getElementById("get-started")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (googleConfigured) {
      void promptGoogleSignIn().catch(() => undefined);
    }
  }, [googleConfigured, promptGoogleSignIn]);
}
