import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Interface cho cuộc hẹn
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

interface AppointmentHistoryTableProps {
  appointments: Appointment[];
}

const AppointmentHistoryTable: React.FC<AppointmentHistoryTableProps> = ({ 
  appointments 
}) => {
  // Hàm chuyển đổi trạng thái thành badge
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Đã hủy</Badge>;
      case "no-show":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Khách không đến</Badge>;
    }
  };

  // Hàm chuyển đổi trạng thái thanh toán thành badge
  const getPaymentStatusBadge = (status: Appointment["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Đã thanh toán</Badge>;
      case "unpaid":
        return <Badge variant="outline" className="border-red-500 text-red-500">Chưa thanh toán</Badge>;
      case "partial":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Thanh toán một phần</Badge>;
    }
  };

  // Xử lý khi nhấn vào nút xem chi tiết
  const handleViewDetails = (appointmentId: string) => {
    console.log("Xem chi tiết cuộc hẹn:", appointmentId);
    // Có thể chuyển hướng đến trang chi tiết cuộc hẹn
    // router.push(`/nurse/appointments/${appointmentId}`);
  };

  return (
    <div>
      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy cuộc hẹn nào phù hợp với bộ lọc.
        </div>
      ) : (
        <Table>
          <TableHeader className="text-[16px]">
            <TableRow >
              {/* <TableHead className="w-[100px]">Mã cuộc hẹn</TableHead> */}
              <TableHead className="w-[150px] font-semibold">Khách hàng</TableHead>
              <TableHead className="font-semibold">Ngày</TableHead>
              <TableHead className="font-semibold">Gói dịch vụ</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Thanh toán</TableHead>
              <TableHead className="text-center font-semibold">Thành tiền</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody  className="text-[16px]">
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                {/* <TableCell className="font-medium">{appointment.id}</TableCell> */}
                <TableCell>{appointment.patient_name}</TableCell>
                <TableCell>
                  {format(appointment.date, "dd/MM/yyyy", { locale: vi })}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.servicePackage.name}</p>
                    <p className="text-[13px] text-gray-500 mt-1">
                      {appointment.servicePackage.services.map(service => service.name).join(", ")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(appointment.paymentStatus)}</TableCell>
                <TableCell className="text-right font-semibold text-red-500">
                  {appointment.totalAmount}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewDetails(appointment.id)}
                    className="flex items-center text-[16px]"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AppointmentHistoryTable;