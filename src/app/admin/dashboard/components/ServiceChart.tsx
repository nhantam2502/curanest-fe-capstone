"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
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
  { service: "Chăm sóc vết thương", requests: 98 },
  { service: "Cấp phát thuốc", requests: 86 },
  { service: "Theo dõi dấu hiệu sinh tồn", requests: 75 },
  { service: "Vệ sinh cá nhân", requests: 60 },
  { service: "Đồng hành", requests: 45 },
];

// Cấu hình đơn giản chỉ để hiển thị nhãn tooltip nếu cần, màu sắc được quản lý bởi Cell
const chartConfig = {
  requests: {
    label: "Yêu cầu",
    color: "hsl(var(--chart-1))", // Màu mặc định nếu không sử dụng Cell
  },
} satisfies ChartConfig;

// Định nghĩa màu sắc cho các cột
const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function ServicePopularityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dịch vụ phổ biến</CardTitle>
        <CardDescription>Số yêu cầu trong tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical" // Biểu đồ ngang
            margin={{ left: 0, right: 10, top: 5, bottom: 5 }} // Chừa khoảng trống bên phải
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="service"
              type="category" // Trục Y hiển thị danh mục
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={140} // Chừa không gian cho nhãn
            />
            <XAxis type="number" hide /> {/* Ẩn trục X */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="requests" radius={4} > {/* Làm tròn góc thanh */}
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
