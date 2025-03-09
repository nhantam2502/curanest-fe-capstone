import { NurseItemType } from "@/types/nurse";
import { ArrowRight, Hospital, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const GuestNursingCard = ({
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
        router.push(
          `/guest/nurseList/${encodeURIComponent(service)}/${nurse["nurse-id"]}`
        )
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

        <div className="flex items-center mt-1">
          <Hospital className="w-6 h-6 mr-2 text-gray-500 flex-shrink-0" />
          <p className="text-lg text-gray-600 flex-grow">
            Làm việc tại {nurse["current-work-place"]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestNursingCard;
