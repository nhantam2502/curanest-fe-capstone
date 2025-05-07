import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  PhoneLoginSchema,
  PhoneLoginInput,
} from "@/schemaValidation/auth.schema";
import { signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneLoginInput>({
    resolver: zodResolver(PhoneLoginSchema),
    defaultValues: {
      "phone-number": "",
      password: "",
    },
  });

  const onSubmit = async (data: PhoneLoginInput) => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        redirect: false,
        identifier: data["phone-number"],
        password: data.password,
      });

      if (result?.error) {
        setError("Thông tin đăng nhập không chính xác.");
        console.error("Đăng nhập thất bại:", result.error);
        return;
      }

      // Fetch session để lấy thông tin role và điều hướng
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );
      // console.log("session: ", session.user)

      if (session?.user?.access_token) {
        localStorage.setItem("sessionToken", session.user.access_token);
      }

      if (session?.user?.role) {
        console.log("User role:", session.user.role);
        switch (session.user.role) {
          case "relatives":
            router.push("/relatives/booking");
            break;
          case "admin":
            setError("Không có quyền truy cập.");
            signOut({ redirect: false });
            setTimeout(() => {
              router.push("/auth/signIn?callbackUrl=%2Fadmin");
            }, 1000);
            break;
          case "nurse":
          case "staff":
            setError("Không có quyền truy cập.");
            signOut({ redirect: false });
            setTimeout(() => {
              router.push("/auth/signIn?callbackUrl=%2Fnurse");
            }, 1000);
            break;
          default:
            router.push("/");
        }
      } else {
        setError("Không thể xác định vai trò của người dùng.");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setError("Có lỗi xảy ra trong quá trình đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-10">
          <div className="w-full flex flex-col gap-7">
            <div>
              <Label htmlFor="phone" className="text-2xl font-medium">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Số điện thoại"
                className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                disabled={loading}
                {...register("phone-number")}
              />
              {errors["phone-number"] && (
                <div className="text-red-500 text-lg">
                  {errors["phone-number"].message as string}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-2xl font-medium">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                disabled={loading}
                {...register("password")}
              />
              {errors.password && (
                <div className="text-red-500 text-lg">
                  {errors.password.message as string}
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center" />
            <Link
              href=""
              className="hover:underline text-lg font-medium whitespace-nowrap cursor-pointer"
            >
              Quên mật khẩu ?
            </Link>
          </div>

          {error && <div className="text-red-500 text-lg">{error}</div>}

          <Button
            type="submit"
            className="w-full py-7 text-xl font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-3" />
                Vui lòng chờ
              </div>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
