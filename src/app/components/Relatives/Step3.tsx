import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

/*service task*/
export type Service = {
  name: string;
  "est-duration": number;
  cost: number;
  description?: string;
  validityPeriod?: number;
  usageTerms?: string;
};

interface Step3Props {
  selectedServices: Service[];
  serviceQuantities: { [key: string]: number };
  updateServiceQuantity: (serviceName: string, newQuantity: number) => void;
  removeService: (serviceName: string) => void;
  formatCurrency: (value: number) => string;
  calculateTotalTime: () => number;
  calculateTotalPrice: () => number;
  setCurrentStep: (step: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ServiceAdjustment: React.FC<Step3Props> = ({
  selectedServices,
  serviceQuantities,
  updateServiceQuantity,
  removeService,
  formatCurrency,
  calculateTotalTime,
  calculateTotalPrice,
  setCurrentStep,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-3xl font-bold">Điều chỉnh gói dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" />
        Bạn có thể điều chỉnh số lượng hoặc loại bỏ các dịch vụ không cần thiết
      </p>

      {selectedServices.length > 0 ? (
        <div className="space-y-6">
          <ScrollArea className="h-96">
            <div className="flex flex-col gap-6">
              {selectedServices.map((service) => (
                <Card key={service.name} className="overflow-hidden shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-semibold">{service.name}</h3>
                        <div className="text-gray-600">
                          {service["est-duration"]} phút • {formatCurrency(service.cost)}
                          /lần
                        </div>
                        {service.description && (
                          <p className="text-gray-500 mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateServiceQuantity(
                                service.name,
                                (serviceQuantities[service.name] || 1) - 1
                              )
                            }
                            disabled={
                              (serviceQuantities[service.name] || 1) <= 1
                            }
                          >
                            <span className="text-lg">-</span>
                          </Button>

                          <span className="w-8 text-center text-lg">
                            {serviceQuantities[service.name] || 1}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateServiceQuantity(
                                service.name,
                                (serviceQuantities[service.name] || 1) + 1
                              )
                            }
                          >
                            <span className="text-lg">+</span>
                          </Button>
                        </div>

                        <span className="font-bold text-xl">
                          {formatCurrency(
                            service.cost *
                              (serviceQuantities[service.name] || 1)
                          )}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeService(service.name)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 mt-6 border-t bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center text-2xl font-semibold text-gray-800">
              <span className="font-medium">Tổng thời gian:</span>
              <span className="text-primary">{calculateTotalTime()} phút</span>
            </div>
            <div className="flex justify-between items-center text-2xl mt-3 font-semibold text-gray-900">
              <span className="font-medium">Tổng tiền:</span>
              <span className="font-bold text-red-600 text-3xl">
                {formatCurrency(calculateTotalPrice())}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Ghi chú</h3>
            <p className="text-lg text-gray-600 mb-4">
              Vui lòng thêm các yêu cầu đặc biệt hoặc lưu ý cho dịch vụ của bạn
            </p>
            <div className="space-y-4">
              <Textarea
                placeholder="Nhập ghi chú của bạn ở đây..."
                className="min-h-[150px] w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
              />
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