"use client";
import { useEffect } from "react";
import "./globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import GuestPage from "./guest/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ca } from "date-fns/locale";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (session?.user?.role) {
      console.log("session: ", session.user.role);
      switch (session.user.role) {
        case "nurse":
          router.push("/nurse");
          break;
        case "staff":
          router.push("/staff");
          break;
        case "admin":
          router.push("/admin");
          break;
        case "relatives":
          router.push("/relatives/booking");
          break;
        default:
          router.push("/");
      }
    }
  }, [session, router]);

  return (
    <div>
      {!session ? (
        <GuestPage />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FEFEFE] to-[#FEF0D7]">
          <div className="flex flex-col items-center space-y-4 p-8 rounded-lg">
            {/* Logo */}
            <span className="text-3xl font-bold text-[#64D1CB] mb-6">
              CURANEST
            </span>

            {/* Loading spinner */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
              <Loader2 className="h-12 w-12 animate-spin text-[#64D1CB]" />
            </div>

            {/* Loading text */}
            <div className="text-[#64D1CB] text-sm font-medium mt-4">
              Đang tải...
            </div>

            {/* Loading dots */}
            <div className="flex space-x-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-[#64D1CB] animate-bounce"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
