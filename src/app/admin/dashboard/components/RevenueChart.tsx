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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  format,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachWeekOfInterval,
  eachDayOfInterval,
  getWeek,
  getMonth,
  getYear,
} from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale if needed for formatting

// --- Types ---
type TimeRange = "week" | "month" | "year";

interface RevenueDataPoint {
  label: string; // e.g., 'Mon', 'W23', 'Jan'
  revenue: number;
  date: Date; // Keep original date for reference/sorting if needed
}

interface FetchRevenueParams {
  startDate: Date;
  endDate: Date;
  granularity: "daily" | "weekly" | "monthly";
}

// --- Mock Data Fetching ---
// Replace this with your actual API call
const fetchRevenueData = async ({
  startDate,
  endDate,
  granularity,
}: FetchRevenueParams): Promise<RevenueDataPoint[]> => {
  console.log(
    `Fetching data from ${format(startDate, "yyyy-MM-dd")} to ${format(endDate, "yyyy-MM-dd")} with granularity ${granularity}`
  );
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate potential errors
  // if (Math.random() > 0.8) {
  //  throw new Error("Failed to fetch revenue data.");
  // }

  // Generate mock data based on granularity
  let data: RevenueDataPoint[] = [];
  const today = new Date();

  if (granularity === "daily") {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    data = days.map((day) => ({
      label: format(day, "EEE", { locale: vi }), // Mon, Tue, etc. (Vietnamese)
      // label: format(day, 'EEE'), // Mon, Tue, etc. (English)
      // label: format(day, 'dd/MM'), // Optional: Show date
      revenue: Math.floor(Math.random() * (day <= today ? 500 : 0) + 50), // Random revenue, 0 for future dates
      date: day,
    }));
  } else if (granularity === "weekly") {
    // Get the start of each week within the interval
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    ); // Monday as start

    data = weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      // Make sure weekEnd doesn't exceed the overall endDate
      const actualEndDate = weekEnd > endDate ? endDate : weekEnd;
      return {
        // label: `Tuần ${getWeek(weekStart)}`, // Week number
        label: `T${index + 1}`, // T1, T2, T3, T4
        // label: `${format(weekStart, 'dd/MM')} - ${format(actualEndDate, 'dd/MM')}`, // Optional: Date range
        revenue: Math.floor(
          Math.random() * (weekStart <= today ? 3000 : 0) + 500
        ), // Random weekly revenue
        date: weekStart,
      };
    });
    // Ensure exactly 4 weeks are shown for month view if needed by adjusting slice/logic
    if (weeks.length > 4) data = data.slice(weeks.length - 4);
  } else if (granularity === "monthly") {
    let currentMonthStart = startOfMonth(startDate);
    for (let i = 0; i < 12; i++) {
      if (currentMonthStart > endOfMonth(endDate)) break;
      data.push({
        label: format(currentMonthStart, "MMM", { locale: vi }), // Jan, Feb (Vietnamese)
        // label: format(currentMonthStart, 'MMM'), // Jan, Feb (English)
        revenue: Math.floor(
          Math.random() * (currentMonthStart <= today ? 15000 : 0) + 2000
        ), // Random monthly revenue
        date: currentMonthStart,
      });
      currentMonthStart = startOfMonth(addMonths(currentMonthStart, 1));
    }
  }

  return data;
};

// --- Helper Functions ---
const getWeekDates = (refDate: Date): { start: Date; end: Date } => {
  // Assuming week starts on Monday
  const start = startOfWeek(refDate, { weekStartsOn: 1 });
  const end = endOfWeek(refDate, { weekStartsOn: 1 });
  return { start, end };
};

// Gets the 4-week interval ending on the Sunday of the refDate's week
const getMonthViewDates = (refDate: Date): { start: Date; end: Date } => {
  const currentWeekEnd = endOfWeek(refDate, { weekStartsOn: 1 });
  const start = startOfWeek(subWeeks(currentWeekEnd, 3), { weekStartsOn: 1 }); // Go back 3 full weeks from the start of the current week
  return { start, end: currentWeekEnd };
};

