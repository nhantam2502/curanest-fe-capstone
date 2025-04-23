"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Bell,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, translateStatusToVietnamese } from "@/lib/utils";
import { GetAppointment } from "@/types/appointment";
import CustomMiniCalendar from "./components/CustomMiniCalendar";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment"; // Assuming this exists and works
import EventDetailsDialog from "./components/ScheduleDetail";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { NurseItemType } from "@/types/nurse";
import ScheduleFilterSidebar from "./components/ScheduleFilterSidebar";
import { FetchedCategory, ServiceItem } from "@/app/admin/nurse/NurseFilter";
import serviceApiRequest from "@/apiRequest/service/apiServices";

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
  const [filterPackageId, setFilterPackageId] = useState<string>("");
  const [filterHasNurse, setFilterHasNurse] = useState<string>("");
  const [rawServiceData, setRawServiceData] = useState<FetchedCategory[]>([]);

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
      const startOfWeek = getStartOfWeek(date); // Uses the memoized version
      const end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6);
      end.setHours(23, 59, 59, 999); // Set to end of the day
      return end;
    },
    [getStartOfWeek]
  ); // Depends on the memoized getStartOfWeek

  const formatDateToISO = useCallback((date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("formatDateToISO received invalid date:", date);
      return "";
    }
    return date.toISOString().split("T")[0];
  }, []);

  const getLocalDayIndex = (date: Date): number => {
    let day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    return day === 0 ? 6 : day - 1; // Adjust to 0=Mon, ..., 6=Sun
  };

  const weekBoundaries = useMemo(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      return { startOfWeek: null, endOfWeek: null };
    }
    const start = getStartOfWeek(selectedDate);
    const end = getEndOfWeek(selectedDate);
    return { startOfWeek: start, endOfWeek: end };
  }, [selectedDate, getStartOfWeek, getEndOfWeek]);

  useEffect(() => {
    const fetchAppointmentsForWeek = async () => {
      const { startOfWeek, endOfWeek } = weekBoundaries;

      if (!startOfWeek || !endOfWeek) {
        setError("Ngày không hợp lệ hoặc không thể tính toán tuần.");
        setScheduleData([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      let filterDateFrom: string;

      try {
        filterDateFrom = formatDateToISO(startOfWeek);
        if (!filterDateFrom) {
          throw new Error("Lỗi định dạng ngày cho truy vấn."); // Throw error to be caught below
        }
        const apiParams: any = {
          "est-date-from": filterDateFrom,
          ...(filterServiceId && { "service-id": filterServiceId }),
          ...(filterStatus && { "appointment-status": filterStatus }),
        };

        console.log("Checking filterHasNurse value before setting API param:", `"${filterHasNurse}"`);

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
          setScheduleData(transformed); // Set the already filtered data
        } else {
          console.error(
            "Lỗi khi lấy lịch hẹn:",
            res.status,
            res.payload?.message || "Unknown error"
          );
          setError(res.payload?.message || "Không thể tải lịch hẹn.");
          setScheduleData([]); // Clear data on error
        }
      } catch (err: any) {
        console.error("Lỗi khi fetch lịch:", err);
        setError(err.message || "Đã xảy ra lỗi mạng hoặc lỗi định dạng ngày.");
        setScheduleData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsForWeek();
  }, [
    // ** IMPORTANT: Dependencies include weekBoundaries and all filters **
    weekBoundaries,
    formatDateToISO,
    filterStatus,
    filterServiceId,
    filterHasNurse,
  ]);

  const fetchService = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getListService(""); // Pass necessary params if any
      if (response.status === 200 && response.payload?.data) {
        setRawServiceData(response.payload.data || []);
      } else {
        console.error("Failed to fetch services:", response);
        setRawServiceData([]); // Reset on failure
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setRawServiceData([]); // Reset on error
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
        })) ?? []
    );
  }, [rawServiceData]);

  const clearFilters = useCallback(() => {
    setFilterStatus("");
    setFilterServiceId("");
    setFilterHasNurse("");
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await nurseApiRequest.getListNurse(1, 100);
        if (response.status === 200 && response.payload?.data) {
          console.log("Data received from API:", response.payload.data); // Log data before setting
          setUsers(response.payload.data); // Schedule state update
          // DO NOT log `users` immediately here
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

  useEffect(() => {
    if (users.length > 0) {
      console.log("Users state updated:", users);
    }
  }, [users]);

  const nurseIdToNameMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    // console.log("Recomputing nurse map. Users:", users); // Debugging line
    users.forEach((user) => {
      // Ensure both id and name exist and are strings before adding
      if (
        user["nurse-id"] &&
        typeof user["nurse-id"] === "string" &&
        user["nurse-name"] &&
        typeof user["nurse-name"] === "string"
      ) {
        map[user["nurse-id"]] = user["nurse-name"];
      } else {
        // console.warn("Skipping user due to missing/invalid id or name:", user);
      }
    });
    return map;
  }, [users]);

  const handleDateSelect = useCallback((dateString: string) => {
    console.log("MiniCalendar selected date string:", dateString);
    const newSelectedDate = new Date(`${dateString}T00:00:00`);
    if (!isNaN(newSelectedDate.getTime())) {
      setSelectedDate(newSelectedDate);
    } else {
      console.error("Invalid date string from MiniCalendar:", dateString);
    }
  }, []);

  const changeWeek = useCallback((direction: "prev" | "next") => {
    setSelectedDate((current) => {
      if (!(current instanceof Date) || isNaN(current.getTime())) {
        console.error(
          "Cannot change week, current selectedDate is invalid:",
          current
        );
        return new Date(); // Fallback to today if current date is invalid
      }
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
      return newDate;
    });
  }, []);
  // No dependencies needed
  const handleEventClick = useCallback((event: GetAppointment) => {
    setSelectedEventDetails(event);
    setIsDialogOpen(true);
  }, []);

  const getEventColor = (
    status: GetAppointment["status"],
    hasNurse: boolean
  ) => {
    if (!hasNurse) {
      return "bg-orange-200 border-orange-300 text-orange-800";
    }

    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 border-green-300 text-green-800";
      case "waiting":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "refused":
        return "bg-red-100 border-red-300 text-red-800";
      case "confirmed":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "changed":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Check if an event should be shown in a specific grid cell
  const shouldShowEvent = useCallback(
    (event: GetAppointment, timeSlot: string, dayIndex: number): boolean => {
      if (!event["est-date"]) return false; // Guard against missing date

      // 1. Parse the UTC event date string
      const eventDateObject = new Date(event["est-date"]);
      if (isNaN(eventDateObject.getTime())) {
        console.warn("Invalid event date string:", event["est-date"]);
        return false; // Cannot process invalid date
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
      // 3. Determine the day of the week for the event *in the local timezone*
      const eventLocalDayIndex = getLocalDayIndex(eventDateObject);
      // 4. Compare the event's local day index with the current column's day index
      if (eventLocalDayIndex !== dayIndex) {
        // console.log(`Event ${event.id} day ${eventLocalDayIndex} !== cell day ${dayIndex}`);
        return false; // Event is not for this day column
      }
      // 5. Extract the starting hour of the event *in the local timezone*
      const eventStartHourLocal = eventDateObject.getHours(); // Use local hour
      // 6. Extract the hour from the time slot string
      const [slotHour] = timeSlot.split(":").map(Number);
      if (isNaN(slotHour)) {
        console.warn("Invalid timeSlot format:", timeSlot);
        return false;
      }
      return slotHour === eventStartHourLocal;
    },
    [weekBoundaries]
  );

  const getEventDuration = useCallback((event: GetAppointment): number => {
    const estimatedDurationMinutes = event["total-est-duration"];

    if (
      estimatedDurationMinutes &&
      typeof estimatedDurationMinutes === "number" &&
      estimatedDurationMinutes > 0
    ) {
      const durationHours = estimatedDurationMinutes / 60;
      return Math.min(Math.max(0.5, durationHours), 8);
    } else {
      // Fallback logic if total-est-duration is missing, zero, negative, or not a number
      // Defaulting to 1 hour is a simple and common fallback.
      // console.warn(`Event ${event.id} missing or invalid total-est-duration (${estimatedDurationMinutes}). Defaulting duration to 1 hour.`);
      return 1;
    }
  }, []);

  const calculateEventHeight = useCallback((durationHours: number): string => {
    const heightPerHourRem = 5;
    const totalHeightRem = durationHours * heightPerHourRem;
    return `calc(${totalHeightRem}rem - 4px)`;
  }, []);

  const statusLegend = useMemo(
    () => [
      // Match the colors from getEventColor logic
      {
        status: "unassigned",
        label: "Chưa gán ĐD",
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
        status: "changed",
        label: translateStatusToVietnamese("changed"),
        colorClass: "bg-purple-100",
      },
      {
        status: "refused",
        label: translateStatusToVietnamese("refused"),
        colorClass: "bg-red-100",
      },
      // Add other distinct statuses if needed, e.g., a default gray one
      // { status: 'other', label: 'Khác', colorClass: 'bg-gray-100' },
    ],
    []
  );

  // const timeFormatOptions: Intl.DateTimeFormatOptions = useMemo(
  //   () => ({
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   }),
  //   []
  // );

  // const formatEventTime = useCallback(
  //   (dateString: string | null | undefined): string => {
  //     if (!dateString) return "--:--";
  //     try {
  //       const date = new Date(dateString);
  //       return !isNaN(date.getTime())
  //         ? date.toLocaleTimeString("vi-VN", timeFormatOptions)
  //         : "??:??";
  //     } catch (e) {
  //       return "??:??";
  //     }
  //   },
  //   [timeFormatOptions]
  // );

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Card className="w-72 flex flex-col flex-shrink-0">
          <CardHeader className="p-4 space-y-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">
                  Lịch hẹn với bệnh nhân
                </span>
              </div>
            </div>
            {/* Mini calendar */}
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
              hasNurse={filterHasNurse} // Pass new state
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
          <CardHeader className="p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50"
                  onClick={() => setSelectedDate(new Date())}
                  disabled={isLoading}
                >
                  Hôm nay
                </Button>
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white"
                    onClick={() => changeWeek("prev")}
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white"
                    onClick={() => changeWeek("next")}
                    disabled={isLoading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-lg font-medium">
                  {/* Display Month/Year only if date is valid */}
                  {selectedDate instanceof Date &&
                  !isNaN(selectedDate.getTime())
                    ? getStartOfWeek(selectedDate).toLocaleDateString("vi-VN", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Tháng không hợp lệ"}
                </span>
              </div>
              <div className="flex items-center justify-end flex-wrap gap-x-3 gap-y-1">
                {" "}
                {/* Use flex-wrap and gap */}
                {statusLegend.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center gap-x-1.5"
                  >
                    {/* Color Swatch */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-md border border-gray-300",
                        item.colorClass
                      )}
                    />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-auto relative">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <p>Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Error Message */}
            {error && !isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 text-red-600 p-4 text-center">
                <p>Lỗi: {error}</p>
              </div>
            )}

            {/* Calendar Grid - Render only if selectedDate is valid */}
            {selectedDate instanceof Date &&
              !isNaN(selectedDate.getTime()) &&
              !error && (
                <div className="grid grid-cols-8 min-w-[1000px]">
                  {/* Header Row */}
                  {/* Time Header */}
                  <div className="col-span-1 p-2 border-r border-b sticky top-0 bg-white z-10">
                    <div className="text-xs font-medium text-gray-500 h-12 flex items-end justify-center">
                      Giờ
                    </div>
                  </div>
                  {/* Day Headers */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const currentDate = new Date(getStartOfWeek(selectedDate));
                    currentDate.setDate(currentDate.getDate() + dayIndex);
                    const isToday =
                      currentDate.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={`header-${dayIndex}`}
                        className="col-span-1 p-2 border-b text-center sticky top-0 bg-white z-10"
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
                              ? "bg-blue-500 text-white font-semibold"
                              : "text-gray-900"
                          )}
                        >
                          {currentDate.getDate()}
                        </div>
                      </div>
                    );
                  })}

                  {/* Grid Body: Time Slots and Events */}
                  {timeSlots.map((timeSlot) => (
                    <React.Fragment key={timeSlot}>
                      <div className="col-span-1 border-r border-b h-20 p-1 flex justify-end items-start">
                        <div className="text-[10px] text-gray-400 -mt-1">
                          {timeSlot}
                        </div>
                      </div>
                      {/* Day Cells */}
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div
                          key={`${timeSlot}-${dayIndex}`}
                          className="col-span-1 border-b border-r h-20 relative"
                        >
                          {/* Render events using scheduleData */}
                          {scheduleData // <-- Use scheduleData directly
                            .filter((event) => event["est-date"]) // Basic check for date existence
                            .map((event) => {
                              if (shouldShowEvent(event, timeSlot, dayIndex)) {
                                const duration = getEventDuration(event); // Uses new logic
                                const eventHeight =
                                  calculateEventHeight(duration); // Uses refined calculation
                                const startTimeString = new Date( // Renamed from timeRangeString for clarity
                                  event["est-date"]
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                });
                                const hasNurseAssigned = !!event["nursing-id"];
                                const bgColor = getEventColor(
                                  event.status,
                                  hasNurseAssigned
                                );
                                const textColor = bgColor
                                  .replace("bg-", "text-")
                                  .replace("-100", "-800");
                                const badgeBgColor = bgColor
                                  .replace("border-", "bg-")
                                  .replace("-300", "-200");
                                const nursingId = event["nursing-id"];
                                let nurseDisplay = "Chưa có"; // Default text
                                let nurseTitle = nurseDisplay; // Title attribute text
                                if (
                                  nursingId &&
                                  typeof nursingId === "string"
                                ) {
                                  const foundName = nurseIdToNameMap[nursingId];
                                  if (foundName) {
                                    nurseDisplay = foundName; // Use the found name
                                    nurseTitle = foundName;
                                  } else {
                                    // Optional: Handle case where ID exists but name wasn't found
                                    nurseDisplay = `ID: ${nursingId}`; // Fallback to ID
                                    nurseTitle = `ID: ${nursingId} (Không tìm thấy tên)`;
                                  }
                                }

                                return (
                                  <div
                                    key={event.id}
                                    className={cn(
                                      "absolute left-0.5 right-0.5 p-1 rounded border text-xs transition-colors cursor-pointer hover:opacity-80 overflow-hidden shadow-sm",
                                      bgColor // Use the calculated background color class
                                    )}
                                    // The style now correctly uses the height based on total-est-duration
                                    style={{
                                      top: "1px",
                                      height: eventHeight, // <-- This uses the calculated height
                                      zIndex: 5,
                                    }}
                                    onClick={() => handleEventClick(event)}
                                    title={`Thời gian: ${startTimeString} (~${event["total-est-duration"] || "?"} phút)\nTrạng thái: ${translateStatusToVietnamese(
                                      event.status
                                    )}`} // Update title slightly
                                  >
                                    {/* Event Content */}
                                    <p
                                      className={`font-semibold mb-0.5 truncate text-[10px] ${textColor}`}
                                    >
                                      Cuộc hẹn
                                    </p>
                                    <div
                                      className={`flex items-center gap-1 text-gray-600 mb-0.5 text-[9px]`}
                                    >
                                      <Clock className="w-2 h-2 flex-shrink-0" />
                                      {/* Display only start time on the grid block */}
                                      <span>{startTimeString}</span>
                                    </div>
                                    <div
                                      className={`flex items-center gap-1 text-gray-600 text-[9px] truncate`}
                                    >
                                      <Users className="w-2 h-2 flex-shrink-0" />
                                      <span
                                        className="truncate"
                                        title={nurseTitle}
                                      >
                                        ĐD: {nurseDisplay}
                                      </span>
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute bottom-0.5 right-0.5">
                                      <span
                                        className={`px-1 py-0 rounded border text-[8px] font-medium ${badgeBgColor} ${textColor}`}
                                      >
                                        {translateStatusToVietnamese(
                                          event.status
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              )}
            {/* Message when selectedDate is invalid */}
            {!(
              selectedDate instanceof Date && !isNaN(selectedDate.getTime())
            ) && (
              <div className="p-4 text-center text-gray-500">
                {" "}
                Vui lòng chọn một ngày hợp lệ.{" "}
              </div>
            )}
            {/* Message when no data found (after loading, considering filters) */}
            {!isLoading && !error && scheduleData.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                {" "}
                Không có lịch hẹn nào được tìm thấy cho tuần này với bộ lọc hiện
                tại.{" "}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <EventDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={selectedEventDetails}
      />
    </div>
  );
};

export default NurseScheduleCalendar;
