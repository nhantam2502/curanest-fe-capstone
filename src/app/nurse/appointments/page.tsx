"use client";
import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Bell,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppointmentSchedule from "@/app/components/Nursing/AppointmentSchedule";
import DonutChart from "@/app/components/Nursing/DonutChart";
import {
  Appointment,
  CalendarViewType,
  ScheduleEvent,
} from "@/types/appointment";

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>("WEEK");

  // Dữ liệu mẫu cho appointments
  const appointments: Appointment[] = [
    {
      id: 1,
      nurse_name: "Nguyễn Văn A",
      avatar: "/avatar1.jpg",
      status: "completed",
      phone_number: "0123456789",
      techniques: "Kỹ thuật 1",
      total_fee: 1000000,
      appointment_date: "2024-09-20",
      time_from_to: "8:00-10:00",
    },
    // Thêm các appointment khác nếu cần
  ];

  // Dữ liệu mẫu cho schedule events
  const scheduleData: ScheduleEvent[] = [
    {
      id: "1",
      title: "Viết Nâng Cao - Sáng tạo",
      startTime: "8:00",
      endTime: "10:00",
      type: "normal",
      participants: 3,
      classType: "writing",
    },
    {
      id: "2",
      title: "Nói Nâng Cao",
      startTime: "8:00",
      endTime: "10:00",
      type: "normal",
      participants: 3,
      classType: "speaking",
    },
    {
      id: "3",
      title: "Nghe Nâng Cao",
      startTime: "13:30",
      endTime: "15:30",
      type: "makeup",
      participants: 3,
      classType: "listening",
    },
  ];

  const handleDateSelect = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(new Date(date));
  };

  const getEventColor = (
    type: ScheduleEvent["type"],
    classType: ScheduleEvent["classType"]
  ) => {
    if (type === "substitute") return "bg-red-50 border-red-100";
    switch (classType) {
      case "writing":
        return "bg-orange-50 border-orange-100";
      case "speaking":
        return "bg-blue-50 border-blue-100";
      case "listening":
        return "bg-yellow-50 border-yellow-100";
      default:
        return "bg-gray-50";
    }
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 7}:00`);

  const getStartOfWeek = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Tính thứ Hai
    start.setDate(diff);
    return start;
  };

  const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(date);
    const end = new Date(startOfWeek);
    end.setDate(startOfWeek.getDate() + 6); // Thêm 6 ngày để có Chủ nhật
    return end;
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="flex gap-4 h-full">
        {/* Left Sidebar */}
        <Card className="w-72 h-full">
          <CardHeader className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Lịch của bạn</span>
              </div>
              <span className="text-xs text-gray-500">
                120 ca đã được lên lịch
              </span>
            </div>
            {/* Mini calendar */}
            <AppointmentSchedule
              appointments={appointments}
              onDateSelect={(date) => handleDateSelect(date)}
            />

            {/* Summary */}
            <DonutChart value={44} total={100} />
          </CardHeader>
        </Card>

        {/* Main Calendar Area */}
        <Card className="flex-1 h-full">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Hôm nay
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const previousMonth = new Date(selectedDate);
                    previousMonth.setMonth(selectedDate.getMonth() - 1);
                    setSelectedDate(previousMonth);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const nextMonth = new Date(selectedDate);
                    nextMonth.setMonth(selectedDate.getMonth() + 1);
                    setSelectedDate(nextMonth);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <span className="text-lg font-medium">
                  {selectedDate.toLocaleDateString("vi-VN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Nút thông báo */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("Notification button clicked");
                    // Thêm logic mở/tắt thông báo ở đây
                  }}
                >
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 overflow-auto">
            <div className="grid grid-cols-8 gap-4 min-w-[1000px]">
              {/* Time column */}
              <div className="space-y-16 pt-10">
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = 8 + i;
                  const time = `${hour}:00`;
                  return (
                    <div
                      key={time}
                      className="text-sm text-gray-500 -translate-y-3"
                    >
                      {time}
                    </div>
                  );
                })}
              </div>

              {/* Days columns */}
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const startOfWeek = getStartOfWeek(selectedDate);
                const currentDate = new Date(startOfWeek);
                currentDate.setDate(startOfWeek.getDate() + dayIndex);
                const isToday =
                  currentDate.toDateString() === new Date().toDateString();

                return (
                  <div key={dayIndex} className="relative min-h-[600px]">
                    {/* Date header */}
                    <div className="text-sm text-center pb-1 border-b">
                      <div className="text-gray-500">
                        {currentDate.toLocaleDateString("vi-VN", {
                          weekday: "short",
                        })}
                      </div>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                          isToday ? "bg-blue-100" : ""
                        )}
                      >
                        {currentDate.getDate()}
                      </div>
                    </div>

                    {/* Events */}
                    {scheduleData.map((event) => {
                      const startHour = parseInt(event.startTime.split(":")[0]);
                      const endHour = parseInt(event.endTime.split(":")[0]);
                      const duration = endHour - startHour;

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "absolute left-2 right-2 p-3 rounded-lg border",
                            getEventColor(event.type, event.classType)
                          )}
                          style={{
                            top: `${(startHour - 7) * 64 + 48}px`,
                            height: `${duration * 64}px`,
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {event.startTime} - {event.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Users className="w-3 h-3" />
                            <div className="flex -space-x-2">
                              {Array.from({ length: event.participants }).map(
                                (_, i) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded-full bg-gray-200 border border-white"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseScheduleCalendar;
