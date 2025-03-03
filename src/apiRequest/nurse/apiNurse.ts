import http from "@/lib/http";
import { CreateNurse, CreateRes } from "@/types/nurse";

const nurseApiRequest = {

  createNurse: (body: CreateNurse) =>
    http.post<CreateRes>("/nurse/api/v1/nurses", body),

};

export default nurseApiRequest;
