import { NurseItemType } from "./nurse";

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

//
export type GetAppointment = {
  id: string;
  "service-id": string;
  "cuspackage-id": string;
  "nursing-id": string;
  "patient-id": string;
  "est-date": string;
  "act-date": string | null;
  status: string;
  "created-at": string;
  "total-est-duration": number;
  "is-paid": boolean;
};

export type AppointmentFilter = {
  "service-id"?: string;
  "cuspackage-id"?: string;
  "nursing-id"?: string;
  "patient-id"?: string;
  "had-nurse"?: string;
  "appointment-status"?: string;
  "est-date-from"?: string;
  "est-date-to"?: string;
  "category-id"?: string;
};

// ----------------------//

export type CreateRes = {
  status: number;
  message: string;
  "object-id": string;
};

export type PatchRes = {
  success: boolean;
  message: string;
};

export type CreateAppointmentCusPackage = {
  "date-nurse-mappings": {
    date: string;
    "nursing-id"?: string;
  }[];
  "patient-address": string;
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
  "patient-address": string;
  "patient-lat-lng": string;
  "est-date": string;
  "act-date": string;
  status: string;
  "is-paid": boolean;
  "created-at": string;
  "total-est-duration": number;
  appointment_date?: string;
  estTimeFrom?: string;
  estTimeTo?: string;
}

export type AppointmentRes = {
  success: boolean;
  data: Appointment[];
};

export type VerifyNurse = {
  "nurses-dates": {
    "est-duration": number;
    "est-start-date": string;
    "nurse-id": string;
  }[];
};

export type VerifyNurseRes = {
  data: {
    "nurse-id": string;
    "est-start-date": string;
    "est-duration": number;
    "is-availability": boolean;
  }[];
  success: boolean;
};

export type GetNurseAvailableRes = {
  success: boolean;
  data: NurseItemType[];
};

export type HistoryAppointmentRes = {
  data: Appointment[];
  filters: {
    "apply-paging"?: boolean;
  };
  paging: {
    page: number;
    size: number;
    total: number;
  };
  success: boolean;
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
  "svc-package-id": string;
  "patient-id": string;
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

export interface Inovice {
  id: string;
  "cuspackage-id": string;
  "order-code": number;
  "total-free": number;
  status: string;
  note: string;
  "payos-url": string;
  "created-at": string;
}

export type InoviceRes = {
  success: boolean;
  data: Inovice[];
};

export interface MedicalRecord {
  id: string;
  "svc-package-id": string;
  "patient-id": number;
  "nursing-report": number;
  "staff-confirmation": string;
  status: string;
  "created-at": string;
}

export type MedicalRecordRes = {
  success: boolean;
  data: MedicalRecord[];
};

export type submitMedicalReport = {
  "nursing-report": string;
  "staff-confirmation"?: string;
};

//
export type GetAppointment = {
  id: string;
  "service-id": string;
  "cuspackage-id": string;
  "nursing-id": string;
  "patient-id": string;
  "est-date": string;
  "act-date": string | null;
  "total-est-duration": number;
  status: string;
  "created-at": string;
};

export type AppointmentFilter = {
  "service-id"?: string;
  "cuspackage-id"?: string;
  "nursing-id"?: string;
  "patient-id"?: string;
  "had-nurse"?: string;
  "appointment-status"?: string;
  "est-date-from"?: string;
};
