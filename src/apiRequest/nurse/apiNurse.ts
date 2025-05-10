import http from "@/lib/http";
import {
  CreateNurse,
  CreateRes,
  GetAllNurseFilter,
  NurseListResType,
} from "@/types/nurse";

const nurseApiRequest = {
  getAllNurse: (params: {
    filter: GetAllNurseFilter;
    paging: { page: number; size: number };
  }) => {
    const queryParams = new URLSearchParams();
    if (params.filter["service-id"]) {
      queryParams.append("service-id", params.filter["service-id"]);
    }
    if (params.filter["nurse-name"]) {
      queryParams.append("nurse-name", params.filter["nurse-name"]);
    }
    if (params.filter.rate) {
      queryParams.append("rate", params.filter.rate);
    }
    queryParams.append("page", params.paging.page.toString());
    queryParams.append("size", params.paging.size.toString());
    const url = `/nurse/api/v1/nurses?${queryParams.toString()}`;
    return http.get<CreateRes>(url);
  },

  getAllNurseDetail: (id: string) =>
    http.get<CreateRes>(`/nurse/api/v1/nurses/${id}/private-detail`),

  getNurseService: (id: string) =>
    http.get<CreateRes>(`/nurse/api/v1/nurses/${id}/services`),

  createNurse: (body: CreateNurse) =>
    http.post<CreateRes>("/nurse/api/v1/nurses", body),

  mapNurseToService: (nurseId: string, body: { "service-ids": string[] }) =>
    http.post<CreateRes>(`/nurse/api/v1/nurses/${nurseId}/services`, body),

  getListNurse: (page: number, size: number) =>
    http.get<NurseListResType>(
      `/nurse/api/v1/nurses?page=${page}&size=${size}`
    ),

  updateNurse: (body: CreateNurse) =>
    http.put<CreateRes>("/nurse/api/v1/nurses", body),

  deleteNurse: (id: string) =>
    http.patch<CreateRes>(`/nurse/api/v1/nurses/${id}`),
};

export default nurseApiRequest;
