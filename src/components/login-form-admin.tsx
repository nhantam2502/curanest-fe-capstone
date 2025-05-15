import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn, signOut } from "next-auth/react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EmailLoginSchema } from "@/schemaValidation/auth.schema";

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailLoginSchema),
    defaultValues: {
      email: "",
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

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        identifier: data.email,
        password: data.password,
        isAdmin: "true",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // const session = await getSession();

      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      if (session?.user?.access_token) {
        localStorage.setItem("sessionToken", session.user.access_token);
      }
      console.log("Session:", session);

      switch (session?.user?.role) {
        case "admin":
          router.push("/admin");
          break;
        case "nurse":
          setError(
            "Chỉ có quản trị viên mới có quyền truy cập vào trang admin"
          );
          signOut({ redirect: false });
          router.push("/auth/signIn?callbackUrl=%2Fnurse");
          break;
        case "staff":
          setError(
            "Chỉ có quản trị viên mới có quyền truy cập vào trang admin"
          );
          signOut({ redirect: false });

          router.push("/auth/signIn?callbackUrl=%2Fnurse");
          break;
        case "relatives":
          setError(
            "Chỉ có quản trị viên mới có quyền truy cập vào trang admin"
          );
          // Xóa session cho vai trò relatives
          signOut({ redirect: false });
          router.push("/auth/signIn");
          return;
        default:
          setError(
            "Chỉ có quản trị viên mới có quyền truy cập vào trang admin"
          );
          setLoading(false);
          return;
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setError("An error occurred during login.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn("", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-10">
          <div className="w-full flex flex-col gap-7">
            <div>
              <Label htmlFor="email" className="text-2xl font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none"
                disabled={loading}
                {...register("email")}
              />
              {errors.email && (
                <div className="text-red-500 text-lg">
                  {errors.email.message as string}
                </div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-2xl font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full text-black py-7 text-xl my-3 bg-transparent border-b-2 border-black outline-none focus:outline-none pr-12"
                  disabled={loading}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={35} /> : <Eye size={35} />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-lg">
                  {errors.password.message as string}
                </div>
              )}
            </div>
          </div>

          {/* <div className="w-full flex items-center justify-between">
            <Link
              href=""
              className="text-lg font-medium whitespace-nowrap cursor-pointer"
            >
              Quên mật khẩu?
            </Link>
          </div> */}

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
