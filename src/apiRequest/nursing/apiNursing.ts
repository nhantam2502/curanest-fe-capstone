import http from "@/lib/http";
import {
  DetailNurseListResType,
  NurseListResType,
} from "@/types/nurse";

const nurseApiRequest = {
 getListNurse: (
  id: string | null,
  rate: string | null,
  page: number,
  nurseName: string | null
) =>
  http.get<NurseListResType>(
    `/nurse/api/v1/nurses?service-id=${id}${
      nurseName ? `&nurse-name=${nurseName}` : ""
    }${rate ? `&rate=${rate}` : ""}&page=${page}&size=10`
  ),

  getDetailNurse: (id: string) =>
    http.get<DetailNurseListResType>(`/nurse/api/v1/nurses/${id}`),
};

export default nurseApiRequest;
