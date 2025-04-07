"use client";
import { Pie, PieChart, Cell, LegendProps,LabelProps } from "recharts";
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
  ChartLegend,
} from "@/components/ui/chart";
import React, { useMemo } from "react";

const chartData = [
  { status: "Đang hoạt động", count: 45, fill: "var(--color-active)" }, // fill here is less relevant now
  { status: "Tạm nghỉ", count: 8, fill: "var(--color-break)" },
  { status: "không khả dụng", count: 5, fill: "var(--color-unavailable)" },
];

// --- Define status-specific configuration separately ---
type StatusKey = "Đang hoạt động" | "Tạm nghỉ" | "không khả dụng";

const statusConfig: Record<StatusKey, { label: string; color: string }> = {
  "Đang hoạt động": {
    label: "Đang hoạt động",
    color: "hsl(var(--chart-1))", // Greenish
  },
  "Tạm nghỉ": {
    label: "Tạm nghỉ",
    color: "hsl(var(--chart-2))", // Yellowish
  },
  "không khả dụng": {
    label: "không khả dụng",
    color: "hsl(var(--chart-5))", // Reddish
  },
};
// --- ---

// General Chart Config (can include other elements if needed)
const chartConfig = {
  count: {
    label: "Điều dưỡng",
  },

  ...statusConfig,
} satisfies ChartConfig; // Ensure it still satisfies the overall ChartConfig type if needed by Shadcn

interface CustomLegendProps extends LegendProps {
  // config might not be needed if we use statusConfig directly
}

interface CustomizedLabelProps extends LabelProps {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number;
  outerRadius?: number; percent?: number; index?: number; value?: number | string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, value
}: CustomizedLabelProps) => {
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent || !value) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Reduce from 0.7 to 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 8) return null; // Hide very small labels

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize="12px"
      fontWeight="bold"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {value}
    </text>
  );
};


const CustomChartLegendContent = (props: CustomLegendProps) => {
  const { payload } = props;

  if (!payload) {
    return null;
  }

  return (
    <ul className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
      {payload.map((entry, index) => {
        const statusLabel = entry.value as StatusKey; // Assert statusLabel is one of our known keys
        const dataItem = chartData.find((item) => item.status === statusLabel);
        const count = dataItem ? dataItem.count : null;
        const color = entry.color;

        return (
          <li
            key={`item-${index}`}
            className="flex items-center gap-2 cursor-default"
          >
            <span
              className="h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: color }}
            />
            {/* Lookup label from statusConfig for consistency */}
            <span>{statusConfig[statusLabel]?.label ?? statusLabel}</span>
          </li>
        );
      })}
    </ul>
  );
};

export function NurseStatusChart() {
  const totalNurses = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Trạng thái điều dưỡng</CardTitle>
        <CardDescription>Phân bổ hiện tại</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        {" "}
        {/* Add relative here */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.status}`}
                  fill={
                    statusConfig[entry.status as StatusKey]?.color ?? "#888"
                  }
                />
              ))}
            </Pie>
            <ChartLegend
              content={<CustomChartLegendContent />}
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingBottom: "10px" }}
            />
          </PieChart>
        </ChartContainer>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            width: "80px", // Reduce width
            height: "50px", // Reduce height
            pointerEvents: "none",
          }}
        >
          <span className="text-xl font-bold leading-none">{totalNurses}</span>
          <span className="mt-1 text-xs text-muted-foreground">Tổng số</span>
        </div>
      </CardContent>
    </Card>
  );
}
