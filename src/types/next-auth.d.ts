// types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "relatives" | "nurse" | "staff" | "admin";
    dob?: string;
    "phone-number"?: string;
    address?: string;
    ward?: string;
    district?: string;
    city?: string;
    email?: string;
    "full-name"?: string;
    "access_token"?: string;
  }

  interface Session {
    user: {
      role?: User["role"];
      dob?: User["dob"];
      "phone-number"?: User["phone-number"];
      address?: User["address"];
      ward?: User["ward"];
      district?: User["district"];
      city?: User["city"];
      email?: User["email"];
      "full-name"?: User["full-name"];
      "access_token"?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: User["role"];
    dob?: User["dob"];
    "phone-number"?: User["phone-number"];
    address?: User["address"];
    ward?: User["ward"];
    district?: User["district"];
    city?: User["city"];
    email?: User["email"];
    "full-name"?: User["full-name"];
    "access_token"?: string;
  }
}
