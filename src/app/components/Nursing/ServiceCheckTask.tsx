import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Interface cho dịch vụ đơn lẻ mở rộng
interface EnhancedService {
  id: string;
  name: string;
  duration: string;
  customerNote?: string;
  staffAdvice?: string;
  times: number;
  isCompleted?: boolean;
  nurseNote?: string;
}

interface ServiceCheckTaskProps {
  services: EnhancedService[];
  onServiceComplete: (serviceId: string, nurseNote: string) => void;
}

const ServiceCheckTask: React.FC<ServiceCheckTaskProps> = ({
  services,
  onServiceComplete,
}) => {
  const [serviceStatus, setServiceStatus] = useState<
    Record<string, { isChecked: boolean; nurseNote: string }>
  >(
    services.reduce((acc, service) => {
      return {
        ...acc,
        [service.id]: {
          isChecked: service.isCompleted || false,
        nurseNote: service.nurseNote || "",
          
        },
      };
    }, {})
  );

  const handleCheckboxChange = (serviceId: string) => {
    setServiceStatus((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        isChecked: !prev[serviceId].isChecked,
      },
    }));
  };

  const handleNurseNoteChange = (serviceId: string, value: string) => {
    setServiceStatus((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        nurseNote: value,
      },
    }));
  };

  const handleSaveNote = (serviceId: string) => {
    onServiceComplete(serviceId, serviceStatus[serviceId].nurseNote);
  };

  

  console.log("serivces ne2: ", services);
  

  return (
    <Card className="shadow-md">
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-4">
          Danh sách dịch vụ cần thực hiện
        </h3>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4 pb-4">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="border-l-4 border-l-cyan-500 overflow-hidden"
              >
                <CardHeader className="bg-cyan-100 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-cyan-600 font-semibold flex items-center gap-2">
                      <span className="text-cyan-600">{index + 1}.</span>
                      <span>{service.name}</span>
                    </CardTitle>
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={serviceStatus[service.id]?.isChecked}
                      onCheckedChange={() => handleCheckboxChange(service.id)}
                      className="h-5 w-5 border-2 border-cyan-500"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-5">
                    <div>
                      <p className="text-[16px] font-semibold text-gray-600">
                        Ghi chú của khách hàng:
                      </p>
                      <p className="text-sm text-gray-700">
                        {service.customerNote || "Không có ghi chú"}
                      </p>
                      
                    </div>

                    <div>
                      <p className="text-[16px] font-semibold text-gray-600">
                        Ghi chú của staff:
                      </p>
                      <p className="text-sm text-gray-700">
                        {service.staffAdvice}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-[16px] font-semibold text-gray-600">
                          Thời gian:
                        </p>
                        <p className="text-[14px] text-gray-700">
                          {service.duration} phút
                        </p>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <p className="text-[16px] font-semibold text-gray-600">
                          Số lần:
                        </p>
                        <p className="text-sm text-gray-700">{service.times}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] font-semibold text-gray-600">
                        Ghi chú của điều dưỡng:
                      </p>
                      <Textarea
                        placeholder="Nhập lưu ý của điều dưỡng"
                        value={serviceStatus[service.id]?.nurseNote || ""}
                        onChange={(e) =>
                          handleNurseNoteChange(service.id, e.target.value)
                        }
                        className="mt-1 resize-none text-sm"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveNote(service.id)}
                          className="bg-cyan-500 hover:bg-cyan-600 text-sm font-semibold"
                        >
                          Lưu ghi chú
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ServiceCheckTask;