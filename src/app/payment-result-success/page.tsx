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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        {/* Header */}
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="w-12 h-12 text-green-500"
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
          <CardDescription>
            Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý.
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
              <span className="font-medium text-green-600">500.000 VND</span>
            </div>
          </div>
        </CardContent> */}

        {/* Footer */}
        <CardFooter className="flex justify-center">
          <Button
            className="w-full"
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