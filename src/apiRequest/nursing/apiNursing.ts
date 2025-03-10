import http from "@/lib/http";
import {
  DetailNurseListResType,
  NurseFilterType,
  NurseListResType,
} from "@/types/nurse";

const nurseApiRequest = {
  getListNurse: (
    body: NurseFilterType = { "service-id": "", page: 1, size: 10 }
  ) =>
    http.get<NurseListResType>(
      `/nurse/api/v1/nurses?${new URLSearchParams({
        "service-id": body["service-id"],
        "nurse-name": body["nurse-name"] || "",
        rate: body.rate?.toString() || "",
        page: body.page?.toString() || "1",
        size: body.size?.toString() || "10",
      })}`
    ),

  getDetailNurse: (id: string) =>
    http.get<DetailNurseListResType>(`/nurse/api/v1/nurses/${id}`),
};

export default nurseApiRequest;
