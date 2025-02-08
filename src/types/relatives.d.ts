export type RelativesFilter = {
  id?: number;
  email?: string;
  "full-name"?: string;
  "phone-number"?: string;
  role?: string;
  avatar?: string;
};

export type Paging = {
  page: number;
  size: number;
  total: number;
};

export type GetRelativesFilter = {
  filter: RelativesFilter;
  paging: Paging;
};

export type CreateRes = {
  status: number;
  message: string;
};
