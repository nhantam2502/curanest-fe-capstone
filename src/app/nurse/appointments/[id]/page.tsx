"use client"
import {
  MedicalReport,
  MedicalReportCard,
} from "@/app/components/Nursing/MedicalReportCard";
import {
  Appointment,
  PatientProfile,
} from "@/app/components/Nursing/PatientRecord";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ServicesList from "@/app/components/Nursing/ServicesList";
import ServiceCheckTask from "@/app/components/Nursing/ServiceCheckTask";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface cho dịch vụ đơn lẻ
interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
}

// Interface cho dịch vụ đơn lẻ mở rộng
interface EnhancedService extends Service {
  customerNote?: string;
  staffNote?: string;
  times: number;
  isCompleted?: boolean;
  nurseNote?: string;
}

// Interface cho gói dịch vụ
interface ServicePackage {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  services: EnhancedService[];
  totalDuration: string;
  totalPrice: string;
}

// Mở rộng interface Appointment để thêm gói dịch vụ
interface EnhancedAppointment extends Appointment {
  servicePackage: ServicePackage;
}

const DetailAppointment: React.FC = () => {
  // Dữ liệu mẫu cho cuộc hẹn với dịch vụ mở rộng
  const appointment: EnhancedAppointment = {
    id: "1",
    patient_name: "Huỳnh Đào",
    avatar: "/avatars/patient.jpg",
    phone_number: "0923 456 789",
    birth_date: "15/01/1943",
    age: "81",
    address: "64 Điện Biên Phủ",
    ward: "Phường Đa Kao",
    district: "Quận 1",
    city: "Hồ Chí Minh",

    description: "Chấn thương gần cơ, đáy chẳng, trật khớp",
    note: "Theo dõi phản ứng của cơ thể bệnh nhân và báo cáo kịp thời.",
    servicePackage: {
      id: "pkg-001",
      name: "Gói điều trị phục hồi chức năng cao cấp",
      appointmentDate: "15/03/2025",
      appointmentTime: "09:00 - 11:00",
      status: "in-progress",
      services: [
        {
          id: "1",
          name: "Vật lý trị liệu",
          category: "Điều trị cơ xương khớp",
          description:
            "Phương pháp điều trị không dùng thuốc, tập trung vào việc phục hồi chức năng vận động",
          duration: "45 phút",
          price: "350.000 VNĐ",
          customerNote: "Khách hàng báo nhiệt độ ổn định",
          staffNote: "Điều dưỡng ghi chú: Kiểm tra nhiệt độ định kỳ.",
          times: 1,
          isCompleted: false,
        },
        {
          id: "2",
          name: "Massage trị liệu",
          category: "Điều trị đau nhức",
          description:
            "Massage chuyên sâu giúp giảm đau, thư giãn cơ và tăng cường tuần hoàn máu",
          duration: "30 phút",
          price: "250.000 VNĐ",
          customerNote: "Khách hàng cảm thấy tốt.",
          staffNote: "Điều dưỡng ghi chú: Theo dõi huyết áp định kỳ.",
          times: 1,
          isCompleted: false,
        },
        {
          id: "3",
          name: "Châm cứu",
          category: "Y học cổ truyền",
          description:
            "Kích thích các huyệt đạo để giảm đau và cải thiện chức năng cơ thể",
          duration: "45 phút",
          price: "400.000 VNĐ",
          customerNote: "Khách hàng báo cảm giác tê nhẹ.",
          staffNote: "Điều dưỡng ghi chú: Theo dõi phản ứng của bệnh nhân.",
          times: 1,
          isCompleted: false,
        },
      ],
      totalDuration: "120 phút",
      totalPrice: "1.000.000 VNĐ",
    },
  };

  const [updatedAppointment, setUpdatedAppointment] = useState<EnhancedAppointment>(appointment);

  const handleServiceComplete = (serviceId: string, nurseNote: string) => {
    setUpdatedAppointment((prev) => {
      const updatedServices = prev.servicePackage.services.map((service) => {
        if (service.id === serviceId) {
          return {
            ...service,
            nurseNote,
            isCompleted: true,
          };
        }
        return service;
      });

      return {
        ...prev,
        servicePackage: {
          ...prev.servicePackage,
          services: updatedServices,
        },
      };
    });
    console.log("updatedAppointment: ", updatedAppointment)
  };

  return (
    <div className="mx-auto">
      {/* Breadcrumb từ shadcn/ui */}
      <Breadcrumb className="px-5 py-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/nurse/appointments" className="text-xl">
              Danh sách cuộc hẹn sắp tới
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl">
              Chi tiết cuộc hẹn: {updatedAppointment.patient_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="px-10 pb-10">
        <h2 className="text-3xl font-bold mb-8">Chi tiết cuộc hẹn</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cột thông tin bệnh nhân - Bên trái */}
          <PatientProfile appointment={updatedAppointment} />

          {/* Cột thông tin dịch vụ - Bên phải */}
          <div>
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Thông tin dịch vụ</TabsTrigger>
                <TabsTrigger value="checklist">Danh sách kiểm tra</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services">
                <ServicesList servicePackage={updatedAppointment.servicePackage} />
              </TabsContent>
              
              <TabsContent value="checklist">
                <ServiceCheckTask 
                  services={updatedAppointment.servicePackage.services} 
                  onServiceComplete={handleServiceComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAppointment;