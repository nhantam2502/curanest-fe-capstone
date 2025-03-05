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
};

export interface Services {
  id: number;
  name: string;
  major_id: number;
  duration: string;
  fee: number;
}
/**/


