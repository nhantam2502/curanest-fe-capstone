import http from "../lib/http";
import { LoginResType, PhoneLoginInput } from "@/schemaValidation/auth.schema";

const authApiRequest = {
  login: (body: PhoneLoginInput) =>
    http.post<LoginResType>("/auth/api/v1/accounts/login", body),
};

export default authApiRequest;
