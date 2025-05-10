export interface NotificationItem {
  id: string;
  "account-id": string;
  content: string;
  route: string;
  "created-at": string;
  "read-at": string | null;
}

export interface NotificationFilters {
  "account-id": string;
}

export interface PagingInfo {
  page: number;
  size: number;
  total: number;
}

export interface NotificationRes {
  data: NotificationItem[];
  filters: NotificationFilters;
  paging: PagingInfo;
  success: boolean;
}

export type PatchRes = {
  message: string;
  success: boolean;
};
