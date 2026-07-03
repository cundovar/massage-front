import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicAdminRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

  if (pathname.startsWith("/admin") && !publicAdminRoutes.includes(pathname)) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
