import http from "@/lib/http";
import {
  AppointmentFilter,
  AppointmentRes,
  CreateAppointmentCusPackage,
  CreateRes,
  CusPackageResponse,
  HistoryAppointmentRes,
  InoviceRes,
} from "@/types/appointment";
import { Res } from "@/types/service";

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

  getHistoryAppointment: (
    page: number,
    nursingId?: string,
    patientId?: string,
    estDateFrom?: string
  ) =>
    http.get<HistoryAppointmentRes>(
      `/appointment/api/v1/appointments${
        nursingId
          ? `?nursing-id=${nursingId}`
          : patientId
            ? `?patient-id=${patientId}`
            : ""
      }${nursingId && patientId ? `&patient-id=${patientId}` : ""}${
        nursingId || patientId
          ? estDateFrom
            ? `&est-date-from=${estDateFrom}`
            : ""
          : estDateFrom
            ? `?est-date-from=${estDateFrom}`
            : ""
      }${nursingId || patientId || estDateFrom ? "&" : "?"}apply-paging=true&page=${page}&page-size=10`
    ),

  getCusPackage: (cusPackageID: string, estDate: string) =>
    http.get<CusPackageResponse>(
      `/appointment/api/v1/cuspackage?cus-package-id=${cusPackageID}&est-date=${estDate}`
    ),

  getInvoice: (cusPackageID: string) =>
    http.get<InoviceRes>(
      `/appointment/api/v1/cuspackage/${cusPackageID}/invoices`
    ),

    getAppointments: (filter: AppointmentFilter | null) => {
      let queryString = `/appointment/api/v1/appointments`;
  
      if (filter) {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
  
        queryString += `?${params.toString()}`;
      }
  
      return http.get<Res>(queryString);
    },

};

export default appointmentApiRequest;
