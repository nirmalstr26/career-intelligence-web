/**
 * Renders the official Google Identity Services button (ID-token flow).
 *
 * The real GIS button is used so Google returns a verifiable ID token; when the
 * client id is not configured we render a helpful, non-blocking placeholder so
 * the UI still builds and previews.
 */

import { useEffect, useRef } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import type { GoogleButtonOptions } from "@/lib/auth/google";
import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps {
  options?: GoogleButtonOptions;
  className?: string;
}

export function GoogleSignInButton({ options, className }: GoogleSignInButtonProps) {
  const { renderGoogleButton, googleConfigured, signingIn } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!googleConfigured || el === null) {
      return;
    }
    el.replaceChildren();
    void renderGoogleButton(el, optionsRef.current).catch(() => undefined);
  }, [googleConfigured, renderGoogleButton]);

  if (!googleConfigured) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface/40 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground",
          className,
        )}
      >
        Google Sign-In isn&rsquo;t configured for this build. Set{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">VITE_GOOGLE_CLIENT_ID</code>{" "}
        to enable it.
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex min-h-[44px] items-center justify-center", className)}
      aria-busy={signingIn}
    >
      <div ref={containerRef} className={cn(signingIn && "pointer-events-none opacity-50")} />
      {signingIn ? (
        <span className="absolute text-xs text-muted-foreground">Signing you in&hellip;</span>
      ) : null}
    </div>
  );
}
