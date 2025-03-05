import http from "@/lib/http";
import { CategoryFilter, CreateCategory, Res } from "@/types/category";

const categoryApiRequest = {
  getCategory: (filter: CategoryFilter | null) => {
    let queryString = `/appointment/api/v1/categories?`;
    if (filter?.name) { 
      queryString += `name=${filter.name}`;
    }
    return http.get<Res>(queryString);
  },
  createCategory: (body: CreateCategory) =>
    http.post<Res>("/appointment/api/v1/categories", body),

};

const addStaffToCate = (cateId: string, staffId: string) => {
  const url = `/appointment/api/v1/categories/${cateId}/staff/${staffId}`;
  return http.patch<Res>(url);
};
export { addStaffToCate };

const removeStaffToCate = (cateId: string) => {
  const url = `/appointment/api/v1/categories/${cateId}/staff/remove`;
  return http.patch<Res>(url); 
};
export { removeStaffToCate };

export default categoryApiRequest;
