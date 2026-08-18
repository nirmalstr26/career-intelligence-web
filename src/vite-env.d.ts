/// <reference types="vite/client" />

// Strongly-typed access to the app's public environment variables so that
// `import.meta.env.VITE_*` is `string | undefined` (dot access is allowed even
// with `noPropertyAccessFromIndexSignature`).
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
