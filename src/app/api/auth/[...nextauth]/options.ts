// auth/options.ts
import { User } from "@/types/account";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users: User[] = [
  { id: "1", email: "nurse@gmail.com", password: "123", role: "nurse" },
  { id: "2", email: "staff@gmail.com", password: "123", role: "staff" },
  { id: "3", email: "admin@gmail.com", password: "123", role: "admin" },
  { id: "4", email: "user@gmail.com", password: "123", role: "relatives" },
];

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const user = users.find((user) => user.email === credentials?.email);

          if (user && credentials?.password === user.password) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Lưu role vào token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role; // Đưa role vào session
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signout",
    error: "/auth/unauthorized",
  },
};
