"use client";
import React from "react";
import { Button } from "@/components/ui/button"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg p-6 rounded-xl shadow-md">
        {/* Header */}
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription className="text-base">
            Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý.
          </CardDescription>
        </CardHeader>

        {/* Footer */}
        <CardFooter className="flex justify-center mt-4/2">
          <Button
            className="w-full h-12 text-base"
            onClick={() => window.location.href = "/"}
          >
            Quay về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
