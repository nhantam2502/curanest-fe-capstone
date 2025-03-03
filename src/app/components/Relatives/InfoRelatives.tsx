"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { infoRelativesRes } from "@/types/patient"; // Adjust this import path
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { useAppContext } from "@/app/appProvider";

interface ApiResponse {
  status: number;
  payload: infoRelativesRes;
}

const InfoRelatives = () => {
  const [userData, setUserData] = useState<infoRelativesRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAppContext(); // Lấy user từ context

  const formatDOB = (dob: string): string => {
    if (dob.includes("/")) {
      // Nếu là định dạng dd/mm/yyyy, giữ nguyên
      return dob;
    } else if (dob.includes("-")) {
      // Nếu là định dạng yyyy-mm-dd, chuyển sang dd/mm/yyyy
      const date = new Date(dob);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      return `${day}/${month}/${year}`;
    } else {
      return dob;
    }
  };

  useEffect(() => {
    // console.log("User from context:", user);
    const fetchUserData = async () => {
      try {
        const response: ApiResponse = await patientApiRequest.getInfoRelatives();
        if (response.status === 200 && response.payload) {
          setUserData(response.payload);
          setUser(response.payload.data);
        } else {
          setError("Không thể tải thông tin. Vui lòng thử lại sau.");
        }
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
          <Loader2
            className="h-12 w-12 animate-spin text-[#64D1CB]"
            aria-label="Loading..."
          />
        </div>
        <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-2xl text-center p-4">{error}</div>;
  }

  if (!userData) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <div className="w-full p-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="w-60 h-60">
              <AvatarImage src={userData.data.avatar} />
              <AvatarFallback className="text-3xl">
                {userData.data["full-name"]?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-bold">
              {userData.data["full-name"] || "Không có tên"}
            </h2>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField
                label="Email"
                value={userData.data.email || "Không có email"}
              />
              <InfoField
                label="Số điện thoại"
                value={
                  userData.data["phone-number"] || "Không có số điện thoại"
                }
              />
              <InfoField
                label="Ngày sinh"
                value={formatDOB(userData.data.dob) || "Không có ngày sinh"}
              />
              <InfoField
                label="Giới tính"
                value={
                  typeof userData.data.gender === "boolean"
                    ? userData.data.gender
                      ? "Nam"
                      : "Nữ"
                    : userData.data.gender || "Không có giới tính"
                }
              />
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField
                  label="Địa chỉ"
                  value={userData.data.address || "Không có địa chỉ"}
                />
                <InfoField
                  label="Phường"
                  value={userData.data.ward || "Không có phường"}
                />
                <InfoField
                  label="Quận"
                  value={userData.data.district || "Không có quận"}
                />
                <InfoField
                  label="Thành phố"
                  value={userData.data.city || "Không có thành phố"}
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
