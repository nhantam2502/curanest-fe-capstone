"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Bell,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, getFormattedDate, getStartTimeFromEstDate } from "@/lib/utils";
import DonutChart from "@/app/components/Nursing/DonutChart";
import { Appointment, ScheduleEvent } from "@/types/appointment";
import { useRouter } from "next/navigation";
import MiniCalendar from "@/app/components/Nursing/MiniCalendar";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { useSession } from "next-auth/react";

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Lấy session từ useSession
  const { data: session, status } = useSession();
  const nursingId = session?.user?.id || null;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        if (status === "loading") {
          return;
        }
        if (!nursingId) {
          throw new Error("Nursing ID not found in session");
        }

        const response = await appointmentApiRequest.getAppointment(nursingId);

        const apiAppointments: Appointment[] = response.payload.data.map(
          (item: any) => ({
            id: item.id,
            patient_id: item["patient-id"] || "Chưa có thông tin",
            status: item.status,
            appointment_date: getFormattedDate(item["est-date"]),
            time_from_to: getStartTimeFromEstDate(item["est-date"]),
          })
        );

        const apiScheduleData: ScheduleEvent[] = response.payload.data.map(
          (item: any) => ({
            id: item.id.toString(),
            title: item.techniques || "Chưa xác định",
            startTime: getStartTimeFromEstDate(item["est-date"]),
            status: item.status,
            name: item.nurse_name || "Chưa có thông tin",
            appointment_date: getFormattedDate(item["est-date"]),
            estDate: item["est-date"], // Thêm estDate
            cusPackageID: item["cuspackage-id"] || "N/A",
          })
        );

        setAppointments(apiAppointments);
        setScheduleData(apiScheduleData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, nursingId, status]);

  // console.log("Appointments:", appointments);
  console.log("Schedule Data:", scheduleData);

  // Phần còn lại của code giữ nguyên
  const handleDateSelect = (date: string) => {
    // console.log("Selected date:", date);
    setSelectedDate(new Date(date));
  };

  const getEventColor = (type: Appointment["status"]) => {
    if (type === "substitute") return "bg-red-50 border-red-100";
    if (type === "completed") return "bg-green-50 border-green-100";
    if (type === "waiting") return "bg-yellow-50 border-yellow-100";
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

  const getStartOfWeek = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  };

  const shouldShowEvent = (
    event: ScheduleEvent,
    timeSlot: string,
    dayIndex: number
  ) => {
    const currentDate = new Date(getStartOfWeek(selectedDate));
    currentDate.setDate(currentDate.getDate() + dayIndex);
    const eventDate = new Date(event.appointment_date);

    if (currentDate.toDateString() !== eventDate.toDateString()) return false;

    const [slotHour, slotMinutes] = timeSlot.split(":").map(Number);
    const [startHour, startMinutes] = event.startTime.split(":").map(Number);

    const slotTime = slotHour * 60 + slotMinutes;
    const startTime = startHour * 60 + startMinutes;

    return slotTime === startTime;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <div className="flex gap-4 h-full">
        <Card className="w-72 h-full">
          <CardHeader className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">
                  Lịch hẹn với bệnh nhân
                </span>
              </div>
            </div>
            <MiniCalendar
              appointments={appointments}
              onDateSelect={(date) => handleDateSelect(date)}
            />
            <DonutChart value={44} total={100} />
          </CardHeader>
        </Card>
        <Card className="flex-1 h-full shadow-lg">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Hôm nay
                </Button>
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white"
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 7);
                      setSelectedDate(prev);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white"
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 7);
                      setSelectedDate(next);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-lg font-medium">
                  {selectedDate.toLocaleDateString("vi-VN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Thông báo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-auto">
            <div className="grid grid-cols-8 min-w-[1000px]">
              <div className="col-span-1 p-4 border-r border-b">
                <div className="text-sm font-medium text-gray-500">Giờ</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const currentDate = new Date(getStartOfWeek(selectedDate));
                currentDate.setDate(currentDate.getDate() + dayIndex);
                const isToday =
                  currentDate.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={dayIndex}
                    className="col-span-1 p-4 border-b text-center"
                  >
                    <div className="text-sm text-gray-500">
                      {currentDate.toLocaleDateString("vi-VN", {
                        weekday: "short",
                      })}
                    </div>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1",
                        isToday
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-900"
                      )}
                    >
                      {currentDate.getDate()}
                    </div>
                  </div>
                );
              })}
              {timeSlots.map((timeSlot) => (
                <React.Fragment key={timeSlot}>
                  <div className="col-span-1 border-r border-b h-20 p-4">
                    <div className="text-sm text-gray-500">{timeSlot}</div>
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div
                      key={`${timeSlot}-${dayIndex}`}
                      className="col-span-1 border-b border-r h-20 relative flex items-center justify-center"
                    >
                      {scheduleData.map((event) => {
                        if (shouldShowEvent(event, timeSlot, dayIndex)) {
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "w-11/12 p-2 rounded-md border shadow-sm transition-all cursor-pointer hover:bg-opacity-90 hover:shadow-md",
                                getEventColor(event.status)
                              )}
                              onClick={() =>
                                router.push(
                                  `/nurse/appointments/${event.id}?estDate=${encodeURIComponent(event.estDate || "")}&cusPackageID=${encodeURIComponent(event.cusPackageID || "")}`
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 flex-shrink-0 text-gray-600" />
                                <div className="min-w-0">
                                  <div className="text-sm leading-tight">
                                    {event.startTime}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 mt-2">
                                {/* <Users className="w-3 h-3 text-gray-600 flex-shrink-0" /> */}
                                <div>
                                  <span className="text-xs font-medium truncate">
                                    {event.name}
                                  </span>
                                </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseScheduleCalendar;
