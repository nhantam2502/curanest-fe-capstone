export type ServiceCate = {
  id: string;
  "category-id": string;
  name: string;
  description: string;
  thumbnail: string;
  "est-duration": string;
  status: string;
};

export type CreateServiceCate = {
  name: string;
  description: string;
  "est-duration": string;
};

export type ServiceFilter = {
  "service-name": string;
};

export interface Res {
  status: number;
  message: string;
}
;

export interface Services {
  id: number;
  name: string;
  major_id: number;
  duration: string;
  fee: number;
  // sẽ xoá sau
  time?: number;
  price?: number;
}
// --------------------------------------------------

// Define types based on the API response structure
type CategoryInfo = {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
};

type ServiceItem = {
  id: string;
  name: string;
  status: string;
  description: string;
  "category-id": string;
  "est-duration": string;
  // Thêm field giả định sau này sẽ xoá
  price?: number;
  validityPeriod?: number;
  usageTerms?: string;
  discount?: number;
};

type PackageServiceItem = {
  id: string;
  name: string;
  status: string;
  description: string;
  "service-id": string;
  "time-interval": number;
  "combo-days"?: number;
  discount: number;
  // Thêm field giả định sau này sẽ xoá
  price?: number;
  validityPeriod?: number;
  usageTerms?: string;
};

type TransformedCategory = {
  name: string;
  id: string;
  description: string;
  thumbnail?: string;
  services: {
    name: string;
    id: string;
    description: string;
    // thumbnail: string;
    "est-duration": string;
  }[];
};

// Modify the component types to match
type SelectedService = {
  name: string;
  id: string;
  description: string;
  // thumbnail: string;
};

// Type cho api get list serivces package
export type ServicePackageType = {
  id: string;
  "service-id": string;
  name: string;
  description: string;
  "combo-days": number;
  discount: string;
  "time-interval": number;
  status: string;
  "created-at": number;
};

export type ServicePackageTypeRes = {
  data: ServicePackageType[];
  success: boolean;
};

// Type cho api get list serivces task
export type ServiceTaskType = {
  id: string;
  "svcpackage-id": string;
  "is-must-have": boolean;
  "task-order": number;
  name: string;
  description: string;
  "staff-advice": string;
  "est-duration": number;
  cost: number;
  "additional-cost": number;
  "additional-cost-desc": string;
  unit: string;
  "price-of-step": number;
  status: string;
  note: string;
};

export type ServiceTaskTypeRes = {
  data: ServiceTaskType[];
  success: boolean;
};
