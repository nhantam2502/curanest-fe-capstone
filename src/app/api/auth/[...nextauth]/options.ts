import { User } from "@/types/account";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users: User[] = [
  { id: "1", email: "", phone: "0123456789", password: "123", role: "nurse" },
  { id: "2", email: "", phone: "0987654321", password: "123", role: "staff" },
  { id: "3", email: "admin@gmail.com", phone:"", password: "123", role: "admin" },
  { id: "4", email: "", phone: "0123123123", password: "123", role: "relatives" },
];

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email/Phone",
          type: "text",
          placeholder: "email or phone number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const user = users.find((user) => {
            if (user.role === "admin") {
              return user.email === credentials?.identifier;
            } else {
              return user.phone === credentials?.identifier;
            }
          });

          if (user && credentials?.password === user.password) {
            return {
              id: user.id,
              email: user.email || user.phone, // Use phone as email for non-admin
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
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