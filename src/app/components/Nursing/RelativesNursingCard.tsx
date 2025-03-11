import { NurseItemType } from "@/types/nurse";
import { Hospital, Star } from "lucide-react";
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
    return <p className="text-center text-gray-500">Dữ liệu không tồn tại</p>;
  }

  return (
    <div
      onClick={() =>
        router.push(
          `/relatives/findingNurse/${encodeURIComponent(service)}/${nurse["nurse-id"]}`
        )
      }
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="overflow-hidden bg-white shadow-md rounded-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    >
      {/* Hình ảnh */}
      <div className="relative">
        <img
          src={nurse["nurse-picture"]}
          className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
          alt={nurse["nurse-name"]}
        />
      </div>

      {/* Nội dung */}
      <div className="p-5 space-y-3">
        {/* Tên điều dưỡng */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
          {nurse["nurse-name"]}
        </h2>

        {/* Nơi làm việc */}
        <div className="flex items-center">
          <Hospital className="w-5 h-5 mr-2 text-red-500" />
          <p className="text-lg text-gray-600 flex-grow">
            Làm việc tại {nurse["current-work-place"]}
          </p>
        </div>

        {/* Rate ở dưới cùng */}
        {nurse.rate && (
          <div className="mt-3 flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-700 text-lg">
              {nurse.rate.toFixed(1)} / 5
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelativesNursingCard;
