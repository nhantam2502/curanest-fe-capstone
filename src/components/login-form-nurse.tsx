import { useState, useEffect } from "react";
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

export function LoginFormForNurse({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
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

  useEffect(() => {
    if (!loading) return;
    const checkNavigation = setInterval(() => {
      if (document.readyState === "complete") {
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(checkNavigation);
  }, [loading]);

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
        setLoading(false);
        return;
      }

      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      if (session?.user?.access_token) {
        localStorage.setItem("sessionToken", session.user.access_token);
      }

      if (session?.user?.role) {
        // console.log("User role:", session.user.role);
        switch (session.user.role) {
          case "admin":
            setError(
              "Chỉ có điều dưỡng mới có quyền truy cập vào trang của điều dưỡng."
            );
            signOut({ redirect: false });
            router.push("/auth/signIn?callbackUrl=%2Fadmin");
            break;
          case "relatives":
            setError(
              "Chỉ có điều dưỡng mới có quyền truy cập vào trang của điều dưỡng."
            );
            signOut({ redirect: false });
            router.push("/auth/signIn");
            break;
          case "nurse":
            router.push("/nurse");
            break;
          case "staff":
            router.push("/staff");
            break;
          default:
            router.push("/");
        }
      } else {
        setError("Không thể xác định vai trò của người dùng.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setError("Có lỗi xảy ra trong quá trình đăng nhập.");
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

          {error && <div className="text-red-500 text-base">{error}</div>}

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
