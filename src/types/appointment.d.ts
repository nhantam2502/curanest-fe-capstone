// Nurse
export interface Appointment {
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



export type CalendarViewType = "DAY" | "WEEK" | "MONTH" | "YEAR" | "SCHEDULE";