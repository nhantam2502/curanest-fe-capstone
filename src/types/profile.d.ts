import { LucideIcon } from "lucide-react";

export interface Profile {
  id: number;
  avatar: string;
  full_name: string;
  dob: string;
  citizen_id: string;
  phone_number: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  medical_description: string;
  note_for_nurses: string;
}

export interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}
