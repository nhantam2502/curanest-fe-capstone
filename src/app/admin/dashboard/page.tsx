"use client";

import { useState } from "react";
import { Stethoscope, UserCheck, Clock, Activity } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { AppointmentsChart } from "./components/AppointmentChart";
import { NurseStatusChart } from "./components/NurseChart";
import { ServicePopularityChart } from "./components/ServiceChart";
import RevenueChart from "./components/RevenueChart";

type TimeRange = "today" | "week" | "month";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");

  return (
    <div className="flex-1 space-y-6 p-4 pt-4">
      {/* Global Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Thống kê</h2>

        <div className="flex items-center space-x-2">
          <label htmlFor="time-range" className="text-sm font-medium mr-2">
            Lọc theo:
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as TimeRange)
            }
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
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

      {/* Main Charts - 2 columns on large screens */}
      <div className="">
        {/* <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Lịch hẹn theo thời gian</h3>
          <AppointmentsChart />
        </div> */}
        <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Doanh thu</h3>
          <RevenueChart />
        </div>
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