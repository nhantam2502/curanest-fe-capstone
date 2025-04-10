import http from "@/lib/http";
import {
  AppointmentRes,
  CreateAppointmentCusPackage,
  CreateRes,
  CusPackageResponse,
  InoviceRes,
} from "@/types/appointment";

const appointmentApiRequest = {
  createAppointmentCusPackage: (body: CreateAppointmentCusPackage) =>
    http.post<CreateRes>("/appointment/api/v1/cuspackage", body),

  getAppointment: (nursingId?: string, patientId?: string) =>
    http.get<AppointmentRes>(
      `/appointment/api/v1/appointments${
        nursingId
          ? `?nursing-id=${nursingId}`
          : patientId
            ? `?patient-id=${patientId}`
            : ""
      }${nursingId && patientId ? `&patient-id=${patientId}` : ""}`
    ),

  getCusPackage: (cusPackageID: string, estDate: string) =>
    http.get<CusPackageResponse>(
      `/appointment/api/v1/cuspackage?cus-package-id=${cusPackageID}&est-date=${estDate}`
    ),

  getInvoice: (cusPackageID: string) =>
    http.get<InoviceRes>(
      `/appointment/api/v1/cuspackage/${cusPackageID}/invoices`
    ),
};

export default appointmentApiRequest;


