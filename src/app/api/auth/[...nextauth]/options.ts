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
        isAdmin: {
          label: "Is Admin",
          type: "checkbox",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.identifier || !credentials.password) {
          console.log("Missing credentials.");
          return null;
        }

        let response;
        
        // Kiểm tra xem đang đăng nhập là admin hay user thường
        if (credentials.isAdmin === "true") {
          response = await authApiRequest.loginForAdmin({
            email: credentials.identifier,
            password: credentials.password,
          });
        } else {
          response = await authApiRequest.login({
            "phone-number": credentials.identifier,
            password: credentials.password,
          });
        }

        if (response.status === 200 && response.payload?.data) {
          const user = response.payload.data["account-info"];
          const token = response.payload.data.token;
         
          return {
            id: user.id || "",
            name: user["full-name"],
            "phone-number": user["phone-number"],
            email: user.email,
            role: user.role,
            access_token: token.access_token
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user["phone-number"] = token["phone-number"];
        session.user.access_token = token.access_token;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token["phone-number"] = user["phone-number"];
        token.access_token = user.access_token;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signout",
    error: "/auth/unauthorized",
  },
};