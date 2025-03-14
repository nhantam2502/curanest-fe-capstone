import React from "react";
import { OrderConfirmationComponent } from "./Step7";

interface SelectedTime {
  timeSlot: { display: string; value: string };
  date: string;
}

interface Step6Props {
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
  calculateTotalPrice: () => number;
  calculateTotalTime: () => number;
  setSelectedTime: (time: SelectedTime) => void;

  selectedNurse: {
    id: number;
    name: string;
    specialization: string;
  } | null;
  selectedTime: {
    timeSlot: { display: string; value: string };
    date: string;
  } | null;
  setCurrentStep: (step: number) => void;
  toast: any;
  router: any;
}

export const Step6Component: React.FC<Step6Props> = ({
  // nurseSelectionMethod,
  selectedServices,
  serviceQuantities,
  formatCurrency,
  calculateTotalPrice,
  selectedNurse,
  selectedTime,
  setCurrentStep,
  toast,
  router,
}) => {
  return (
    <OrderConfirmationComponent
      selectedServices={selectedServices}
      serviceQuantities={serviceQuantities}
      formatCurrency={formatCurrency}
      selectedNurse={selectedNurse}
      selectedTime={selectedTime}
      // nurseSelectionMethod={nurseSelectionMethod}
      calculateTotalPrice={calculateTotalPrice}
      setCurrentStep={setCurrentStep}
      toast={toast}
      router={router}
    />
  );
};
