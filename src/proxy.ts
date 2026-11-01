import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, getSessionKey } from "@/lib/auth/token";

/**
 * Fast first gate for admin pages. Pages and server actions still call requireAdmin(),
 * which also checks the database for revoked sessions.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await jwtVerify(token, getSessionKey(), { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // Falls through to the login redirect.
    }
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
