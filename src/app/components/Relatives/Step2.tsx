// Step2Component.tsx
import React from "react";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ServiceItem } from "@/types/service";

interface Step2Props {
  selectedServiceType: "oneTime" | "subscription";
  setSelectedServiceType: (type: "oneTime" | "subscription") => void;
  selectedMajor: string | null;
  setSelectedMajor: (major: string | null) => void;
  servicesByType: {
    [key: string]: {
      [packageName: string]: ServiceItem[];
    };
  };
  handleMajorChange: (packageName: string) => void;
  formatCurrency: (value: number) => string;
  calculatePackageTotalTime: (services: ServiceItem[]) => number;
  calculatePackagePrice: (services: ServiceItem[]) => number;
  setSelectedServices: (
    services: Array<{
      name: string;
      price: number;
      time: string;
      description?: string;
      validityPeriod?: number;
      usageTerms?: string;
    }>
  ) => void;
  setServiceQuantities: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  onNext: () => void;
  onPrevious: () => void;
}

export const ServicePackageSelection: React.FC<Step2Props> = ({
  selectedServiceType,
  setSelectedServiceType,
  selectedMajor,
  servicesByType,
  handleMajorChange,
  formatCurrency,
  calculatePackageTotalTime,
  calculatePackagePrice,
  setSelectedServices,
  setServiceQuantities,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-4xl font-bold">Chọn gói dịch vụ</h2>
      <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
        <Info className="mr-2" />
        Mỗi đơn hàng chỉ được chọn một gói dịch vụ
      </p>

      {/* Tabs for service types */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-lg ${
            selectedServiceType === "oneTime"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedServiceType("oneTime")}
        >
          Gói dịch vụ sử dụng 1 lần
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${
            selectedServiceType === "subscription"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedServiceType("subscription")}
        >
          Gói dịch vụ áp dụng nhiều ngày
        </button>
      </div>

      <ScrollArea className="w-full h-[800px]">
        <div className="space-y-6 mr-4">
          {Object.keys(servicesByType[selectedServiceType]).map(
            (packageName) => (
              <Card
                key={packageName}
                className={cn(
                  "overflow-hidden transition-all cursor-pointer",
                  selectedMajor === packageName
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-primary/50"
                )}
                onClick={() => {
                  handleMajorChange(packageName);
                  // Auto-select all services in this package
                  setSelectedServices(
                    servicesByType[selectedServiceType][packageName].map(
                      (service) => ({
                        name: service.name,
                        price: service.price ?? 0, // Ensure price is never undefined
                        time: String(service["est-duration"]),
                        description: service.description,
                        // validityPeriod: service.validityPeriod,
                        // usageTerms: service.usageTerms,
                      })
                    )
                  );
                }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">
                        {packageName}
                      </h3>
                      <div className="text-lg text-gray-600 mb-4">
                        {calculatePackageTotalTime(
                          servicesByType[selectedServiceType][packageName].map(
                            (service) => ({
                              ...service,
                              time: String(service["est-duration"]),
                            })
                          )
                        )}{" "}
                        phút •{" "}
                        {
                          servicesByType[selectedServiceType][packageName]
                            .length
                        }{" "}
                        dịch vụ
                        {/* Show validity period for subscription packages */}
                        {selectedServiceType === "subscription" &&
                          servicesByType[selectedServiceType][packageName][0]
                            .validityPeriod && (
                            <span className="ml-2 text-blue-600">
                              • Áp dụng trong{" "}
                              {
                                servicesByType[selectedServiceType][
                                  packageName
                                ][0].validityPeriod
                              }{" "}
                              ngày
                            </span>
                          )}
                      </div>

                      {/* List the included services */}
                      <div className="space-y-2 mt-4">
                        <h4 className="font-semibold text-lg">
                          Dịch vụ bao gồm:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {servicesByType[selectedServiceType][packageName].map(
                            (service) => (
                              <li key={service.name} className="text-gray-700">
                                {service.name}{" "}
                                <span className="text-gray-500">
                                  ({service["est-duration"]} phút)
                                </span>
                                {/* Show usage terms for subscription packages */}
                                {selectedServiceType === "subscription" &&
                                  service.usageTerms && (
                                    <span className="text-green-600 ml-1">
                                      • {service.usageTerms}
                                    </span>
                                  )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="font-bold text-2xl text-red-600">
                        {formatCurrency(
                          calculatePackagePrice(
                            servicesByType[selectedServiceType][
                              packageName
                            ].map((service) => ({
                              ...service,
                              time: String(service.price),
                            }))
                          )
                        )}
                      </span>

                      {selectedMajor === packageName && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
