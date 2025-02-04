import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Phone,
  Stethoscope,
  AlertCircle,
  Building2,
  Home,
  MapPinned,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { InfoItemProps, PatientRecord } from "@/types/patient";
import { useRouter } from "next/navigation";
import patientApiRequest from "@/apiRequest/patient/apiPatient";

const calculateAge = (dateString: string): number => {
  let day: number, month: number, year: number;

  if (dateString.includes("/")) {
    // Định dạng dd/mm/yyyy
    [day, month, year] = dateString.split("/").map(Number);
  } else if (dateString.includes("-")) {
    // Định dạng yyyy-mm-dd
    [year, month, day] = dateString.split("-").map(Number);
  } else {
    throw new Error("Invalid date format");
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

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
    throw new Error("Invalid date format");
  }
};


const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-6 h-6 text-gray-500" />
    <span className="text-gray-700 text-xl font-semibold">{label}:</span>
    <span className="text-gray-600 text-xl">{value}</span>
  </div>
);

const ProfileCard: React.FC<{ profile: PatientRecord }> = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleBookNurse = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/relatives/booking/${id}`);
  };

  const handleEditPatientRecord = (
    e: React.MouseEvent,
    profile: PatientRecord
  ) => {
    e.stopPropagation();
    router.push(`/relatives/editPatientRecord/${profile.id}`);
  };

  return (
    <div>
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* <Avatar className="w-40 h-40 mb-4">
              <AvatarImage src={profile.avatar} alt={profile["full-name"]} />
              <AvatarFallback className="text-2xl">
                {profile["full-name"]
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar> */}

            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">
                {profile["full-name"]}
              </h2>
              <div className="text-gray-500 text-xl mt-2">
                {calculateAge(profile.dob)} tuổi
              </div>
            </div>

            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-6 border-t pt-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <InfoItem
                  icon={Calendar}
                  label="Ngày sinh"
                  value={formatDOB(profile.dob)}
                />

                <InfoItem
                  icon={Phone}
                  label="Số điện thoại"
                  value={profile["phone-number"]}
                />
              </div>

              {/* Address Information */}
              <div className="border-t mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <InfoItem
                    icon={Home}
                    label="Địa chỉ"
                    value={profile.address}
                  />
                  <InfoItem
                    icon={Building2}
                    label="Phường/Xã"
                    value={profile.ward}
                  />
                  <InfoItem
                    icon={MapPinned}
                    label="Quận/Huyện"
                    value={profile.district}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Tỉnh/Thành phố"
                    value={profile.city}
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t mt-4 pt-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <Stethoscope className="w-6 h-6 text-gray-500 mt-1" />
                  <div className="text-xl">
                    <span className="font-semibold">Mô tả bệnh lý: </span>
                    <span className="text-gray-600">
                      {profile["desc-pathology"]}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-xl">
                  <AlertCircle className="w-6 h-6 text-gray-500 mt-1" />
                  <div>
                    <span className="font-semibold">
                      Lưu ý với điều dưỡng:{" "}
                    </span>
                    <span className="text-gray-600">
                      {profile["note-for-nurse"]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
                <Button
                  variant="secondary"
                  className="bg-[#FFD700] text-white hover:bg-[#FFC300] px-6 rounded-full text-xl"
                  onClick={(e) => handleEditPatientRecord(e, profile)}
                >
                  Chỉnh sửa
                </Button>

                <Button
                  className="bg-[#71DDD7] hover:bg-[#5fc4c0] px-6 rounded-full text-xl"
                  onClick={(e) => handleBookNurse(e, profile.id)}
                >
                  Đặt điều dưỡng
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PatientRecords: React.FC = () => {
  const [profiles, setProfiles] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const response = await patientApiRequest.getPatientRecord();
        // console.log("patient records :", response.payload.data);
        setProfiles(response.payload.data);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải hồ sơ bệnh nhân");
        setIsLoading(false);
      }
    };

    fetchPatientRecords();
  }, []);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="text-center text-2xl text-red-500">{error}</div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Hồ sơ bệnh nhân</h1>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center text-2xl text-red-500 mt-10">
          Không có hồ sơ bệnh nhân
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
