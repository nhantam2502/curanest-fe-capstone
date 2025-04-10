'use client'
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

const PaymentResultFail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">
            Thanh toán không thành công
          </CardTitle>
          <CardDescription>
            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
          </CardDescription>
        </CardHeader>

        {/* Content */}
        {/* <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mã giao dịch:</span>
              <span className="font-medium">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ngày:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-medium text-red-600">500.000 VND</span>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-4">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ qua{" "}
              <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
                support@example.com
              </a>
            </div>
          </div>
        </CardContent> */}

        {/* Footer */}
        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Quay về trang chủ
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={() => window.location.href = "/payment"}
          >
            Thử lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentResultFail;