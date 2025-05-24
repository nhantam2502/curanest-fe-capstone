"use client";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefefe] to-[#FEF0D7] flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl rounded-3xl shadow-2xl border-none bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-28 h-28 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
            <Shield className="w-14 h-14 text-red-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-800">
            Truy cập bị từ chối
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Bạn không có quyền truy cập vào trang này.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* <Alert
            variant="destructive"
            className="bg-red-50 text-red-800 text-base px-5 py-4"
          >
            <Shield className="h-6 w-6 mr-2 mb-2" />
            <AlertDescription>
              Vui lòng kiểm tra tài khoản của bạn hoặc liên hệ với quản trị viên
              nếu bạn cho rằng đây là lỗi.
            </AlertDescription>
          </Alert> */}

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-100 py-3 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-[#64D1CB] hover:bg-[#5ec8c3] text-white py-3 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-base text-gray-500">
              Mã lỗi:{" "}
              <span className="font-mono font-semibold">
                401 - Unauthorized
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
