export type CreateCategory = {
  name: string;
  description: string;
}

export type CategoryFilter = {
  name: string;
}

export interface Res {
  status: number;
  message: string;
}

export type Category = {
  id: string;
  name: string;
  description: string;
  "staff-info": StaffInfo;
};

export type StaffInfo = {
  "nurse-id": string; 
  "nurse-picture": string;
  "nurse-name": string;
};
