import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { useToast } from "@/hooks/use-toast";

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
  status?: string;
  taskOrder?: number;
}

interface ServiceCheckTaskProps {
  services: EnhancedService[];
  onServiceComplete: (serviceId: string, nurseNote: string) => void;
}

const ServiceCheckTask: React.FC<ServiceCheckTaskProps> = ({
  services,
  onServiceComplete,
}) => {
  const { toast } = useToast();

  // Sắp xếp dịch vụ theo taskOrder để hiển thị đúng thứ tự
  const sortedServices = [...services].sort((a, b) => {
    const orderA = a.taskOrder || 0;
    const orderB = b.taskOrder || 0;
    return orderA - orderB;
  });

  // Tìm task order nhỏ nhất chưa hoàn thành
  const getNextTaskOrder = () => {
    for (const service of sortedServices) {
      const order = service.taskOrder || 0;
      if (service.status !== "done" && !service.isCompleted) {
        return order;
      }
    }
    return Infinity; // Nếu tất cả đã hoàn thành
  };

  const [nextTaskOrder, setNextTaskOrder] =
    useState<number>(getNextTaskOrder());

  // Khởi tạo trạng thái dịch vụ
  const [serviceStatus, setServiceStatus] = useState<
    Record<
      string,
      {
        isChecked: boolean;
        nurseNote: string;
        isLoading: boolean;
        taskOrder: number;
      }
    >
  >(
    services.reduce((acc, service) => {
      return {
        ...acc,
        [service.id]: {
          isChecked: service.isCompleted || service.status === "done" || false,
          nurseNote: service.nurseNote || "",
          isLoading: false,
          taskOrder: service.taskOrder || 0,
        },
      };
    }, {})
  );

  // Cập nhật nextTaskOrder khi có thay đổi trong serviceStatus
  useEffect(() => {
    setNextTaskOrder(getNextTaskOrder());
  }, [serviceStatus]);

  const isTaskCheckable = (taskOrder: number) => {
    return taskOrder === nextTaskOrder;
  };

  const handleCheckboxChange = async (cusTaskID: string) => {
    console.log("Checkbox clicked for service ID:", cusTaskID);
    const currentTaskOrder = serviceStatus[cusTaskID].taskOrder;

    // Skip nếu đã check, đang loading, hoặc không phải task tiếp theo cần làm
    if (
      serviceStatus[cusTaskID].isChecked ||
      serviceStatus[cusTaskID].isLoading ||
      !isTaskCheckable(currentTaskOrder)
    ) {
      if (
        !isTaskCheckable(currentTaskOrder) &&
        !serviceStatus[cusTaskID].isChecked
      ) {
        toast({
          variant: "destructive",
          title: "Bạn cần hoàn thành các nhiệm vụ theo thứ tự",
          description: "Vui lòng hoàn thành các nhiệm vụ trước đó",
        });
      }
      return;
    }

    try {
      // Set loading state
      setServiceStatus((prev) => ({
        ...prev,
        [cusTaskID]: {
          ...prev[cusTaskID],
          isLoading: true,
        },
      }));

      // Call API to update task status
      await appointmentApiRequest.checkCusTask(cusTaskID);

      // Update local state after successful API call
      setServiceStatus((prev) => ({
        ...prev,
        [cusTaskID]: {
          ...prev[cusTaskID],
          isChecked: true,
          isLoading: false,
        },
      }));

      // Call the parent component's callback
      onServiceComplete(cusTaskID, serviceStatus[cusTaskID].nurseNote);

      // Show success notification
      toast({
        variant: "default",
        title: "Cập nhật trạng thái thành công",
      });
    } catch (error) {
      console.error("Error updating task status:", error);

      // Reset loading state on error
      setServiceStatus((prev) => ({
        ...prev,
        [cusTaskID]: {
          ...prev[cusTaskID],
          isLoading: false,
        },
      }));

      // Show error notification
      toast({
        variant: "destructive",
        title: "Cuộc hẹn vẫn chưa bắt đầu",
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-4">
          Danh sách dịch vụ cần thực hiện
        </h3>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4 pb-4">
            {sortedServices.map((service, index) => {
              const serviceId = service.id;
              const currentTaskOrder = serviceStatus[serviceId].taskOrder;
              const isCheckable = isTaskCheckable(currentTaskOrder);
              const isChecked = serviceStatus[serviceId]?.isChecked;
              const isLoading = serviceStatus[serviceId]?.isLoading;

              return (
                <Card
                  key={serviceId}
                  className={`border-l-4 ${
                    isChecked
                      ? "border-l-green-500"
                      : isCheckable
                        ? "border-l-cyan-500"
                        : "border-l-gray-300"
                  } overflow-hidden`}
                >
                  <CardHeader
                    className={`${
                      isChecked
                        ? "bg-green-100"
                        : isCheckable
                          ? "bg-cyan-100"
                          : "bg-gray-50"
                    } py-3 px-4`}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className={`text-lg ${
                          isChecked
                            ? "text-green-600"
                            : isCheckable
                              ? "text-cyan-600"
                              : "text-gray-500"
                        } font-semibold flex items-center gap-2`}
                      >
                        <span>{service.taskOrder || index + 1}.</span>
                        <span>{service.name}</span>
                        {!isCheckable && !isChecked && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2 mr-2 shrink-0">
                            Chờ đến lượt
                          </span>
                        )}
                        {isCheckable && (
                          <span className="text-xs bg-cyan-200 text-cyan-700 px-2 py-1 rounded-full ml-2 mr-2 shrink-0">
                            Đến lượt
                          </span>
                        )}
                      </CardTitle>
                      <Checkbox
                        id={`service-${serviceId}`}
                        checked={isChecked}
                        onCheckedChange={() => handleCheckboxChange(serviceId)}
                        disabled={isLoading || isChecked || !isCheckable}
                        className={`h-5 w-5 border-2 ${
                          isChecked
                            ? "border-green-500"
                            : isCheckable
                              ? "border-cyan-500"
                              : "border-gray-300"
                        }`}
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
                          {service.staffAdvice || "Không có ghi chú"}
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
                          <p className="text-sm text-gray-700">
                            {service.times}
                          </p>
                        </div>
                      </div>

                      {isChecked && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md">
                          <p className="text-sm text-green-600 font-medium">
                            ✓ Đã hoàn thành
                          </p>
                        </div>
                      )}

                      {isLoading && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600 font-medium">
                            Đang cập nhật...
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ServiceCheckTask;
