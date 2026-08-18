/**
 * Google Identity Services (GIS) loader and typed wrapper.
 *
 * We use the ID-token ("credential") flow: Google returns a signed JWT that the
 * backend verifies. This module only loads the GIS script and exposes a minimal
 * typed surface — all browser-only, guarded for SSR.
 */

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

export interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
  prompt: () => void;
  cancel: () => void;
  disableAutoSelect: () => void;
}

interface GoogleNamespace {
  accounts: { id: GoogleAccountsId };
}

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";
let loadPromise: Promise<GoogleNamespace> | null = null;

/** Load the GIS client script exactly once and resolve with `window.google`. */
export function loadGoogleIdentity(): Promise<GoogleNamespace> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Google Identity Services is only available in the browser."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<GoogleNamespace>((resolve, reject) => {
    const finish = () => {
      if (window.google?.accounts?.id) {
        resolve(window.google);
      } else {
        reject(new Error("Google Identity Services loaded without the expected API."));
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener(
      "error",
      () => {
        loadPromise = null;
        reject(new Error("Failed to load Google Identity Services."));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return loadPromise;
}
