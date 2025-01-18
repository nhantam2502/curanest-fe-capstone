import { z } from "zod";

export const CreatePatientSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Họ và tên không được để trống" })
    .max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),

  dateOfBirth: z.date({
    required_error: "Vui lòng chọn ngày sinh",
    invalid_type_error: "Ngày sinh không hợp lệ",
  }),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Vui lòng chọn giới tính",
    invalid_type_error: "Giới tính không hợp lệ",
  }),

  phone: z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .regex(/^(0|84)[0-9]{9}$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc 84912345678)",
    }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  ward: z.string().min(1, { message: "Vui lòng chọn phường" }),
  
  district: z.string().min(1, { message: "Vui lòng chọn quận" }),
  
  city: z.string().min(1, { message: "Thành phố không được để trống" }),

  medicalDescription: z
    .string()
    .min(1, { message: "Mô tả bệnh lý không được để trống" })
    .max(1000, { message: "Mô tả bệnh lý không được vượt quá 1000 ký tự" }),

  nurseNotes: z
    .string()
    .optional()
    .transform(val => val || "")
    .pipe(
      z.string().max(1000, { message: "Lưu ý không được vượt quá 1000 ký tự" })
    ),

  avatar: z
    .instanceof(File, { message: "Vui lòng chọn ảnh đại diện" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước ảnh không được vượt quá 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP",
      }
    ),
});

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;