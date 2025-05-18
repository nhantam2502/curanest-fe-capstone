"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  // Bell, // Not used
  Clock,
  // Filter, // Not used
  // X, // Not used
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, translateStatusToVietnamese } from "@/lib/utils";
import { GetAppointment } from "@/types/appointment";
import CustomMiniCalendar from "./components/CustomMiniCalendar";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import EventDetailsDialog from "./components/ScheduleDetail"; // Corrected import path
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { NurseItemType } from "@/types/nurse";
import ScheduleFilterSidebar from "./components/ScheduleFilterSidebar";
import { FetchedCategory, ServiceItem } from "@/app/admin/nurse/NurseFilter"; // Assuming this path is correct
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { useToast } from "@/hooks/use-toast"; // Import useToast if you want to show feedback

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<GetAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] =
    useState<GetAppointment | null>(null);
  const [users, setUsers] = useState<NurseItemType[]>([]);

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterServiceId, setFilterServiceId] = useState<string>("");
  const [filterPackageId, setFilterPackageId] = useState<string>(""); // Assuming this is not used currently based on API params
  const [filterHasNurse, setFilterHasNurse] = useState<string>("");
  const [rawServiceData, setRawServiceData] = useState<FetchedCategory[]>([]);
  const { toast } = useToast(); // Initialize toast

  const getStartOfWeek = useCallback((date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }, []);

  const getEndOfWeek = useCallback(
    (date: Date): Date => {
      const startOfWeek = getStartOfWeek(date);
      const end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return end;
    },
    [getStartOfWeek]
  );

  const formatDateToISO = useCallback((date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("formatDateToISO received invalid date:", date);
      return "";
    }
    return date.toISOString().split("T")[0];
  }, []);

  const getLocalDayIndex = (date: Date): number => {
    let day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const weekBoundaries = useMemo(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      return { startOfWeek: null, endOfWeek: null };
    }
    const start = getStartOfWeek(selectedDate);
    const end = getEndOfWeek(selectedDate);
    return { startOfWeek: start, endOfWeek: end };
  }, [selectedDate, getStartOfWeek, getEndOfWeek]);

  // --- MODIFIED: Extracted fetch logic into a useCallback for reusability ---
  const fetchAppointmentsForWeek = useCallback(async () => {
    const { startOfWeek, endOfWeek } = weekBoundaries;

    if (!startOfWeek || !endOfWeek) {
      setError("Ngày không hợp lệ hoặc không thể tính toán tuần.");
      setScheduleData([]);
      setIsLoading(false); // Ensure loading is false
      return;
    }
    setIsLoading(true);
    setError(null);
    let filterDateFrom: string;

    try {
      filterDateFrom = formatDateToISO(startOfWeek);
      if (!filterDateFrom) {
        throw new Error("Lỗi định dạng ngày cho truy vấn.");
      }
      const apiParams: any = {
        "est-date-from": filterDateFrom,
        ...(filterServiceId && { "service-id": filterServiceId }),
        ...(filterStatus && { "appointment-status": filterStatus }),
      };

      if (filterHasNurse === "1") {
        apiParams["had-nurse"] = "true";
      } else if (filterHasNurse === "0") {
        apiParams["had-nurse"] = "false";
      }

      console.log("Fetching appointments with params:", apiParams);

      const res = await appointmentApiRequest.getAppointments(apiParams);

      if (res.status === 200 && Array.isArray(res.payload?.data)) {
        const transformed = res.payload.data;
        console.log("Fetched appointments:", transformed);
        setScheduleData(transformed);
      } else {
        console.error(
          "Lỗi khi lấy lịch hẹn:",
          res.status,
          res.payload?.message || "Unknown error"
        );
        setError(res.payload?.message || "Không thể tải lịch hẹn.");
        setScheduleData([]);
      }
    } catch (err: any) {
      console.error("Lỗi khi fetch lịch:", err);
      setError(err.message || "Đã xảy ra lỗi mạng hoặc lỗi định dạng ngày.");
      setScheduleData([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    weekBoundaries,
    formatDateToISO,
    filterStatus,
    filterServiceId,
    filterHasNurse,
  ]); // Dependencies for this fetch function

  // --- Initial fetch and refetch on filter changes ---
  useEffect(() => {
    fetchAppointmentsForWeek();
  }, [fetchAppointmentsForWeek]); // Call the memoized fetch function

  const fetchService = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getListService(""); // Assuming empty string fetches all or is okay
      if (response.status === 200 && response.payload?.data) {
        setRawServiceData(response.payload.data || []);
      } else {
        console.error("Failed to fetch services:", response);
        setRawServiceData([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setRawServiceData([]);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const allServices = useMemo((): ServiceItem[] => {
    if (!rawServiceData || rawServiceData.length === 0) {
      return [];
    }
    return rawServiceData.flatMap(
      (category) =>
        category["list-services"]?.map((service) => ({
          id: service.id,
          name: service.name,
          // category_id: category.id, // If needed
        })) ?? []
    );
  }, [rawServiceData]);

  const clearFilters = useCallback(() => {
    setFilterStatus("");
    setFilterServiceId("");
    setFilterHasNurse("");
    // fetchAppointmentsForWeek();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await nurseApiRequest.getListNurse(1, 100);
        if (response.status === 200 && response.payload?.data) {
          setUsers(response.payload.data);
        } else {
          console.error("Failed to fetch staff:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    fetchStaff();
  }, []);

  const nurseIdToNameMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    users.forEach((user) => {
      if (
        user["nurse-id"] &&
        typeof user["nurse-id"] === "string" &&
        user["nurse-name"] &&
        typeof user["nurse-name"] === "string"
      ) {
        map[user["nurse-id"]] = user["nurse-name"];
      }
    });
    return map;
  }, [users]);

  const handleDateSelect = useCallback(
    (dateString: string) => {
      const newSelectedDate = new Date(`${dateString}T00:00:00Z`); // Ensure parsing as UTC if dateString is YYYY-MM-DD
      if (!isNaN(newSelectedDate.getTime())) {
        setSelectedDate(newSelectedDate);
      } else {
        console.error("Invalid date string from MiniCalendar:", dateString);
        toast({
          title: "Lỗi",
          description: "Ngày không hợp lệ.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const changeWeek = useCallback((direction: "prev" | "next") => {
    setSelectedDate((current) => {
      if (!(current instanceof Date) || isNaN(current.getTime())) {
        console.error(
          "Cannot change week, current selectedDate is invalid:",
          current
        );
        return new Date();
      }
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
      return newDate;
    });
  }, []);

  const handleEventClick = useCallback((event: GetAppointment) => {
    setSelectedEventDetails(event);
    setIsDialogOpen(true);
  }, []);

  const handleAppointmentUpdated = useCallback(() => {
    console.log("Appointment updated, refetching schedule...");
    toast({
      title: "Đang làm mới...",
      description: "Lịch hẹn đang được cập nhật.",
    });
    fetchAppointmentsForWeek();
  }, [fetchAppointmentsForWeek, toast]);

  const getEventColor = (
    status: GetAppointment["status"],
    hasNurse: boolean
  ) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-orange-200 border-orange-300 text-orange-800";
      case "success":
        return "bg-green-100 border-green-300 text-green-800";
      case "waiting":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "cancel":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7; // 7 AM to 6 PM
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const shouldShowEvent = useCallback(
    (event: GetAppointment, timeSlot: string, dayIndex: number): boolean => {
      if (!event["est-date"]) return false;

      const eventDateObject = new Date(event["est-date"]);
      if (isNaN(eventDateObject.getTime())) {
        return false;
      }

      const { startOfWeek, endOfWeek } = weekBoundaries;
      if (
        !startOfWeek ||
        !endOfWeek ||
        eventDateObject < startOfWeek ||
        eventDateObject > endOfWeek
      ) {
        return false;
      }
      const eventLocalDayIndex = getLocalDayIndex(eventDateObject);
      if (eventLocalDayIndex !== dayIndex) {
        return false;
      }
      const eventStartHourLocal = eventDateObject.getHours();
      const [slotHour] = timeSlot.split(":").map(Number);
      if (isNaN(slotHour)) {
        return false;
      }
      return slotHour === eventStartHourLocal;
    },
    [weekBoundaries] // Removed getLocalDayIndex from deps as it's stable
  );

  const getEventDuration = useCallback((event: GetAppointment): number => {
    const estimatedDurationMinutes = (event as any)["total-est-duration"];
    if (
      typeof estimatedDurationMinutes === "number" &&
      estimatedDurationMinutes > 0
    ) {
      const durationHours = estimatedDurationMinutes / 60;
      return Math.min(Math.max(0.5, durationHours), 8);
    }
    return 1;
  }, []);

  const calculateEventHeight = useCallback((durationHours: number): string => {
    const heightPerHourRem = 5;
    const totalHeightRem = durationHours * heightPerHourRem;
    return `calc(${totalHeightRem}rem - 4px)`;
  }, []);

  const calculateEventPosition = (totalEvents: number, index: number) => {
    const widthPercentage = 100 / totalEvents;
    const leftOffset = widthPercentage * index;
    return {
      width: `${widthPercentage}%`,
      left: `${leftOffset}%`,
      zIndex: 10 - index, // Events earlier in the array (lower index) get higher z-index
    };
  };

  const statusLegend = useMemo(
    () => [
      {
        status: "upcoming",
        label: translateStatusToVietnamese("upcoming"),
        colorClass: "bg-orange-200",
      },
      {
        status: "success",
        label: translateStatusToVietnamese("success"),
        colorClass: "bg-green-100",
      },
      {
        status: "waiting",
        label: translateStatusToVietnamese("waiting"),
        colorClass: "bg-yellow-100",
      },
      {
        status: "confirmed",
        label: translateStatusToVietnamese("confirmed"),
        colorClass: "bg-blue-100",
      },
      {
        status: "cancel",
        label: translateStatusToVietnamese("cancel"),
        colorClass: "bg-red-100",
      },
    ],
    []
  );

  return (
    <div className="w-full h-[calc(100vh-var(--header-height,64px)-1rem)] p-2 flex flex-col">
      {" "}
      {/* Adjusted height */}
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Card className="w-72 flex flex-col flex-shrink-0 shadow-sm">
          <CardHeader className="p-4 space-y-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700">
                  Lịch hẹn
                </span>
              </div>
            </div>
            <CustomMiniCalendar
              onDateSelect={handleDateSelect}
              initialDate={selectedDate}
            />
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto">
            <ScheduleFilterSidebar
              status={filterStatus}
              serviceId={filterServiceId}
              packageId={filterPackageId}
              hasNurse={filterHasNurse}
              services={allServices}
              onHasNurseChange={setFilterHasNurse}
              onStatusChange={setFilterStatus}
              onServiceIdChange={setFilterServiceId}
              onPackageIdChange={setFilterPackageId}
              onClearFilters={clearFilters}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Main Calendar Area */}
        <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
          <CardHeader className="p-3 border-b flex-shrink-0 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 text-gray-700"
                  onClick={() => setSelectedDate(new Date())}
                  disabled={isLoading}
                >
                  Hôm nay
                </Button>

                <div className="flex items-center gap-0.5 bg-white rounded-md border p-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-gray-100 text-gray-600"
                    onClick={() => changeWeek("prev")}
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700 px-2 whitespace-nowrap">
                    {weekBoundaries.startOfWeek && weekBoundaries.endOfWeek
                      ? `${weekBoundaries.startOfWeek.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${weekBoundaries.endOfWeek.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                      : "Đang tải..."}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-gray-100 text-gray-600"
                    onClick={() => changeWeek("next")}
                    disabled={isLoading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-end flex-wrap gap-x-2 gap-y-1">
                {statusLegend.map((item) => (
                  <div key={item.status} className="flex items-center gap-x-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-sm border border-gray-400",
                        item.colorClass
                      )}
                    />
                    <span className="text-sm text-gray-800">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {error && !isLoading && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 text-red-600 p-4 text-center">
                <p>Lỗi: {error}</p>
              </div>
            )}

            {selectedDate instanceof Date &&
              !isNaN(selectedDate.getTime()) &&
              !error && (
                <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[1000px]">
                  {" "}
                  {/* Adjusted grid template */}
                  {/* Header Row */}
                  <div className="col-start-1 row-start-1 p-2 border-r border-b sticky top-0 bg-white z-10">
                    <div className="text-xs font-medium text-gray-500 h-12 flex items-end justify-center">
                      Giờ
                    </div>
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const currentDate = new Date(getStartOfWeek(selectedDate));
                    currentDate.setDate(currentDate.getDate() + dayIndex);
                    const isToday =
                      currentDate.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={`header-${dayIndex}`}
                        className={cn(
                          "col-start-auto row-start-1 p-2 border-b text-center sticky top-0 bg-white z-10",
                          dayIndex < 6 && "border-r" // Add right border to all but the last day header
                        )}
                      >
                        <div className="text-xs text-gray-500">
                          {currentDate.toLocaleDateString("vi-VN", {
                            weekday: "short",
                          })}
                        </div>
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center mx-auto mt-1 text-xs",
                            isToday
                              ? "bg-primary text-white font-semibold"
                              : "text-gray-900"
                          )}
                        >
                          {currentDate.getDate()}
                        </div>
                      </div>
                    );
                  })}
                  {/* Grid Body: Time Slots and Events */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <React.Fragment key={timeSlot}>
                      <div
                        className={cn(
                          "row-start-auto col-start-1 border-r h-20 p-1 flex justify-end items-start",
                          timeIndex < timeSlots.length - 1 && "border-b" // Bottom border for all but last time slot
                        )}
                      >
                        <div className="text-[10px] text-gray-400 -mt-1">
                          {timeSlot}
                        </div>
                      </div>

                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const eventsInCell = scheduleData.filter((event) =>
                          shouldShowEvent(event, timeSlot, dayIndex)
                        );
                        return (
                          <div
                            key={`${timeSlot}-${dayIndex}`}
                            className={cn(
                              "col-span-1 border-b border-r h-20 relative"
                            )}
                          >
                            {eventsInCell.map((event, index) => {
                              const duration = getEventDuration(event);
                              const height = calculateEventHeight(duration);
                              const hasNurseAssigned = !!event["nursing-id"];
                              const bgColor = getEventColor(
                                event.status,
                                hasNurseAssigned
                              );
                              const positionStyle = calculateEventPosition(
                                eventsInCell.length,
                                index
                              );

                              return (
                                <div
                                  key={event.id}
                                  style={{
                                    top: "1px",
                                    height,
                                    ...positionStyle,
                                    zIndex: 5,
                                  }}
                                  className={cn(
                                    "absolute p-1 rounded border text-xs transition-colors cursor-pointer hover:opacity-80 overflow-hidden shadow-sm",
                                    bgColor
                                  )}
                                  onClick={() => handleEventClick(event)}
                                  title={`BN: ${event["patient-id"] || "N/A"}\nThời gian: ${new Date(event["est-date"]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} (~${(event as any)["total-est-duration"] || "?"} phút)\nTrạng thái: ${translateStatusToVietnamese(event.status)}`}
                                >
                                  <p className="font-semibold mb-0.5 truncate text-[10px] leading-tight">
                                    Cuộc hẹn
                                  </p>
                                  <div className="flex items-center gap-1 text-gray-600 mb-0.5 text-[9px] leading-tight">
                                    <Clock className="w-2 h-2 flex-shrink-0" />
                                    <span>
                                      {new Date(
                                        event["est-date"]
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-600 text-[9px] truncate leading-tight">
                                    <Users className="w-2 h-2 flex-shrink-0" />
                                    <span className="truncate">
                                      ĐD:{" "}
                                      {nurseIdToNameMap[event["nursing-id"]!] ||
                                        (event["nursing-id"]
                                          ? `ID:${event["nursing-id"].slice(-4)}`
                                          : "Chưa có")}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              )}

            {!(
              selectedDate instanceof Date && !isNaN(selectedDate.getTime())
            ) && (
              <div className="p-4 text-center text-gray-500">
                Vui lòng chọn một ngày hợp lệ.
              </div>
            )}
            {!isLoading &&
              !error &&
              scheduleData.length === 0 &&
              selectedDate instanceof Date &&
              !isNaN(selectedDate.getTime()) && (
                <div className="p-4 text-center text-gray-500">
                  Không có lịch hẹn nào cho tuần này hoặc theo bộ lọc đã chọn.
                </div>
              )}
          </CardContent>
        </Card>
      </div>
      <EventDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={selectedEventDetails}
        onAppointmentUpdated={handleAppointmentUpdated} // Pass the callback here
      />
    </div>
  );
};

export default NurseScheduleCalendar;
