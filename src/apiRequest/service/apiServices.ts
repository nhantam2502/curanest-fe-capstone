import http from "@/lib/http";
import { ServiceListResType } from "@/schemaValidation/service.schema";
import { CreateServiceCate, Res, ServiceFilter } from "@/types/service";
import { CreateServicePackage } from "@/types/servicesPack";

const serviceApiRequest = {
  getService: (cateId: string, filter: ServiceFilter | null) => {
    let queryString = `/appointment/api/v1/categories/${cateId}/services?`;
    if (filter?.["service-name"]) {
      queryString += `=${filter["service-name"]}`;
    }
    return http.get<Res>(queryString);
  },

  getListService: (serviceName: string | null) =>
    http.get<ServiceListResType>(
      `/appointment/api/v1/services/group-by-category${
        serviceName ? `?service-name=${serviceName}` : ""
      }`
    ),

  createService: (cateId: string, body: CreateServiceCate) =>
    http.post<Res>(`/appointment/api/v1/categories/${cateId}/services`, body),

  getServicePackage: (serviceId: string) =>
    http.get<Res>(`/appointment/api/v1/services/${serviceId}/svcpackage`),

  createServicePackage: (serviceId: string, body: CreateServicePackage) =>
    http.post<Res>(`/appointment/api/v1/services/${serviceId}/svcpackage`, body),
};

export default serviceApiRequest;
