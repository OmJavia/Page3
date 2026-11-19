import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow access to login page
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      const sessionCookie = request.cookies.get("p3_admin_session")?.value;
      if (sessionCookie === "authenticated" || sessionCookie === "true") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Verify session cookie for protected admin pages
    const sessionCookie = request.cookies.get("p3_admin_session")?.value;
    if (sessionCookie !== "authenticated" && sessionCookie !== "true") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
