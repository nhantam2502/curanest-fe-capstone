import DashboardCards from "./DashboardCard";
import DashboardChart from "./DashboardChart";

export default function Home() {
  return (
    <main className="container mx-auto p-6 bg-white rounded-md">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <DashboardCards />
        <div className="mt-4">
          <DashboardChart />
      </div>
    </main>
  );
}