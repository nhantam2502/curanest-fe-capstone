"use client";

import { useState } from "react";
import { Stethoscope, UserCheck, Clock, Activity } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { AppointmentsChart } from "./components/AppointmentChart";
import { NurseStatusChart } from "./components/NurseChart";
import { ServicePopularityChart } from "./components/ServiceChart";
import RevenueChart from "./components/RevenueChart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TimeRange = "today" | "week" | "month";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");

  return (
    <div className="flex-1 space-y-6 pt-4">
      <div>
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
      </div>

      {/* Stat Cards - 4 columns on large screens */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Các y tá đang làm việc"
          value={timeRange === "today" ? 10 : timeRange === "week" ? 45 : 120}
          icon={UserCheck}
          description={
            timeRange === "today"
              ? "+2 so với hôm qua"
              : timeRange === "week"
                ? "+5 so với tuần trước"
                : "+10 so với tháng trước"
          }
        />
        <StatCard
          title="Các cuộc hẹn đang diễn ra"
          value={timeRange === "today" ? 8 : timeRange === "week" ? 28 : 90}
          icon={Stethoscope}
          description="Trong thời gian đã chọn"
        />
        <StatCard
          title="Những cuộc hẹn chờ xử lý"
          value={timeRange === "today" ? 3 : timeRange === "week" ? 12 : 25}
          icon={Clock}
          description="Chờ xử lý"
        />
        <StatCard
          title="Tổng số cuộc hẹn"
          value={timeRange === "today" ? 15 : timeRange === "week" ? 75 : 300}
          icon={Activity}
          description="Theo khoảng thời gian đã chọn"
        />
      </div>
      <div>
        <RevenueChart />
      </div>

      {/* Full-width Charts */}
      {/* <div className="grid gap-6 grid-cols-1">
        <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Dịch vụ phổ biến</h3>
          <ServicePopularityChart />
        </div>
      </div> */}
    </div>
  );
}
