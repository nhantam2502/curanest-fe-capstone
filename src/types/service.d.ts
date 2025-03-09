export type Service = {
  name: string;
  time: string;
  price: number;
  description?: string;
};

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

