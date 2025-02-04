import DashboardCards from "./DashboardCard";
import DashboardChart from "./DashboardChart";

export default function Home() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4"> Dashboard</h1>
      <DashboardCards />
        <div className="mt-4">
          <DashboardChart />
      </div>
    </div>
  );
}