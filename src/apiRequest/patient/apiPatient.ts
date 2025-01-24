import http from "@/lib/http";
import { createPatientRecord, CreateRes, PatientRecordRes } from "@/types/patient";

const patientApiRequest = {
  // infoCustomer: (customer_id: string) =>
  //   http.get<infoCustomerRes>(`/customers/${customer_id}`),

  createPatientRecord: (body: createPatientRecord) =>
    http.post<CreateRes>("/patient/api/v1/patients", body),

  getPatientRecord: () =>
    http.get<PatientRecordRes>("/patient/api/v1/patients/relatives"),
};

export default patientApiRequest;
