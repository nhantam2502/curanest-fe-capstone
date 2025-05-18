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
import { useRouter } from "next/navigation";
import { PatientRecord } from "@/types/patient";

// Interface cho cuộc hẹn
interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  cusPackageID: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  patient_info: PatientRecord;
  estTimeFrom?: string;
  estTimeTo?: string;
}

interface AppointmentHistoryTableProps {
  appointments: Appointment[];
}

const AppointmentHistoryTable: React.FC<AppointmentHistoryTableProps> = ({
  appointments,
}) => {
  const router = useRouter();
  // console.log("appointments: ", appointments);

  // Hàm chuyển đổi trạng thái thành badge
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>
        );
      case "cancel":
        return <Badge className="bg-red-500 hover:bg-red-600">Đã hủy</Badge>;
      case "upcoming":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Đang tới</Badge>
        );
      case "confirmed":
        return (
          <Badge className=" bg-yellow-500 hover:bg-yellow-600">
            Đã xác nhận
          </Badge>
        );
    }
  };

  // Hàm chuyển đổi trạng thái thanh toán thành badge
  const getPaymentStatusBadge = (status: Appointment["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Đã thanh toán</Badge>
        );
      case "unpaid":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Chưa thanh toán
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Thanh toán một phần
          </Badge>
        );
    }
  };

  // Xử lý khi nhấn vào nút xem chi tiết
  const handleViewDetails = (
    appointmentID: string,
    patientID: string,
    estDate: string,
    cusPackageID: string,
    estTimeFrom: string,
    estTimeTo: string,
    appointmentStatus: string
  ) => {
    router.push(
      `/nurse/appointmentHistory/${patientID}?appointmentID=${encodeURIComponent(appointmentID)}&estDate=${encodeURIComponent(estDate)}&cusPackageID=${encodeURIComponent(cusPackageID)}&estTimeFrom=${encodeURIComponent(estTimeFrom)}&estTimeTo=${encodeURIComponent(estTimeTo)}&status=${encodeURIComponent(appointmentStatus)}` // Chuyển hướng đến trang chi tiết cuộc hẹn
    );
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
            <TableRow>
              <TableHead className="font-semibold">Khách hàng</TableHead>
              <TableHead className="font-semibold">Ngày</TableHead>
              <TableHead className="font-semibold">Thời gian</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">
                Trạng thái thanh toán
              </TableHead>
              {/* <TableHead className="text-center font-semibold">Thành tiền</TableHead> */}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[16px]">
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                {/* <TableCell className="font-medium">{appointment.id}</TableCell> */}
                <TableCell>{appointment.patient_name}</TableCell>
                <TableCell>
                  {format(appointment.date, "dd/MM/yyyy", { locale: vi })}
                </TableCell>
                <TableCell>
                  {appointment.estTimeFrom} - {appointment.estTimeTo}
                </TableCell>
                {/* <TableCell>
                  <div>
                    <p className="font-medium">{appointment.servicePackage.name}</p>
                    <p className="text-[13px] text-gray-500 mt-1">
                      {appointment.servicePackage.services.map(service => service.name).join(", ")}
                    </p>
                  </div>
                </TableCell> */}
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>
                  {getPaymentStatusBadge(appointment.paymentStatus)}
                </TableCell>
                {/* <TableCell className="text-right font-semibold text-red-500">
                  {appointment.totalAmount}
                </TableCell> */}
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleViewDetails(
                        appointment.id,
                        appointment.patient_info.id,
                        appointment.date,
                        appointment.cusPackageID,
                        appointment.estTimeFrom || "",
                        appointment.estTimeTo || "",
                        appointment.status
                      )
                    }
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
