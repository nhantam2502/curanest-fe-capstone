import z from "zod";

// Schema cho thông tin danh mục dịch vụ
const CategoryInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

// Schema cho dịch vụ
const ServiceSchema = z.object({
  id: z.string(),
  "category-id": z.string(),
  name: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  "est-duration": z.string(),
  status: z.string(),
});

// Schema cho nhóm danh mục và dịch vụ
const CategoryServiceGroupSchema = z.object({
  "category-info": CategoryInfoSchema,
  "list-services": z.array(ServiceSchema),
});

// Schema cho response
export const ServiceListRes = z.object({
  data: z.array(CategoryServiceGroupSchema),
  success: z.boolean(),
});

// Filter schema
export const ServiceFilterSchema = z.object({
  "service-name": z.string().optional(),
});

// Export types
export type ServiceListResType = z.TypeOf<typeof ServiceListRes>;
export type ServiceFilterType = z.TypeOf<typeof ServiceFilterSchema>;
export type ServiceType = z.TypeOf<typeof ServiceSchema>;
export type CategoryInfoType = z.TypeOf<typeof CategoryInfoSchema>;