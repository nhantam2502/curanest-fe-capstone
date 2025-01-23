import authApiRequest from "@/apiRequest/auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }
      
        try {
          const response = await authApiRequest.login({
            "phone-number": credentials.identifier,
            password: credentials.password,
          });
      
          console.log("Full login response: ", response);
      
          // Ensure the response contains the necessary user information
          if (response.payload?.data) {
            return {
              id: response.payload.data.id.toString(), // Ensure id is a string
              email: response.payload.data["phone-number"],
              role: response.payload.data.role,
              name: response.payload.data["full-name"],
            };
          }
      
          return null;
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.email = user.email;
      token.role = user.role;
      token.name = user.name;
    }
    return token;
  },
  async session({ session, token }) {
    if (session?.user) {
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.name = token.name;
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
