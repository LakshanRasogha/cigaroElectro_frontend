const defaultApiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api.cigarroelectrico.com";

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API?.trim() || defaultApiBaseUrl;

const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

function resolveApiBaseUrl() {
  if (!normalizedApiBaseUrl) {
    return defaultApiBaseUrl;
  }

  try {
    const hostname = new URL(normalizedApiBaseUrl).hostname.toLowerCase();

    if (
      hostname === "cigarroelectrico.com" ||
      hostname === "www.cigarroelectrico.com"
    ) {
      return defaultApiBaseUrl;
    }
  } catch {
    return defaultApiBaseUrl;
  }

  return normalizedApiBaseUrl;
}

export const apiBaseUrl = resolveApiBaseUrl();

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
