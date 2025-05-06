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

export const RegisterSchema = z
  .object({
    "full-name": z.string().min(2, {
      message: "Họ tên phải có ít nhất 2 ký tự",
    }),
    email: z.string().email({
      message: "Vui lòng nhập đúng định dạng email",
    }),
    "phone-number": z.string().regex(/^[0-9]{10}$/, {
      message: "Vui lòng nhập số điện thoại hợp lệ (10 số).",
    }),
    password: z
      .string()
      .min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Mật khẩu phải chứa ít nhất một chữ hoa",
      })
      // .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      //   message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
      // })
      .refine((val) => /\d/.test(val), {
        message: "Mật khẩu phải chứa ít nhất một số",
      }),
    // confirmPassword: z.string().min(6, {
    //   message: "Mật khẩu nhập lại phải có ít nhất 6 ký tự",
    // }),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Mật khẩu nhập lại không khớp",
  //   path: ["confirmPassword"],
  // });

export const RegisterBody = z.object({
  email: z.string(),
  password: z.string(),
  // confirmPassword: z.string(),
  "full-name": z.string(),
  "phone-number": z.string(),
});

export const LoginRes = z.object({
  data: z.object({
    "account-info": z.object({
      id: z.string(),
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
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export type EmailLoginInput = z.infer<typeof EmailLoginSchema>;
export type PhoneLoginInput = z.infer<typeof PhoneLoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
