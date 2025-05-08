"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RegisterSchema,
  RegisterBodyType,
  RegisterInput,
} from "@/schemaValidation/auth.schema";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter
import authApiRequest from "@/apiRequest/auth";
import { useToast } from "@/hooks/use-toast";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      "full-name": "",
      email: "",
      "phone-number": "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      setIsLoading(true);

      const registerData: RegisterBodyType = {
        "full-name": values["full-name"],
        email: values.email,
        "phone-number": values["phone-number"],
        password: values.password,
      };

      const response = await authApiRequest.register(registerData);
      console.log("response register: ", response);

      // Hiển thị thông báo trước
      toast({
        title: "Đăng nhập thành công",
        // description: "Tài khoản của bạn đã được tạo thành công",
      });

      router.push(`/auth/signIn?role=${role}`);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: error.response?.data?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full-name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="full-name" className="text-2xl font-medium">
                Họ và tên
              </Label>
              <FormControl>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-lg" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email" className="text-2xl font-medium">
                Email
              </Label>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-lg" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone-number"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="phone" className="text-2xl font-medium">
                Số điện thoại
              </Label>
              <FormControl>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-lg" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password" className="text-2xl font-medium">
                Mật khẩu
              </Label>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={35} /> : <Eye size={35} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-lg" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmPassword" className="text-2xl font-medium">
                Nhập lại mật khẩu
              </Label>{" "}
              <FormControl>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={35} />
                    ) : (
                      <Eye size={35} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-lg" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full py-7 text-xl font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
  );
}
