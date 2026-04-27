const defaultApiBaseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API?.trim() || defaultApiBaseUrl;

export const apiBaseUrl = rawApiBaseUrl.endsWith("/")
  ? rawApiBaseUrl.slice(0, -1)
  : rawApiBaseUrl;

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export function getAuthHeaders() {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
