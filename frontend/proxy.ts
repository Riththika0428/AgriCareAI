import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route → allowed roles
// const ROUTE_ROLES: Record<string, string[]> = {
//   "/dashboard/farmer":   ["farmer"],
//   "/dashboard/consumer": ["consumer"],
//   "/dashboard/admin":    ["admin"],
// };
const ROUTE_ROLES: Record<string, string[]> = {
  "/dashboard/farmer":   ["farmer"],
  "/dashboard/consumer": ["consumer", "user"],  // backend stores consumers as "user"
  "/dashboard/admin":    ["admin"],
};
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find if this path is under a protected prefix
  const matchedPrefix = Object.keys(ROUTE_ROLES).find(prefix =>
    pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!matchedPrefix) return NextResponse.next(); // Not a protected route

  // Read the stored user from the cookie (we'll set this on login — see Fix 3)
  const userCookie = request.cookies.get("agriai_user")?.value;

  if (!userCookie) {
    // Not logged in — send to landing page
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    const allowed = ROUTE_ROLES[matchedPrefix];

    if (!allowed.includes(user.role)) {
      // Wrong role — redirect to their own dashboard
      const roleHome: Record<string, string> = {
        farmer:   "/dashboard/farmer",
        consumer: "/dashboard/consumer",
        admin:    "/dashboard/admin",
      };
      const redirect = roleHome[user.role] ?? "/";
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  } catch {
    // Corrupt cookie — clear and redirect
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("agriai_user");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};