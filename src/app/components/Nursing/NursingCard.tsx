import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const NursingCard = ({ nurse }: { nurse: any }) => {
  const {
    name,
    avgRating,
    totalRating,
    photo,
    specialization,
    totalPatients,
    hospital,
  } = nurse;

  return (
    <div
      data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      className="p-3 lg:p-5"
    >
      <div>
        <img src={photo} className="w-full" alt="" />
      </div>

      <h2 className="text-[18px] leading-[30px] lg:text-[26px]  lg:leading-9 text-headingColor font-[700] mt-3">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2lg:px-6 leading-4 lg:text-[16px] lg:leading-7 font-semibol rounded">
          {specialization}
        </span>

        <div className="flex items-center gap-[6px]">
          <span
            className="flex items-center gap-[6px] text-[14px] 
            leading-6 lg:text-[16px] leading-7 font-semibold text-headingColor"
          >
            <img src="./Star.png" alt="" /> {avgRating}
          </span>

          <span
            className="text-[14px] 
            leading-6 lg:text-[16px] leading-7 font-[400] text-textColor"
          >
            ({totalRating})
          </span>
        </div>
      </div>

      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor">
            + {totalPatients} patients
          </h3>

          <p className="text-[14px] leading-6 font-[400] text-textColor">
            At {hospital}
          </p>
        </div>

        <Link
          href=""
          className="w-[44px] h-[44px] rounded-full 
                border border-solid border-[#181A1E] flex items-center 
                justify-center group hover:bg-[#FEF0D7] hover:border-none"
        >
          <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default NursingCard;
