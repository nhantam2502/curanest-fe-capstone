"use client"
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppointmentHistoryFilters from "@/app/components/Nursing/AppointmentHistoryFilters";
import AppointmentHistoryTable from "@/app/components/Nursing/AppointmentHistoryTable";

// Interface cơ sở cho cuộc hẹn
interface Appointment {
  id: string;
  patient_name: string;
  date: Date;
  servicePackage: {
    id: string;
    name: string;
    services: {
      id: string;
      name: string;
    }[];
  };
  status: "completed" | "cancelled" | "no-show";
  totalAmount: string;
  paymentStatus: "paid" | "unpaid" | "partial";
}

const AppointmentHistory: React.FC = () => {
  // Dữ liệu mẫu
  const appointments: Appointment[] = [
    {
      id: "APT-001",
      patient_name: "Huỳnh Đào",
      date: new Date(2025, 2, 15), // 15/03/2025
      servicePackage: {
        id: "pkg-001",
        name: "Gói điều trị phục hồi chức năng cao cấp",
        services: [
          { id: "srv-001", name: "Vật lý trị liệu" },
          { id: "srv-002", name: "Massage trị liệu" },
          { id: "srv-003", name: "Châm cứu" }
        ]
      },
      status: "completed",
      totalAmount: "1.000.000 VNĐ",
      paymentStatus: "paid"
    },
    {
      id: "APT-002",
      patient_name: "Nguyễn Văn An",
      date: new Date(2025, 2, 12), // 12/03/2025
      servicePackage: {
        id: "pkg-002",
        name: "Gói điều trị đau lưng",
        services: [
          { id: "srv-001", name: "Vật lý trị liệu" },
          { id: "srv-004", name: "Bấm huyệt" }
        ]
      },
      status: "completed",
      totalAmount: "750.000 VNĐ",
      paymentStatus: "paid"
    },
    {
      id: "APT-003",
      patient_name: "Trần Thị Bình",
      date: new Date(2025, 2, 10), // 10/03/2025
      servicePackage: {
        id: "pkg-003",
        name: "Gói massage thư giãn",
        services: [
          { id: "srv-002", name: "Massage trị liệu" }
        ]
      },
      status: "cancelled",
      totalAmount: "250.000 VNĐ",
      paymentStatus: "unpaid"
    },
    {
      id: "APT-004",
      patient_name: "Lê Văn Cường",
      date: new Date(2025, 2, 8), // 08/03/2025
      servicePackage: {
        id: "pkg-004",
        name: "Gói điều trị thoái hóa khớp",
        services: [
          { id: "srv-001", name: "Vật lý trị liệu" },
          { id: "srv-003", name: "Châm cứu" },
          { id: "srv-005", name: "Thuỷ trị liệu" }
        ]
      },
      status: "completed",
      totalAmount: "1.200.000 VNĐ",
      paymentStatus: "partial"
    },
    {
      id: "APT-005",
      patient_name: "Phạm Thị Dung",
      date: new Date(2025, 2, 5), // 05/03/2025
      servicePackage: {
        id: "pkg-005",
        name: "Gói chăm sóc người cao tuổi",
        services: [
          { id: "srv-002", name: "Massage trị liệu" },
          { id: "srv-006", name: "Tư vấn dinh dưỡng" },
          { id: "srv-007", name: "Tập vận động nhẹ" }
        ]
      },
      status: "no-show",
      totalAmount: "900.000 VNĐ",
      paymentStatus: "unpaid"
    }
  ];

  // State cho các bộ lọc
  const [filteredAppointments, setFilteredAppointments] = 
    useState<Appointment[]>(appointments);
  const [filters, setFilters] = useState({
    patientName: "",
    serviceName: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: "all" as "all" | "completed" | "cancelled" | "no-show",
    paymentStatus: "all" as "all" | "paid" | "unpaid" | "partial"
  });

  // Xử lý lọc dữ liệu
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    const filtered = appointments.filter(appointment => {
      // Lọc theo tên bệnh nhân
      if (
        newFilters.patientName &&
        !appointment.patient_name
          .toLowerCase()
          .includes(newFilters.patientName.toLowerCase())
      ) {
        return false;
      }
      
      // Lọc theo tên dịch vụ
      if (newFilters.serviceName) {
        const hasService = appointment.servicePackage.services.some(
          service => service.name.toLowerCase().includes(newFilters.serviceName.toLowerCase())
        );
        if (!hasService) return false;
      }
      
      // Lọc theo ngày (từ ngày)
      if (newFilters.fromDate && appointment.date < newFilters.fromDate) {
        return false;
      }
      
      // Lọc theo ngày (đến ngày)
      if (newFilters.toDate) {
        const toDateEnd = new Date(newFilters.toDate);
        toDateEnd.setHours(23, 59, 59);
        if (appointment.date > toDateEnd) {
          return false;
        }
      }
      
      // Lọc theo trạng thái cuộc hẹn
      if (newFilters.status !== "all" && appointment.status !== newFilters.status) {
        return false;
      }
      
      // Lọc theo trạng thái thanh toán
      if (
        newFilters.paymentStatus !== "all" && 
        appointment.paymentStatus !== newFilters.paymentStatus
      ) {
        return false;
      }
      
      return true;
    });
    
    setFilteredAppointments(filtered);
  };

  // Xử lý reset bộ lọc
  const handleResetFilters = () => {
    const defaultFilters = {
      patientName: "",
      serviceName: "",
      fromDate: null,
      toDate: null,
      status: "all" as "all" | "completed" | "cancelled" | "no-show",
      paymentStatus: "all" as "all" | "paid" | "unpaid" | "partial"
    };
    
    setFilters(defaultFilters);
    setFilteredAppointments(appointments);
  };

  return (
    <div className=" mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Lịch sử cuộc hẹn</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch sử  toàn bộ cuộc hẹn</CardTitle>
          <CardDescription>
            Quản lý và xem lại các cuộc hẹn đã hoàn thành, bị hủy hoặc khách không đến.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <AppointmentHistoryFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
          
          <div className="mt-6">
            <ScrollArea className="h-[60vh]">
              <AppointmentHistoryTable appointments={filteredAppointments} />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentHistory;