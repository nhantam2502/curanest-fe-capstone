"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfWeek,
  endOfWeek,
  // startOfMonth, // No longer needed for the 4-week rolling view
  // endOfMonth,   // No longer needed
  eachDayOfInterval,
  // eachWeekOfInterval, // We'll manually create 4 weeks
  // isSameMonth, // No longer needed for clamping if we define 4 distinct weeks
  subWeeks,
  addDays,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval, // Helper for iterating weeks
} from "date-fns";
import { vi } from "date-fns/locale";
import invoiceApiRequest from "@/apiRequest/invoice/apiInvoice";
import { Loader2, AlertTriangle } from "lucide-react";

interface ApiRevenueDataPoint {
  label: string;
  revenue: number;
}

type ApiRevenueResponseData = ApiRevenueDataPoint[];
type ActiveFilter = "week" | "month";

const formatDatePayload = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

const formatRangePayload = (startDate: Date, endDate: Date): string => {
  return `${formatDatePayload(startDate)}/${formatDatePayload(endDate)}`;
};

const RevenueChart: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("week");
  const [chartData, setChartData] = useState<ApiRevenueDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDisplayPeriod, setCurrentDisplayPeriod] = useState<string>("");

  const apiRequestBodyDates = useMemo((): string[] => {
    const today = new Date(); // Represents the current date to determine "current week" or "current month"
    let datesArray: string[] = [];
    let displayPeriod = "";

    if (activeFilter === "week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      datesArray = daysInWeek.map((day) => formatRangePayload(day, day));
      displayPeriod = `Tuần ${format(weekStart, "dd/MM", { locale: vi })} - ${format(weekEnd, "dd/MM", { locale: vi })}`;
    } else if (activeFilter === "month") {
      const currentMonthStart = startOfMonth(today);
      const currentMonthEnd = endOfMonth(today);

      const weeksInCalendarMonth = eachWeekOfInterval(
        { start: currentMonthStart, end: currentMonthEnd },
        { weekStartsOn: 1 } // Monday
      );

      datesArray = weeksInCalendarMonth.map((weekPeriodStartFromIterator) => {
        const weekActualStart =
          weekPeriodStartFromIterator < currentMonthStart
            ? currentMonthStart
            : weekPeriodStartFromIterator;

        let weekActualEnd = endOfWeek(weekPeriodStartFromIterator, {
          weekStartsOn: 1,
        });
        weekActualEnd =
          weekActualEnd > currentMonthEnd ? currentMonthEnd : weekActualEnd;

        return formatRangePayload(weekActualStart, weekActualEnd);
      });
      displayPeriod = `Tháng ${format(today, "M/yyyy", { locale: vi })}`;
    }
    setCurrentDisplayPeriod(displayPeriod);
    return datesArray;
  }, [activeFilter]);

  const transformDataForChart = useCallback(
    (
      apiData: ApiRevenueResponseData,
      filter: ActiveFilter
    ): ApiRevenueDataPoint[] => {
      if (!apiData) return [];

      if (filter === "week") {
        const daysOfWeekLabels_vi = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        return apiData.map((point, index) => ({
          ...point,
          label:
            point.label || daysOfWeekLabels_vi[index] || `Day ${index + 1}`,
        }));
      } else if (filter === "month") {
        return apiData.map((point, index) => ({
          ...point,
          label: point.label || `Tuần ${index + 1}`, // W1, W2, W3, W4 (relative to the 4-week view)
        }));
      }
      return [];
    },
    []
  );

  const fetchData = useCallback(async () => {
    if (!apiRequestBodyDates || apiRequestBodyDates.length === 0) {
      setError("Không có khoảng thời gian hợp lệ để tải dữ liệu.");
      setChartData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await invoiceApiRequest.getRevenue({
        dates: apiRequestBodyDates,
      });

      if (
        response.status === 200 &&
        response.payload.success &&
        response.payload.data
      ) {
        const rawApiData = response.payload
          .data as unknown as ApiRevenueResponseData;
        // Ensure the transform function aligns with the number of expected data points (7 for week, 4 for month)
        const transformedData = transformDataForChart(rawApiData, activeFilter);
        setChartData(transformedData || []);
      } else {
        setError(
          response.payload.message || "Không thể tải dữ liệu doanh thu."
        );
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
      );
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiRequestBodyDates, activeFilter, transformDataForChart]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilter: ActiveFilter) => {
    setActiveFilter(newFilter);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const formatShortCurrency = (value: number): string => {
    if (value >= 1_000_000_000)
      return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
  };

  const cardTitle = "Thống kê doanh thu";
  const cardDescription = `Doanh thu cho: ${currentDisplayPeriod}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </div>
          <div className="flex gap-2">
            {(["week", "month"] as ActiveFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(filter)}
                disabled={isLoading}
                className={
                  activeFilter === filter
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : ""
                }
              >
                {filter === "week" && "Tuần này"}
                {filter === "month" && "Tháng này"}{" "}
                {/* This will now represent 4 weeks */}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] p-2 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold">Lỗi tải dữ liệu</p>
            <p className="text-xs">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <p>Không có dữ liệu doanh thu cho khoảng thời gian này.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatShortCurrency}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Doanh thu",
                ]}
                // Add back contentStyle and labelStyle if you had them and they are defined in your theme
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar
                dataKey="revenue"
                fill="#10b981" // Emerald color
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
