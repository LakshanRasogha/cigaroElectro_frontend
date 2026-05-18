import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();
  if (host === "www.cigarroelectrico.com") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = "cigarroelectrico.com";
    return NextResponse.redirect(redirectUrl, 301);
  }

  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role !== "admin") {
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
