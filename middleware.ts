// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Define routes that require authentication
  const isProtected = pathname.startsWith("/dashboard");

  // If trying to access the dashboard while NOT logged in -> redirect to get-started page
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/get-started", req.url));
  }

  return NextResponse.next();
});

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*"],
};