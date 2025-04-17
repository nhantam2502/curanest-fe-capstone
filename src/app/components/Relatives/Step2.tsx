import React, { useEffect, useState } from "react";
import { Info, Check, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PackageServiceItem, ServiceTaskType } from "@/types/service";

interface Step2Props {
  servicesByType: {
    oneTime: { [categoryName: string]: PackageServiceItem[] };
    subscription: { [categoryName: string]: PackageServiceItem[] };
  };
  formatCurrency: (value: number) => string;
  calculatePackageTotalTime: (services: PackageServiceItem[]) => number;
  calculatePackagePrice: (services: PackageServiceItem[]) => number;
  setSelectedServicesTask: (services: ServiceTaskType[]) => void;

  isLoading?: boolean;
  selectedPackage: PackageServiceItem | null;
  setSelectedPackage: (packageName: PackageServiceItem | null) => void;
  fetchServiceTasks: (packageId: string) => Promise<ServiceTaskType[]>;
  serviceTasks: Record<string, ServiceTaskType[]>;
  setServiceTasks: React.Dispatch<
    React.SetStateAction<Record<string, ServiceTaskType[]>>
  >;
  isTasksLoading?: boolean;
}

export const ServicePackageSelection: React.FC<Step2Props> = ({
  servicesByType,
  formatCurrency,
  calculatePackageTotalTime,
  calculatePackagePrice,
  setSelectedServicesTask,
  isLoading = false,
  selectedPackage,
  setSelectedPackage,
  fetchServiceTasks,
  serviceTasks,
  setServiceTasks,
  isTasksLoading = false,
}) => {
  const [selectedServiceType, setSelectedServiceType] = useState<
    "oneTime" | "subscription"
  >("oneTime");

  const handleServiceTypeChange = (type: "oneTime" | "subscription") => {
    setSelectedServiceType(type);
    setSelectedPackage(null);
  };

  const handlePackageSelect = async (
    packageName: string,
    packageId: string
  ) => {
    const selectedPackageItem =
      servicesByType[selectedServiceType][packageName]?.[0] || null;

    setSelectedPackage(selectedPackageItem);

    // Đầu tiên tải tasks nếu chưa có
    if (!serviceTasks[packageId]) {
      const tasks = await fetchServiceTasks(packageId);
      setServiceTasks((prev) => ({
        ...prev,
        [packageId]: tasks,
      }));

      // Sử dụng tasks để thiết lập selectedServices
      if (tasks && tasks.length > 0) {
        setSelectedServicesTask(
          tasks.map((task) => ({
            id: task.id,
            name: task.name,
            cost: task.cost || 0,
            "est-duration": task["est-duration"] || 0,
            description: task.description || "",
            discount: 0, // Hoặc có thể thêm discount nếu task có
            "additional-cost": task["additional-cost"] || 0,
            "additional-cost-desc": task["additional-cost-desc"] || "",
            "staff-advice": task["staff-advice"] || "",
            "task-order": task["task-order"] || 0,
            "is-must-have": task["is-must-have"] || false,
            "price-of-step": task["price-of-step"] || 0,
            unit: task.unit || "",
            "svcpackage-id": task["svcpackage-id"] || "",
            status: task.status || "",
            note: task.note,
          }))
        );
      } else {
        // Fallback nếu không có tasks
        setSelectedServicesTask(
          servicesByType[selectedServiceType][packageName].map((service) => ({
            id: service.id,
            name: service.name,
            cost: service.price ?? 0,
            "est-duration": service["time-interval"] || 0,
            description: service.description,
            discount: service.discount,
            "additional-cost": 0,
            "additional-cost-desc": "",
            "staff-advice": "",
            "task-order": 0,
            "is-must-have": false,
            "price-of-step": 0,
            unit: "",
            "svcpackage-id": packageId,
            status: "",
            note: service.note || "",
          }))
        );
      }
    } else {
      // Nếu đã có tasks, sử dụng tasks để thiết lập selectedServices
      const tasks = serviceTasks[packageId];
      if (tasks && tasks.length > 0) {
        setSelectedServicesTask(
          tasks.map((task) => ({
            id: task.id,
            name: task.name,
            cost: task.cost || 0,
            "est-duration": task["est-duration"] || 0,
            description: task.description || "",
            discount: 0, // Hoặc có thể thêm discount nếu task có
            "additional-cost": task["additional-cost"] || 0,
            "additional-cost-desc": task["additional-cost-desc"] || "",
            "staff-advice": task["staff-advice"] || "",
            "task-order": task["task-order"] || 0,
            "is-must-have": task["is-must-have"] || false,
            "price-of-step": task["price-of-step"] || 0,
            unit: task.unit || "",
            "svcpackage-id": task["svcpackage-id"] || "",
            status: task.status || "",
            note: task.note,
          }))
        );
      } else {
        // Fallback nếu không có tasks
        setSelectedServicesTask(
          servicesByType[selectedServiceType][packageName].map((service) => ({
            id: service.id,
            name: service.name,
            cost: service.price ?? 0,
            "est-duration": service["time-interval"] || 0,
            description: service.description,
            discount: service.discount,
            "additional-cost": 0,
            "additional-cost-desc": "",
            "staff-advice": "",
            "task-order": 0,
            "is-must-have": false,
            "price-of-step": 0,
            unit: "",
            "svcpackage-id": packageId,
            status: "",
            note: service.note || "",
          }))
        );
      }
    }
  };

  useEffect(() => {
    Object.keys(servicesByType[selectedServiceType] || {}).forEach(
      async (packageName) => {
        const packageId =
          servicesByType[selectedServiceType][packageName][0]?.id || "";
        if (packageId && !serviceTasks[packageId]) {
          const tasks = await fetchServiceTasks(packageId);
          setServiceTasks((prev) => ({
            ...prev,
            [packageId]: tasks,
          }));
        }
      }
    );
  }, [selectedServiceType]);

  const calculateTasksTotalPrice = (tasks: ServiceTaskType[]) => {
    return tasks.reduce((total, task) => {
      return total + (task.cost || 0);
    }, 0);
  };

  // Kiểm tra có dữ liệu cho từng loại gói
  const hasOneTimeData = Object.keys(servicesByType.oneTime || {}).length > 0;
  const hasSubscriptionData = Object.keys(servicesByType.subscription || {}).length > 0;
  
  // Hiển thị thông báo nếu đang chọn loại gói mà không có dữ liệu
  const noDataMessage = selectedServiceType === "oneTime" 
    ? "Hệ thống hiện tại chưa có gói sử dụng một lần"
    : "Hệ thống hiện tại chưa có gói áp dụng nhiều ngày";

  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-4xl font-bold">Chọn gói dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" /> Mỗi đơn hàng chỉ được chọn một gói dịch vụ
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      ) : !hasOneTimeData && !hasSubscriptionData ? (
        // Thông báo khi không có dữ liệu cho cả hai loại gói
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Không có dữ liệu gói dịch vụ</h3>
          <p className="text-gray-600">
            Hệ thống hiện tại chưa có gói dịch vụ nào. Vui lòng thử lại sau hoặc liên hệ với quản trị viên để được hỗ trợ.
          </p>
        </div>
      ) : (
        <>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium text-lg ${
                selectedServiceType === "oneTime"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => handleServiceTypeChange("oneTime")}
              disabled={!hasOneTimeData}
            >
              Gói dịch vụ sử dụng 1 lần
            </button>
            <button
              className={`py-3 px-6 font-medium text-lg ${
                selectedServiceType === "subscription"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => handleServiceTypeChange("subscription")}
              disabled={!hasSubscriptionData}
            >
              Gói dịch vụ áp dụng nhiều ngày
            </button>
          </div>
          
          {(selectedServiceType === "oneTime" && !hasOneTimeData) || 
           (selectedServiceType === "subscription" && !hasSubscriptionData) ? (
            // Thông báo khi loại gói hiện tại không có dữ liệu
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{noDataMessage}</h3>
              <p className="text-gray-600">
                {selectedServiceType === "oneTime" && hasSubscriptionData ? 
                  "Vui lòng chọn gói dịch vụ áp dụng nhiều ngày." : 
                  selectedServiceType === "subscription" && hasOneTimeData ?
                  "Vui lòng chọn gói dịch vụ sử dụng một lần." :
                  "Vui lòng thử lại sau hoặc liên hệ với quản trị viên để được hỗ trợ."}
              </p>
            </div>
          ) : (
            <ScrollArea className="w-full h-[800px]">
              <div className="space-y-6 mr-4">
                {Object.keys(servicesByType[selectedServiceType] || {}).map(
                  (packageName) => {
                    const packageDiscount =
                      servicesByType[selectedServiceType][packageName][0]
                        ?.discount || 0;

                    const packageId =
                      servicesByType[selectedServiceType][packageName][0]?.id ||
                      "";
                    const tasks = serviceTasks[packageId] || [];

                    return (
                      <Card
                        key={packageName}
                        className={cn(
                          "overflow-hidden transition-all cursor-pointer",
                          selectedPackage?.name === packageName
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                        onClick={() =>
                          handlePackageSelect(packageName, packageId)
                        }
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <h3 className="text-2xl font-semibold mb-3">
                                {packageName}
                              </h3>

                              {/* Thông tin dịch vụ */}
                              {servicesByType[selectedServiceType][
                                packageName
                              ].map((service, index) => (
                                <div
                                  key={index}
                                  className="text-lg text-gray-600 mb-4"
                                >
                                  {service.description && (
                                    <span className="text-gray-500 ml-1">
                                      {service.description}
                                    </span>
                                  )}
                                </div>
                              ))}

                              {/* Hiển thị tasks */}
                              {tasks.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-xl font-semibold mb-2">
                                    Trong gói bao gồm dịch vụ:
                                  </h4>
                                  <ul className="space-y-2">
                                    {tasks.map((task) => (
                                      <li
                                        key={task.id}
                                        className="text-xl text-gray-600"
                                      >
                                        <div className="flex items-center gap-8">
                                          {task.name}
                                          <span className="text-[#e5ab47] font-semibold">
                                            {task["est-duration"]} phút
                                          </span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {isTasksLoading &&
                                !tasks.length &&
                                selectedPackage?.name === packageName && (
                                  <div className="mt-4 flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    <span>Đang tải danh sách công việc...</span>
                                  </div>
                                )}

                              <div className="text-lg text-gray-600 mt-4">
                                {tasks && tasks.length > 0
                                  ? tasks.length
                                  : servicesByType[selectedServiceType][
                                      packageName
                                    ].length}{" "}
                                dịch vụ
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 min-w-[150px]">
                              {packageDiscount > 0 ? (
                                <>
                                  <div className="bg-red-100 text-red-700 px-2 py-2 rounded-full text-lg font-semibold min-w-[120px] text-center whitespace-nowrap">
                                    Giảm {packageDiscount}%
                                  </div>
                                  <span className="font-bold text-2xl text-red-600">
                                    {formatCurrency(
                                      tasks.length > 0
                                        ? calculateTasksTotalPrice(tasks) *
                                            (1 - packageDiscount / 100)
                                        : calculatePackagePrice(
                                            servicesByType[selectedServiceType][
                                              packageName
                                            ]
                                          ) *
                                            (1 - packageDiscount / 100)
                                    )}
                                  </span>
                                  <span className="text-gray-500 text-lg line-through">
                                    {formatCurrency(
                                      tasks.length > 0
                                        ? calculateTasksTotalPrice(tasks)
                                        : calculatePackagePrice(
                                            servicesByType[selectedServiceType][
                                              packageName
                                            ]
                                          )
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-2xl text-red-600">
                                  {formatCurrency(
                                    tasks.length > 0
                                      ? calculateTasksTotalPrice(tasks)
                                      : calculatePackagePrice(
                                          servicesByType[selectedServiceType][
                                            packageName
                                          ]
                                        )
                                  )}
                                </span>
                              )}

                              {selectedPackage?.name === packageName && (
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-5 h-5 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
};