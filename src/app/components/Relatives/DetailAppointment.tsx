"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PatientRecord } from "@/types/patient";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import { formatDate, getStatusText } from "@/lib/utils";
import { NurseItemType } from "@/types/nurse";
import { Button } from "@/components/ui/button";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import invoiceApiRequest from "@/apiRequest/invoice/apiInvoice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PatientDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    estTimeFrom?: string;
    estTimeTo?: string;
    apiData: Appointment;
    cusPackage?: CusPackageResponse | null;
  };
  nurse?: NurseItemType;
  patient: PatientRecord;
}

const PatientInfo: React.FC<{
  label: string;
  value: string | number;
  valueClassName?: string;
}> = ({
  label,
  value,
  valueClassName = "font-medium text-xl text-gray-900",
}) => (
  <div className="mb-4">
    <p className="text-gray-500 text-xl">{label}</p>
    <p className={valueClassName}>{value}</p>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "font-semibold text-green-800";
    case "done":
      return "font-semibold text-green-800 bg-green-100 hover:bg-green-200";
    case "waiting":
    case "confirmed":
    case "not_done":
      return "bg-white hover:bg-white cursor-pointer font-semibold text-yellow-500";
    case "upcoming":
      return "font-semibold text-blue-500";
    case "cancel":
      return "font-semibold text-red-500 ";
    default:
      return "font-semibold text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "done":
      return <CheckCircle className="w-5 h-5 " />;
    case "waiting":
    case "not_done":
      return <Hourglass className="w-5 h-5" />;
    case "canceled":
      return <XCircle className="w-5 h-5" />;
    default:
      return null;
  }
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
    {/* Patient Info Skeleton */}
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-200 rounded"></div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>

    {/* Nurse & Appointment Skeleton */}
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>

    {/* Package Skeleton */}
    <div className="space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
);

