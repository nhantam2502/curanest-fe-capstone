import React, { useState } from "react";
import { Calendar, Check, Clock, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Profile } from "@/types/profile";

const ProfileCard = ({
  profile,
  isSelected,
  onClick,
}: {
  profile: Profile;
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
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.avatar} />
        <AvatarFallback>
          <User className="w-12 h-12" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-semibold">{profile.full_name}</h3>
          {isSelected && (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6 text-gray-600">
          <div className="text-xl space-y-4">
            <p>Số điện thoại: {profile.phone_number}</p>
            <p className="text-gray-600">
              Ngày sinh: {new Date(profile.dob).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div  className="text-xl space-y-4">
            <p>Địa chỉ: {profile.address}</p>
            <p>
              {profile.ward}, {profile.district}
            </p>
            <p>{profile.city}</p>
          </div>
        </div>

        <div className="space-y-4">
        
          <div className="text-xl">
            <span className="font-medium text-xl">Mô tả bệnh lý: </span>
            <span className="text-gray-700">{profile.medical_description}</span>
          </div>

          <div className="text-xl">
            <span className="font-medium text-xl">Lưu ý cho điều dưỡng: </span>
            <span className="text-gray-700">{profile.note_for_nurses}</span>
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
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
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
