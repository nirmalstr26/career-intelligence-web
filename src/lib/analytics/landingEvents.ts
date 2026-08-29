/**
 * Landing Page Analytics Instrumentation
 * Emits telemetry events to product observability pipeline without logging PII.
 */

export type LandingEventType =
  | "LANDING_VIEWED"
  | "GET_STARTED_CLICKED"
  | "GOOGLE_AUTH_SELECTED"
  | "EMAIL_AUTH_SELECTED"
  | "EMAIL_OTP_REQUESTED"
  | "AUTH_COMPLETED"
  | "COLLEGE_CTA_CLICKED"
  | "CAREER_PATH_EXPLORED";

export function trackLandingEvent(event: LandingEventType, properties?: Record<string, any>) {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("spar_analytics", {
          detail: { event, properties: properties || {}, timestamp: new Date().toISOString() },
        })
      );
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[Analytics: ${event}]`, properties || {});
      }
    }
  } catch {
    // Fail-safe
  }
}
