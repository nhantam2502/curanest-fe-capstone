import http from "@/lib/http";
import {
  AppointmentFilter,
  AppointmentRes,
  CreateAppointmentCusPackage,
  CreateRes,
  CusPackageResponse,
  GetNurseAvailableRes,
  HistoryAppointmentRes,
  InoviceRes,
  MedicalRecordRes,
  PatchRes,
  submitMedicalReport,
  VerifyNurse,
  VerifyNurseRes,
} from "@/types/appointment";
import { Res } from "@/types/service";

const appointmentApiRequest = {
  createAppointmentCusPackage: (body: CreateAppointmentCusPackage) =>
    http.post<CreateRes>("/appointment/api/v1/cuspackage", body),

  cancelAppointmentCusPackage: (cusPackageID: string) =>
    http.patch<PatchRes>(
      `/appointment/api/v1/cuspackage/${cusPackageID}/cancel`
    ),

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

  verifyNurse: (body: VerifyNurse) =>
    http.post<VerifyNurseRes>(
      "/appointment/api/v1/appointments/verify-nurses-dates",
      body
    ),

  getNurseAvailable: (
    serviceID: string,
    estDate: string,
    estDuration: number
  ) =>
    http.get<GetNurseAvailableRes>(
      `/appointment/api/v1/appointments/nursing-available?service-id=${serviceID}&est-date=${estDate}&est-duration=${estDuration}`
    ),

  getHistoryAppointment: (
    page: number,
    size: number,
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
      }${nursingId || patientId || estDateFrom ? "&" : "?"}apply-paging=true&page=${page}&page-size=${size}`
    ),

  getCusPackage: (cusPackageID: string, estDate: string) =>
    http.get<CusPackageResponse>(
      `/appointment/api/v1/cuspackage?cus-package-id=${cusPackageID}&est-date=${estDate}`
    ),

  getInvoice: (cusPackageID: string) =>
    http.get<InoviceRes>(
      `/appointment/api/v1/cuspackage/${cusPackageID}/invoices`
    ),

  getMedicalRecord: (appointmentID: string) =>
    http.get<MedicalRecordRes>(
      `/appointment/api/v1/medical-record/${appointmentID}`
    ),

  submitMedicalReport: (medicalReportID: string, body: submitMedicalReport) =>
    http.patch<PatchRes>(
      `/appointment/api/v1/medical-record/${medicalReportID}`,
      body
    ),

  checkCusTask: (custaskID: string) =>
    http.patch<PatchRes>(
      `/appointment/api/v1/cuspackage/custask/${custaskID}/update-status-done`
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

  getNursingAvailable: (
    serviceId: string,
    estDate: string,
    estDuration: number
  ) =>
    http.get<Res>(
      `/appointment/api/v1/appointments/nursing-available?service-id=${serviceId}&est-date=${estDate}&est-duration=${estDuration}`
    ),

  getTimesheet: (nursingId: string, estDateFrom: string, estDateTo: string) =>
    http.get<Res>(
      `/appointment/api/v1/appointments/nursing-timesheet?nursing-id=${nursingId}&est-date-from=${estDateFrom}&est-date-to=${estDateTo}`
    ),

  assignNurseToAppointment: (appointmentId: string, nursingId: string) =>
    http.patch<Res>(
      `/appointment/api/v1/appointments/${appointmentId}/assign-nursing/${nursingId}`
    ),
};

export default appointmentApiRequest;
