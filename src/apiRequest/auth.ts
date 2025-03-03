import { CreateRes } from "@/types/patient";
import http from "../lib/http";
import { LoginResType, PhoneLoginInput, RegisterBodyType } from "@/schemaValidation/auth.schema";

const authApiRequest = {
  login: (body: PhoneLoginInput) =>
    http.post<LoginResType>("/auth/api/v1/accounts/login", body),
  register: (body: RegisterBodyType) =>
    http.post<CreateRes>("/patient/api/v1/relatives", body),
};

export default authApiRequest;
