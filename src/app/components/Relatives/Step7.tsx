// Step7Component.tsx (Order Confirmation for manual selection)
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";

interface OrderConfirmationProps {
  // nurseSelectionMethod: "manual" | "auto";

  selectedServices: Array<{
    name: string;
    price: number;
    time: string;
    description?: string;
    validityPeriod?: number;
    usageTerms?: string;
  }>;
  serviceQuantities: { [key: string]: number };
  formatCurrency: (value: number) => string;
  selectedNurse: {
    id: number;
    name: string;
    specialization: string;
  } | null;
  selectedTime: {
    timeSlot: { display: string; value: string };
    date: string;
  } | null;
  calculateTotalPrice: () => number; 
  setCurrentStep: (step: number) => void;
  toast: any;
  router: any;
}

export const OrderConfirmationComponent: React.FC<OrderConfirmationProps> = ({
  selectedServices,
  serviceQuantities,
  formatCurrency,
  selectedNurse,
  selectedTime,
  calculateTotalPrice,
  // nurseSelectionMethod,
  setCurrentStep,
  toast,
  router
}) => {
  return (
    <div className="space-y-6 text-lg">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        <h3 className="text-3xl font-semibold mb-4">Dịch vụ đã chọn</h3>
        {/* Hiển thị dịch vụ đã chọn */}
        <div className="space-y-2">
          {selectedServices.length > 0 ? (
            selectedServices.map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2"
              >
                <div>
                  <span className="font-semibold text-xl">{service.name}</span>
                  {(serviceQuantities[service.name] || 1) > 1 && (
                    <span className="text-gray-600 ml-2">
                      x{serviceQuantities[service.name]}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-xl text-red-600">
                  {formatCurrency(
                    service.price * (serviceQuantities[service.name] || 1)
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">
              Chưa có dịch vụ nào được chọn.
            </p>
          )}
        </div>
        <Separator className="my-3" />
        {selectedNurse && (
          <div className="mb-4">
            <h3 className="text-xl font-be-vietnam-pro font-semibold">
              Điều dưỡng đã chọn
            </h3>
            <div className="text-lg text-gray-600">{selectedNurse.name}</div>
          </div>
        )}
        {/* Hiển thị thời gian đã chọn */}
        {selectedTime && (
          <div className="mt-4">
            <h3 className="text-3xl font-semibold mb-4">Thời gian đã chọn</h3>
            <div className="text-lg text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary" />
                <span className="text-xl">{selectedTime.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-primary" />
                <span className="text-xl">{selectedTime.timeSlot.display}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị tổng tiền */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Tổng cộng:</h3>
            <span className="text-2xl font-bold text-red-600">
              {formatCurrency(calculateTotalPrice())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
