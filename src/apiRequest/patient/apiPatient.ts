import http from "@/lib/http";
import { UpdateInfoRelatives, UpdatePatientRecord } from "@/schemaValidation/relatives.schema";
import { createPatientRecord, CreateRes, infoRelativesRes, PatientRecordRes } from "@/types/patient";

const patientApiRequest = {
  getInfoRelatives: () =>
    http.get<infoRelativesRes>("/patient/api/v1/relatives/me"),

  updateInfoRelatives: (body: UpdateInfoRelatives) => {
    const { id, ...updateBody } = body;
    return http.put<CreateRes>(`/patient/api/v1/relatives/${body.id}`, updateBody);
  },

  createPatientRecord: (body: createPatientRecord) =>
    http.post<CreateRes>("/patient/api/v1/patients", body),

  getPatientRecord: () =>
    http.get<PatientRecordRes>("/patient/api/v1/patients/relatives"),

  getPatientById: (id:string) =>
    http.get<PatientRecordRes>(`/patient/api/v1/patients/${id}`),

  getPatientRecordByID: (id: string) =>
    http.get<PatientRecordRes>(`/patient/api/v1/patients/${id}`),

  updatePatientRecord: (body: UpdatePatientRecord) => {
    const { id, ...updateBody } = body;
    return http.put<CreateRes>(`/patient/api/v1/patients/${body.id}`, updateBody);
  },
};

export default patientApiRequest;
