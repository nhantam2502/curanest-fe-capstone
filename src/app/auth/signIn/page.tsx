"use client";
import { LoginForm } from "@/components/login-form";
import { AdminLoginForm } from "@/components/login-form-admin";
import { QrCode } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/register-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(true);

  // Set initial state based on URL parameters
  useEffect(() => {
    if (mode === "register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mode]);

  const getRoleTitle = () => {
    if (!isLogin) return "Đăng ký tài khoản mới";

    return role === "business"
      ? "Đăng nhập dành cho quản trị viên"
      : "Đăng nhập dành cho khách hàng";
  };

  const toggleForm = () => {
    // Update URL when toggling between login and register
    const baseUrl = window.location.pathname;
    const newMode = isLogin ? "register" : "login";
    const newUrl = `${baseUrl}?${role ? `role=${role}&` : ''}mode=${newMode}`;
    window.history.pushState({}, '', newUrl);
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">
      <motion.div
        className="relative w-full lg:w-1/2 h-[300px] lg:h-full flex flex-col"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute top-[20%] left-[10%] z-10 flex flex-col">
          <p className="text_para text-white drop-shadow-lg">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
          <div className="mt-4">
            <QrCode size={128} className="text-white" />
          </div>
        </div>
        <img
          src="https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-nurturing-asian-nurse-providing-care-for-patients-and-elderly-adults-in-home-settingsemphasizing-the-concept-of-athome-nursing-photo-image_49286924.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="relative w-full lg:w-2/4 h-full flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ScrollArea className="w-full h-[calc(100vh-300px)] lg:h-screen">
          <div className="w-full flex flex-col items-center p-8 sm:p-16 lg:p-24">
            <div className="w-full flex flex-col max-w-2xl p-6 sm:p-10">
              <motion.div
                className="w-full flex flex-col mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  {getRoleTitle()}
                </h1>
                <p className="text-base sm:text-xl mb-6">
                  {isLogin
                    ? "Chào mừng bạn quay trở lại"
                    : "Tạo tài khoản mới để tiếp tục"}
                </p>
              </motion.div>

              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  role === "business" ? (
                    <AdminLoginForm />
                  ) : (
                    <LoginForm />
                  )
                ) : (
                  <RegisterForm />
                )}
              </motion.div>

              <motion.div
                className="w-full flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <button
                  onClick={toggleForm}
                  className="text-lg font-medium whitespace-nowrap cursor-pointer hover:underline"
                >
                  {isLogin
                    ? "Chưa có tài khoản? Đăng ký ngay"
                    : "Đã có tài khoản? Đăng nhập"}
                </button>
              </motion.div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
};

export default LoginPage;