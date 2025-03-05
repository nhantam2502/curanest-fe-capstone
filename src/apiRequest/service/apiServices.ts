import http from "@/lib/http";
import { CreateServiceCate, Res, ServiceFilter } from "@/types/service";


const serviceApiRequest = {
  getService: ( cateId:string, filter: ServiceFilter | null) => {
    let queryString = `/appointment/api/v1/categories/${cateId}/services?`;
    if (filter?.["service-name"]) { 
      queryString += `=${filter["service-name"]}`;
    }
    return http.get<Res>(queryString);
  },

  createService: (body: CreateServiceCate) =>
    http.post<Res>("/appointment/api/v1/services", body),

};

export default serviceApiRequest;
