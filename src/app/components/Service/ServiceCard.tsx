import React from "react";

const ServiceCard = ({ item, index }: { item: any; index: number }) => {
  const { name, desc, bgColor, textColor } = item;
  return (
    <div
    data-aos="zoom-in"
    data-aos-duration="1600"
    data-aos-easing="ease-in-out-back"
     className="py-[30px] px-3 lg:px-5">
      <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
        {name}
      </h2>
      <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
        {desc}
      </p>

      <div className="flex items-center justify-between mt-[30px]">
        {/* <Link
          href=""
          className="w-[44px] h-[44px] rounded-full 
                border border-solid border-[#181A1E]
                flex items-center justify-center group hover:bg-[#FEF0D7]
                hover:border-none"
        >
          <ArrowRight className="group-hover:text-[#181A1E] w-6 h-5" />
        </Link> */}
        <div></div>

        <span
          className="w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600]"
          style={{
            background: `${bgColor}`,
            color: `${textColor}`,
            borderRadius: "6PX 0 0 6PX",
          }}
        >
          {index + 1}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
