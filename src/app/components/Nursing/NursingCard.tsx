import { Nurse } from "@/types/nurse";
import { ArrowRight, StarIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NursingCard = ({ nurse }: { nurse: Nurse }) => {
  if (!nurse) {
    return <p>Dữ liệu không tồn tại</p>;
  }

  return (
    <div
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="p-3 lg:p-5 bg-white shadow-md rounded-xl"
    >
      <div>
        <img src={nurse.photo} className="w-full rounded-lg" alt={nurse.name} />
      </div>

      <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-bold mt-3">
        {nurse.name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2 ">
          {nurse.services.map((service, index) => (
            <span
              key={index}
              className="bg-[#CCF0F3] text-irisBlueColor py-2 px-4 text-sm lg:text-base font-semibold rounded-lg text-center"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-headingColor font-semibold">
          <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-200" />
          {nurse.avgRating}
        </div>
        <span className="text-textColor text-sm lg:text-base">
          ({nurse.totalRating} đánh giá)
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] lg:text-[18px] font-semibold text-headingColor">
            + {nurse.totalPatients} bệnh nhân
          </h3>
          <p className="text-[14px] lg:text-[16px] text-textColor">
            Làm việc tại {nurse.hospital}
          </p>
        </div>

        <Link
          href={`/guest/nurseList/${nurse.services[0]}/${nurse.id}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-[#FEF0D7] hover:border-none"
        >
          <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default NursingCard;
