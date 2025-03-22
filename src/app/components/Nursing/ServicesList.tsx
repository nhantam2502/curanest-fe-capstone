import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// Interface cho dịch vụ đơn lẻ
interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  quantity?: number;
}

// Interface cho gói dịch vụ
interface ServicePackage {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  services: Service[];
  totalDuration: string;
  totalPrice: string;
}

interface ServicesListProps {
  servicePackage: ServicePackage;
}

const ServicesList: React.FC<ServicesListProps> = ({ servicePackage }) => {
  // Map status to badge color and label
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Chờ thực hiện",
        color: "bg-yellow-100 text-yellow-800",
      },
      "in-progress": {
        label: "Đang thực hiện",
        color: "bg-blue-100 text-blue-800",
      },
      completed: {
        label: "Đã hoàn thành",
        color: "bg-green-100 text-green-800",
      },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    };

    const { label, color } = statusMap[status] || statusMap["pending"];

    return (
      <Badge className={`${color} font-semibold rounded-full px-4 py-1 text-xs`}>
        {label}
      </Badge>
    );
  };

  // Format date for header
  const formatDate = (date: string) => {
    return `Thông tin lịch hẹn - ${date}`;
  };

  return (
    <Card className="w-full shadow-sm h-full bg-white">
      <CardContent className="p-0">
        {/* Header với ngày hẹn */}
        <div className="bg-white p-4 border-b border-gray-100">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Clock className="w-5 h-5 text-black-600" />
            {formatDate(servicePackage.appointmentDate)}
          </h3>
        </div>

        {/* Thông tin cơ bản */}
        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Thời gian:</div>
            <div className="font-semibold">{servicePackage.appointmentTime}</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Trạng thái:</div>
            <div>{getStatusBadge(servicePackage.status)}</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Gói dịch vụ:</div>
            <div className="text-blue-700 font-semibold pt-1">
              {servicePackage.name}
            </div>
          </div>
        </div>

        {/* Danh sách dịch vụ */}
        <div className="px-4 pb-4">
          {servicePackage.services.map((service, index) => (
            <div
              key={service.id}
              className="py-3 border-t border-gray-100 first:border-t-0"
            >
              <div className="font-medium text-gray-800">{service.name}</div>
              <div className="flex justify-between text-gray-500 text-sm mt-1">
                <div>Giá: <span className="font-semibold">{service.price}</span></div>
                <div>Thời gian: <span className="font-semibold">{service.duration}</span></div>
              </div>
              <div className="flex justify-end font-semibold text-red-500 text-sm mt-1">
                x{service.quantity || 1} lần
              </div>
            </div>
          ))}

          {/* Tổng chi phí và thời gian */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <div className="text-gray-800 font-semibold">Tổng chi phí:</div>
              <div className="text-red-600 font-semibold text-lg">{servicePackage.totalPrice}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-gray-800 font-semibold">Tổng thời gian:</div>
              <div>{servicePackage.totalDuration}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
