export type ServiceCate = {
  id:string;
  "category-id": string;
  name: string;
  description: string;
  thumbnail: string;
  "est-duration": string;
  status: string;
};

export type CreateServiceCate = {
  "category-id": string;
  name: string;
  description: string;
  thumbnail: string;
  "est-duration": string;
};

export type ServiceFilter = {
  "service-name": string;
};

export interface Res {
  status: number;
  message: string;
}

/**/
export type Service = {
  name: string;
  time: string;
  price: number;
  description?: string;
  validityPeriod?: number;
  usageTerms?: string;
};

export interface Services {
  id: number;
  name: string;
  major_id: number;
  duration: string;
  fee: number;
}
// --------------------------------------------------

// Define types based on the API response structure
type CategoryInfo = {
  id: string;
  name: string;
  description: string;
};

type ServiceItem = {
  id: string;
  name: string;
  status: string;
  description: string;
  "category-id": string;
  // thumbnail: string;
  "est-duration": string;
};

type TransformedCategory = {
  name: string;
  id: string;
  description: string;
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

