// app/admin/dashboard/page.tsx (or your desired route)
import { Stethoscope, UserCheck, Clock, Activity } from "lucide-react"; // Example icons
import { StatCard } from "./components/StatCard";
import { AppointmentsChart } from "./components/AppointmentChart";
import { NurseStatusChart } from "./components/NurseChart";
import { ServicePopularityChart } from "./components/ServiceChart";

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Thống kê</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Các y tá đang làm việc"
          value={45} // Replace with actual data
          icon={UserCheck}
          description="+2 so với tuần trước"
        />
        <StatCard
          title="Các cuộc hẹn đang diễn ra"
          value={28} // Replace with actual data
          icon={Stethoscope}
          description="Trong ngày"
        />
         <StatCard
          title="Những cuộc hẹn chờ xử lý"
          value={12} // Replace with actual data
          icon={Clock}
          description="Chờ xử lý"
        />
         <StatCard
          title="Tổng số cuộc hẹn"
          value={230} // Replace with actual data
          icon={Activity}
          description="Trong tháng 6"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2">
            <AppointmentsChart />
        </div>
        <NurseStatusChart />
        <div className="lg:col-span-3 xl:col-span-3">
             <ServicePopularityChart />
        </div>
      </div>
    </div>
  );
}