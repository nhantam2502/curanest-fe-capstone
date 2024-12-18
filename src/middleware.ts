import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;

    if (
      req.nextUrl.pathname.startsWith("/AdminPage") &&
      (!token || token.role !== "admin")
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/Nurse") &&
      (!token || token.role !== "nurse")
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/User") &&
      (!token || token.role !== "user")
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/Nurse/:path*", "/User/:path*"],
};
