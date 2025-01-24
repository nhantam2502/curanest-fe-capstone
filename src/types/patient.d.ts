import { LucideIcon } from "lucide-react";

export type createPatientRecord = {
  "full-name": string;
  dob: string;
  email: string;
 "phone-number": string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "desc-pathology": string;
  "note-for-nurse": string;
};


export interface PatientRecord {
  id: string;
  avatar: string;
  "full-name": string;
  email: string;
  dob: string;
 "phone-number": string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "desc-pathology": string;
  "note-for-nurse": string;
}

export type PatientRecordRes = {
  status: number;
  message: string;
  data: PatientRecord[];
};

export type CreateRes = {
  status: number;
  message: string;
};

export interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}
