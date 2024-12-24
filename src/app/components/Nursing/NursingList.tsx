import React from "react";
import NursingCard from "./NursingCard";

const nursing = [
  {
    id: "01",
    name: "Dr. Alfaz Ahmed",
    specialization: "Surgeon",
    avgRating: 4.8,
    totalRating: 272,
    photo: "./doctor-img01.png",
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
  {
    id: "02",
    name: "Dr. Saleh Mahmud",
    specialization: "Neurologist",
    avgRating: 4.8,
    totalRating: 272,
    photo: "./doctor-img02.png",
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
  {
    id: "03",
    name: "Dr. Farid Uddin",
    specialization: "Dermatologist",
    avgRating: 4.8,
    totalRating: 272,
    photo: "./doctor-img03.png",
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
];

const NursingList = () => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]"
    >
      {nursing.map((nurse, index) => (
        <NursingCard key={nurse.id} nurse={nurse} />
      ))}
    </div>
  );
};

export default NursingList;
