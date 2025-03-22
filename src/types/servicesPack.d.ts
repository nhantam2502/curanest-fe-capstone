export type ServicePackage = {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  comboDays: number;
  discount: number;
  timeInterval: number;
  status: string;
  createdAt: string;
};

export type CreateServicePackage = {
  "combo-days": number;
  description: string;
  discount: number;
  name: string;
  "time-interval": number;
};

export interface Res {
  status: number;
  message: string;
}
