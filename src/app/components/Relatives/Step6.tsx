import React from "react";
import { OrderConfirmationComponent } from "./Step7";
import { NurseItemType } from "@/types/nurse";
import { ServiceTaskType } from "@/types/service";



interface Step6Props {
  nurseSelectionMethod: "manual" | "auto";
  selectedServiceTask: ServiceTaskType[];

  serviceQuantities: { [key: string]: number };
  formatCurrency: (value: number) => string;
  calculateTotalPrice: () => number;
  calculateTotalTime: () => number;

  selectedNurse: NurseItemType | null;

  selectedTime: {
    timeSlot: { display: string; value: string };
    date: Date | string;
  } | null;

  selectedTimes: Array<{
    date: Date | string;
    timeSlot: { display?: string; value?: string };
  }>;
  selectedPackage: {
    id: string;
    name: string;
    "combo-days"?: number;
    discount: number;
    [key: string]: any;
  } | null;
  setCurrentStep: (step: number) => void;
  toast: any;
  router: any;
  serviceNotes?: { [key: string]: string };
}

export const Step6Component: React.FC<Step6Props> = ({
  nurseSelectionMethod,
  selectedServiceTask,
  serviceQuantities,
  formatCurrency,
  calculateTotalTime,
  calculateTotalPrice,
  selectedNurse,
  selectedTimes,
  selectedTime,
  setCurrentStep,
  selectedPackage,
  toast,
  router,
  serviceNotes, 
}) => {
  return (
    <OrderConfirmationComponent
      selectedServiceTask={selectedServiceTask}
      selectedPackage={selectedPackage}
      serviceQuantities={serviceQuantities}
      formatCurrency={formatCurrency}
      selectedNurse={selectedNurse}
      selectedTime={selectedTime}
      selectedTimes={selectedTimes}
      nurseSelectionMethod={nurseSelectionMethod}
      calculateTotalPrice={calculateTotalPrice}
      calculateTotalTime={calculateTotalTime}
      setCurrentStep={setCurrentStep}
      toast={toast}
      router={router}
      serviceNotes={serviceNotes} // Thêm prop này

    />
  );
};
