"use client";
import InfoRelatives from "@/app/components/Relatives/InfoRelatives";
import PatientRecords from "@/app/components/Relatives/PatientRecord";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";

const Booking = () => {
  const router = useRouter();

  return (
    <div className="hero_section p-6">
      <div className="flex items-center justify-between mb-10">
        <p className="text-4xl font-bold text-gray-900">Thông tin khách hàng</p>
        <Button
          onClick={() => router.push("/relatives/createPatientRecord")}
          className="text-white font-bold text-lg px-6 py-5 rounded-[50px] shadow-lg bg-primary hover:bg-primary-dark transition-all"
        >
          Tạo hồ sơ bệnh nhân
        </Button>
      </div>

      <InfoRelatives />
      <Separator className="my-6 border-2" />

      <PatientRecords />
    </div>
  );
};

export default Booking;
