import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getFormattedDate } from "@/lib/utils";

// Type cho dịch vụ đơn lẻ (đã khớp với EnhancedTask)
interface Service {
  id: string;
  name: string;
  duration: string; // Được ánh xạ từ "est-duration" và "unit"
  price?: string; // Optional vì không có trong Task
  quantity?: number; // Ánh xạ từ "total-unit"
  staffAdvice?: string;
  clientNote?: string;
}

// Type cho gói dịch vụ
interface ServicePackage {
  id: string;
  name: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  services: Service[];
  totalDuration: string;
  totalPrice: string;
}

interface ServicesListProps {
  servicePackage: ServicePackage;
}

const ServicesList: React.FC<ServicesListProps> = ({ servicePackage }) => {
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
      <Badge
        className={`${color} font-semibold rounded-full px-4 py-1 text-xs`}
      >
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full shadow-sm h-full bg-white">
      <CardContent className="p-0">
        <div className="bg-white p-4 border-b border-gray-100">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Clock className="w-5 h-5 text-black-600" />
            {getFormattedDate(servicePackage.appointmentDate)}
          </h3>
        </div>

        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Thời gian:</div>
            <div className="font-semibold">
              {servicePackage.appointmentTime}
            </div>
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

        <div className="px-4 pb-4">
          {servicePackage.services.map((service) => (
            <div
              key={service.id}
              className="py-3 border-t border-gray-100 first:border-t-0"
            >
              <div className="font-medium text-gray-800">{service.name}</div>
              <div className="flex justify-between text-gray-500 text-sm mt-1">
                <div>
                  Thời gian:{" "}
                  <span className="font-semibold">{service.duration}</span>
                </div>
                <div className="flex justify-end font-semibold text-red-500 text-sm mt-1">
                  x{service.quantity || 1} lần
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <div className="text-gray-800 font-semibold">Tổng chi phí:</div>
              <div className="text-red-600 font-semibold text-lg">
                {servicePackage.totalPrice}
              </div>
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
