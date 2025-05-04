"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import AppointmentTable from "./components/AppointmentTable";
import NurseTable from "./components/NurseTable";
import { GetAppointment } from "@/types/appointment";

export default function AssignNurseDashboard() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetAppointment | null>(null);

  return (
    <div className="mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Giao việc cho Điều dưỡng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Appointments Table */}
        <Card>
          <Card>
            <AppointmentTable onSelect={setSelectedAppointment} />
          </Card>
        </Card>

        {/* Right Column: Nurses Table */}
        <Card>
          <NurseTable selectedAppointment={selectedAppointment} />
        </Card>
      </div>
    </div>
  );
}
