import http from "@/lib/http";
import { createPatientRecord, CreateRes, infoRelativesRes, PatientRecordRes } from "@/types/patient";

const patientApiRequest = {
  infoRelatives: () =>
    http.get<infoRelativesRes>("/patient/api/v1/relatives/me"),

  createPatientRecord: (body: createPatientRecord) =>
    http.post<CreateRes>("/patient/api/v1/patients", body),

  getPatientRecord: () =>
    http.get<PatientRecordRes>("/patient/api/v1/patients/relatives"),
};

export default patientApiRequest;
