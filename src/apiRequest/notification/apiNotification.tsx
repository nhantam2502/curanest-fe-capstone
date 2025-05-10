import http from "@/lib/http";
import { NotificationRes, PatchRes } from "@/types/notification";

const notificationApiRequest = {
  getNotification: (accountID: string, pageSize: number) =>
    http.get<NotificationRes>(
      `/notification/api/v1/notifications?account-id=${accountID}&page-size=${pageSize}`
    ),

  seenNotification: (notificationID: string) =>
    http.patch<PatchRes>(
      `/notification/api/v1/notifications/${notificationID}`
    ),
};

export default notificationApiRequest;
