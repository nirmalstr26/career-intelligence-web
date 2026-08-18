/**
 * Thin fetch wrapper for the CareerAI backend.
 *
 * - Always sends the CareerAI session cookie (`credentials: "include"`).
 * - Serializes/parses JSON and normalizes the backend error envelope
 *   (`{ "error": { "code", "message", "details?" } }`) into a typed {@link ApiError}.
 *
 * The session is an HttpOnly cookie; it is never read or stored in JS here.
 */

import { env } from "@/lib/env";

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

/** A normalized backend error carrying the HTTP status and error `code`. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }

  /** True when the caller is not authenticated (no/invalid session). */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** True when the authenticated student may not access this resource. */
  get isForbidden(): boolean {
    return this.status === 403;
  }
}

export interface RequestOptions {
  body?: unknown;
  signal?: AbortSignal;
}

function isErrorEnvelope(value: unknown): value is { error: ApiErrorBody } {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error: unknown }).error === "object" &&
    (value as { error: unknown }).error !== null
  );
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  const init: RequestInit = {
    method,
    credentials: "include",
    headers,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  if (signal) {
    init.signal = signal;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, init);
  } catch (cause) {
    throw new ApiError(0, {
      code: "NETWORK_ERROR",
      message: "Could not reach the server. Check your connection and try again.",
      details: cause,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data: unknown = text.length > 0 ? JSON.parse(text) : undefined;

  if (!response.ok) {
    if (isErrorEnvelope(data)) {
      throw new ApiError(response.status, data.error);
    }
    throw new ApiError(response.status, {
      code: "UNKNOWN_ERROR",
      message: response.statusText || "Request failed.",
    });
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>("POST", path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>("PUT", path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>("PATCH", path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
} as const;
