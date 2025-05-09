'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import invoiceApiRequest from "@/apiRequest/invoice/apiInvoice";

const PaymentResultFail = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Lấy URL hiện tại
    const url = new URL(window.location.href);
    
    // Sử dụng URLSearchParams để lấy các tham số
    const searchParams = new URLSearchParams(url.search);
    
    // Lấy giá trị của status và orderCode
    const status = searchParams.get("status");
    const code = searchParams.get("orderCode");
    
    if (status) setPaymentStatus(status);
    if (code) {
      setOrderCode(code);
      
      // Gọi API cancelPaymentUrl khi có orderCode
      if (code) {
        cancelPayment(code);
      }
    } else {
      setIsProcessing(false);
    }
  }, []);

  // Hàm gọi API hủy URL thanh toán
  const cancelPayment = async (code: string) => {
    try {
      setIsProcessing(true);
      const response = await invoiceApiRequest.cancelPaymentUrl(code);
      console.log("Response cancelPaymentUrl:", response);
      
      if (response.payload.data) {
        toast({
          title: "Đã hủy giao dịch",
          description: "Giao dịch đã được hủy thành công.",
          variant: "default",
        });
      } else {
        console.error("Lỗi khi hủy URL thanh toán:", response);
        toast({
          title: "Lỗi",
          description: "Không thể hủy giao dịch. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API hủy URL thanh toán:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi hủy giao dịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
        <CardContent>
          <div className="space-y-4">
            {paymentStatus && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="font-medium">{paymentStatus}</span>
              </div>
            )}
            {orderCode && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-medium">{orderCode}</span>
              </div>
            )}
            {isProcessing && (
              <div className="text-center mt-2">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Đang xử lý...
                  </span>
                </div>
                <span className="ml-2 text-sm text-muted-foreground">Đang hủy giao dịch...</span>
              </div>
            )}
            <div className="text-center text-sm text-muted-foreground mt-4">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ qua{" "}
              <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
                support@example.com
              </a>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/relatives/booking"}
            disabled={isProcessing}
          >
            Quay về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentResultFail;