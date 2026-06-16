import type { AppUser } from "@/app/lib/types";
export { isUnauthorizedError } from "@/app/lib/errors";

function clearSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  const secureCookie = window.location.protocol === "https:" ? " Secure;" : "";
  document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;${secureCookie} SameSite=Strict`;
}

export function persistAuthSession(user: AppUser, token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("user", JSON.stringify(user));
  window.localStorage.setItem("token", token);

  const secureCookie = window.location.protocol === "https:" ? " Secure;" : "";
  document.cookie = `session=${token}; path=/;${secureCookie} SameSite=Strict`;
  window.dispatchEvent(new Event("storage"));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("user");
  window.localStorage.removeItem("token");
  clearSessionCookie();
  window.dispatchEvent(new Event("storage"));
}

