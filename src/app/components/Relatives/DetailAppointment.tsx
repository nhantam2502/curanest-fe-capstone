import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

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
}

const PatientDetailDialog: React.FC<PatientDetailDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  nurse,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-semibold">Chi tiết lịch hẹn</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Patient Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Thông tin bệnh nhân</h3>
            
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={appointment.avatar} />
                <AvatarFallback>Patient</AvatarFallback>
              </Avatar>
              <div className="text-lg">
                Huỳnh Đào
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-gray-500 text-base mb-2">Ngày sinh</p>
                <p className="font-medium text-lg">15/01/1943</p>
              </div>
              <div>
                <p className="text-gray-500 text-base mb-2">Số điện thoại</p>
                <p className="font-medium text-lg">{appointment.phone_number}</p>
              </div>
              <div>
                <p className="text-gray-500 text-base mb-2">Tuổi</p>
                <p className="font-medium text-lg">81</p>
              </div>
              <div>
                <p className="text-gray-500 text-base mb-2">Ngày hẹn</p>
                <p className="font-medium text-lg">{appointment.appointment_date}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Địa chỉ</p>
              <p className="font-medium text-lg">64 Điện Biên Phủ, phường Đa Kao, quận 1, Hồ Chí Minh</p>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Mô tả</p>
              <p className="font-medium text-lg">Chấn thương gần cơ, đáy chẳng, trật khớp</p>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Lưu ý</p>
              <p className="font-medium text-lg">Theo dõi phản ứng của cơ thể của bệnh nhân và báo cáo kịp thời.</p>
            </div>
          </div>

          {/* Right Column - Nurse and Appointment Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Thông tin điều dưỡng và lịch hẹn</h3>
            
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={nurse.photo} />
                <AvatarFallback>{nurse.name}</AvatarFallback>
              </Avatar>
              <div className="bg-[#00E2D6] text-white px-6 py-2 rounded-full text-lg">
                {nurse.name}
              </div>
              <p className="text-gray-600 text-lg">{appointment.phone_number}</p>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Lịch hẹn ngày:</p>
              <p className="font-medium text-lg">{appointment.appointment_date}</p>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Thời gian:</p>
              <p className="font-medium text-lg">{appointment.time_from_to}</p>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Trạng thái:</p>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <span className="text-yellow-500 text-lg">{appointment.status}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-base mb-2">Dịch vụ đã đăng kí:</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {appointment.techniques.split('-').map((technique, index) => (
                  <Badge 
                    key={index}
                    className="bg-[#8B89E1] hover:bg-[#8B89E1] text-white px-4 py-2 text-base"
                  >
                    {technique.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <p className="text-gray-500 text-lg">Tổng số tiền: <span className="font-semibold">{appointment.total_fee.toLocaleString()} VND</span></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailDialog;