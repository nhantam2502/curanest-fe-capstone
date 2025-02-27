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
import { Appointment, ScheduleEvent } from "@/types/appointment";

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dữ liệu mẫu cho appointments
  const appointments: Appointment[] = [
    {
      id: 1,
      nurse_name: "Nguyễn Văn A",
      avatar: "/avatar1.jpg",
      status: "completed",
      phone_number: "0123456789",
      techniques: "Chăm sóc bệnh nhân",
      total_fee: 500000,
      appointment_date: "2025-01-24",
      time_from_to: "8:00-10:00",
    },
    {
      id: 2,
      nurse_name: "Trần Thị B",
      avatar: "/avatar2.jpg",
      status: "upcoming",
      phone_number: "0987654321",
      techniques: "Tiêm thuốc",
      total_fee: 300000,
      appointment_date: "2025-01-26",
      time_from_to: "10:00-10:30",
    },
  ];

  // Dữ liệu mẫu cho schedule events
  const scheduleData: ScheduleEvent[] = [
    {
      id: "1",
      title: "Thay băng vết thương",
      startTime: "8:00",
      endTime: "9:00",
      status: "completed",
      participants: 1,
      classType: "wound-care",
      appointment_date: "2025-01-24",
    },
    {
      id: "2",
      title: "Tiêm thuốc",
      startTime: "10:00",
      endTime: "10:30",
      status: "upcoming",
      participants: 1,
      classType: "injection",
      appointment_date: "2025-01-26",
    },
  ];

  const handleDateSelect = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(new Date(date));
  };

  const getEventColor = (
    type: ScheduleEvent["status"],
    classType: ScheduleEvent["classType"]
  ) => {
    if (type === "substitute") return "bg-red-50 border-red-100";
    if (type === "completed") return "bg-green-50 border-green-100";
    if (type === "upcoming") return "bg-yellow-50 border-yellow-100";
    switch (classType) {
      case "wound-care":
        return "bg-green-50 border-green-100";
      case "injection":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-gray-50";
    }
  };

  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });


  const getStartOfWeek = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  };

  // const getEndOfWeek = (date: Date): Date => {
  //   const startOfWeek = getStartOfWeek(date);
  //   const end = new Date(startOfWeek);
  //   end.setDate(startOfWeek.getDate() + 6);
  //   return end;
  // };

  const shouldShowEvent = (
    event: ScheduleEvent,
    timeSlot: string,
    dayIndex: number
  ) => {
    const currentDate = new Date(getStartOfWeek(selectedDate));
    currentDate.setDate(currentDate.getDate() + dayIndex);
    const eventDate = new Date(event.appointment_date);

    // Kiểm tra ngày
    if (currentDate.toDateString() !== eventDate.toDateString()) return false;

    const [slotHour, slotMinutes] = timeSlot.split(":").map(Number);
    const [startHour, startMinutes] = event.startTime.split(":").map(Number);
    const [endHour, endMinutes] = event.endTime.split(":").map(Number);

    const slotTime = slotHour * 60 + slotMinutes;
    const startTime = startHour * 60 + startMinutes;
    const endTime = endHour * 60 + endMinutes;

    return slotTime === startTime;
  };

 const getEventDuration = (event: ScheduleEvent) => {
    const [startHour, startMinutes] = event.startTime.split(":" ).map(Number);
    const [endHour, endMinutes] = event.endTime.split(":" ).map(Number);

    const startTime = startHour * 60 + startMinutes;
    const endTime = endHour * 60 + endMinutes;

    return (endTime - startTime) / 30 ;
  };


  return (
    <div className="w-full h-full bg-gray-100 p-4">
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
              {/* Header row with time label and days */}
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

              {/* Time slots */}
              {timeSlots.map((timeSlot, index) => (
                <React.Fragment key={timeSlot}>
                  <div className="col-span-1 border-r border-b h-20 p-4">
                    <div className="text-sm text-gray-500">{timeSlot}</div>
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div
                      key={`${timeSlot}-${dayIndex}`}
                      className="col-span-1 border-b border-r h-20 relative"
                    >
                      {scheduleData.map((event) => {
                        if (shouldShowEvent(event, timeSlot, dayIndex)) {
                          const duration = getEventDuration(event);
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "absolute left-1 right-1 p-2 rounded-lg border transition-colors",
                                getEventColor(event.status, event.classType)
                              )}
                              style={{
                                top: "4px",
                                height: `calc(${duration} * 5rem - 8px)`,
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
                                  {Array.from({
                                    length: event.participants,
                                  }).map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-4 h-4 rounded-full bg-white border border-gray-200"
                                    />
                                  ))}
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
