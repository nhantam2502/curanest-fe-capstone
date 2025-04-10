import React from "react";
import { Info, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  PackageServiceItem,
  ServicePackageType,
  ServiceTaskType,
} from "@/types/service";

interface Step3Props {
  selectedServiceTask: ServiceTaskType[];
  serviceQuantities: { [key: string]: number };
  updateServiceNote?: (serviceName: string, note: string) => void;
  updateServiceQuantity: (serviceName: string, newQuantity: number) => void;
  removeService: (serviceName: string) => void;
  calculateAdvancedPricing: (
    service: ServiceTaskType,
    quantity: number
  ) => {
    totalCost: number;
    totalDuration: number;
  };
  formatCurrency: (value: number) => string;
  calculateTotalTime: () => number;
  calculateTotalPrice: () => number;
  setCurrentStep: (step: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  selectedPackage: PackageServiceItem | null;
}

export const ServiceAdjustment: React.FC<Step3Props> = ({
  selectedServiceTask,
  serviceQuantities,
  updateServiceNote,
  updateServiceQuantity,
  removeService,
  calculateAdvancedPricing,
  formatCurrency,
  calculateTotalTime,
  calculateTotalPrice,
  setCurrentStep,
  onNext,
  onPrevious,
  selectedPackage,
}) => {
  const [serviceNotes, setServiceNotes] = React.useState<{
    [key: string]: string;
  }>({});

  const handleNoteChange = (serviceName: string, note: string) => {
    setServiceNotes((prev) => ({
      ...prev,
      [serviceName]: note,
    }));
    updateServiceNote?.(serviceName, note);
  };

  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-3xl font-bold">Điều chỉnh gói dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" />
        Bạn có thể điều chỉnh số lượng hoặc loại bỏ các dịch vụ không cần thiết
      </p>

      {selectedServiceTask.length > 0 ? (
        <div className="space-y-6">
          <ScrollArea className="h-96">
            <div className="flex flex-col gap-6">
              {selectedServiceTask.map((service) => {
                const currentQuantity = serviceQuantities[service.name] || 1;
                const { totalCost } = calculateAdvancedPricing(
                  service,
                  currentQuantity
                );

                let additionalDuration = 0;
                let totalQuantity = currentQuantity;
                let totalTime = service["est-duration"];

                if (currentQuantity > 1) {
                  if (service.unit === "time") {
                    additionalDuration =
                      (currentQuantity - 1) * service["price-of-step"];
                    totalTime = service["est-duration"] + additionalDuration;
                  } else if (service.unit === "quantity") {
                    totalQuantity = currentQuantity;
                  }
                }

                return (
                  <Card
                    key={service.name}
                    className="overflow-hidden shadow-lg"
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-semibold">
                            {service.name}
                          </h3>
                          <div className="text-gray-600">
                            {service["est-duration"]} phút •{" "}
                            {formatCurrency(service.cost)}
                            {service.unit === "quantity" ? "/ lần" : ""}
                          </div>
                          {service.description && (
                            <p className="text-gray-500 mt-1">
                              {service.description}
                            </p>
                          )}

                          {currentQuantity > 1 &&
                            service["additional-cost-desc"] && (
                              <p className="text-yellow-500 mt-1 italic font-semibold">
                                {service["additional-cost-desc"]}:{" "}
                                {formatCurrency(service["additional-cost"])} /{" "}
                                {service["price-of-step"]}{" "}
                                {service.unit === "quantity" ? "lần" : "phút"}
                              </p>
                            )}
                        </div>

                        {!(
                          service["additional-cost"] === 0 ||
                          service["additional-cost-desc"] === "" ||
                          service["price-of-step"] === 0
                        ) && (
                          <div className="flex items-center gap-6">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  updateServiceQuantity(
                                    service.name,
                                    currentQuantity - 1
                                  )
                                }
                                disabled={currentQuantity <= 1}
                              >
                                <span className="text-lg">-</span>
                              </Button>

                              {service.unit === "time" ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{totalTime}</span>
                                  <span className="text-lg">phút</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">
                                    {totalQuantity}
                                  </span>
                                  <span className="text-lg">lần</span>
                                </div>
                              )}

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  updateServiceQuantity(
                                    service.name,
                                    currentQuantity + 1
                                  )
                                }
                              >
                                <span className="text-lg">+</span>
                              </Button>
                            </div>

                            <span className="font-bold text-xl">
                              {formatCurrency(totalCost)}
                            </span>
                          </div>
                        )}

                        {!service["is-must-have"] && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeService(service.name)}
                          >
                            <Trash size={24} />
                          </Button>
                        )}
                      </div>

                      {/* Thêm phần ghi chú riêng cho từng dịch vụ */}
                      <div className="mt-4">
                        <label className="text-lg font-semibold text-red-500">
                          Ghi chú cho {service.name} (tùy chọn):
                        </label>
                        <Textarea
                          placeholder={`Nhập ghi chú cho ${service.name}...`}
                          value={serviceNotes[service.name] || ""}
                          onChange={(e) =>
                            handleNoteChange(service.name, e.target.value)
                          }
                          className="mt-2 min-h-[100px] w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <div className="pt-4 mt-6 border-t bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center text-2xl font-semibold text-gray-800">
              <span className="font-medium">Tổng thời gian:</span>
              <span className="text-primary">{calculateTotalTime()} phút</span>
            </div>
            <div className="flex justify-between items-center text-2xl mt-3 font-semibold text-gray-900">
              <span className="font-bold text-2xl text-gray-800">
                Tổng tiền
              </span>
              <div className="flex flex-col items-end">
                {selectedPackage &&
                selectedPackage.discount &&
                selectedPackage.discount > 0 ? (
                  <>
                    <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                      {formatCurrency(
                        calculateTotalPrice() *
                          (1 - selectedPackage.discount / 100)
                      )}
                    </span>
                    <span className="text-gray-500 text-lg line-through">
                      {formatCurrency(calculateTotalPrice())}
                    </span>
                  </>
                ) : (
                  <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">Bạn chưa chọn gói dịch vụ nào</p>
          <Button className="mt-4 text-lg" onClick={() => setCurrentStep(2)}>
            Quay lại chọn gói dịch vụ
          </Button>
        </div>
      )}
    </div>
  );
};
