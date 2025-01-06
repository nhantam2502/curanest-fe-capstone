"use client";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
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
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const handleChartTypeChange = (type: "bar" | "line") => {
    setChartType(type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>Overview of monthly sales</CardDescription>
        {/* Toggle Buttons */}
        <div className="mt-2 space-x-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => handleChartTypeChange("bar")}
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => handleChartTypeChange("line")}
          >
            Line Chart
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] p-4">
        {/* Conditional Rendering */}
        {chartType === "bar" ? (
          <Bar data={barData} options={options} />
        ) : (
          <Line data={lineData} options={options} />
        )}
      </CardContent>
    </Card>
  );
}