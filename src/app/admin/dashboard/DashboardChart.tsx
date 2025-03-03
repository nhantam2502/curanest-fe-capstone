"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const barData = {
  labels,
  datasets: [
    {
      type: "bar" as const, // Specify chart type
      label: "Monthly Sales (Bar)",
      data: [400, 700, 200, 550, 900, 480],
      backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue with transparency
      borderColor: "rgba(54, 162, 235, 1)", // Solid blue
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Monthly Sales (Line)",
      data: [250, 600, 350, 700, 850, 500],
      backgroundColor: "transparent",
      borderColor: "rgba(255, 99, 132, 1)", // Solid red
      borderWidth: 2,
      tension: 0.4, // Adjust for curve smoothness
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      beginAtZero: true, // Start y-axis at zero
    },
  },
};

export default function DashboardChart() {
  return (
    <>
      <div className="flex  space-x-2">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Data 1</CardTitle>
            <CardDescription>Mô tả 1</CardDescription>
          </CardHeader>
          <CardContent className="h-auto p-4">
            <Bar data={barData} options={options} />
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Data 2</CardTitle>
            <CardDescription>Mô tả 2</CardDescription>
          </CardHeader>
          <CardContent className="h-auto p-4">
            <Line data={lineData} options={options} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
