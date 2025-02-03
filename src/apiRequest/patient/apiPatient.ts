import http from "@/lib/http";
import { UpdatePatientInput } from "@/schemaValidation/relatives.schema";
import { createPatientRecord, CreateRes, infoRelativesRes, PatientRecordRes } from "@/types/patient";

const patientApiRequest = {
  infoRelatives: () =>
    http.get<infoRelativesRes>("/patient/api/v1/relatives/me"),

  createPatientRecord: (body: createPatientRecord) =>
    http.post<CreateRes>("/patient/api/v1/patients", body),

  getPatientRecord: () =>
    http.get<PatientRecordRes>("/patient/api/v1/patients/relatives"),

  updatePatientRecord: (body: UpdatePatientInput) => {
    const { id, ...updateBody } = body;
    return http.put<CreateRes>(`/patient/api/v1/patients/${body.id}`, updateBody);
  },
};

export default patientApiRequest;
