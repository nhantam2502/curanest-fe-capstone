import http from "@/lib/http";
import { CreateAppointmentCusPackage, CreateRes } from "@/types/appointment";

const appointmentApiRequest = {
  createAppointmentCusPackage: (body: CreateAppointmentCusPackage) =>
    http.post<CreateRes>("/appointment/api/v1/cuspackage", body),
};

export default appointmentApiRequest;
