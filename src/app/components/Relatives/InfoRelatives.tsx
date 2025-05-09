"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { infoRelativesRes } from "@/types/patient";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { useAppContext } from "@/app/appProvider";

const InfoRelatives = () => {
  const [userData, setUserData] = useState<infoRelativesRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAppContext();

  const formatDOB = (dob: string): string => {
    if (dob.includes("/")) return dob;

    if (dob.includes("-")) {
      const date = new Date(dob);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    }

    return dob;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await patientApiRequest.getInfoRelatives();
        if (response.status === 200 && response.payload) {
          setUserData(response.payload);
          setUser(response.payload.data);
        } else {
          setError("Không thể tải thông tin. Vui lòng thử lại sau.");
        }
      } catch (err) {
        console.log("Error fetching info relatives data: ", err);
        setError("Không thể tải thông tin. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-red-500 text-2xl text-center p-4">{error}</div>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            setTimeout(() => {
              patientApiRequest
                .getInfoRelatives()
                .then((response) => {
                  if (response.status === 200 && response.payload) {
                    setUserData(response.payload);
                    setUser(response.payload.data);
                  } else {
                    setError("Không thể tải thông tin. Vui lòng thử lại sau.");
                  }
                })
                .catch((err) => {
                  console.log("Error fetching info relatives data: ", err);
                  setError("Không thể tải thông tin. Vui lòng thử lại sau.");
                })
                .finally(() => setIsLoading(false));
            }, 500);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-gray-500 text-xl text-center p-4">
          Không tìm thấy thông tin người dùng.
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              patientApiRequest
                .getInfoRelatives()
                .then((response) => {
                  if (response.status === 200 && response.payload) {
                    setUserData(response.payload);
                    setUser(response.payload.data);
                  } else {
                    setError("Không thể tải thông tin. Vui lòng thử lại sau.");
                  }
                })
                .catch((err) => {
                  console.log("Error fetching info relatives data: ", err);
                  setError("Không thể tải thông tin. Vui lòng thử lại sau.");
                })
                .finally(() => setIsLoading(false));
            }, 500);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Làm mới
        </button>
      </div>
    );
  }

  const { data } = userData;

  return (
    <div className="w-full">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="w-60 h-60">
              <AvatarImage src={data.avatar} />
              <AvatarFallback className="text-3xl">
                {(() => {
                  const fullName = data["full-name"];
                  const words = fullName?.split(" ").filter(Boolean);
                  const lastWord = words?.slice(-1)[0];
                  const initial = lastWord?.[0]?.toUpperCase();
                  return initial || "?";
                })()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-bold">
              {data["full-name"] || "Không có tên"}
            </h2>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="Email" value={data.email || "Không có email"} />
              <InfoField
                label="Số điện thoại"
                value={data["phone-number"] || "Không có số điện thoại"}
              />
              <InfoField
                label="Ngày sinh"
                value={formatDOB(data.dob) || "Không có ngày sinh"}
              />
              <InfoField
                label="Giới tính"
                value={
                  typeof data.gender === "boolean"
                    ? data.gender
                      ? "Nam"
                      : "Nữ"
                    : data.gender || "Không có giới tính"
                }
              />
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField
                label="Địa chỉ"
                value={data.address || "Không có địa chỉ"}
              />
              <InfoField
                label="Phường"
                value={data.ward || "Không có phường"}
              />
              <InfoField
                label="Quận"
                value={data.district || "Không có quận"}
              />
              <InfoField
                label="Thành phố"
                value={data.city || "Không có thành phố"}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Avatar and name skeleton */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-60 h-60 rounded-full bg-gray-200"></div>
            <div className="h-10 w-48 bg-gray-200 rounded-md"></div>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Main information skeleton */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <SkeletonInfoField key={`top-${i}`} />
              ))}
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <SkeletonInfoField key={`bottom-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Loading indicator overlay */}
      {/* <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
            <Loader2
              className="h-12 w-12 animate-spin text-[#64D1CB]"
              aria-label="Loading..."
            />
          </div>
          <div className="text-[#64D1CB] text-sm font-medium mt-4">
            Đang tải thông tin...
          </div>
        </div>
      </div> */}
    </div>
  );
};

// Skeleton for info fields
const SkeletonInfoField = () => (
  <div className="space-y-2">
    <div className="h-6 w-24 bg-gray-200 rounded"></div>
    <div className="h-7 w-48 bg-gray-200 rounded"></div>
  </div>
);

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-2">
    <p className="text-xl text-muted-foreground">{label}</p>
    <p className="text-xl font-medium">{value}</p>
  </div>
);

export default InfoRelatives;
