"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  Activity,
  PackageSearch,
  AlertTriangle,
  Hourglass,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";

export type TimeFilter = "week" | "month"; // Removed "all"

export interface DashboardStats {
  "total-service": number;
  "upcoming-apps": number;
  "waiting-apps": number;
  "total-apps": number;
}

interface DateRange {
  dateFrom: string; 
  dateTo: string;   
}

const calculateDateRange = (filter: TimeFilter): DateRange => {
  const today = new Date(); // Local current date and time
  let dateFromInstance: Date;
  let dateToInstance: Date;

  switch (filter) {
    case "week":
      // Ensure 'today' for week calculation is consistent if this function is called at different times
      const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
      const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // Adjust to make Monday the start of the week

      dateFromInstance = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diffToMonday);
      dateToInstance = new Date(dateFromInstance.getFullYear(), dateFromInstance.getMonth(), dateFromInstance.getDate() + 6);
      break;
    case "month":
      dateFromInstance = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
      dateToInstance = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
      break;
    default: // Should not happen with current TimeFilter type
      dateFromInstance = new Date(today);
      dateToInstance = new Date(today);
      break;
  }

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    dateFrom: formatDateToYYYYMMDD(dateFromInstance),
    dateTo: formatDateToYYYYMMDD(dateToInstance),
  };
};

const getTimeFilterDescription = (filter: TimeFilter): string => {
  switch (filter) {
    case "week":
      return "tuần này";
    case "month":
      return "tháng này";
    default:
      return "";
  }
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { dateFrom, dateTo } = calculateDateRange(timeFilter);

    try {
      const response = await appointmentApiRequest.getDashboard(
        "true",
        "",
        dateFrom,
        dateTo
      );

      if (response.status === 200 && response.payload?.success && response.payload.data) {
        setStats(response.payload.data);
      } else {
        const errorMessage = response.payload?.message || "Thống kê không tải được.";
        setError(errorMessage);
        setStats(null);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Lỗi không xác định khi tải thống kê.";
      setError(errorMessage);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = useCallback(
    (newFilter: TimeFilter) => {
      setTimeFilter(newFilter);
    },
    []
  );

  const currentFilterDescription = useMemo(() => {
    return getTimeFilterDescription(timeFilter);
  }, [timeFilter]);

  const getStatDisplayValue = useCallback(
    (value: number | undefined): string | number =>
      isLoading ? "" : (value !== undefined ? value : "-"),
    [isLoading]
  );

  const refetchStats = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const renderFilterButtons = () => (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {(["week", "month"] as TimeFilter[]).map((filter) => ( 
        <Button
          key={filter}
          variant={timeFilter === filter ? "default" : "outline"}
          onClick={() => handleFilterChange(filter)}
          className={
            timeFilter === filter
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
          disabled={isLoading}
        >
          {filter === "week" && "Trong Tuần"}
          {filter === "month" && "Trong Tháng"}
          {/* "all" button removed */}
        </Button>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Card className="bg-red-50 border border-red-200 text-red-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" /> Lỗi tải dữ liệu thống kê
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetchStats}
          className="text-red-600 hover:bg-red-100 px-2"
          disabled={isLoading}
        >
          Thử lại
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{error}</p>
      </CardContent>
    </Card>
  );

  const renderNoDataState = () =>
    !isLoading &&
    !error &&
    (!stats || Object.keys(stats).length === 0) && (
      <Card className="col-span-full">
        <CardContent className="py-10 text-center text-muted-foreground">
          Không có dữ liệu thống kê để hiển thị cho {currentFilterDescription} (tất cả danh mục).
        </CardContent>
      </Card>
    );

  return (
    <div className="flex-1 space-y-4">
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Thống kê của bạn
          </CardTitle>
          <CardDescription>
            Hiệu suất và hoạt động liên quan đến dịch vụ của bạn.
          </CardDescription>
        </CardHeader>
      </Card>

      {renderFilterButtons()}

      {error && renderErrorState()}

      {!error && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng dịch vụ"
              value={getStatDisplayValue(stats?.["total-service"])}
              icon={PackageSearch}
              description="Tổng số dịch vụ trong hệ thống"
              isLoading={isLoading}
            />
            <StatCard
              title="Cuộc hẹn sắp tới"
              value={getStatDisplayValue(stats?.["upcoming-apps"])}
              icon={Clock}
              description={`Trong ${currentFilterDescription}`}
              isLoading={isLoading}
            />
            <StatCard
              title="Cuộc hẹn đang chờ"
              value={getStatDisplayValue(stats?.["waiting-apps"])}
              icon={Hourglass}
              description={`Cần xử lý ${currentFilterDescription}`}
              isLoading={isLoading}
            />
            <StatCard
              title="Tổng cuộc hẹn"
              value={getStatDisplayValue(stats?.["total-apps"])}
              icon={Activity}
              description={`Tổng ${currentFilterDescription}`}
              isLoading={isLoading}
            />
          </div>

          {renderNoDataState()}

            <div className="grid gap-6 grid-cols-1 mt-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Doanh thu</CardTitle>
                  <CardDescription>Thống kê doanh thu của hệ thống.</CardDescription>
                </CardHeader>
                <CardContent > 
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>
          
        </>
      )}
    </div>
  );
}