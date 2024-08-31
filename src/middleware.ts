import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "pt"],
  defaultLocale: "en",
});

const isLandingPage = createRouteMatcher(["/"]);
const isProtectedRoute = createRouteMatcher([
  "/(en|pt)/dashboard(.*)",
  "/dashboard(.*)",
]);

export default convexAuthNextjsMiddleware(async (request) => {
  // Lightweight auth check
  const isAuthenticated = await isAuthenticatedNextjs();

  // Handle authentication logic
  if (isLandingPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isProtectedRoute(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // Apply intlMiddleware
  const response = await intlMiddleware(request);

  // Add auth state to headers for client-side use
  const finalResponse = response || NextResponse.next();
  finalResponse.headers.set("x-is-authenticated", String(isAuthenticated));

  return finalResponse;
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - static assets (i.e., files with extensions)
    "/((?!.*\\..*|_next).*)",
    "/(api|trpc)(.*)",
    // Add the language matcher
    "/(pt|en)/:path*",
  ],
};
