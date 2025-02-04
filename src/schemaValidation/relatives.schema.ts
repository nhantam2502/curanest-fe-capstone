import { z } from "zod";

export const CreatePatientSchema = z.object({
  id: z.string(),

  "full-name": z
    .string()
    .min(1, { message: "Họ và tên không được để trống" })
    .max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),

  dob: z
    .string({
      required_error: "Ngày sinh không được để trống",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Ngày sinh không hợp lệ" }
    ),

  gender: z.boolean({
    required_error: "Vui lòng chọn giới tính",
    invalid_type_error: "Giới tính không hợp lệ",
  }),

  district: z.string({
    required_error: "Vui lòng chọn quận",
    invalid_type_error: "Quận không hợp lệ",
  }),

  ward: z.string({
    required_error: "Vui lòng chọn phường",
    invalid_type_error: "Phường không hợp lệ",
  }),

  "phone-number": z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .regex(/^(0|84)[0-9]{9}$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc 84912345678)",
    }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  city: z.string().min(1, { message: "Thành phố không được để trống" }),

  "desc-pathology": z
    .string()
    .min(1, { message: "Mô tả bệnh lý không được để trống" })
    .max(1000, { message: "Mô tả bệnh lý không được vượt quá 1000 ký tự" }),

  "note-for-nurse": z
    .string()
    .optional()
    .transform((val) => val || "")
    .pipe(
      z.string().max(1000, { message: "Lưu ý không được vượt quá 1000 ký tự" })
    ),

  email: z
    .string()
    .email({ message: "Địa chỉ email không hợp lệ" })
    .optional()
    .transform((val) => val || undefined),

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

export const UpdateRelativesSchema = z.object({
  id: z.string(),

  "full-name": z
    .string()
    .min(1, { message: "Họ và tên không được để trống" })
    .max(100, { message: "Họ và tên không được vượt quá 100 ký tự" }),

  dob: z
    .string({
      required_error: "Ngày sinh không được để trống",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Ngày sinh không hợp lệ" }
    ),

  gender: z.boolean({
    required_error: "Vui lòng chọn giới tính",
    invalid_type_error: "Giới tính không hợp lệ",
  }),

  district: z.string({
    required_error: "Vui lòng chọn quận",
    invalid_type_error: "Quận không hợp lệ",
  }),

  ward: z.string({
    required_error: "Vui lòng chọn phường",
    invalid_type_error: "Phường không hợp lệ",
  }),

  "phone-number": z
    .string()
    .min(1, { message: "Số điện thoại không được để trống" })
    .regex(/^(0|84)[0-9]{9}$/, {
      message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc 84912345678)",
    }),

  address: z
    .string()
    .min(1, { message: "Địa chỉ không được để trống" })
    .max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),

  city: z.string().min(1, { message: "Thành phố không được để trống" }),

  email: z
    .string()
    .email({ message: "Địa chỉ email không hợp lệ" })
    .optional()
    .transform((val) => val || undefined),

    avatar: z.string()
    .refine(
      (value) => value.length > 0, 
      { message: "Vui lòng chọn ảnh đại diện" }
    )
    .refine(
      (value) => {
        // Optional: Add URL or base64 validation if needed
        return value.startsWith('http') || value.startsWith('data:image')
      }, 
      { message: "Định dạng ảnh không hợp lệ" }
    )
});


export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientRecord = z.infer<typeof CreatePatientSchema>;
export type UpdateInfoRelatives = z.infer<typeof UpdateRelativesSchema>;
