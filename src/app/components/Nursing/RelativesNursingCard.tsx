import { NurseItemType } from "@/types/nurse";
import { Hospital, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RelativesNursingCard = ({
  nurse,
  service,
  serviceID,
}: {
  nurse: NurseItemType;
  service: string;
  serviceID: string;
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
          `/relatives/findingNurse/${encodeURIComponent(service)}/${nurse["nurse-id"]}?serviceID=${encodeURIComponent(serviceID)}`
        )
      }
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="w-full max-w-sm mx-auto min-h-[300px] overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    >
      {/* Top gradient background */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-cyan-200 to-yellow-200" />

      <div className="absolute top-12 sm:top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {/* Responsive avatar size */}
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 border-4 border-white">
          <AvatarImage src={nurse["nurse-picture"]} alt={nurse["nurse-name"]} />
          <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl bg-blue-100 text-blue-800">
            {getInitials(nurse["nurse-name"])}
          </AvatarFallback>
        </Avatar>

        {/* Badge rating with responsive positioning */}
        {nurse.rate && (
          <div className="absolute top-28 sm:top-32 md:top-40 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-0.5 sm:py-1 px-2 sm:px-3 md:px-4 shadow-sm border border-gray-100 flex items-center">
            <span className="font-bold text-gray-800 text-xs sm:text-sm md:text-base lg:text-lg mr-0.5 sm:mr-1">
              {parseFloat(nurse.rate).toFixed(1)}
            </span>
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-200 flex-shrink-0" />
          </div>
        )}
      </div>

      <CardContent className="pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 px-4 sm:px-6 bg-white">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate text-center mb-3 sm:mb-3">
          {nurse["nurse-name"]}
        </h2>

        {/* Nơi làm việc */}
        <div className="flex items-center mb-2 sm:mb-3">
          <Hospital className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2 text-red-500 flex-shrink-0" />
          <p className="text-sm sm:text-base md:text-lg text-gray-600 truncate">
            Làm việc tại {nurse["current-work-place"]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelativesNursingCard;