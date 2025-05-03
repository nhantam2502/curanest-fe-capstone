import http from "@/lib/http";
import {
  DetailNurseListResType,
  infoNurseRes,
  NurseListResType,
} from "@/types/nurse";

const nurseApiRequest = {
 getListNurse: (
  id: string | null,
  rate: string | null,
  page: number,
  size: number,
  nurseName: string | null
) =>
  http.get<NurseListResType>(
    `/nurse/api/v1/nurses?service-id=${id}${
      nurseName ? `&nurse-name=${nurseName}` : ""
    }${rate ? `&rate=${rate}` : ""}&page=${page}&size=${size}`
  ),

  getDetailNurse: (id: string) =>
    http.get<DetailNurseListResType>(`/nurse/api/v1/nurses/${id}`),

  getListNurseNoFilter: () =>
    http.get<NurseListResType>("/nurse/api/v1/nurses?page=1&size=50"),
  

  getInfoNurseMe: () =>
    http.get<infoNurseRes>("/nurse/api/v1/nurses/me"),

};

export default nurseApiRequest;
