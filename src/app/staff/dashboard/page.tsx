// app/staff/dashboard/page.tsx (or your actual path for the staff dashboard)
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  Activity,
  PackageSearch,
  AlertTriangle,
  Hourglass,
} from "lucide-react";
import { StatCard } from "./components/StatCard"; // Assuming this path is correct
import { ServicePopularityChart } from "./components/ServiceChart"; // Assuming this path is correct
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment"; // Assuming this path is correct
import { useStaffServices } from "@/hooks/useStaffService";

export type TimeFilter = "week" | "month";

interface DashboardStats {
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
  const today = new Date();
  let dateFromInstance = new Date(today);
  let dateToInstance = new Date(today);

  switch (filter) {
    case "week":
      const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
      const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // Adjust to make Monday the start
      dateFromInstance.setDate(today.getDate() + diffToMonday);
      dateToInstance.setDate(dateFromInstance.getDate() + 6); // Monday + 6 days = Sunday
      break;
    case "month":
      dateFromInstance = new Date(today.getFullYear(), today.getMonth(), 1);
      dateToInstance = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
  }
  const formatDate = (date: Date): string => date.toISOString().split("T")[0];
  return {
    dateFrom: formatDate(dateFromInstance),
    dateTo: formatDate(dateToInstance),
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

function StaffDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  const { staffServices, loading: isLoadingStaffServices } = useStaffServices();

  const derivedFilterCategoryId = useMemo(() => {
    if (isLoadingStaffServices || !staffServices || staffServices.length === 0) {
      return null;
    }
    return staffServices[0]?.categoryInfo?.id?.toString() || null;
  }, [staffServices, isLoadingStaffServices]);

  const fetchData = useCallback(async () => {
    if (isLoadingStaffServices) {
      setIsLoading(true); 
      setError(null);
      setStats(null);
      return;
    }

    if (!derivedFilterCategoryId) {
      setIsLoading(false);
      setError(
        "Không thể xác định danh mục dịch vụ của nhân viên để tải thống kê."
      );
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    const { dateFrom, dateTo } = calculateDateRange(timeFilter);

    try {
      const response = await appointmentApiRequest.getDashboard(
        "false",
        derivedFilterCategoryId,
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
  }, [timeFilter, derivedFilterCategoryId, isLoadingStaffServices]);

  useEffect(() => {
    if (!isLoadingStaffServices) {
        fetchData();
    } else {
        setIsLoading(true);
        setStats(null);
        setError(null);
    }
  }, [fetchData, isLoadingStaffServices]);

  const handleFilterChange = useCallback(
    (newFilter: TimeFilter) => {
      setTimeFilter(newFilter);
    },
    []
  );

  const refetchStats = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const currentFilterDescription = useMemo(() => {
    return getTimeFilterDescription(timeFilter);
  }, [timeFilter]);

  const getStatDisplayValue = useCallback(
    (value: number | undefined): string | number => {
      if (isLoading) return "";
      return value !== undefined ? value : "-";
    },
    [isLoading]
  );

  const renderFilterButtons = () => (
    <div className="flex flex-wrap gap-2 mb-6">
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
          disabled={isLoading || isLoadingStaffServices} // Disable if either is loading
        >
          {filter === "week" && "Trong Tuần"}
          {filter === "month" && "Trong Tháng"}
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
          disabled={isLoading || isLoadingStaffServices}
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
    !isLoadingStaffServices && 
    derivedFilterCategoryId && 
    (!stats || Object.keys(stats).length === 0) && (
      <Card className="col-span-full">
        <CardContent className="py-10 text-center text-muted-foreground">
          Không có dữ liệu thống kê để hiển thị cho {currentFilterDescription}.
        </CardContent>
      </Card>
    );

  return (
    <div className="flex-1 space-y-4 p-4">
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
              title="Dịch vụ được quản lý"
              value={getStatDisplayValue(stats?.["total-service"])}
              icon={PackageSearch}
              description="Dịch vụ đang quản lý"
              isLoading={isLoading || isLoadingStaffServices} // StatCard loading if either is true
            />
            <StatCard
              title="Cuộc hẹn sắp tới"
              value={getStatDisplayValue(stats?.["upcoming-apps"])}
              icon={Clock}
              description={`Trong ${currentFilterDescription}`}
              isLoading={isLoading || isLoadingStaffServices}
            />
            <StatCard
              title="Cuộc hẹn đang chờ"
              value={getStatDisplayValue(stats?.["waiting-apps"])}
              icon={Hourglass}
              description={`Cần xử lý ${currentFilterDescription}`}
              isLoading={isLoading || isLoadingStaffServices}
            />
            <StatCard
              title="Tổng cuộc hẹn"
              value={getStatDisplayValue(stats?.["total-apps"])}
              icon={Activity}
              description={`Tổng ${currentFilterDescription}`}
              isLoading={isLoading || isLoadingStaffServices}
            />
          </div>

          {renderNoDataState()}

          {!isLoading && !isLoadingStaffServices && !error && stats && Object.keys(stats).length > 0 && (
            <div className="grid gap-6 grid-cols-1 mt-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Dịch vụ phổ biến
                  </CardTitle>
                  <CardDescription>
                    Các dịch vụ được yêu cầu nhiều nhất{" "}
                    {currentFilterDescription}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServicePopularityChart 
                    categoryId={derivedFilterCategoryId} 
                    timeFilter={timeFilter}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StaffDashboardPage;