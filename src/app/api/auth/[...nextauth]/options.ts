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
      authorize: async (credentials) => {
        if (!credentials?.identifier || !credentials.password) {
          console.log("Missing credentials.");
          return null;
        }

        const response = await authApiRequest.login({
          "phone-number": credentials.identifier,
          password: credentials.password,
        });

        // console.log("API Response in authorize: ", response); // Kiểm tra dữ liệu trả về từ API

        if (response.status === 200 && response.payload?.data) {
          const user = response.payload.data["account-info"];
          // console.log("User data in authorize: ", user); // Kiểm tra user data
          const token = response.payload.data.token;
          // console.log("Token data in authorize: ", token); // Kiểm tra token data
         
          return {
            id: user.id || "",
            name: user["full-name"],
            "phone-number": user["phone-number"],
            email: user.email,
            role: user.role,
            access_token: token.access_token

            // address: user.address || "N/A",
            // city: user.city || "N/A",
            // dob: user.dob || "N/A",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user["phone-number"] = token["phone-number"];
        session.user.access_token = token.access_token; // Add this line

        // session.user.address = token.address;
        // session.user.city = token.city;
        // session.user.dob = token.dob;

        // console.log("Session in session callback: ", session); // Log session để kiểm tra dữ liệu
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token["phone-number"] = user["phone-number"];
        token.access_token = user.access_token; // Add this line

        // token.address = user.address;
        // token.city = user.city;
        // token.dob = user.dob;

        // console.log("Token in jwt callback: ", token); // Log token để kiểm tra dữ liệu
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
