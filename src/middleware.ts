// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Protect nurse routes
    if (path.startsWith("/nurse") && token?.role !== "nurse") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Protect staff routes
    if (path.startsWith("/staff") && token?.role !== "staff") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

     // Protect staff routes
     if (path.startsWith("/relatives") && token?.role !== "relatives") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/nurse/:path*", "/staff/:path*", "/relatives/:path*"],
};