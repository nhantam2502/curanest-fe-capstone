export type ServiceTask = {
    id: string;
    svcPackageId: string;
    isMustHave: boolean;
    taskOrder: number;
    name: string;
    description: string;
    staffAdvice: string;
    estDuration: number;
    cost: number;
    additionalCost: number;
    additionalCostDesc: string;
    unit: string;
    priceOfStep: number;
    status: "available" | "unavailable";
  };
  
  export type CreateServiceTask = {
    "additional-cost": number;
    "additional-cost-desc": string;
    cost: number;
    description: string;
    "est-duration": number;
    "is-must-have": true;
    name: string;
    order: number;
    "price-of-step": number;
    "staff-advice": string;
    unit: "quantity" | "time";
  };
  
  export interface Res {
    status: number;
    message: string;
  }