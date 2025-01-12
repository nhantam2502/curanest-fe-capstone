import React, { useState } from "react";
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
} from "lucide-react";
import { InfoItemProps, Profile } from "@/types/profile";
import { useRouter } from "next/navigation";
import dummy_profile from "@/dummy_data/dummy_profile.json";

const formatDateVN = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const calculateAge = (dateString: string): number => {
  const today = new Date();
  const birthDate = new Date(dateString);
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

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-6 h-6 text-gray-500" />
    <span className="text-gray-700 text-xl font-semibold">{label}:</span>
    <span className="text-gray-600 text-xl">{value}</span>
  </div>
);

const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleBookNurse = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    router.push(`/relatives/booking/${id}`);
  };

  const handleEditPatientRecord = (e: React.MouseEvent, profile: Profile) => {
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
            <Avatar className="w-40 h-40 mb-4">
              <AvatarImage src={profile.avatar} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">
                {profile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">
                {profile.full_name}
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
                  value={formatDateVN(profile.dob)}
                />
                <InfoItem
                  icon={Phone}
                  label="Số điện thoại"
                  value={profile.phone_number}
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
                      {profile.medical_description}
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
                      {profile.note_for_nurses}
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
  const profiles: Profile[] = dummy_profile;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Hồ sơ bệnh nhân</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default PatientRecords;
