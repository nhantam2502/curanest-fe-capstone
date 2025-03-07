import http from "@/lib/http";
import { CreateNurse, CreateRes, GetAllNurseFilter } from "@/types/nurse";

const nurseApiRequest = {

  getAllNurse: (params: { 
    filter: GetAllNurseFilter; 
    paging: { page: number; size: number} 
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
  
  createNurse: (body: CreateNurse) =>
    http.post<CreateRes>("/nurse/api/v1/nurses", body),

};

export default nurseApiRequest;
