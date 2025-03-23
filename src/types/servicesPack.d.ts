export type ServicePackage = {
  id: string;
  "service-id": string;
  name: string;
  description: string;
  "combo-days": number;
  discount: number;
  "time-interval": number;
  status: string;
};

export type CreateServicePackage = {
  "combo-days": number;
  description: string;
  discount: number;
  name: string;
  "time-interval": number;
};

export type UpdateServicePackage = {
  "combo-days": number;
  description: string;
  discount: number;
  name: string;
  "time-interval": number;
  status: string;
};

export interface Res {
  status: number;
  message: string;
}
