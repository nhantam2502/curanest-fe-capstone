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
  hospital?: string; 
  experience: string;
  education_level: string;
  certificate: string[];
  services: string[]; 
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
export interface CreateNurse {
  address: string;
  certificate: string;
  "citizen-id": string; 
  city: string;
  "current-work-place": string; 
  district: string;
  dob: string;
  "education-level": string; 
  email: string;
  experience: string;
  "full-name": string; 
  gender: boolean;
  "google-drive-url": string; 
  "nurse-picture": string; 
  password?: string; 
  "phone-number": string; 
  slogan: string;
  ward: string;
}

export type GetAllNurse = {
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  "current-work-place": string;
  rate: number;
};

export type GetAllNurseFilter = {
  "service-id": string;
  "nurse-name": string;
  rate: string;
}


export type CreateRes = {
  status: number;
  message: string;
  error?: string;
};

export interface NurseService {
  id: number;
  name: string;
  major_id: number; // ID of the major they belong to
}

// Profile data
interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
}

interface PersonalInfo {
  full_name: string;
  avatar_url: string;
  dob: string;
  gender: string;
  slogan: string;
  about: string;
}

interface ProfessionalInfo {
  position: string;
  department: string;
  workplace: string;
  medical_license: string;
  specializations: string[];
}

interface ContactInfo {
  phone: string;
  email: string;
  citizen_id: string;
  address: Address;
}

interface SkillsLanguages {
  skills: string[];
}

interface Experience {
  position: string;
  department: string;
  workplace: string;
  duration: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  major: string;
  university: string;
  duration: string;
}

interface Certificate {
  name: string;
  issuer: string;
  year: string;
  expiry: string;
}

export interface ProfileData {
  personal_info: PersonalInfo;
  professional_info: ProfessionalInfo;
  contact_info: ContactInfo;
  skills_languages: SkillsLanguages;
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
}
