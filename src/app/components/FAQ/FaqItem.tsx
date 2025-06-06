'use client'
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const FaqItem = ({ item, index }: { item: any, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div 
    data-aos="fade-left"
      data-aos-duration="1200"
      data-aos-easing="ease-in-out-back"
      data-aos-delay={index * 100} 
    className="p-3 lg:p-5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5 cursor-pointer">
      <div
        className="flex items-center justify-between gap-5"
        onClick={toggleAccordion}
      >
        <h4 className="text-[26px] leading-7 lg:text-[22px] leading-8 text-headingColor font-semibold">
          {item.question}
        </h4>

        <div
          className={`${
            isOpen && "bg-[#71DDD7] text-white border-none"
          } w-7 h-7 lg:w-8 lg:h-8 border border-solid border-[#141F21] rounded flex
                items-center justify-center`}
        >
          {isOpen ? <Minus /> : <Plus />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4">
          <p className="text-[20px] leading-6 lg:text-[16] lg:leading-7 font-[400]">
            {item.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
