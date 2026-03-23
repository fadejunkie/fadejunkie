import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const isPublicPath = createRouteMatcher([
  "/",
  "/signin(.*)",
  "/barber(.*)",
  "/shop(.*)",
  "/cc(.*)",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // 1. Subdomain rewrite
  const host = request.headers.get("host") ?? "";
  const parts = host.split(".");
  const isSubdomain =
    parts.length >= 3 &&
    !host.startsWith("localhost") &&
    !parts[0].startsWith("www") &&
    parts[0] !== "fadejunkie";

  if (isSubdomain) {
    const slug = parts[0];

    // cc.fadejunkie.com → /cc routes
    // Only rewrite the root path; let /signin etc. pass through normally
    if (slug === "cc") {
      const path = request.nextUrl.pathname;
      if (path === "/" || path.startsWith("/cc")) {
        const url = request.nextUrl.clone();
        url.pathname = path === "/" ? "/cc" : path;
        return NextResponse.rewrite(url);
      }
      // All other paths (e.g. /signin) resolve normally on the main app
      return;
    }

    const url = request.nextUrl.clone();
    url.pathname = `/barber/${slug}`;
    return NextResponse.rewrite(url);
  }

  // 2. Auth route protection
  const authed = await convexAuth.isAuthenticated();

  if (!isPublicPath(request) && !authed) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
  if (request.nextUrl.pathname === "/signin" && authed) {
    return nextjsMiddlewareRedirect(request, "/home");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
