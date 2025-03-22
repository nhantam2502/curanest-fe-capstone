import http from "@/lib/http";
import { CreateServicePackage, Res } from "@/types/servicesPack";
import { CreateServiceTask } from "@/types/servicesTask";

const servicePackageApiRequest = {
    // Service Package
  getServicePackage: (serviceId: string) =>
    http.get<Res>(`/appointment/api/v1/services/${serviceId}/svcpackage`),

  createServicePackage: (serviceId: string, body: CreateServicePackage) =>
    http.post<Res>(
      `/appointment/api/v1/services/${serviceId}/svcpackage`,
      body
    ),

  // Service Task
  getServiceTask: (packageId: string) =>
    http.get<Res>(`/appointment/api/v1/svcpackage/${packageId}/svctask`),

  createServiceTask: (packageId: string, body: CreateServiceTask) =>
    http.post<Res>(
      `/appointment/api/v1/svcpackage/${packageId}/svctask`,
      body
    ),
};

export default servicePackageApiRequest;
