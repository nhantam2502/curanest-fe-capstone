"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { GetAppointment } from "@/types/appointment";
import AppointmentTable from "./components/AppointmentTable";

function page() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  return (
    <div className="mx-auto space-y-6">
      <Card className="mb-4 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Quản lý báo cáo
          </CardTitle>
          <CardDescription>
          Danh sách các cuộc hẹn đang chờ được phê duyệt là hoàn thành.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="">
        <AppointmentTable
          onSelect={(appointment) => setSelectedAppointmentId(appointment.id)}
        />
      </div>
    </div>
  );
}

export default page;
