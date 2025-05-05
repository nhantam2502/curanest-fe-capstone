import http from "@/lib/http";
import {
  CreateFeedback,
  CreateRes,
  DetailNurseListResType,
  Feedback,
  FeedbackRes,
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

   createFeedback: (body: CreateFeedback) =>
      http.post<CreateRes>("/nurse/api/v1/feedbacks", body),

   getFeedback: (medicalRecordID: string) =>
    http.get<Feedback>(`/nurse/api/v1/feedbacks/${medicalRecordID}`),

   getFeedbackForNursing: (nursingID: string) =>
    http.get<FeedbackRes>(`/nurse/api/v1/feedbacks/nursing/${nursingID}`),

};

export default nurseApiRequest;