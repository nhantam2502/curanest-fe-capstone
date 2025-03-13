import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { PatientRecord } from "@/types/patient";

interface PatientDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    nurse_name: string;
    avatar: string;
    status: string;
    phone_number: string;
    techniques: string;
    total_fee: number;
    appointment_date: string;
    time_from_to: string;
  };
  nurse: {
    id: number;
    name: string;
    photo: string;
    specialization: string;
    avgRating: number;
    totalRating: number;
    totalPatients: number;
    hospital: string;
    certificate: string[];
    experience: string;
    education_level: string;
    services: {
      [key: string]: string[];
    };
  };
  patient: PatientRecord;
}

const PatientInfo: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-gray-500 text-xl mb-1">{label}</p>
    <p className="font-medium text-xl">{value}</p>
  </div>
);

const PatientDetailDialog: React.FC<PatientDetailDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  nurse,
  patient,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-semibold">
            Chi tiết lịch hẹn
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Thông tin bệnh nhân */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Thông tin bệnh nhân</h3>
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={patient["full-name"]} alt="Patient Avatar" />
                <AvatarFallback className="text-2xl">
                  {patient["full-name"]
                    ? patient["full-name"]
                        .split(" ")
                        .slice(-1)[0][0]
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="text-xl font-semibold">
                {patient["full-name"]}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <PatientInfo label="Ngày sinh" value={patient.dob} />
              <PatientInfo
                label="Số điện thoại"
                value={patient["phone-number"]}
              />
              <PatientInfo label="Tuổi" value="81" />
            </div>
            <PatientInfo label="Địa chỉ" value={patient.address} />
            <PatientInfo
              label="Mô tả bệnh lý"
              value={patient["desc-pathology"]}
            />
            <PatientInfo
              label="Lưu ý với điều duỡng"
              value={patient["note-for-nurse"]}
            />
          </div>

          {/* Thông tin điều dưỡng và lịch hẹn */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">
              Thông tin điều dưỡng và lịch hẹn
            </h3>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={nurse.photo} alt="Nurse Avatar" />
                <AvatarFallback>{nurse.name}</AvatarFallback>
              </Avatar>
              <div className="bg-[#00E2D6] text-white px-6 py-2 rounded-full text-lg">
                {nurse.name}
              </div>
              <p className="text-gray-600 text-lg">
                {appointment.phone_number}
              </p>
            </div>
            <PatientInfo
              label="Lịch hẹn ngày"
              value={appointment.appointment_date}
            />
            <PatientInfo label="Thời gian" value={appointment.time_from_to} />
            <div>
              <p className="text-gray-500 text-xl mb-2">Trạng thái:</p>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-green-500" />
                <span className="text-green-500 text-xl font-semibold">
                  {appointment.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xl mb-2">Dịch vụ đã đăng kí:</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {(appointment.techniques || "")
                  .split("-")
                  .filter(Boolean)
                  .map((technique, index) => (
                    <Badge
                      key={index}
                      className="text-white px-4 py-2 text-base"
                    >
                      {technique.trim()}
                    </Badge>
                  ))}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <p className="font-semibold text-xl text-red-500">
                Tổng số tiền:{" "}
                <span className="font-semibold">
                  {appointment.total_fee.toLocaleString()} VND
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailDialog;
