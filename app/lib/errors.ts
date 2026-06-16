type ErrorPayload = {
  message?: string;
  error?: string;
};

/** Narrows an unknown catch value to a typed fetch Response error. */
export type FetchError = {
  status?: number;
  data?: ErrorPayload;
  message?: string;
};

/**
 * Parse a structured error message from a fetch Response or a plain Error.
 * Works as a drop-in replacement for the old axios.isAxiosError pattern.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const e = error as FetchError;

    if (e.data?.message) return e.data.message;
    if (e.data?.error) return e.data.error;
    if (e.message) return e.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Returns true when the provided FetchError has a 401 or 403 status.
 * Mirrors the old `isUnauthorizedError` behaviour from auth.ts.
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const status = (error as FetchError).status;
    return status === 401 || status === 403;
  }
  return false;
}