// Gets the 12-month interval ending on the last day of the refDate's month
const getYearViewDates = (refDate: Date): { start: Date; end: Date } => {
  const currentMonthEnd = endOfMonth(refDate);
  const start = startOfMonth(subMonths(currentMonthEnd, 11));
  return { start, end: currentMonthEnd };
};

// --- Component ---
const RevenueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [data, setData] = useState<RevenueDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // currentDate represents the *end* of the period being viewed
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    start: startDate,
    end: endDate,
    granularity,
  } = useMemo(() => {
    switch (timeRange) {
      case "month":
        const monthDates = getMonthViewDates(currentDate);
        return { ...monthDates, granularity: "weekly" as const };
      case "year":
        const yearDates = getYearViewDates(currentDate);
        return { ...yearDates, granularity: "monthly" as const };
      case "week":
      default:
        const weekDates = getWeekDates(currentDate);
        return { ...weekDates, granularity: "daily" as const };
    }
  }, [timeRange, currentDate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRevenueData({
        startDate,
        endDate,
        granularity,
      });
      setData(result);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
      );
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, granularity]); // Dependencies for useCallback

  useEffect(() => {
    fetchData();
  }, [fetchData]); // useEffect depends on the memoized fetchData

  const handleTimeRangeChange = (value: string) => {
    // When changing range, reset view to the period containing today
    setCurrentDate(new Date());
    setTimeRange(value as TimeRange);
    // Data will refetch via useEffect -> fetchData dependency change
  };

  const handlePreviousWeek = () => {
    setCurrentDate((prev) => subDays(prev, 7));
    // Data will refetch via useEffect -> currentDate dependency change
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 7));
    // Data will refetch via useEffect -> currentDate dependency change
  };

  // Disable "Next" button if the current week view includes today
  const isNextWeekDisabled = useMemo(() => {
    if (timeRange !== "week") return true; // Only enable for week view
    const { end: currentViewEndDate } = getWeekDates(currentDate);
    return endOfWeek(new Date(), { weekStartsOn: 1 }) <= currentViewEndDate;
  }, [currentDate, timeRange]);

  // Format currency for Y-Axis and Tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const formatShortCurrency = (value: number) => {
    if (value >= 1_000_000_000)
      return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
  };

  const cardTitle = useMemo(() => {
    switch (timeRange) {
      case "week":
        return `Doanh thu tuần (${format(startDate, "dd/MM")} - ${format(endDate, "dd/MM")})`;
      case "month":
        return `Doanh thu 4 tuần gần nhất (kết thúc ${format(endDate, "dd/MM")})`;
      case "year":
        return `Doanh thu 12 tháng gần nhất (kết thúc ${format(endDate, "MM/yyyy")})`;
      default:
        return "Thống kê doanh thu";
    }
  }, [timeRange, startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>
              {timeRange === "week"
                ? "Doanh thu theo từng ngày trong tuần"
                : timeRange === "month"
                  ? "Tổng doanh thu theo từng tuần"
                  : "Tổng doanh thu theo từng tháng"}
            </CardDescription>
          </div>
          <Select onValueChange={handleTimeRangeChange} value={timeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn khoảng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần</SelectItem>
              <SelectItem value="month">Tháng</SelectItem>
              <SelectItem value="year">Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[350px] p-2 sm:p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Đang tải dữ liệu...</p> {/* Add a spinner here if desired */}
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-destructive">
            <p>Lỗi: {error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <p>Không có dữ liệu cho khoảng thời gian này.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
            >
              {" "}
              {/* Adjust margins */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatShortCurrency} // Use short format for axis
                // width={80} // Adjust if labels get cut off
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Doanh thu",
                ]} // Use full format for tooltip
              />
              <Bar
                dataKey="revenue"
                fill="#6ee7b7" 
                radius={[4, 4, 0, 0]} // Rounded top corners
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      {/* Footer only shown for weekly view for navigation */}
      {timeRange === "week" && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            Tuần trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            disabled={isNextWeekDisabled}
          >
            Tuần sau
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RevenueChart;

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
