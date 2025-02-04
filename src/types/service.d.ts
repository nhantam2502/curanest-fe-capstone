export type Service = {
  name: string;
  time: string;
  price: number;
  description?: string;
};

export interface Services {
  id: number;
  name: string;
  major_id: number; // ID of the major the service belongs to
  duration: string;
  fee: number;
}