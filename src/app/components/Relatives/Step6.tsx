import React from "react";
import { OrderConfirmationComponent } from "./Step7";
import { NurseItemType } from "@/types/nurse";

interface SelectedTime {
  timeSlot: { display: string; value: string };
  date: string;
}

interface Step6Props {
  nurseSelectionMethod: "manual" | "auto";
  selectedServicesTask: Array<{
    name: string;
    "est-duration": number;
    cost: number;
    description?: string;
    validityPeriod?: number;
    usageTerms?: string;
  }>;
  serviceQuantities: { [key: string]: number };
  formatCurrency: (value: number) => string;
  calculateTotalPrice: () => number;
  calculateTotalTime: () => number;
  setSelectedTime: (time: SelectedTime) => void;

  selectedNurse: NurseItemType | null;

  selectedTime: {
    timeSlot: { display: string; value: string };
    date: string;
  } | null;
  setCurrentStep: (step: number) => void;
  toast: any;
  router: any;
}

export const Step6Component: React.FC<Step6Props> = ({
  nurseSelectionMethod,
  selectedServicesTask,
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
      selectedServicesTask={selectedServicesTask}
      serviceQuantities={serviceQuantities}
      formatCurrency={formatCurrency}
      selectedNurse={selectedNurse}
      selectedTime={selectedTime}
      nurseSelectionMethod={nurseSelectionMethod}
      calculateTotalPrice={calculateTotalPrice}
      setCurrentStep={setCurrentStep}
      toast={toast}
      router={router}
    />
  );
};
