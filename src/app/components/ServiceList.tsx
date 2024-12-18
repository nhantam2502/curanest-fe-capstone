import React from "react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    name: "Cancer Care",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(254, 182, 13, .2)",
    textColor: "#FEB60D",
  },
  {
    name: "Labor & Delivery",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(151, 113, 255, .2)",
    textColor: "#9771FF",
  },
  {
    name: "Heart & Vascular",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(1, 181, 197, .2)",
    textColor: "#01B5C5",
  },
  {
    name: "Mental Health",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(1, 181, 197, .2)",
    textColor: "#01B5C5",
  },
  {
    name: "Neurology",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(254, 182, 13, .2)",
    textColor: "#FEB60D",
  },
  {
    name: "Burn Treatment",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    bgColor: "rgba(151, 113, 255, .2)",
    textColor: "#9771FF",
  },
];

const ServiceList = () => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
    gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]"
    >
      {services.map((item, index) => (
        <ServiceCard item={item} index={index} key={index}/>
      ))}
    </div>
  );
};

export default ServiceList;
