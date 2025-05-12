import React from "react";
import { StatCard } from "./components/StatCard";
import { Activity, Clock, Stethoscope, UserCheck } from "lucide-react";
import { AppointmentsChart } from "./components/AppointmentChart";
import RevenueChart from "./components/RevenueChart";
import { ServicePopularityChart } from "./components/ServiceChart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function page() {
  return (
    <div className="flex-1 space-y-6">
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Thống kê
          </CardTitle>
          <CardDescription>
            Theo dõi hiệu suất và hoạt động của các điều dưỡng.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Các y tá đang làm việc"
          value={45}
          icon={UserCheck}
          description="+2 so với tuần trước"
        />
        <StatCard
          title="Các cuộc hẹn đang diễn ra"
          value={28}
          icon={Stethoscope}
          description="Trong ngày"
        />
        <StatCard
          title="Những cuộc hẹn chờ xử lý"
          value={12}
          icon={Clock}
          description="Chờ xử lý"
        />
        <StatCard
          title="Tổng số cuộc hẹn"
          value={230}
          icon={Activity}
          description="Trong 6 tháng qua"
        />
      </div>

      {/* Full-width Charts */}
      <div className="grid gap-6 grid-cols-1">
        <div className="rounded-lg border shadow-sm p-4 bg-white">
          <h3 className="text-lg font-semibold mb-4">Dịch vụ phổ biến</h3>
          <ServicePopularityChart />
        </div>
      </div>
    </div>
  );
}

export default page;
