"use client";
import InfoRelatives from "@/app/components/Relatives/InfoRelatives";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";

const Booking = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-10">
        <p className="text-2xl font-bold">Thông tin khách hàng</p>
        <Button
          onClick={() => router.push("/user/createPatientProfile")}
          className="bg-lime-500 text-white font-bold px-4 py-2 rounded shadow-md transition-colors"
        >
          Tạo hồ sơ bệnh nhân
        </Button>
      </div>

      <InfoRelatives />
      <Separator className="my-4" />
    </div>
  );
};

export default Booking;
