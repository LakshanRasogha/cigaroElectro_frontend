import { apiBaseUrl } from "@/app/lib/site";

export { apiBaseUrl };

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiFetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

/**
 * Thin fetch wrapper that returns `{ data, status }` to mirror the axios
 * response shape — makes it a drop-in replacement in existing call sites.
 * Throws on non-2xx responses with a message extracted from the JSON body.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<{ data: T; status: number }> {
  const { method = "GET", headers = {}, body } = options;

  const res = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON regardless of status so we can surface error messages
  let data: T;
  try {
    data = await res.json();
  } catch {
    data = undefined as T;
  }

  if (!res.ok) {
    const msg =
      (data as Record<string, unknown>)?.message ||
      (data as Record<string, unknown>)?.error ||
      `HTTP ${res.status}`;
    throw Object.assign(new Error(String(msg)), { status: res.status, data });
  }

  return { data, status: res.status };
}

