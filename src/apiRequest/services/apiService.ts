import http from "@/lib/http";
import { ServiceFilterType, ServiceListResType } from "@/schemaValidation/service.schema";

const serviceApiRequest = {
  getListService: (body: ServiceFilterType | null) =>
    http.get<ServiceListResType>(
      `/appointment/api/v1/services/group-by-category${
        body?.["service-name"] ? `?service-name=${body["service-name"]}` : ""
      }`
    ),
};

export default serviceApiRequest;