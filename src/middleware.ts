import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin and /api/admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  // Handle Login Page access
  if (pathname === "/admin/login") {
    if (session) {
      // Already authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Handle Public API Auth endpoints
  if (
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/seed"
  ) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Handle Protected /admin UI routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Handle Protected /api/admin API routes
  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      const res = NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Authentication required.",
        },
        { status: 401 }
      );
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return res;
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
