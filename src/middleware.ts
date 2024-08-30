import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";

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
  // First, handle the authentication logic
  if (isLandingPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // If authentication is okay, then apply the intlMiddleware
  const response = await intlMiddleware(request);

  // Return the response from intlMiddleware or continue with the default response
  return response || undefined;
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
