import React, { useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Info,
  User,
  Phone,
  MapPin,
  Home,
  Building2,
  MapPinned,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PatientRecord } from "@/types/patient";
import { InfoItemProps } from "@/types/patient";

// InfoItem component
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-6 h-6 text-gray-500" />
    <span className="text-gray-700 text-xl font-semibold">{label}:</span>
    <span className="text-gray-600 text-xl">{value}</span>
  </div>
);

const ProfileCard = ({
  profile,
  isSelected,
  onClick,
}: {
  profile: PatientRecord;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "border rounded-lg p-6 cursor-pointer transition-all",
      isSelected
        ? "border-primary bg-primary/5"
        : "border-gray-200 hover:border-primary/50"
    )}
    onClick={onClick}
  >
    <div className="flex gap-6">
      {/* <Avatar className="w-24 h-24">
        <AvatarImage src={profile.a} />
        <AvatarFallback>
          <User className="w-12 h-12" />
        </AvatarFallback>
      </Avatar> */}

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <h3 className="text-3xl font-semibold">{profile["full-name"]}</h3>
          </div>
          {isSelected && (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 text-gray-600">
          <div className="text-xl space-y-4">
            <InfoItem
              icon={Phone}
              label="Số điện thoại"
              value={profile["phone-number"]}
            />

            <InfoItem
              icon={Calendar}
              label="Ngày sinh"
              value={new Date(profile.dob).toLocaleDateString("vi-VN")}
            />
          </div>

          <div className="text-xl space-y-4">
            <InfoItem icon={Home} label="Địa chỉ" value={profile.address} />
            <InfoItem icon={Building2} label="Phường/Xã" value={profile.ward} />
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

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Stethoscope className="w-6 h-6 text-gray-500" />
            </div>
            <div className="ml-2 flex-grow text-xl">
              <span className="font-semibold">Mô tả bệnh lý: </span>
              <span className="text-gray-700">{profile["desc-pathology"]}</span>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <AlertCircle className="w-6 h-6 text-gray-500" />
            </div>
            <div className="ml-2 flex-grow text-xl">
              <span className="font-semibold">Lưu ý cho điều dưỡng: </span>
              <span className="text-gray-700">{profile["note-for-nurse"]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PatientProfileSelection = ({
  profiles,
  selectedProfile,
  onSelectProfile,
}: {
  profiles: PatientRecord[];
  selectedProfile: PatientRecord | null;
  onSelectProfile: (profile: PatientRecord) => void;
}) => (
  <div className="space-y-6 text-lg">
    <h2 className="text-4xl font-bold">Chọn hồ sơ bệnh nhân</h2>
    <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
      <Info className="w-5 h-5 mr-2" />
      Vui lòng chọn hồ sơ bệnh nhân cần đặt lịch chăm sóc
    </p>

    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 pr-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfile?.id === profile.id}
            onClick={() => onSelectProfile(profile)}
          />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  </div>
);

export default PatientProfileSelection;
