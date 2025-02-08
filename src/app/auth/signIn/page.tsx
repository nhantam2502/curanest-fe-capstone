"use client";
import { LoginForm } from "@/components/login-form";
import { AdminLoginForm } from "@/components/login-form-admin";
import { QrCode } from "lucide-react";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const getRoleTitle = () => {
    return role === "business" 
      ? "Đăng nhập dành cho quản trị viên"
      : "Đăng nhập dành cho khách hàng";
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center">
      <div className="relative w-full lg:w-1/2 h-1/3 lg:h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <p className="text_para">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
          <div className="mt-4">
            <QrCode size={128} />
          </div>
        </div>
        <img
          src="https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-nurturing-asian-nurse-providing-care-for-patients-and-elderly-adults-in-home-settingsemphasizing-the-concept-of-athome-nursing-photo-image_49286924.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative w-full lg:w-2/4 h-full flex flex-col p-16 sm:p-20 lg:p-32 justify-center items-center">
        <div className="w-full flex flex-col max-w-2xl p-10">
          <div className="w-full flex flex-col mb-6">
            <h1 className="text-6xl sm:text-5xl font-bold mb-4">
              {getRoleTitle()}
            </h1>
            <p className="text-lg sm:text-xl mb-6">
              Chào mừng bạn quay trở lại
            </p>
          </div>
          {role === "business" ? <AdminLoginForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;