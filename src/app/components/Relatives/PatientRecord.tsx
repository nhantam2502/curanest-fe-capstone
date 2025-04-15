import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Circle,
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

const ProfileCard: React.FC<{
  profile: PatientRecord;
  isLoading?: boolean;
}> = ({ profile, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleBookNurse = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsActionLoading("booking");
    setTimeout(() => {
      router.push(`/relatives/booking/${id}`);
    }, 500);
  };

  const handleEditPatientRecord = async (
    e: React.MouseEvent,
    profile: PatientRecord
  ) => {
    e.stopPropagation();
    setIsActionLoading("editing");
    setTimeout(() => {
      router.push(`/relatives/editPatientRecord/${profile.id}`);
    }, 500);
  };

  if (isLoading) {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg animate-pulse">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-6 w-20 bg-gray-200 rounded mt-2 mx-auto"></div>
            </div>

            <div className="mt-4 h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
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

                <InfoItem
                  icon={Circle}
                  label="Giới tính"
                  value={profile.gender ? "Nam" : "Nữ"}
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
                  <div className="flex-shrink-0 mt-1">
                    <Stethoscope className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-grow text-xl">
                    <span className="font-semibold">Mô tả bệnh lý: </span>
                    <span className="text-gray-600">
                      {profile["desc-pathology"]}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-xl">
                  <div className="flex-shrink-0 mt-1">
                    <AlertCircle className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-grow text-xl">
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
                  disabled={isActionLoading !== null}
                >
                  {isActionLoading === "editing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Chỉnh sửa"
                  )}
                </Button>

                <Button
                  className="bg-[#71DDD7] hover:bg-[#5fc4c0] px-6 rounded-full text-xl"
                  onClick={(e) => handleBookNurse(e, profile.id)}
                  disabled={isActionLoading !== null}
                >
                  {isActionLoading === "booking" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt điều dưỡng"
                  )}
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
  const [isFetchingError, setIsFetchingError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientRecords = async () => {
    setIsLoading(true);
    setIsFetchingError(false);
    setError(null);

    try {
      const response = await patientApiRequest.getPatientRecord();
      setProfiles(response.payload.data);
    } catch (err) {
      setError("Không thể tải hồ sơ bệnh nhân");
      setIsFetchingError(true);
      console.error("Error fetching patient records: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProfileCard
              key={i}
              profile={{} as PatientRecord}
              isLoading={true}
            />
          ))}
        </div>

        {/* Overlay with loading spinner */}
        {/* <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
              <Loader2
                className="h-12 w-12 animate-spin text-[#64D1CB]"
                aria-label="Loading..."
              />
            </div>
            <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
              Đang tải hồ sơ bệnh nhân...
            </div>
          </div>
        </div> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-center text-2xl text-red-500">{error}</div>
        <Button
          onClick={fetchPatientRecords}
          className="mt-4 px-6 py-2 bg-[#71DDD7] hover:bg-[#5fc4c0] text-white rounded-full"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Hồ sơ bệnh nhân</h1>
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-center text-2xl text-gray-500 mb-4">
            Chưa có hồ sơ bệnh nhân nào
          </div>
          <Button
            onClick={fetchPatientRecords}
            className="px-6 py-2 bg-[#71DDD7] hover:bg-[#5fc4c0] text-white rounded-full"
          >
            Làm mới
          </Button>
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
