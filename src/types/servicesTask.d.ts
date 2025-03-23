export type ServiceTask = {
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
  status: "available" | "unavailable";
};

export type CreateServiceTask = {
  "additional-cost": number;
  "additional-cost-desc": string;
  cost: number;
  description: string;
  "est-duration": number;
  "is-must-have": boolean;
  name: string;
  "task-order": number;
  "price-of-step": number;
  "staff-advice": string;
  unit: string;
};

export type UpdateServiceTask = {
  "additional-cost": number;
  "additional-cost-desc": string;
  cost: number;
  description: string;
  "est-duration": number;
  "is-must-have": boolean;
  name: string;
  "price-of-step": number;
  "staff-advice": string;
  status: string;
  unit: string;
};

export interface Res {
  status: number;
  message: string;
}
