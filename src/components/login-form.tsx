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
        default:
          router.push("/");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  disabled={loading}
                  {...register("email")}

                />
                {errors.email && (
                  <div className="text-red-500 text-sm">
                    {errors.email.message as string}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  disabled={loading}
                  {...register("password")}

                />
                
                {errors.password && (
                  <div className="text-red-500 text-sm">
                    {errors.password.message as string}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-between">
              <div className="w-full flex items-center">
                <input type="checkbox" className="w-4 h-4 mr-2" />
                <p className="text-sm">Remember me</p>
              </div>

              <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
                Quên mật khẩu ?
              </p>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Vui lòng chờ
                </Button>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
