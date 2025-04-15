import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
  Info,
  Clock,
  Home,
  Building2,
  MapPinned,
  Stethoscope,
} from "lucide-react";

export interface PatientInfoProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-blue-600">{icon}</div>}
      <div>
        <div className="text-gray-500 text-sm">{label}</div>
        <div className="font-medium mt-1">{value}</div>
      </div>
    </div>
  );
};

export interface Appointment {
  id: string;
  patient_name: string;
  avatar?: string;
  phone_number: string;
  birth_date: string;
  age: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "desc-pathology": string;
  "note-for-nurse": string;
  note?: string;
}

interface PatientProfileProps {
  appointment: Appointment;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  appointment,
}) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Info className="w-5 h-5 text-black-600" />
          Thông tin bệnh nhân
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={appointment.avatar} alt="Patient Avatar" />
            <AvatarFallback className="text-xl">
              {appointment.patient_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-xl font-semibold">
            {appointment.patient_name}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientInfo
              icon={<Calendar className="w-5 h-5" />}
              label="Ngày sinh"
              value={`${appointment.birth_date} (${appointment.age} tuổi)`}
            />
            <PatientInfo
              icon={<Phone className="w-5 h-5" />}
              label="Số điện thoại"
              value={appointment.phone_number}
            />
            <PatientInfo
              icon={<Home className="w-5 h-5" />}
              label="Địa chỉ"
              value={appointment.address}
            />

            <PatientInfo
              icon={<Building2 className="w-5 h-5" />}
              label="Phường/Xã"
              value={appointment.ward}
            />
            <PatientInfo
              icon={<MapPinned className="w-5 h-5" />}
              label="Quận/Huyện"
              value={appointment.district}
            />
            <PatientInfo
              icon={<MapPin className="w-5 h-5" />}
              label="Tỉnh/Thành phố"
              value={appointment.city}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              Mô tả bệnh lý
            </h4>
            <p>{appointment["desc-pathology"]}</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Lưu ý
            </h4>
            <p className="text-amber-800">{appointment["note-for-nurse"]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
