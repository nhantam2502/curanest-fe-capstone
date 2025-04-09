import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Hourglass } from "lucide-react";
import { PatientRecord } from "@/types/patient";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import { formatDate } from "@/lib/utils";
import { NurseItemType } from "@/types/nurse";

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
    case "completed":
    case "done":
      return "font-semibold text-green-800";
    case "waiting":
    case "not_done":
      return "bg-white hover:bg-white cursor-pointer font-semibold text-yellow-500";
    case "canceled":
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

const PatientDetailDialog: React.FC<PatientDetailDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  nurse,
  patient,
}) => {
  
  const packageData = appointment.cusPackage?.data?.package;
  const tasks = appointment.cusPackage?.data?.tasks || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1500px] max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold text-gray-800">
            Chi tiết lịch hẹn
          </DialogTitle>
        </DialogHeader>

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
                <AvatarImage src={nurse?.["nurse-picture"]} alt="Nurse Avatar" />
                <AvatarFallback>{nurse?.["nurse-name"]?.[0]}</AvatarFallback>
              </Avatar>
              <div className="text-xl font-semibold">{nurse?.["nurse-name"]}</div>
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
                      {/* <p className="text-lg text-gray-600">
                        Lời khuyên: {task["staff-advice"] || "Không có"}
                      </p> */}
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
                    <span>
                      {task["est-duration"]} phút 
                    
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailDialog;
