import http from "@/lib/http";
import { CreateRes, GetRelativesFilter} from "@/types/relatives";

const relativesApiRequest = {
  getRelativesFilter: (body: GetRelativesFilter) =>
    http.post<CreateRes>("/patient/api/v1/relatives/filter", body),
};

export default relativesApiRequest;