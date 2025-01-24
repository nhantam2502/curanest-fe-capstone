"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const InfoRelatives = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="relative">
          {/* Outer ring with pulse effect */}
          <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>

          {/* Inner spinner */}
          <Loader2
            className="h-12 w-12 animate-spin text-[#64D1CB]"
            aria-label="Loading..."
          />
        </div>
        <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
          Đang tải...
        </div>{" "}
      </div>
    );
  }

  // Kiểm tra nếu người dùng chưa đăng nhập
  if (!session?.user) {
    return <div>Vui lòng đăng nhập để xem thông tin.</div>;
  }

  const user = session.user;

  // console.log("User info: ", user);

  return (
    <div className="w-full p-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="w-60 h-60">
              <AvatarImage src={"https://via.placeholder.com/150"} />
              <AvatarFallback className="text-3xl">
                {user.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-bold">
              {user.name || "Không có tên"}
            </h2>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="Email" value={user.email || "Không có email"} />
              <InfoField
                label="Số điện thoại"
                value={user["phone-number"] || "Không có số điện thoại"}
              />
              <InfoField
                label="Ngày sinh"
                value={user.dob || "Không có ngày sinh"}
              />
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField
                  label="Địa chỉ"
                  value={user.address || "Không có địa chỉ"}
                />
                <InfoField
                  label="Phường"
                  value={user.ward || "Không có phường"}
                />
                <InfoField
                  label="Quận"
                  value={user.district || "Không có quận"}
                />
                <InfoField
                  label="Thành phố"
                  value={user.city || "Không có thành phố"}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-2">
    <p className="text-xl text-muted-foreground">{label}</p>
    <p className="text-xl font-medium">{value}</p>
  </div>
);

export default InfoRelatives;
