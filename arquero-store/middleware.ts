import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const isAdminSubdomain =
    host.startsWith("admin.arqueroco.com") ||
    host.startsWith("admin.arquero-store.vercel.app");

  if (!isAdminSubdomain) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // If already under /admin, pass through
  if (pathname.startsWith("/admin")) return NextResponse.next();

  // Rewrite root to /admin
  const url = req.nextUrl.clone();
  url.pathname = "/admin" + (pathname === "/" ? "" : pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|brand|fonts|videos|images).*)"],
};
