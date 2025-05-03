import React from "react";
import { OrderConfirmationComponent } from "./Step7";
import { NurseItemType } from "@/types/nurse";
import { ServiceTaskType } from "@/types/service";
import { PatientRecord } from "@/types/patient";
import { SelectedDateTime } from "./SubscriptionTimeSelection";

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

    selectedTimes: SelectedDateTime[];
  
  selectedPackage: {
    id: string;
    name: string;
    "combo-days"?: number;
    discount: number;
    [key: string]: any;
  } | null;
  serviceNotes?: { [key: string]: string };
  selectedProfile?: PatientRecord | null;
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
  selectedPackage,
  serviceNotes,
  selectedProfile,
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
      serviceNotes={serviceNotes}
      selectedProfile={selectedProfile} 
    />
  );
};


