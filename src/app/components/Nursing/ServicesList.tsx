import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatCurrency, formatDate, getFormattedDate } from "@/lib/utils";

// Type cho dịch vụ đơn lẻ (đã khớp với EnhancedTask)
interface Service {
  id: string;
  name: string;
  duration: string;
  quantity?: number; // Ánh xạ từ "total-unit"
  staffAdvice?: string;
  clientNote?: string;
}

// Type cho gói dịch vụ
export interface ServicePackage {
  id: string;
  name: string;
  appointmentDate: string;
  estTimeFrom: string;
  estTimeTo: string;
  status: string;
  services: Service[];
  totalDuration: string;
  totalPrice: number;
}

interface ServicesListProps {
  servicePackage: ServicePackage;
}

const ServicesList: React.FC<ServicesListProps> = ({ servicePackage }) => {
  // console.log("Service Package:", servicePackage);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      paid: {
        label: "Đã thanh toán",
        color: "bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer",
      },
      unpaid: {
        label: "Chưa thanh toán",
        color: "bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer",
      },
    };

    // Kiểm tra nếu status không có trong statusMap
    if (!statusMap[status]) {
      return (
        <Badge className="bg-gray-100 text-gray-800 font-semibold rounded-full px-4 py-1 text-xs">
          {status || "Không xác định"}
        </Badge>
      );
    }

    const { label, color } = statusMap[status];
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
            Ngày hẹn: {formatDate(new Date(servicePackage.appointmentDate))}
          </h3>
        </div>

        <div className="p-4 space-y-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Thời gian:</div>
            <div className="font-semibold">
              {servicePackage.estTimeFrom} - {servicePackage.estTimeTo}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-600 font-medium">Trạng thái:</div>
            <div>{getStatusBadge(servicePackage.status)}</div>
          </div>
          <div className="flex justify-between items-start">
            <div className="text-gray-600 font-medium">Gói dịch vụ:</div>
            <div className="text-blue-700 font-semibold pt-1 text-right max-w-[60%] break-words">
              {servicePackage.name}
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          {servicePackage.services.map((service) => (
            <div
              key={service.id}
              className="py-3 border-t-2 border-gray-200 first:border-t-0"
            >
              <div className="font-medium text-gray-800">{service.name}</div>
              <div className="flex justify-between text-gray-500 text-sm mt-1">
                <div>
                  Thời gian:{" "}
                  <span className="font-semibold">{service.duration} phút</span>
                </div>
                <div className="flex justify-end font-semibold text-red-500 text-sm mt-1">
                  x{service.quantity || 1} lần
                </div>
              </div>
              {service.staffAdvice && (
                <div className="text-sm mt-2">
                  <span className="text-gray-600 font-medium">
                    Lời khuyên từ nhân viên:
                  </span>
                  <p className="text-gray-700">{service.staffAdvice}</p>
                </div>
              )}
              {service.clientNote && (
                <div className="text-sm mt-2">
                  <span className="text-gray-600 font-medium">
                    Ghi chú từ khách hàng:
                  </span>
                  <p className="text-gray-700">{service.clientNote}</p>
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 pt-3 border-t-2 border-gray-200">
            <div className="flex justify-between">
              <div className="text-gray-800 font-semibold">Tổng chi phí:</div>
              <div className="text-red-600 font-semibold text-lg">
                {formatCurrency(servicePackage.totalPrice)}
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
