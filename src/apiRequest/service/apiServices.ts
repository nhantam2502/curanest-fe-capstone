import http from "@/lib/http";
import { ServiceListResType } from "@/schemaValidation/service.schema";
import { CreateServiceCate, Res, ServiceFilter, ServicePackageTypeRes, ServiceTaskTypeRes } from "@/types/service";

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

    getListServicePackage: (serviceId: string) =>
        http.get<ServicePackageTypeRes>(`/appointment/api/v1/services/${serviceId}/svcpackage`),

    getListServiceTask: (svcpackageId: string) =>
      http.get<ServiceTaskTypeRes>(`/appointment/api/v1/svcpackage/${svcpackageId}/svctask`),

  createService: (body: CreateServiceCate) =>
    http.post<Res>("/appointment/api/v1/services", body),
};

export default serviceApiRequest;
