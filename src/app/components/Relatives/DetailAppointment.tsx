"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Hourglass, Loader2 } from "lucide-react";
import { PatientRecord } from "@/types/patient";
import {
  Appointment,
  CusPackageResponse,
} from "@/types/appointment";
import { formatDate } from "@/lib/utils";
import { NurseItemType } from "@/types/nurse";
import { Button } from "@/components/ui/button";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { useRouter } from "next/navigation";

interface PatientDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    time_from_to: string;
    apiData: Appointment;
    cusPackage?: CusPackageResponse | null;
  };
  nurse?: NurseItemType;
  patient: PatientRecord;
}

const PatientInfo: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="mb-4">
    <p className="text-gray-500 text-xl">{label}</p>
    <p className="font-medium text-xl text-gray-900">{value}</p>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "done":
      return "font-semibold text-green-800";
    case "waiting":
    case "confirmed":
    case "changed":
    case "not_done":
      return "bg-white hover:bg-white cursor-pointer font-semibold text-yellow-500";
    case "canceled":
    case "refused":
      return "font-semibold text-red-800";
    default:
      return "font-semibold text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "done":
      return <CheckCircle className="w-5 h-5" />;
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
      <div key={i} className="border rounded-lg p-4 bg-gray-50 mb-4 animate-pulse">
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
  const [isContentLoading, setIsContentLoading] = useState(true);

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
      const invoiceResponse = await appointmentApiRequest.getInvoice(
        packageData?.id || ""
      );
      const invoiceData = invoiceResponse.payload.data;

      // Chuyển hướng đến URL thanh toán nếu có
      if (invoiceData && invoiceData.length > 0) {
        router.push(invoiceData[0]["payos-url"]);
      }
    } catch (invoiceError) {
      console.error("Lỗi khi lấy thông tin hóa đơn:", invoiceError);
      router.push("/relatives/appointments");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isLoading && !isPaymentLoading) {
        onClose();
      }
    }}>
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
                <h3 className="text-2xl font-semibold text-gray-800">Bệnh nhân</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={patient["full-name"]} alt="Patient Avatar" />
                    <AvatarFallback className="text-xl">
                      {patient["full-name"]
                        ?.split(" ")
                        .slice(-1)[0][0]
                        ?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xl font-semibold">
                    {patient["full-name"]}
                  </div>
                </div>
                <PatientInfo label="Ngày sinh" value={patient.dob} />
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
                    <AvatarFallback>{nurse?.["nurse-name"]?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-xl font-semibold">
                    {nurse?.["nurse-name"]}
                  </div>
                </div>
                <PatientInfo
                  label="Ngày hẹn"
                  value={formatDate(new Date(appointment.apiData["est-date"]))}
                />
                <PatientInfo label="Thời gian" value={appointment.time_from_to} />

                <div className="flex items-center space-x-2">
                  <p className="text-gray-500 text-xl">Trạng thái:</p>
                  <div>
                    <span
                      className={`text-xl ${getStatusColor(appointment.apiData.status)}`}
                    >
                      {appointment.apiData.status}
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
                    />
                    {/* Thêm nút thanh toán khi chưa thanh toán */}
                    {packageData["payment-status"] === "unpaid" && (
                      <Button
                        className="w-full mt-4 text-xl"
                        onClick={handlePayment}
                        disabled={isPaymentLoading}
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
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Chưa có thông tin gói dịch vụ</p>
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
                            : task.status}
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
  );
};

export default PatientDetailDialog;