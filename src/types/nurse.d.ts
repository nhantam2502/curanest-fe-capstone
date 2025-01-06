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