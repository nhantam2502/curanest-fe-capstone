import { add } from "date-fns";
import { z } from "zod";

export const EmailLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Vui lòng nhập địa chỉ email hợp lệ." })
    .min(1, { message: "Email không được để trống." }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
});

export const PhoneLoginSchema = z.object({
  "phone-number": z
    .string()
    .regex(/^[0-9]{10}$/, {
      message: "Vui lòng nhập số điện thoại hợp lệ (10 số).",
    })
    .min(1, { message: "Số điện thoại không được để trống." }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
});

export const RegisterRes = z.object({
  data: z.object({
    id: z.string(),
    address: z.string(),
    city: z.string(),
    district: z.string(),
    dob: z.string(),
    email: z.string(),
    "full-name": z.string(),
    password: z.string(),
    "phone-number": z.string(),
    ward: z.string(),
  }),
  message: z.string(),
  status: z.number(),
});

export const LoginRes = z.object({
  data: z.object({
    "account-info": z.object({
      "full-name": z.string(),
      email: z.string(),
      "phone-number": z.string(),
      role: z.string(),
    }),
    token: z.object({
      access_token: z.string(),
      access_token_exp_in: z.number(),
    }),
  }),
  success: z.boolean(),
});

export const AccountRes = z
  .object({
    data: z.object({
      id: z.string(),
      role: z.string(),
      "full-name": z.string(),
      email: z.string(),
      "phone-number": z.string(),
      avatar: z.string(),
      gender: z.boolean(),
      dob: z.string(),
      address: z.string(),
      ward: z.string(),
      district: z.string(),
      city: z.string(),
    }),
    message: z.string(),
    status: z.number(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export type LoginResType = z.TypeOf<typeof LoginRes>;

export type EmailLoginInput = z.infer<typeof EmailLoginSchema>;
export type PhoneLoginInput = z.infer<typeof PhoneLoginSchema>;
