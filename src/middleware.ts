// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Định nghĩa kiểu dữ liệu cho NextAuthRequest
type NextAuthRequest = NextRequest & {
  nextauth: {
    token: {
      role?: string;
      [key: string]: any;
    } | null;
  };
};

export default withAuth(
  function middleware(req: NextAuthRequest) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log("Token:", token);
    console.log("Path:", path);

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

    // Protect relatives routes
    if (path.startsWith("/relatives") && token?.role !== "relatives") {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signIn",  // Đặt trang đăng nhập tùy chỉnh
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/nurse/:path*",
    "/staff/:path*",
    "/relatives/:path*",
  ],
};