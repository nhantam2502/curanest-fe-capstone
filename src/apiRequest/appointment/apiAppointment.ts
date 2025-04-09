import http from "@/lib/http";
import { AppointmentRes, CreateAppointmentCusPackage, CreateRes, CusPackageResponse } from "@/types/appointment";

const appointmentApiRequest = {
  createAppointmentCusPackage: (body: CreateAppointmentCusPackage) =>
    http.post<CreateRes>("/appointment/api/v1/cuspackage", body),

  getAppointment: (nursingId?: string, patientId?: string) =>
    http.get<AppointmentRes>(
      `/appointment/api/v1/appointments${
        nursingId ? `?nursing-id=${nursingId}` : patientId ? `?patient-id=${patientId}` : ""
      }${
        nursingId && patientId ? `&patient-id=${patientId}` : ""
      }`
    ),

    getCusPackage: (cusPackageID: string, estDate: string) =>
      http.get<CusPackageResponse>(`/appointment/api/v1/cuspackage?cus-package-id=${cusPackageID}&est-date=${estDate}`),
    
};

export default appointmentApiRequest;