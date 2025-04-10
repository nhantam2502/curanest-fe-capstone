"use client";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";

const chartData = [
  { month: "Tháng 1", appointments: 150 },
  { month: "Tháng 2", appointments: 180 },
  { month: "Tháng 3", appointments: 220 },
  { month: "Tháng 4", appointments: 190 },
  { month: "Tháng 5", appointments: 250 },
  { month: "Tháng 6", appointments: 230 },
];

const chartConfig = {
  appointments: {
    label: "Cuộc hẹn",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AppointmentsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng các cuộc hẹn</CardTitle>
        <CardDescription>6 tháng vừa qua</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[380px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
               tickLine={false}
               axisLine={false}
               tickMargin={8}
               width={30} // Adjust width for Y-axis labels
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="appointments"
              type="monotone"
              stroke={chartConfig.appointments.color}
              strokeWidth={2}
              dot={true} // Show dots
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
