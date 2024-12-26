"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const dummyProfile = {
  email: "nguyenvana@gmail.com",
  user_name: "nguyenvana",
  avatar: "https://github.com/shadcn.png",
  user_id: "USER001",
  citizen_id: "079202000001",
  full_name: "Nguyễn Văn A",
  phone_number: "0923456789",
  dob: "01/01/1990",
  ward: "Phường 12",
  district: "Quận Bình Thạnh",
  city: "TP. Hồ Chí Minh",
  address: "123 Đường Nguyễn Văn Linh",
  created_at: "2024-01-01",
};

const InfoRelatives = () => {
  return (
    <Card className="w-full p-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-6">
            <Avatar className="w-60 h-60">
              <AvatarImage src={dummyProfile.avatar} />
              <AvatarFallback className="text-4xl">{dummyProfile.full_name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-bold">{dummyProfile.full_name}</h2>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="Email" value={dummyProfile.email} />
              <InfoField label="Số điện thoại" value={dummyProfile.phone_number} />
              <InfoField label="Ngày sinh" value={dummyProfile.dob} />
              <InfoField label="CCCD" value={dummyProfile.citizen_id} />
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField label="Địa chỉ" value={dummyProfile.address} />
                <InfoField label="Phường" value={dummyProfile.ward} />
                <InfoField label="Quận" value={dummyProfile.district} />
                <InfoField label="Thành phố" value={dummyProfile.city} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-2">
    <p className="text-lg text-muted-foreground">{label}</p>
    <p className="text-xl font-medium">{value}</p>
  </div>
);

export default InfoRelatives;