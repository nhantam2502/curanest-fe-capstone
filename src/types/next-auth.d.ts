// types/next-auth.d.ts
import type { DefaultSession } from "next-auth";
import { User } from "./account";

type UserRole = User["role"]; // Lấy type role từ User type

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: {
      role?: UserRole;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}