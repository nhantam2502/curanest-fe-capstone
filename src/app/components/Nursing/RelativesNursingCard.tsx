import { NurseItemType } from "@/types/nurse";
import { ArrowRight, Hospital, Star, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const RelativesNursingCard = ({
  nurse,
  service,
}: {
  nurse: NurseItemType;
  service: string;
}) => {
  const router = useRouter();

  if (!nurse) {
    return <p>Dữ liệu không tồn tại</p>;
  }

  return (
    <div
      onClick={() =>
        router.push(`/relatives/findingNurse/${encodeURIComponent(service)}/${nurse["nurse-id"]}`)
      }
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      <div className="relative">
        <img
          src={nurse["nurse-picture"]}
          className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
          alt={nurse["nurse-name"]}
        />
        {nurse.rate && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-800">
              {nurse.rate.toFixed(1)}
            </span>
          </div>
        )}
      </div>
  
      <div className="p-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 truncate">
          {nurse["nurse-name"]}
        </h2>
  
        <p className="text-lg text-gray-600 flex items-center">
          <Hospital className="w-5 h-5 mr-2 text-red-600" />
          Làm việc tại {nurse["current-work-place"]}
        </p>
      </div>
    </div>
  );
};

export default RelativesNursingCard;
