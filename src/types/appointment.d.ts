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
};

// ----------------------//

// export interface ScheduleEvent {
//   id: string;
//   title: string;
//   startTime: string;
//   status: string;
//   name: string;
//   appointment_date: string;
//   estDate?: string;
//   cusPackageID?: string;
//   patientID?: string;
// }

export type CreateRes = {
  status: number;
  message: string;
  "object-id": string;
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