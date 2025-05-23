import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { Appointment } from "@/types/appointment";
import {
  formatDate,
  getFormattedDate,
  getStartTimeFromEstDate,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeTableNurseProps {
  nurseId: string;
}

type TimeRange = "morning" | "afternoon" | "evening";

const TimeTableNurse = ({ nurseId }: TimeTableNurseProps) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState(() => getDates(0));
  const [weekRange, setWeekRange] = useState(() => getWeekRange(0));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>("morning");

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

        if (!nurseId) {
          throw new Error("Nursing ID not found");
        }

        const response = await appointmentApiRequest.getAppointment(nurseId);

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

        setAppointments(apiAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [nurseId]);



  function getDates(offset = 0) {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay() || 7;
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1 + offset);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const formattedDate = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      dates.push(formattedDate);
    }

    return dates;
  }

  function getWeekRange(offset = 0) {
    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay() || 7;
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1 + offset);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      from: startOfWeek.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      to: endOfWeek.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  }

  const changeWeek = (direction: "prev" | "next") => {
    const newOffset = direction === "prev" ? weekOffset - 7 : weekOffset + 7;
    setWeekOffset(newOffset);
    setWeekDays(getDates(newOffset));
    setWeekRange(getWeekRange(newOffset));
  };

  // Tạo khung giờ theo thời gian biểu
  const generateTimeSlots = (
    start: string,
    end: string,
    intervalMinutes: number = 30
  ): string[] => {
    const slots: string[] = [];
    let current = new Date(`2023-01-01T${start}:00`);
    const endTime = new Date(`2023-01-01T${end}:00`);

    while (current < endTime) {
      const next = new Date(current.getTime() + intervalMinutes * 60000);
      const format = (d: Date) => d.toTimeString().slice(0, 5);
      slots.push(`${format(current)} - ${format(next)}`);
      current = next;
    }

    return slots;
  };

  // Tạo khung giờ theo ca
  const getMorningSlots = () => generateTimeSlots("08:00", "12:00", 15);
  const getAfternoonSlots = () => generateTimeSlots("12:00", "17:00", 15);
  const getEveningSlots = () => generateTimeSlots("17:00", "22:00", 15);

  const formatShiftDate = (date: string) => date;

  // Lấy khung giờ của ca đang được chọn
  const getActiveTimeSlots = () => {
    switch (activeTimeRange) {
      case "morning":
        return getMorningSlots();
      case "afternoon":
        return getAfternoonSlots();
      case "evening":
        return getEveningSlots();
      default:
        return getMorningSlots();
    }
  };

  const timeSlots = getActiveTimeSlots();

const hasAppointmentsInTimeRange = (range: TimeRange) => {
  const [startHour, endHour] = {
    morning: [8, 12],
    afternoon: [12, 17],
    evening: [17, 22],
  }[range];

  const currentWeekAppointments = appointments.filter((apt) => {
    if (!apt.appointment_date) return false;

    const aptDate = new Date(apt.appointment_date);
    if (isNaN(aptDate.getTime())) return false;

    const formattedAptDate = formatDate(aptDate);
    const isInWeek = weekDays.includes(formattedAptDate);

    return isInWeek;
  });

  return currentWeekAppointments.some((apt) => {
    if (!apt.estTimeFrom || !apt.estTimeTo) return false;

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const aptStartMinutes = toMinutes(apt.estTimeFrom);
    const aptEndMinutes = toMinutes(apt.estTimeTo);
    const rangeStartMinutes = startHour * 60;
    const rangeEndMinutes = endHour * 60;

    const hasOverlap = aptStartMinutes < rangeEndMinutes && aptEndMinutes > rangeStartMinutes;
    // console.log(`Checking ${range} for ${apt.estTimeFrom}-${apt.estTimeTo}:`, hasOverlap);
    return hasOverlap;
  });
};


  // Render bảng lịch trình
  const renderScheduleTable = () => {
    return (
      <div className="mt-4">
        <ScrollArea className="h-96">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border bg-gray-100"></th>
                {weekDays.map((day, index) => (
                  <th
                    key={index}
                    className="text-lg border py-2 bg-gray-100 text-center"
                  >
                    {index < 6 ? `Thứ ${index + 2}` : "Chủ nhật"}
                    <p className="mt-1">{day}</p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((hour) => (
                <tr key={hour}>
                  <td className="text-lg border border-gray-300 font-semibold text-gray-600 text-center">
                    {hour}
                  </td>
                  {weekDays.map((day) => {
                    const appointment = appointments.find((apt) => {
                      let formattedDate = "";
                      if (apt.appointment_date) {
                        const date = new Date(apt.appointment_date);
                        if (!isNaN(date.getTime())) {
                          formattedDate = formatDate(date);
                        }
                      }
                      const isSameDay = formattedDate === formatShiftDate(day);

                      const [start, end] = hour
                        .split(" - ")
                        .map((time) => time.trim());

                      if (!apt.estTimeFrom || !apt.estTimeTo) return false;

                      // Kiểm tra xem cuộc hẹn có nằm trong khung giờ này không
                      const appointmentStart = apt.estTimeFrom;
                      const appointmentEnd = apt.estTimeTo;

                      const hasOverlap =
                        (appointmentStart <= start && appointmentEnd > start) ||
                        (appointmentStart >= start && appointmentStart < end);

                      return isSameDay && hasOverlap;
                    });

                    const hasAppointment = appointment !== undefined;

                    return (
                      <td
                        key={`${day}-${hour}`}
                        className={`border border-gray-300 p-1 text-center ${
                          hasAppointment ? "bg-yellow-100" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-center p-4 rounded-lg">
                          {hasAppointment && (
                            <span className="text-yellow-700 font-bold">
                              {appointment["patient-id"]}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => changeWeek("prev")}
          className="px-5 py-5 rounded-lg shadow-md text-xl"
          disabled={weekOffset === 0}
        >
          Tuần trước
        </Button>
        <p className="text-xl font-semibold">
          {weekRange.from} - {weekRange.to}
        </p>
        <Button
          onClick={() => changeWeek("next")}
          className="px-5 py-5 rounded-lg shadow-md text-xl"
          disabled={weekOffset === 7}
        >
          Tuần kế tiếp
        </Button>
      </div>

      {/* Bộ chọn khung giờ sử dụng Tabs của Shadcn/UI */}
      <Tabs
        value={activeTimeRange}
        onValueChange={(value) => setActiveTimeRange(value as TimeRange)}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="morning" className="text-lg relative">
            Buổi sáng (8h-12h)
            {hasAppointmentsInTimeRange("morning") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="afternoon" className="text-lg relative">
            Buổi chiều (12h-17h)
            { hasAppointmentsInTimeRange("afternoon") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="evening" className="text-lg relative">
            Buổi tối (17h-22h)
            {hasAppointmentsInTimeRange("evening") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : (
            renderScheduleTable()
          )}
        </TabsContent>

        <TabsContent value="afternoon">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : (
            renderScheduleTable()
          )}
        </TabsContent>

        <TabsContent value="evening">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : (
            renderScheduleTable()
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-gray-50 border border-gray-300"></span>
            <span className="text-gray-700 font-bold text-lg">Lịch trống</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-yellow-100 border border-gray-300"></span>
            <span className="text-yellow-700 font-bold text-lg">
              Có người đặt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableNurse;