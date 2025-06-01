"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts";
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
import { AlertTriangle, Loader2 } from "lucide-react";
import { TimeFilter } from "@/app/admin/dashboard/page";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";

interface ChartDataItem {
  id: string;
  service: string;
  requests: number;
}

const chartConfig = {
  requests: {
    label: "Lượt sử dụng",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(262.1,83.3%,57.8%)",
  "hsl(350.1,83.3%,57.8%)",
];

interface ServicePopularityChartProps {
  categoryId: string | null;
  timeFilter: TimeFilter;
}

const getTimeFilterDescriptionForChart = (filter: TimeFilter): string => {
  switch (filter) {
    case "week":
      return "trong tuần này";
    case "month":
      return "trong tháng này";
    default:
      return "hiện tại";
  }
};

export function ServicePopularityChart({ categoryId, timeFilter }: ServicePopularityChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeFilterText = useMemo(() => getTimeFilterDescriptionForChart(timeFilter), [timeFilter]);

  useEffect(() => {
    if (!categoryId) {
      setChartData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await servicePackageApiRequest.packageCount(categoryId);

        if (response.status === 200 && response.payload?.success) {
          interface ApiDataItem {
            id: string;
            name: string;
            "usage-count": number;
          }
          
          const apiData = response.payload.data || [];
          const formattedData = apiData
            .map((item: ApiDataItem) => ({
              id: item.id,
              service: item.name,
              requests: item["usage-count"],
            }))
            .sort((a: ChartDataItem, b: ChartDataItem) => b.requests - a.requests) // Sort by requests descending
            .slice(0, 7); // Show top 7, for example

          setChartData(formattedData);
          if (formattedData.length === 0) {
            // No error, but no data to show
            setError(null); // Clear previous errors
          }
        } else {
          setError(response.payload?.message || "Không thể tải dữ liệu gói dịch vụ.");
          setChartData([]);
        }
      } catch (err: any) {
        console.error("Error fetching package count:", err);
        setError(err.message || "Lỗi khi tải dữ liệu gói dịch vụ.");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]); 

  const yAxisWidth = useMemo(() => {
    if (chartData.length === 0) return 150;
    const longestLabel = chartData.reduce((max, item) => Math.max(max, item.service.length), 0);
    return Math.max(120, longestLabel * 7 + 20);
  }, [chartData]);

  const cardTitle = "Gói dịch vụ phổ biến";
  const cardDescription = `Các gói dịch vụ được sử dụng nhiều nhất ${timeFilterText}. (Không lọc theo thời gian)`;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="ml-2 text-muted-foreground">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <AlertTriangle className="h-8 w-8 mb-2 text-red-500" />
          <p className="text-sm font-semibold text-red-600">Lỗi tải dữ liệu</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">
            {categoryId ? "Không có dữ liệu sử dụng gói dịch vụ cho danh mục này." : "Vui lòng chọn một danh mục."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 5, right: 30, top: 5, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="service"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              width={yAxisWidth}
              interval={0} 
              tickFormatter={(value: string) => value.length > (yAxisWidth / 10) ? `${value.substring(0, Math.floor(yAxisWidth / 8) - 3)}...` : value} // Truncate long labels
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => [value, chartConfig.requests.label]}
            />
            <Bar dataKey="requests" radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList dataKey="requests" position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}