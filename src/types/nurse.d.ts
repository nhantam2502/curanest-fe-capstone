// Interface  cho Nurse (sẽ bỏ)
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

// --------------------------------------
export type NurseItemType = {
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  "current-work-place": string;
  rate: number;
};

export type NurseListResType = {
  data: NurseItemType[];
  filters: {
    "service-id"?: string;
    "nurse-name"?: string;
    rate?: number;
  };
  paging: {
    page: number;
    size: number;
    total: number;
  };
  success: boolean;
};

export type DetailNurseItemType = {
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  city: string;
  "current-work-place": string;
  "education-level": string;
  experience: string;
  certificate: string;
  slogan: string;
  rate: number;
};

export type DetailNurseListResType = {
  data: DetailNurseItemType;
  success: boolean;
};

export interface NurseForStaff {
  avatar: string;
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

export type GetAllNurseDetail = {
  id: string; 
  role: string; 
  email: string;
  "phone-number": string;
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  dob: string; 
  address: string;
  ward: string;
  district: string;
  city: string;
  "current-work-place": string;
  "education-level": string;
  experience: string;
  certificate: string;
  "google-drive-url": string;
  slogan: string;
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

// Type for api get nurse profile
export type infoNurse = {
  id: string;
  role: string;
  "full-name": string;
  email: string;
  "phone-number": string;
  "created-at": string;
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  dob: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "current-work-place": string;
  "education-level": string;
  experience: string;
  certificate: string;
  "google-drive-url": string;
  slogan: string;
  rate: number;
};

export type infoNurseRes = {
  status: number;
  message: string;
  data: infoNurse;
};
