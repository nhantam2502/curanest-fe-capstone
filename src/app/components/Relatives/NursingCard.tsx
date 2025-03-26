import { Hospital, Star } from "lucide-react";
import React from "react";
import { Nurse, NurseItemType } from "@/types/nurse";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NursingCardProps {
  nurse: NurseItemType;
  onSelect: (nurseId: string) => void;
  isSelected?: boolean;
}

const NursingCard: React.FC<NursingCardProps> = ({
  nurse,
  onSelect,
  isSelected = false,
}) => {
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
      className={`w-[300px] min-h-[300px] overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer 
      ${isSelected ? "border-2 border-blue-500" : "border border-gray-200"}`}
      onClick={() => onSelect(nurse["nurse-id"])}
    >
      {/* Top gradient background */}
      <div className="h-32 bg-gradient-to-r from-cyan-200 to-yellow-200" />

      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {/* Avatar */}
        <Avatar className="h-32 w-32 border-4 border-white">
          <AvatarImage src={nurse["nurse-picture"]} alt={nurse["nurse-name"]} />
          <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
            {getInitials(nurse["nurse-name"])}
          </AvatarFallback>
        </Avatar>

        {/* Rating Badge */}
        {nurse.rate && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-1 px-3 shadow-sm border border-gray-100 flex items-center">
            <span className="font-bold text-gray-800 text-base mr-1">
              {nurse.rate.toFixed(1)}
            </span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-200 flex-shrink-0" />
          </div>
        )}
      </div>

      <CardContent className="pt-20 pb-4 px-4 bg-white">
        <h2 className="text-xl font-bold text-gray-800 truncate text-center mb-3">
          {nurse["nurse-name"]}
        </h2>

        {/* Workplace */}
        <div className="flex items-center justify-center">
          <Hospital className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
          <p className="text-base text-gray-600">
            {nurse["current-work-place"]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NursingCard;
