// Nurse
export interface AppointmentDummy {
  id: number;
  nurse_name: string;
  avatar: string;
  status: string;
  phone_number: string;
  techniques: string;
  total_fee: number;
  appointment_date: string;
  time_from_to: string;
}

export type ScheduleEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  name: string;
  classType: string;
  appointment_date: string;
};

export type CalendarViewType = "DAY" | "WEEK" | "MONTH" | "YEAR" | "SCHEDULE";
// ----------------------//
export type CreateRes = {
  status: number;
  message: string;
};

export type CreateAppointmentCusPackage = {
  dates: string[];
  "nursing-id"?: string;
  "patient-id": string;
  "svcpackage-id": string;
  "task-infos": {
    "client-note": string;
    "est-duration": number;
    "svctask-id": string;
    "total-cost": number;
    "total-unit": number;
  }[];
};

export interface Appointment {
  id: string;
  "service-id": string;
  "cuspackage-id": string;
  "nursing-id": string;
  "patient-id": string;
  "est-date": string;
  "act-date": string;
  status: string;
  "created-at": string;
}

export type AppointmentRes = {
  success: boolean;
  message: string;
  data: Appointment[];
};

export type CusPackageResponse = {
  success: boolean;
  data: {
    package: CusPackage;
    tasks: Task[];
  };
};

export type CusPackage = {
  id: string;
  name: string;
  "total-fee": number;
  "paid-amount": number;
  "unpaid-amount": number;
  "payment-status": string;
  "created-at": string; 
};

export type Task = {
  id: string;
  "task-order": number;
  name: string;
  "client-note": string;
  "staff-advice": string;
  "est-duration": number;
  unit: string;
  "total-unit": number;
  status: string; 
  "est-date": string; 
};
