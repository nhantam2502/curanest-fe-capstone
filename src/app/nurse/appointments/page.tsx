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
import { Appointment } from "@/types/appointment";
import { useRouter } from "next/navigation";
import MiniCalendar from "@/app/components/Nursing/MiniCalendar";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { useSession } from "next-auth/react";
import { PatientRecord } from "@/types/patient";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduleEvent {
  id: string;
  estTimeFrom?: string;
  estTimeTo?: string;
  status: string;
  appointment_date: string;
  estDate?: string;
  cusPackageID: string;
  patientInfo?: PatientRecord;
}

// Định nghĩa các ca làm việc
const shifts = [
  { id: "morning", label: "Ca Sáng", timeStart: "08:00", timeEnd: "12:00" },
  { id: "afternoon", label: "Ca Chiều", timeStart: "13:00", timeEnd: "17:00" },
  { id: "evening", label: "Ca Tối", timeStart: "18:00", timeEnd: "22:00" },
];

const NurseScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState("morning");
  const router = useRouter();
  // Lấy session từ useSession
  const { data: session, status } = useSession();
  const nursingId = session?.user?.id || null;

  // Hàm tính thời gian kết thúc từ thời gian bắt đầu và thời lượng (tính bằng phút)
  const calculateEndTime = (startTimeStr: string, durationMinutes: number) => {
    const [hours, minutes] = startTimeStr.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    return `${endHours}:${endMinutes}`;
  };

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
          (item: any) => {
            const startTime = getStartTimeFromEstDate(item["est-date"]);
            const duration = item["total-est-duration"] || 0;
            const endTime = calculateEndTime(startTime, duration);

            return {
              id: item.id,
              patient_id: item["patient-id"] || "Chưa có thông tin",
              status: item.status,
              appointment_date: getFormattedDate(item["est-date"]),
              estTimeFrom: startTime,
              estTimeTo: endTime,
            };
          }
        );

        // Tạo một mảng tạm thời để lưu dữ liệu lịch trình
        const tempScheduleData: ScheduleEvent[] = [];

        // Lấy thông tin chi tiết cho từng bệnh nhân
        for (const item of response.payload.data) {
          const patientId = item["patient-id"];
          const startTime = getStartTimeFromEstDate(item["est-date"]);
          const duration = item["total-est-duration"] || 0;
          const endTime = calculateEndTime(startTime, duration);

          if (patientId && patientId !== "Chưa có thông tin") {
            try {
              const patientResponse =
                await patientApiRequest.getPatientRecordByID(patientId);
              const patientData: PatientRecord = patientResponse.payload.data;

              // Tạo object lịch trình với thông tin bệnh nhân
              tempScheduleData.push({
                id: item.id.toString(),
                estTimeFrom: startTime,
                estTimeTo: endTime,
                status: item.status,
                appointment_date: getFormattedDate(item["est-date"]),
                estDate: item["est-date"],
                cusPackageID: item["cuspackage-id"] || "N/A",
                patientInfo: patientData, // Lưu thông tin chi tiết của bệnh nhân
              });
            } catch (error) {
              console.error(
                `Error fetching patient data for ID ${patientId}:`,
                error
              );

              // Vẫn thêm vào dữ liệu lịch trình nhưng không có thông tin bệnh nhân
              tempScheduleData.push({
                id: item.id.toString(),
                estTimeFrom: startTime,
                estTimeTo: endTime,
                status: item.status,
                appointment_date: getFormattedDate(item["est-date"]),
                estDate: item["est-date"],
                cusPackageID: item["cuspackage-id"] || "N/A",
              });
            }
          } else {
            // Trường hợp không có patient_id
            tempScheduleData.push({
              id: item.id.toString(),
              estTimeFrom: startTime,
              estTimeTo: endTime,
              status: item.status,
              appointment_date: getFormattedDate(item["est-date"]),
              estDate: item["est-date"],
              cusPackageID: item["cuspackage-id"] || "N/A",
            });
          }
        }

        setAppointments(apiAppointments);
        setScheduleData(tempScheduleData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [nursingId, status]);

  // Phần còn lại của code giữ nguyên
  const handleDateSelect = (date: string) => {
    setSelectedDate(new Date(date));
  };

  const getEventColor = (type: Appointment["status"]) => {
    if (type === "substitute") return "bg-red-50 border-red-100";
    if (type === "completed") return "bg-green-50 border-green-100";
    if (type === "waiting") return "bg-yellow-50 border-yellow-100";
  };

  // Sửa hàm getTimeSlotsForShift để bao gồm cả thời điểm cuối
  const getTimeSlotsForShift = (shiftId: string) => {
    const selectedShift = shifts.find((shift) => shift.id === shiftId);
    if (!selectedShift) return [];

    const [startHour, startMinute] = selectedShift.timeStart
      .split(":")
      .map(Number);
    const [endHour, endMinute] = selectedShift.timeEnd.split(":").map(Number);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Tạo khoảng thời gian 15 phút và bao gồm cả thời điểm cuối
    const slots = [];
    for (let time = startTimeInMinutes; time <= endTimeInMinutes; time += 15) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      slots.push(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      );
    }

    return slots;
  };

  const getStartOfWeek = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start;
  };

  // Cập nhật hàm shouldShowEvent để hiển thị sự kiện từ thời gian bắt đầu đến kết thúc
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
    const [startHour, startMinutes] = (event.estTimeFrom ?? "00:00")
      .split(":")
      .map(Number);

    const slotTime = slotHour * 60 + slotMinutes;
    const startTime = startHour * 60 + startMinutes;

    return slotTime === startTime;
  };

  const calculateEventHeight = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 1;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Tính tổng số phút
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Tính số khoảng thời gian 15 phút (thay vì 30 phút)
    return Math.ceil((endMinutes - startMinutes) / 15);
  };

  // Lọc sự kiện theo ca làm việc hiện tại
  const filteredScheduleData = scheduleData.filter((event) => {
    if (!event.estTimeFrom) return false;

    const selectedShift = shifts.find((shift) => shift.id === activeShift);
    if (!selectedShift) return false;

    const [eventHour, eventMinute] = event.estTimeFrom.split(":").map(Number);
    const eventTimeInMinutes = eventHour * 60 + eventMinute;

    const [shiftStartHour, shiftStartMinute] = selectedShift.timeStart
      .split(":")
      .map(Number);
    const shiftStartInMinutes = shiftStartHour * 60 + shiftStartMinute;

    const [shiftEndHour, shiftEndMinute] = selectedShift.timeEnd
      .split(":")
      .map(Number);
    const shiftEndInMinutes = shiftEndHour * 60 + shiftEndMinute;

    return (
      eventTimeInMinutes >= shiftStartInMinutes &&
      eventTimeInMinutes <= shiftEndInMinutes
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get time slots for the active shift
  const timeSlots = getTimeSlotsForShift(activeShift);

  const renderShiftContent = (shiftId: string) => {
    const shiftTimeSlots = getTimeSlotsForShift(shiftId);

    return (
      <ScrollArea className="h-[calc(100vh-260px)]">
        <div className="grid grid-cols-8 min-w-[1000px]">
          <div className="col-span-1 p-4 border-r border-b border-t sticky left-0 bg-white z-10">
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
                className="col-span-1 p-4 border-b border-t border-r text-center bg-white z-10"
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
          {shiftTimeSlots.map((timeSlot) => (
            <React.Fragment key={timeSlot}>
              <div className="col-span-1 border-r border-b h-16 p-4 sticky left-0 bg-white z-10">
                <div className="text-sm text-gray-500">{timeSlot}</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${timeSlot}-${dayIndex}`}
                  className="col-span-1 border-b border-r h-16 relative flex items-center justify-center"
                >
                  {filteredScheduleData.map((event) => {
                    if (shouldShowEvent(event, timeSlot, dayIndex)) {
                      const eventHeight = calculateEventHeight(
                        event.estTimeFrom || "",
                        event.estTimeTo || ""
                      );

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "w-11/12 p-2 rounded-md border shadow-sm transition-all cursor-pointer hover:bg-opacity-90 hover:shadow-md absolute z-10",
                            getEventColor(event.status)
                          )}
                          style={{
                            height: `${eventHeight * 4.7}rem`, // 4rem là chiều cao của mỗi khoảng thời gian 15 phút (h-16)
                            top: 2,
                            left: "4%", // Để căn giữa trong ô
                          }}
                          onClick={() =>
                            router.push(
                              `/nurse/appointments/${event.patientInfo?.id}?estDate=${encodeURIComponent(event.estDate || "")}&cusPackageID=${encodeURIComponent(event.cusPackageID || "")}&estTimeFrom=${encodeURIComponent(event.estTimeFrom || "")}&estTimeTo=${encodeURIComponent(event.estTimeTo || "")}`
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <div className="text-sm leading-tight">
                                {event.estTimeFrom} - {event.estTimeTo}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mt-2">
                            <Users className="w-3 h-3 text-gray-600 flex-shrink-0" />
                            <div>
                              <span className="text-xs font-medium truncate">
                                {event.patientInfo?.["full-name"]}
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
      </ScrollArea>
    );
  };

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

          <div className="p-4 border-b">
            <Tabs
              defaultValue="morning"
              value={activeShift}
              onValueChange={setActiveShift}
            >
              <TabsList className="grid grid-cols-3">
                {shifts.map((shift) => (
                  <TabsTrigger key={shift.id} value={shift.id}>
                    {shift.label} ({shift.timeStart} - {shift.timeEnd})
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* TabsContent components với ScrollArea */}
              {shifts.map((shift) => (
                <TabsContent key={shift.id} value={shift.id} className="mt-5">
                  {renderShiftContent(shift.id)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NurseScheduleCalendar;
