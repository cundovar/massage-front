import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "massagesdhelene.com";

export function middleware(request: NextRequest) {
  const requestHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  if (requestHost === `www.${CANONICAL_HOST}`) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https";
    canonicalUrl.hostname = CANONICAL_HOST;
    canonicalUrl.port = "";

    return NextResponse.redirect(canonicalUrl, 308);
  }

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
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
