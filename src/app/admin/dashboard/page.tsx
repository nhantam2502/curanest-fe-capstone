// app/admin/dashboard/page.tsx
import { Stethoscope, UserCheck, Clock, Activity } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { AppointmentsChart } from "./components/AppointmentChart";
import { NurseStatusChart } from "./components/NurseChart";
import { ServicePopularityChart } from "./components/ServiceChart";
import RevenueChart from "./components/RevenueChart";

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 pt-4">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Thống kê</h2>

      {/* Stat Cards - 4 columns on large screens */}
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

      {/* Main Charts - 2 columns on large screens */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Lịch hẹn theo thời gian</h3>
          <AppointmentsChart />
        </div>
        <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Doanh thu</h3>
          <RevenueChart />
        </div>
      </div>

      {/* Full-width Charts */}
      <div className="grid gap-6 grid-cols-1">
        <div className="rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Dịch vụ phổ biến</h3>
          <ServicePopularityChart />
        </div>
      </div>
    </div>
  );
}