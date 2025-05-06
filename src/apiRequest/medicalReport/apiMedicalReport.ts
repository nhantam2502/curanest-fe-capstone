import http from "@/lib/http";
import { Res } from "@/types/service";

interface ConfirmBody {
  "nursing-report": string | null;
  "staff-confirmation": string;
}

const medicalReportApiRequest = {
  getMedicalReport: (appId:string) =>
    http.get<Res>(`/appointment/api/v1/medical-record/${appId}`),

  updateMedicalReport: (reportId:string, body: ConfirmBody) =>
    http.patch<Res>(`/appointment/api/v1/medical-record/${reportId}`, body),
};

export default medicalReportApiRequest;
