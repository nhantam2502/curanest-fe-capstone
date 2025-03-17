import { NurseItemType } from "@/types/nurse";
import { Hospital, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const GuestNursingCard = ({
  nurse,
  service,
}: {
  nurse: NurseItemType;
  service: string;
}) => {
  const router = useRouter();

  if (!nurse) {
    return <p className="text-center text-gray-500">Dữ liệu không tồn tại</p>;
  }

  // Get nurse initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card
      onClick={() =>
        router.push(
          `/guest/nurseList/${encodeURIComponent(service)}/${nurse["nurse-id"]}`
        )
      }
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="w-[400px] md:w-[400px] min-h-[300px] overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      >
      {/* Top gradient background */}
      <div className="h-40 bg-gradient-to-r from-blue-300 to-yellow-300" />

      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {/* Avatar lớn hơn */}
        <Avatar className="h-48 w-48 border-4 border-white">
          <AvatarImage src={nurse["nurse-picture"]} alt={nurse["nurse-name"]} />
          <AvatarFallback className="text-4xl bg-blue-100 text-blue-800">
            {getInitials(nurse["nurse-name"])}
          </AvatarFallback>
        </Avatar>

        {/* Badge rating điều chỉnh lại vị trí */}
        {nurse.rate && (
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-1 px-4 shadow-sm border border-gray-100 flex items-center">
            <span className="font-bold text-gray-800 text-lg mr-1">
              {nurse.rate.toFixed(1)}
            </span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-200 flex-shrink-0" />
          </div>
        )}
      </div>

      <CardContent className="pt-28 pb-6 px-6 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 truncate text-center mb-6">
          {nurse["nurse-name"]}
        </h2>

        {/* Nơi làm việc */}
        <div className="flex items-center mb-3">
          <Hospital className="w-6 h-6 mr-2 text-red-500 flex-shrink-0" />
          <p className="text-lg md:text-xl text-gray-600">
            Làm việc tại {nurse["current-work-place"]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestNursingCard;
