export interface Major {
    id: number;
    name: string;
  }

  export type Res = {
    status: number;
    message: string;
  };

  export type createMajor = {
    name: string;
  };