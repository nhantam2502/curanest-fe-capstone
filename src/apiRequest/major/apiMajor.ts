import http from "@/lib/http";
import { createMajor, Res } from "@/types/major";

const majorApiRequest = {
  getMajor: () =>
    http.get<Res>("/nurse/api/v1/majors"),

  createMajor: (body: createMajor) =>
    http.post<Res>("/nurse/api/v1/majors", body),
};

export default majorApiRequest;