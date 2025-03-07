import React from "react";
import NursingCard from "./GuestNursingCard";
import nursing from "@/dummy_data/dummy_nurse.json";

const NursingList = () => {
  const limitedNursingData = nursing.slice(0, 3); 

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
       gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]"
    >
      {limitedNursingData.map((nurse) => (
        <NursingCard key={nurse.id} nurse={nurse} service={nurse.services[0] || "Unknown"} />
      ))}
    </div>
  );
};

export default NursingList;
