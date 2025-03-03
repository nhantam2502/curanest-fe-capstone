import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Phone, MapPin, AlertCircle, Info, Clock } from 'lucide-react';

export interface PatientInfoProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-blue-600 mt-1">{icon}</div>}
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
  appointment_date: string;
  appointment_time: string;
  address: string;
  description: string;
  note?: string;
}

interface PatientProfileProps {
  appointment: Appointment;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ appointment }) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600" />
          Thông tin bệnh nhân
        </h3>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={appointment.avatar} alt="Patient Avatar" />
            <AvatarFallback className="text-xl">
              {appointment.patient_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-xl font-semibold">{appointment.patient_name}</div>
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
              icon={<Calendar className="w-5 h-5" />}
              label="Ngày hẹn" 
              value={appointment.appointment_date} 
            />
            <PatientInfo 
              icon={<Clock className="w-5 h-5" />}
              label="Giờ hẹn" 
              value={appointment.appointment_time} 
            />
          </div>
          
          <PatientInfo 
            icon={<MapPin className="w-5 h-5" />}
            label="Địa chỉ" 
            value={appointment.address} 
          />
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Mô tả</h4>
            <p>{appointment.description}</p>
          </div>
          
          {appointment.note && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Lưu ý
              </h4>
              <p className="text-amber-800">{appointment.note}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};