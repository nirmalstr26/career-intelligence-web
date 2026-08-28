/**
 * Public runtime configuration, read from Vite's build-time env injection.
 *
 * Only PUBLIC values live here: the backend base URL and the public Google OAuth
 * Client ID. There are deliberately no secrets in the browser — the CareerAI
 * session is an HttpOnly cookie managed by the backend.
 */

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function resolveApiBaseUrl(): string {
  // In the browser, always use same-origin relative /api/v1 (or window.location.origin/api/v1)
  // so all session cookies are strictly same-origin and never dropped by browser cross-site policies.
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/v1`;
  }
  const envUrl = clean(import.meta.env.VITE_API_BASE_URL);
  if (!envUrl) {
    return "https://13-234-153-165.sslip.io/api/v1";
  }
  const trimmed = envUrl.replace(/\/$/, "");
  if (trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
}

const googleClientId =
  clean(import.meta.env.VITE_GOOGLE_CLIENT_ID) ||
  "601182504704-513k286792um93ct1purvip7gshrjtr9.apps.googleusercontent.com";

export const env = {
  /** CareerAI backend base URL, including the `/api/v1` prefix. */
  apiBaseUrl: resolveApiBaseUrl(),
  /** Public Google OAuth Web Client ID (empty when sign-in is not configured). */
  googleClientId,
} as const;

/** Whether Google Sign-In is configured for this build. */
export const isGoogleConfigured = env.googleClientId.length > 0;
