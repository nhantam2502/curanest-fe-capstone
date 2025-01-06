import { StarIcon } from "lucide-react";
import React from "react";
import { Nurse } from "@/types/nurse";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

interface NursingCardProps {
  nurse: Nurse;
  onSelect: (nurseId: number) => void;
  isSelected?: boolean;
}

const NursingCard: React.FC<NursingCardProps> = ({
  nurse,
  onSelect,
  isSelected = false,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl
      ${isSelected ? "border-2 border-blue-500" : "border border-gray-200"}
    `}
      onClick={() => onSelect(nurse.id)}
    >
      <CardHeader className="p-0">
        <img src={nurse.photo} className="w-full rounded-t-xl" alt="" />
      </CardHeader>

      <CardContent>
        <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3">
          {nurse.name}
        </h2>

        <div className="mt-2 lg:mt-4 flex items-center justify-between">
          <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 leading-4 lg:text-[16px] lg:leading-7 font-bold">
            {nurse.specialization}
          </span>

          <div className="flex items-center gap-[6px]">
            <span className="flex items-center gap-[6px] text-[14px] lg:text-[16px] leading-7 font-semibold text-headingColor">
              <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-200" />{" "}
              {nurse.avgRating}
            </span>

            <span className="text-[14px] lg:text-[16px] leading-7 font-[400] text-textColor">
              ({nurse.totalRating})
            </span>
          </div>
        </div>

        <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
          <div>
            <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor">
              + {nurse.totalPatients} bệnh nhân
            </h3>

            <p className="text-[14px] leading-6 font-[400] text-textColor">
              Làm việc tại {nurse.hospital}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NursingCard;
