"use client";

import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentTable from "./components/AppointmentTable";
import NurseTable from "./components/NurseTable";
import { GetAppointment } from "@/types/appointment";

export default function AssignNurseDashboard() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<GetAppointment | null>(null);

  return (
    <div className="mx-auto space-y-6">
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
          Giao việc cho Điều dưỡng
          </CardTitle>
          <CardDescription>
            Chọn cuộc hẹn từ bảng bên trái, sau đó chỉ định điều dưỡng thích hợp từ danh sách bên phải để quản lý lịch công việc hiệu quả.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
