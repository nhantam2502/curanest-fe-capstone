'use client'
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const email = useRef("");
  const password = useRef("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email: email.current,
        password: password.current,
        redirect: false, // Để tự xử lý điều hướng
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      // Lấy session để kiểm tra role
      const session = await getSession();
      const role = session?.user?.role;

      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "nurse":
          router.push("/nurse");
          break;
        case "staff":
          router.push("/staff");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br gap-1 from-cyan-300 to-sky-600">
      <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <input
          className="border p-2 rounded-md"
          placeholder="Email"
          type="email"
          onChange={(e) => (email.current = e.target.value)}
          disabled={loading}
        />
        <input
          className="border p-2 rounded-md"
          placeholder="Password"
          type="password"
          onChange={(e) => (password.current = e.target.value)}
          disabled={loading}
        />
        <button
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
