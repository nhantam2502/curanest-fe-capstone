import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        const user = { id: "42", email: "ha@gmail.com", password: "123" };

        if (credentials?.password === user.password) {
          return user;
        } else {
            return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signIn',
    signOut: '/auth/signout',
    error: '/auth/error', 
  }
};
