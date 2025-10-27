import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const coachRoutes = createRouteMatcher([
  "/(coach)(.*)",
  "/api/(programs|phases|workouts|sets|assignments|subscriptions|stripe|mux|pusher|media)(.*)"
]);

const athleteRoutes = createRouteMatcher([
  "/(athlete)(.*)",
  "/api/(workout-logs)(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl.clone();

  if (!userId) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role ?? sessionClaims?.role;
  const orgIdHeader = req.headers.get("x-org-id");
  const orgFromClaims = (sessionClaims?.publicMetadata as { orgId?: string })?.orgId;
  const orgId = orgIdHeader ?? orgFromClaims ?? sessionClaims?.org_id ?? sessionClaims?.orgId;

  const host = req.headers.get("host") ?? "";
  const [subdomain] = host.split(".");
  const derivedOrg = subdomain && subdomain !== "www" && subdomain !== "localhost" ? subdomain : undefined;
  const effectiveOrg = orgId ?? derivedOrg;

  const response = NextResponse.next({
    request: {
      headers: new Headers(req.headers)
    }
  });

  if (effectiveOrg) {
    response.headers.set("x-org-id", String(effectiveOrg));
  }
  if (role) {
    response.headers.set("x-user-role", String(role));
  }

  if (coachRoutes(req) && role !== "COACH") {
    url.pathname = "/athlete";
    return NextResponse.redirect(url);
  }

  if (athleteRoutes(req) && role !== "ATHLETE" && role !== "COACH") {
    url.pathname = "/coach";
    return NextResponse.redirect(url);
  }

  return response;
});

export const config = {
  matcher: ["/(coach)(.*)", "/(athlete)(.*)", "/api/(.*)"]
};
