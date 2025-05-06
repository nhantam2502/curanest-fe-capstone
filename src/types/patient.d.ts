import { LucideIcon } from "lucide-react";

export type infoRelatives = {
  id: string;
  role: string;
  "full-name": string;
  email: string;
  "phone-number": string;
  avatar: string;
  gender: boolean;
  dob: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  created_at: string;
};

export type createPatientRecord = {
  "full-name": string;
  dob: string;
  gender: boolean;
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
  "full-name": string;
  dob: string;
  gender: boolean;
  "phone-number": string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "desc-pathology": string;
  "note-for-nurse": string;
}

export type infoRelativesRes = {
  status: number;
  message: string;
  data: infoRelatives;
};

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

export type getPaymentHistory = {
  "patient-ids": string[];
};

export type Invoice = {
  id: string;
  "cuspackage-id": string;
  "total-fee": number;
  status: string; 
  "created-at": string; 
};

export type getPaymentHistoryRes = {
  data: Invoice[];
  success: boolean;
};

export type UpdateTermType = z.TypeOf<typeof UpdateTerm>;

