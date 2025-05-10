export type Invoice = {
  id: string;
  "cuspackage-id": string;
  "total-fee": number;
  status: string;
};

export type InvoiceBody = {
  "is-admin": boolean;
  "patient-ids": [];
};

export type PatchRes = {
  success: boolean;
  message: string;
};