"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const SelectRolePage = () => {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    router.push(`/auth/signIn?role=${role}`);
  };

  return (
    <div className="min-h-screen  flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://bluecare.vn/images/services/271661617788102.jpeg"
          alt="Beauty salon"
          className="rounded-r-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Curanest</h1>
            <p className="text-xl">
              Nền tảng đặt lịch điều dưỡng tại nhà hàng đầu
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Cards */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-10">Đăng nhập</h1>

        <div className="space-y-6 w-full max-w-md">
          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleRoleSelect("relatives")}
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-semibold mb-6">
                Curanest dành cho khách hàng
              </h2>
              <p className="text-gray-600 text-lg">
                Đặt lịch hẹn với điều dưỡng gần bạn
              </p>
              <div className="mt-5">
                <ArrowRight className="w-8 h-8 ml-2" />
              </div>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleRoleSelect("business")}
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-semibold mb-6">
                Curanest dành cho chuyên gia
              </h2>
              <p className="text-gray-600 text-lg">
                Quản lý và phát triển doanh nghiệp của bạn
              </p>
              <div className="mt-5">
                <ArrowRight className="w-8 h-8 ml-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
