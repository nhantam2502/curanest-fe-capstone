// Nurse
export interface Appointment {
  id: number;
  nurse_name: string;
  avatar: string;
  status: "completed" | "pending" | "canceled";
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
  type: "normal" | "makeup" | "substitute";
  participants: number;
  classType: "writing" | "speaking" | "listening";
  appointment_date: string;
};

export type CalendarViewType = "DAY" | "WEEK" | "MONTH" | "YEAR" | "SCHEDULE";