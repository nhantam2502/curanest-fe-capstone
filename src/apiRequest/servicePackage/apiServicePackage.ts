import http from "@/lib/http";
import {
  CreateServicePackage,
  Res,
  UpdateServicePackage,
} from "@/types/servicesPack";
import {
  CreateServiceTask,
  UpdateServiceOrder,
  UpdateServiceOrderPayload,
  UpdateServiceTask,
} from "@/types/servicesTask";

const servicePackageApiRequest = {
  // Service Package
  getServicePackage: (serviceId: string) =>
    http.get<Res>(`/appointment/api/v1/services/${serviceId}/svcpackage`),

  createServicePackage: (serviceId: string, body: CreateServicePackage) =>
    http.post<Res>(
      `/appointment/api/v1/services/${serviceId}/svcpackage`,
      body
    ),

  updateServicePackage: (
    serviceId: string,
    packageId: string,
    body: UpdateServicePackage
  ) =>
    http.put<Res>(
      `/appointment/api/v1/services/${serviceId}/svcpackage/${packageId}`,
      body
    ),

    packageCount: (cateId: string) =>
    http.get<Res>(`/appointment/api/v1/svcpackage/category/${cateId}/usage-count`),

  // Service Task
  getServiceTask: (packageId: string) =>
    http.get<Res>(`/appointment/api/v1/svcpackage/${packageId}/svctask`),

  createServiceTask: (packageId: string, body: CreateServiceTask) =>
    http.post<Res>(`/appointment/api/v1/svcpackage/${packageId}/svctask`, body),

  updateServiceOrder: (taskData: UpdateServiceOrderPayload) =>
    http.patchWithBody<Res>(`/appointment/api/v1/svcpackage/svctask`, taskData),

  updateServiceTask: (
    packageId: string,
    taskId: string,
    body: UpdateServiceTask
  ) =>
    http.put<Res>(
      `/appointment/api/v1/svcpackage/${packageId}/svctask/${taskId}`,
      body
    ),
};

export default servicePackageApiRequest;
