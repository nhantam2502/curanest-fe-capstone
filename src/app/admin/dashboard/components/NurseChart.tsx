"use client";
import { Pie, PieChart, Cell } from "recharts"; // Import Cell for Pie colors
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,        // Import Legend components
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { status: "Active", count: 45, fill: "var(--color-active)" },
  { status: "On Break", count: 8, fill: "var(--color-break)" },
  { status: "Unavailable", count: 5, fill: "var(--color-unavailable)" },
];

const chartConfig = {
  count: { // Using 'count' as the dataKey for the value
    label: "Nurses",
  },
  active: { // Keep keys simple for config
    label: "Active",
    color: "hsl(var(--chart-1))", // Greenish
  },
  break: {
    label: "On Break",
    color: "hsl(var(--chart-2))", // Yellowish
  },
  unavailable: {
    label: "Unavailable",
    color: "hsl(var(--chart-5))", // Reddish
  },
} satisfies ChartConfig;

export function NurseStatusChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Trạng thái điều dưỡng</CardTitle>
        <CardDescription>Phân bổ hiện tại</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0"> {/* Allow chart to grow */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[240px]" // Control size
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />} // Simple tooltip
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status" // Key for the label/name
              innerRadius={60} // Creates the donut hole
              outerRadius={90}
              paddingAngle={2} // Small gap between segments
            >
             {/* Map data to Cell components for individual colors */}
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                     entry.status === "Active" ? chartConfig.active.color :
                     entry.status === "On Break" ? chartConfig.break.color :
                     chartConfig.unavailable.color
                  }
                />
              ))}
            </Pie>
             {/* Add Legend */}
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />} // Use nameKey from Pie
              verticalAlign="bottom"
              height={40}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
