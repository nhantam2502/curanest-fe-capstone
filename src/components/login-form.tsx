import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    // .min(6, { message: "Password must be at least 6 characters." })
    .min(1, { message: "Password is required." }),
});

export function LoginForm({
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
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "nurse":
          router.push("/nurse");
          break;
        case "staff":
          router.push("/staff");
          break;
        case "relatives":
          router.push("/relatives/booking");
          break;
        default:
          router.push("/guest");
      }
    } catch (error) {
      setError("An error occurred during login");
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
            {/* <div className="w-full flex items-center">
          <input type="checkbox" className="w-6 h-6 mr-4" />
          <p className="text-lg">Remember me</p>
        </div> */}

            <div className="w-full flex items-center" />

            <Link
              href=""
              className="text-lg font-medium whitespace-nowrap cursor-pointer"
            >
              Quên mật khẩu ?
            </Link>
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
              "Login"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
