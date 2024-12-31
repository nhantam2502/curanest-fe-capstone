import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Phone,
  IdCard,
  Stethoscope,
  AlertCircle,
  LucideIcon,
  Building2,
  Home,
  MapPinned,
} from "lucide-react";

interface Profile {
  id: number;
  avatar: string;
  full_name: string;
  dob: string;
  citizen_id: string;
  phone_number: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  medical_description: string;
  note_for_nurses: string;
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const dummyProfiles: Profile[] = [
  {
    id: 1,
    avatar: "https://github.com/shadcn.png",
    full_name: "Nguyễn Văn A",
    dob: "1990-01-01",
    citizen_id: "079202000001",
    phone_number: "0923456789",
    address: "123 Đường Nguyễn Văn Linh",
    ward: "Phường 12",
    district: "Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    medical_description: "Bệnh nhân cao huyết áp, tiểu đường type 2",
    note_for_nurses: "Cần theo dõi đường huyết mỗi ngày, hạn chế ăn mặn",
  },
  {
    id: 2,
    avatar: "https://github.com/shadcn.png",
    full_name: "Trần Thị B",
    dob: "1985-05-15",
    citizen_id: "079202000002",
    phone_number: "0934567890",
    address: "456 Đường Lê Văn Việt",
    ward: "Phường 15",
    district: "Quận 9",
    city: "TP. Hồ Chí Minh",
    medical_description: "Hậu phẫu gãy xương đùi, cần vật lý trị liệu",
    note_for_nurses: "Tập vận động nhẹ nhàng, theo dõi vết thương",
  },
];

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
    <span className="text-gray-700 font-semibold text-lg">{label}:</span>
    <span className="text-gray-600 text-lg">{value}</span>
  </div>
);

const PatientProfiles: React.FC = () => {
  return (
    <div className="w-full ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Hồ sơ bệnh nhân</h1>
      </div>

      <div className="grid gap-8">
        {dummyProfiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <Avatar className="w-48 h-48">
                    <AvatarImage src={profile.avatar} alt={profile.full_name} />
                    <AvatarFallback className="text-3xl">
                      {profile.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Information Section */}
                <div className="flex-1 space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {profile.full_name}
                      </h2>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <InfoItem
                      icon={Calendar}
                      label="Ngày sinh"
                      value={`${formatDateVN(profile.dob)} (${calculateAge(
                        profile.dob
                      )} tuổi)`}
                    />
                    <InfoItem
                      icon={IdCard}
                      label="CCCD"
                      value={profile.citizen_id}
                    />
                    <InfoItem
                      icon={Phone}
                      label="Số điện thoại"
                      value={profile.phone_number}
                    />
                  </div>

                  {/* Address Information */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-6">
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
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <Stethoscope className="w-6 h-6 text-gray-500 mt-1" />
                      <div>
                        <span className="font-semibold text-lg">
                          Mô tả bệnh lý:{" "}
                        </span>
                        <span className="text-gray-600 text-lg">
                          {profile.medical_description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-gray-500 mt-1" />
                      <div>
                        <span className="font-semibold text-lg">
                          Lưu ý với điều dưỡng:{" "}
                        </span>
                        <span className="text-gray-600 text-lg">
                          {profile.note_for_nurses}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button variant="secondary" className="text-lg px-6 py-5">
                      Chỉnh sửa
                    </Button>
                    <Button className="bg-[#FFD700] text-white hover:bg-[#FFC300] text-lg px-6 py-5">
                      Đặt điều dưỡng
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientProfiles;