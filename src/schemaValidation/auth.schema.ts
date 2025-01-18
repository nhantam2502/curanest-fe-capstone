import { z } from "zod";

export const EmailLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Vui lòng nhập địa chỉ email hợp lệ." })
    .min(1, { message: "Email không được để trống." }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống." }),
});

export const PhoneLoginSchema = z.object({
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Vui lòng nhập số điện thoại hợp lệ (10 số)." })
    .min(1, { message: "Số điện thoại không được để trống." }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống." }),
});

export type EmailLoginInput = z.infer<typeof EmailLoginSchema>;
export type PhoneLoginInput = z.infer<typeof PhoneLoginSchema>;