import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnLogin = req.nextUrl.pathname.startsWith("/login");
    const isOnApi = req.nextUrl.pathname.startsWith("/api");

    // Allow API routes and public pages
    if (isOnApi || req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // Redirect logged-in users away from login page
    if (isOnLogin && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Protect dashboard routes
    if (isOnDashboard && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle redirects in the middleware function
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
