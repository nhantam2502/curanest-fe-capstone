"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { GetAppointment } from "@/types/appointment";
import AppointmentTable from "./components/AppointmentTable";

function page() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  return (
    <div className="mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Báo cáo về cuộc hẹn</h1>
      <div className="">
          <AppointmentTable
            onSelect={(appointment) => setSelectedAppointmentId(appointment.id)}
          />
      </div>
    </div>
  );
}

export default page;
