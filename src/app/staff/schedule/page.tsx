"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, translateStatusToVietnamese } from "@/lib/utils";
import { GetAppointment } from "@/types/appointment";
import CustomMiniCalendar from "./components/CustomMiniCalendar";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import EventDetailsDialog from "./components/ScheduleDetail";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { NurseItemType } from "@/types/nurse";
import ScheduleFilterSidebar from "./components/ScheduleFilterSidebar";
import { FetchedCategory, ServiceItem } from "@/app/admin/nurse/NurseFilter"; // Assuming this path is correct
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { useToast } from "@/hooks/use-toast";
import { useStaffServices } from "@/hooks/useStaffService";

// --- Helper Functions (Stable, can be outside or memoized if complex) ---
const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const end = new Date(startOfWeek);
  end.setDate(startOfWeek.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const formatDateToISO = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("formatDateToISO received invalid date:", date);
    return ""; // Or throw an error, depending on desired handling
  }
  return date.toISOString().split("T")[0];
};

const getLocalDayIndex = (date: Date): number => {
  let day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<GetAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true); 
  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<GetAppointment | null>(null);

  const [nurses, setNurses] = useState<NurseItemType[]>([]); // Renamed for clarity
  const [isLoadingNurses, setIsLoadingNurses] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterServiceId, setFilterServiceId] = useState<string>("");
  const [filterHasNurse, setFilterHasNurse] = useState<string>(""); 

  const [rawServiceCategories, setRawServiceCategories] = useState<FetchedCategory[]>([]); // Renamed for clarity
  const [isLoadingServiceCategories, setIsLoadingServiceCategories] = useState(true);

  const { toast } = useToast();
  const { staffServices, loading: isLoadingStaffServices } = useStaffServices();

  const derivedFilterCategoryId = useMemo(() => {
    if (isLoadingStaffServices || !staffServices || staffServices.length === 0) {
      return null;
    }

    const categoryId = staffServices[0]?.categoryInfo?.id || null;
    // console.log("NurseScheduleCalendar: Derived filterCategoryId:", categoryId);
    return categoryId;
  }, [staffServices, isLoadingStaffServices]);

  const weekBoundaries = useMemo(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      // console.warn("NurseScheduleCalendar: Selected date is invalid for week boundaries.");
      return { startOfWeek: null, endOfWeek: null };
    }
    const start = getStartOfWeek(selectedDate);
    const end = getEndOfWeek(selectedDate);
    return { startOfWeek: start, endOfWeek: end };
  }, [selectedDate]); 

  const fetchAppointmentsForWeek = useCallback(async () => {
    const { startOfWeek } = weekBoundaries; 

    if (isLoadingStaffServices || !startOfWeek) {
      setIsLoadingAppointments(true); // Keep loading true
      setScheduleData([]); // Clear data while waiting
      setAppointmentError(null);
      return;
    }
    // console.log("fetchAppointmentsForWeek: Proceeding to fetch.");
    setIsLoadingAppointments(true);
    setAppointmentError(null);

    try {
      const filterDateFrom = formatDateToISO(startOfWeek);
      if (!filterDateFrom) {
        throw new Error("Lỗi định dạng ngày cho truy vấn (ngày bắt đầu).");
      }

      const apiParams: Record<string, string | undefined> = {
        "est-date-from": filterDateFrom,
        // Only include category-id if it's not null. Adjust if API handles null as "all".
        ...(derivedFilterCategoryId && { "category-id": derivedFilterCategoryId }),
        ...(filterServiceId && { "service-id": filterServiceId }),
        ...(filterStatus && { "appointment-status": filterStatus }),
      };

      if (filterHasNurse === "1") apiParams["had-nurse"] = "true";
      else if (filterHasNurse === "0") apiParams["had-nurse"] = "false";

      // console.log("Fetching appointments with params:", apiParams);
      const res = await appointmentApiRequest.getAppointments(apiParams);

      if (res.status === 200 && Array.isArray(res.payload?.data)) {
        setScheduleData(res.payload.data);
      } else {
        console.error("Lỗi khi lấy lịch hẹn:", res.status, res.payload?.message);
        setAppointmentError(res.payload?.message || "Không thể tải lịch hẹn.");
        setScheduleData([]);
      }
    } catch (err: any) {
      console.error("Lỗi khi fetch lịch:", err);
      setAppointmentError(err.message || "Đã xảy ra lỗi mạng hoặc lỗi định dạng ngày.");
      setScheduleData([]);
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [
    weekBoundaries,
    derivedFilterCategoryId, // Key dependency
    filterStatus,
    filterServiceId,
    filterHasNurse,
    isLoadingStaffServices, // Ensure we wait for this
  ]);

  useEffect(() => {
    // This effect triggers fetching appointments when critical dependencies change.
    fetchAppointmentsForWeek();
  }, [fetchAppointmentsForWeek]);


  useEffect(() => {
    // Fetch service categories for the filter sidebar
    const fetchServiceCategoriesList = async () => {
      setIsLoadingServiceCategories(true);
      try {
        const response = await serviceApiRequest.getListService(null); // Assuming null fetches all
        if (response.status === 200 && response.payload?.data) {
          setRawServiceCategories(response.payload.data || []);
        } else {
          console.error("Failed to fetch service categories:", response);
          setRawServiceCategories([]);
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
        setRawServiceCategories([]);
      } finally {
        setIsLoadingServiceCategories(false);
      }
    };
    fetchServiceCategoriesList();
  }, []);

  const allServicesForFilter = useMemo((): ServiceItem[] => {
    if (!rawServiceCategories || rawServiceCategories.length === 0) return [];
    return rawServiceCategories.flatMap(
      (category) => category["list-services"]?.map((service) => ({
        id: service.id,
        name: service.name,
        // category_id: category.id, // Uncomment if needed by the filter
      })) ?? []
    );
  }, [rawServiceCategories]);


  useEffect(() => {
    // Fetch nurses for mapping ID to name
    const fetchNursesList = async () => {
      setIsLoadingNurses(true);
      try {
        const response = await nurseApiRequest.getListNurse(1, 200); // Fetch a larger list if needed
        if (response.status === 200 && response.payload?.data) {
          setNurses(response.payload.data);
        } else {
          console.error("Failed to fetch nurses:", response);
          setNurses([]);
        }
      } catch (error) {
        console.error("Error fetching nurses:", error);
        setNurses([]);
      } finally {
        setIsLoadingNurses(false);
      }
    };
    fetchNursesList();
  }, []);

  const clearFilters = useCallback(() => {
    setFilterStatus("");
    setFilterServiceId("");
    setFilterHasNurse("");
    // fetchAppointmentsForWeek() will be triggered by state changes if it's a dependency
  }, []);

  const handleDateSelect = useCallback((dateString: string) => {
    // Assuming dateString is YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const newSelectedDate = new Date(year, month - 1, day);

    if (!isNaN(newSelectedDate.getTime())) {
      setSelectedDate(newSelectedDate);
    } else {
      console.error("Invalid date string from MiniCalendar:", dateString);
      toast({
        title: "Lỗi",
        description: "Ngày không hợp lệ từ lịch nhỏ.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const changeWeek = useCallback((direction: "prev" | "next") => {
    setSelectedDate((current) => {
      if (!(current instanceof Date) || isNaN(current.getTime())) {
        return new Date(); // Fallback to today
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
    // console.log("Appointment updated, refetching schedule...");
    toast({
      title: "Đang làm mới...",
      description: "Lịch hẹn đang được cập nhật.",
    });
    fetchAppointmentsForWeek(); // Manually trigger refetch
  }, [fetchAppointmentsForWeek, toast]); // fetchAppointmentsForWeek is stable due to useCallback

  // --- EVENT RENDERING LOGIC ---
  const getEventColor = useCallback((status: GetAppointment["status"]) => {
    // Removed hasNurse param as it's not used in the switch
    switch (status?.toLowerCase()) {
      case "upcoming": return "bg-orange-100 border-orange-300 text-orange-700";
      case "success": return "bg-green-100 border-green-300 text-green-700";
      case "waiting": return "bg-yellow-100 border-yellow-300 text-yellow-700";
      case "confirmed": return "bg-blue-100 border-blue-300 text-blue-700";
      case "cancel": return "bg-red-100 border-red-300 text-red-700";
      default: return "bg-gray-100 border-gray-300 text-gray-700";
    }
  }, []);

  const timeSlots = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7; // 7 AM to 6 PM
    return `${hour.toString().padStart(2, "0")}:00`;
  }), []);

  const shouldShowEvent = useCallback((event: GetAppointment, timeSlot: string, dayIndexInWeek: number): boolean => {
    if (!event?.["est-date"]) return false;
    const eventDateObject = new Date(event["est-date"]);
    if (isNaN(eventDateObject.getTime())) return false;

    const { startOfWeek: currentViewStartOfWeek, endOfWeek: currentViewEndOfWeek } = weekBoundaries;
    if (!currentViewStartOfWeek || !currentViewEndOfWeek ||
        eventDateObject < currentViewStartOfWeek || eventDateObject > currentViewEndOfWeek) {
      return false; // Event not in current view week
    }

    const eventLocalDayIndex = getLocalDayIndex(eventDateObject);
    if (eventLocalDayIndex !== dayIndexInWeek) return false; // Event not on this day of the week

    const eventStartHourLocal = eventDateObject.getHours();
    const [slotHour] = timeSlot.split(":").map(Number);
    return slotHour === eventStartHourLocal; // Event starts in this time slot
  }, [weekBoundaries]); // weekBoundaries is memoized

  const getEventUIDisplayProps = useCallback((event: GetAppointment) => {
    const estimatedDurationMinutes = (event as any)["total-est-duration"]; // Type assertion if not in GetAppointment
    let durationHours = 1; // Default duration
    if (typeof estimatedDurationMinutes === "number" && estimatedDurationMinutes > 0) {
      durationHours = Math.min(Math.max(0.5, estimatedDurationMinutes / 60), 8); // Clamp duration
    }
    const heightRemPerHr = 5; // Corresponds to h-20 for 1 hour (1rem title + 4rem content roughly)
    const height = `calc(${durationHours * heightRemPerHr}rem - 4px)`; // -4px for borders/padding
    return { durationHours, height };
  }, []);


  const calculateEventPositionStyle = useCallback((totalEventsInSlot: number, eventIndex: number) => {
    if (totalEventsInSlot <= 0) return { width: '100%', left: '0%', zIndex: 5 };
    const widthPercentage = 100 / totalEventsInSlot;
    const leftOffset = widthPercentage * eventIndex;
    return {
      width: `${widthPercentage}%`,
      left: `${leftOffset}%`,
      zIndex: 10 + eventIndex, // Higher index (later in array) can be on top for some layouts
    };
  }, []);

  const statusLegend = useMemo(() => [
    { status: "upcoming", label: translateStatusToVietnamese("upcoming"), colorClass: getEventColor("upcoming") },
    { status: "success", label: translateStatusToVietnamese("success"), colorClass: getEventColor("success") },
    { status: "waiting", label: translateStatusToVietnamese("waiting"), colorClass: getEventColor("waiting") },
    { status: "confirmed", label: translateStatusToVietnamese("confirmed"), colorClass: getEventColor("confirmed") },
    { status: "cancel", label: translateStatusToVietnamese("cancel"), colorClass: getEventColor("cancel") },
  ], [getEventColor]); // Depends on getEventColor (which is stable)

  // Overall loading state for the main calendar grid
  const isCalendarGridLoading = isLoadingStaffServices || isLoadingAppointments;


  return (
    <div className="w-full h-[calc(100vh-var(--header-height,64px)-1rem)] p-2 flex flex-col">
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Card className="w-72 flex flex-col flex-shrink-0 shadow-sm">
          <CardHeader className="p-4 space-y-4 border-b">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Lịch hẹn</span>
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
              packageId={""} // Pass filterPackageId if used
              hasNurse={filterHasNurse}
              services={allServicesForFilter}
              onHasNurseChange={setFilterHasNurse}
              onStatusChange={setFilterStatus}
              onServiceIdChange={setFilterServiceId}
              onPackageIdChange={() => {}} // Pass setFilterPackageId if used
              onClearFilters={clearFilters}
              isLoading={isLoadingServiceCategories || isLoadingStaffServices} // Sidebar loading depends on its data
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
                  disabled={isCalendarGridLoading}
                >
                  Hôm nay
                </Button>
                <div className="flex items-center gap-0.5 bg-white rounded-md border p-0.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100 text-gray-600" onClick={() => changeWeek("prev")} disabled={isCalendarGridLoading}> <ChevronLeft className="w-4 h-4" /> </Button>
                 <span className="text-sm font-medium text-gray-700 px-2 whitespace-nowrap">
                    {weekBoundaries.startOfWeek && weekBoundaries.endOfWeek
                      ? `${weekBoundaries.startOfWeek.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${weekBoundaries.endOfWeek.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                      : "Đang tải..."}
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100 text-gray-600" onClick={() => changeWeek("next")} disabled={isCalendarGridLoading}> <ChevronRight className="w-4 h-4" /> </Button>
                </div>
              </div>
              <div className="flex items-center justify-end flex-wrap gap-x-2 gap-y-1">
                {statusLegend.map((item) => (
                  <div key={item.status} className="flex items-center gap-x-1.5">
                    <div className={cn("w-3.5 h-3.5 rounded-sm border border-gray-400", item.colorClass.split(' ')[0])} /> {/* Use only bg color for legend dot */}
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-auto relative">
            {isCalendarGridLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {appointmentError && !isCalendarGridLoading && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 text-red-600 p-4 text-center">
                <p>Lỗi: {appointmentError}</p>
              </div>
            )}

            {selectedDate instanceof Date && !isNaN(selectedDate.getTime()) && !appointmentError && (
              <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[1000px]">
                {/* Header Row: Time Slot Label + Day Headers */}
                <div className="col-start-1 row-start-1 p-2 border-r border-b sticky top-0 bg-white z-10">
                  <div className="text-xs font-medium text-gray-500 h-12 flex items-end justify-center">Giờ</div>
                </div>
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const currentDate = new Date(weekBoundaries.startOfWeek || new Date()); // Fallback for safety
                  if (weekBoundaries.startOfWeek) currentDate.setDate(weekBoundaries.startOfWeek.getDate() + dayIndex);
                  const isToday = currentDate.toDateString() === new Date().toDateString();
                  return (
                    <div key={`header-${dayIndex}`} className={cn("col-start-auto row-start-1 p-2 border-b text-center sticky top-0 bg-white z-10", dayIndex < 6 && "border-r")}>
                      <div className="text-xs text-gray-500">{currentDate.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center mx-auto mt-1 text-xs", isToday ? "bg-primary text-white font-semibold" : "text-gray-900")}>
                        {currentDate.getDate()}
                      </div>
                    </div>
                  );
                })}

                {/* Grid Body: Time Slots and Events */}
                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeSlot}>
                    {/* Time label column */}
                    <div className={cn("row-start-auto col-start-1 border-r h-20 p-1 flex justify-end items-start", timeIndex < timeSlots.length - 1 && "border-b")}>
                      <div className="text-[10px] text-gray-400 -mt-1">{timeSlot}</div>
                    </div>
                    {/* Day columns for this time slot */}
                    {Array.from({ length: 7 }).map((_, dayIndexInWeek) => {
                      const eventsInCell = scheduleData.filter((event) =>
                        shouldShowEvent(event, timeSlot, dayIndexInWeek)
                      );
                      return (
                        <div key={`${timeSlot}-${dayIndexInWeek}`} className={cn("col-span-1 border-b border-r h-20 relative")}>
                          {eventsInCell.map((event, eventIdxInSlot) => {
                            const { height } = getEventUIDisplayProps(event);
                            const bgColorClass = getEventColor(event.status);
                            const positionStyle = calculateEventPositionStyle(eventsInCell.length, eventIdxInSlot);

                            return (
                              <div
                                key={event.id}
                                style={{ top: "1px", height, ...positionStyle }}
                                className={cn("absolute p-1 rounded border text-xs transition-colors cursor-pointer hover:opacity-80 overflow-hidden shadow-sm", bgColorClass)}
                                onClick={() => handleEventClick(event)}
                                title={`BN: ${event["patient-id"] || "N/A"}\nThời gian: ${new Date(event["est-date"]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\nTrạng thái: ${translateStatusToVietnamese(event.status)}`}
                              >
                                <p className="font-semibold mb-0.5 truncate text-[10px] leading-tight">Cuộc hẹn</p>
                                <div className="flex items-center gap-1 text-gray-600 mb-0.5 text-[9px] leading-tight">
                                  <Clock className="w-2 h-2 flex-shrink-0" />
                                  <span>{new Date(event["est-date"]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                                {/* <div className="flex items-center gap-1 text-gray-600 text-[9px] truncate leading-tight">
                                  <Users className="w-2 h-2 flex-shrink-0" />
                                  <span className="truncate">
                                    ĐD: {nurseIdToNameMap[event["nursing-id"]!] || (event["nursing-id"] ? `ID:${event["nursing-id"].slice(-4)}` : "Chưa có")}
                                  </span>
                                </div> */}
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

            {/* Fallback messages for invalid date or no data */}
            {!(selectedDate instanceof Date && !isNaN(selectedDate.getTime())) && (
              <div className="p-4 text-center text-gray-500">Vui lòng chọn một ngày hợp lệ.</div>
            )}
            {!isCalendarGridLoading && !appointmentError && scheduleData.length === 0 && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) && (
              <div className="p-4 text-center text-gray-500">Không có lịch hẹn nào cho tuần này hoặc theo bộ lọc đã chọn.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <EventDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedEventDetails(null); // Clear details when dialog closes
        }}
        event={selectedEventDetails}
        onAppointmentUpdated={handleAppointmentUpdated}
      />
    </div>
  );
};

export default NurseScheduleCalendar;