const TaskSkeleton = () => (
  <div className="mt-8">
    <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border rounded-lg p-4 bg-gray-50 mb-4 animate-pulse"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-gray-200 rounded"></div>
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="mt-2 h-5 w-32 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const PatientDetailDialog: React.FC<PatientDetailDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  nurse,
  patient,
}) => {
  const router = useRouter();
  const packageData = appointment.cusPackage?.data?.package;
  const tasks = appointment.cusPackage?.data?.tasks || [];
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Simulate content loading when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setIsContentLoading(true);
      const timer = setTimeout(() => {
        setIsContentLoading(false);
      }, 1000); // Simulate loading for 1 second
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    try {
      setIsPaymentLoading(true);

      // 1. Lấy thông tin hóa đơn
      let invoiceResponse = await appointmentApiRequest.getInvoice(
        packageData?.id || ""
      );

      if (!invoiceResponse?.payload?.data) {
        throw new Error("Không nhận được dữ liệu hóa đơn từ server");
      }

      let invoiceData = invoiceResponse.payload.data;

      if (invoiceData && invoiceData.length > 0) {
        // Nếu đã có URL thì chuyển hướng luôn
        if (typeof invoiceData[0]["payos-url"] === "string") {
          router.push(invoiceData[0]["payos-url"]);
          return;
        }

        // Nếu chưa có thì tạo URL
        const invoiceID = invoiceData[0].id;
        await invoiceApiRequest.createPaymentUrl(invoiceID);

        // Gọi lại getInvoice để lấy URL mới
        invoiceResponse = await appointmentApiRequest.getInvoice(
          packageData?.id || ""
        );
        invoiceData = invoiceResponse.payload.data;

        if (invoiceData[0] && typeof invoiceData[0]["payos-url"] === "string") {
          router.push(invoiceData[0]["payos-url"]);
          return;
        } else {
          throw new Error("Không thể tạo URL thanh toán");
        }
      } else {
        throw new Error("Không tìm thấy thông tin hóa đơn");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast({
        title: "Lỗi thanh toán",
        description:
          error instanceof Error
            ? `${error.message}. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.`
            : "Không thể xử lý thanh toán. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCancelPackage = async () => {
    try {
      setIsCancelLoading(true);

      if (!packageData?.id) {
        throw new Error("Không tìm thấy ID gói dịch vụ");
      }

      const response = await appointmentApiRequest.cancelAppointmentCusPackage(
        packageData.id
      );

      if (response && response.payload.success === true) {
        toast({
          title: "Hủy gói dịch vụ thành công",
          description: "Gói dịch vụ đã được hủy thành công",
          variant: "default",
        });

        // Đóng dialog và refresh dữ liệu nếu cần
        onClose();
        router.refresh();
      } else {
        throw new Error("Không thể hủy gói dịch vụ");
      }
    } catch (error) {
      console.error("Lỗi khi hủy gói dịch vụ:", error);
      toast({
        title: "Lỗi hủy gói dịch vụ",
        description:
          error instanceof Error
            ? `${error.message}. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.`
            : "Không thể hủy gói dịch vụ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsCancelLoading(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (!isLoading && !isPaymentLoading && !isCancelLoading) {
            onClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[1500px] max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold text-gray-800">
              Chi tiết lịch hẹn
            </DialogTitle>
          </DialogHeader>

          {isContentLoading ? (
            <>
              <LoadingSkeleton />
              <TaskSkeleton />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Thông tin bệnh nhân */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Bệnh nhân
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">
                        {(() => {
                          const fullName = patient["full-name"];
                          const words = fullName?.split(" ").filter(Boolean);
                          const lastWord = words?.slice(-1)[0];
                          const initial = lastWord?.[0]?.toUpperCase();
                          return initial || "?";
                        })()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xl font-semibold">
                      {patient["full-name"]}
                    </div>
                  </div>
                  <PatientInfo
                    label="Ngày sinh"
                    value={formatDate(new Date(patient.dob))}
                  />
                  <PatientInfo
                    label="Số điện thoại"
                    value={patient["phone-number"]}
                  />
                  <PatientInfo label="Địa chỉ" value={patient.address} />
                  <PatientInfo
                    label="Mô tả bệnh lý"
                    value={patient["desc-pathology"] || "Chưa có"}
                  />
                </div>

                {/* Thông tin điều dưỡng và lịch hẹn */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Điều dưỡng & Lịch hẹn
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={nurse?.["nurse-picture"]}
                        alt="Nurse Avatar"
                      />
                      <AvatarFallback>
                        {nurse?.["nurse-name"]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xl font-semibold">
                      {nurse?.["nurse-name"]}
                    </div>
                  </div>
                  <PatientInfo
                    label="Ngày hẹn"
                    value={formatDate(
                      new Date(appointment.apiData["est-date"])
                    )}
                  />
                  <PatientInfo
                    label="Thời gian"
                    value={`${appointment.estTimeFrom} - ${appointment.estTimeTo}`}
                  />

                  <div className="flex items-center space-x-2">
                    <p className="text-gray-500 text-xl">Trạng thái:</p>
                    <div>
                      <span
                        className={`text-xl ${getStatusColor(appointment.apiData.status)}`}
                      >
                        {getStatusText(appointment.apiData.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin gói dịch vụ và tác vụ */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Gói dịch vụ
                  </h3>
                  {packageData ? (
                    <>
                      <div className="text-gray-500 text-xl">
                        Tên gói
                        <div className="text-primary font-semibold">
                          {packageData.name}
                        </div>
                      </div>
                      <div className="text-gray-500 text-xl">
                        Tổng phí
                        <div className="text-red-500 font-semibold">{`${packageData["total-fee"].toLocaleString()} VND`}</div>
                      </div>

                      <PatientInfo
                        label="Trạng thái thanh toán"
                        value={
                          packageData["payment-status"] === "unpaid"
                            ? "Chưa thanh toán"
                            : "Đã thanh toán"
                        }
                        valueClassName={
                          packageData["payment-status"] === "unpaid"
                            ? "text-red-500 font-semibold text-xl"
                            : "text-green-500 font-semibold text-xl"
                        }
                      />

                      {/* Thêm nút thanh toán và hủy khi chưa thanh toán */}
                      {packageData["payment-status"] === "unpaid" &&
                        appointment.apiData.status.toLowerCase() !==
                          "cancel" && (
                          <div className="flex gap-4">
                            <Button
                              className="flex-1 text-lg"
                              onClick={handlePayment}
                              disabled={isPaymentLoading || isCancelLoading}
                            >
                              {isPaymentLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Đang xử lý...
                                </>
                              ) : (
                                "Thanh toán ngay"
                              )}
                            </Button>
                            <Button
                              className="flex-1 text-lg"
                              variant="destructive"
                              onClick={() => setShowCancelConfirm(true)}
                              disabled={isPaymentLoading || isCancelLoading}
                            >
                              {isCancelLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Đang hủy...
                                </>
                              ) : (
                                "Hủy gói dịch vụ"
                              )}
                            </Button>
                          </div>
                        )}
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Chưa có thông tin gói dịch vụ
                    </p>
                  )}
                </div>
              </div>

              {/* Danh sách tác vụ */}
              {tasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Danh sách tác vụ
                  </h3>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xl font-semibold text-gray-800">
                              {task["task-order"]}. {task.name}
                            </p>
                            <p className="text-lg text-red-600 mt-1">
                              {task["client-note"]
                                ? `Ghi chú: ${task["client-note"]}`
                                : ""}
                            </p>
                          </div>
                          <Badge
                            className={`${getStatusColor(task.status)} text-sm px-3 py-1 flex items-center gap-2`}
                          >
                            {getStatusIcon(task.status)}
                            {task.status === "not_done"
                              ? "Chưa hoàn thành"
                              : getStatusText(task.status)}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center text-gray-600 text-lg">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{task["est-duration"]} phút</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Hộp thoại xác nhận hủy */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Xác nhận hủy gói dịch vụ
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Bạn có chắc chắn muốn hủy gói dịch vụ này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelLoading}>
              Quay lại
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelPackage();
              }}
              disabled={isCancelLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCancelLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PatientDetailDialog;
