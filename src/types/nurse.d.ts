// Interface cho một service
export interface NurseService {
  name: string;
  time?: string;
  price?: number;
}

// Interface chính cho Nurse
export interface Nurse {
  id: number;
  name: string;
  specialization: string;  
  avgRating: number;
  totalRating: number;
  photo: string;
  totalPatients: number;
  hospital: string;
  experience: string;
  education_level: string;
  certificate: string[];
}

export interface DetailNurseProps {
  nurse: Nurse;
}

export interface NurseForStaff {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  major: string;
  dob: string;
  citizen_id: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  gender: string;
  slogan: string;
  department?: string; 
  email?: string;
}

export interface NurseService {
  id: number;
  name: string;
  major_id: number; // ID of the major they belong to
}