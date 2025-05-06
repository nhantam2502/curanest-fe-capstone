"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, CircleX } from "lucide-react";
import { cn, createISOString } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import StartTimeSelection from "./StartTimeSelection";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { NurseItemType } from "@/types/nurse";
import AvailabilityDialog from "./ChangeNurse";

export interface TimeSlot {
  start: string;
  end: string;
  display: string;
  value: string;
}

interface SelectedDateTime {
  date: Date;
  timeSlot: TimeSlot;
  isoString: string;
}

interface TimeSelectionProps {
  totalTime: number;
  onTimeSelect: (datetime: SelectedDateTime) => void;
  selectedNurse: NurseItemType | null;
  serviceID: string | null;
  onNurseSelect: (nurse: NurseItemType) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  totalTime = 60,
  onTimeSelect,
  selectedNurse,
  serviceID,
  onNurseSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [isNurseAvailable, setIsNurseAvailable] = useState<boolean | null>(null);
  const [availableNurses, setAvailableNurses] = useState<NurseItemType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Function to verify nurse availability
  const verifyNurseAvailability = useCallback(
    async (date: Date, timeSlot: TimeSlot) => {
      if (!selectedNurse) return;

      try {
        setLoading(true);
        setError(null);
        const isoString = createISOString(date, timeSlot);
        const body = {
          "nurses-dates": [
            {
              "nurse-id": selectedNurse["nurse-id"],
              "est-duration": totalTime,
              "est-start-date": isoString,
            },
          ],
        };

        const response = await appointmentApiRequest.verifyNurse(body);
        const isAvailable = response.payload.data[0]?.["is-availability"] || false;
        setIsNurseAvailable(isAvailable);
        if (!isAvailable) {
          setDialogOpen(true); // Open dialog to select a new nurse
        }
      } catch (error) {
        console.error("Verify nurse error:", error);
        setError("Không thể kiểm tra tính khả dụng của điều dưỡng");
        setDialogOpen(true); // Open dialog on error to allow nurse selection
      } finally {
        setLoading(false);
      }
    },
    [selectedNurse, totalTime]
  );

  // Function to fetch available nurses
  const fetchAvailableNurses = useCallback(async (date: Date, timeSlot: TimeSlot) => {
    if (!serviceID) {
      setError("Không có thông tin dịch vụ");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const isoString = createISOString(date, timeSlot);
      const response = await appointmentApiRequest.getNurseAvailable(
        serviceID,
        isoString,
        totalTime
      );

      if (response?.payload?.data) {
        setAvailableNurses(
          response.payload.data.map((nurse: NurseItemType) => ({
            "nurse-id": nurse["nurse-id"],
            "nurse-picture": nurse["nurse-picture"],
            "nurse-name": nurse["nurse-name"],
            gender: nurse.gender,
            "current-work-place": nurse["current-work-place"],
            rate: nurse.rate,
          }))
        );
      } else {
        setError("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching available nurses:", err);
      setError("Đã xảy ra lỗi khi tải danh sách điều dưỡng");
    } finally {
      setLoading(false);
    }
  }, [serviceID, totalTime]);

  // Trigger fetchAvailableNurses when dialog opens
  useEffect(() => {
    if (dialogOpen && selectedDate && selectedTimeSlot) {
      fetchAvailableNurses(selectedDate, selectedTimeSlot);
    }
  }, [dialogOpen, selectedDate, selectedTimeSlot, fetchAvailableNurses]);

  // Function to get the days in the next 15 days
  const getDaysInWeek = (): Date[] => {
    const days: Date[] = [];
    const startOfWeek = new Date();

    for (let i = 0; i <= 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Function to generate available time slots based on start time
  const getTimeSlots = (startTimeStr: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHourNum, startMinute] = startTimeStr.split(":").map(Number);
    const startTime = startHourNum * 60 + startMinute;
    const endTime = 20 * 60; // 20:00 PM

    const interval = 30; // 30 minutes intervals

    for (let i = startTime; i <= endTime - totalTime; i += interval) {
      const startHour = Math.floor(i / 60);
      const startMinute = i % 60;
      const endHour = Math.floor((i + totalTime) / 60);
      const endMinute = (i + totalTime) % 60;

      const timeSlot: TimeSlot = {
        start: `${startHour.toString().padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")}`,
        end: `${endHour.toString().padStart(2, "0")}:${endMinute
          .toString()
          .padStart(2, "0")}`,
        display: `${startHour.toString().padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")} - ${endHour
          .toString()
          .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
        value: `${startHour.toString().padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")}-${endHour
          .toString()
          .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
      };

      slots.push(timeSlot);
    }
    return slots;
  };

  // Function to format the date
  const formatDate = (date: Date): { day: number; dayName: string } => {
    const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    return {
      day: date.getDate(),
      dayName: days[date.getDay()],
    };
  };

  // Vietnamese month names
  const vietnameseMonths = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Get the current month and year in Vietnamese
  const currentMonth = selectedDate
    ? vietnameseMonths[selectedDate.getMonth()]
    : vietnameseMonths[new Date().getMonth()];
  const currentYear = selectedDate
    ? selectedDate.getFullYear()
    : new Date().getFullYear();

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    const isoString = createISOString(selectedDate, slot);
    const datetime: SelectedDateTime = {
      date: selectedDate,
      timeSlot: slot,
      isoString,
    };
    onTimeSelect(datetime);
    if (selectedNurse) {
      verifyNurseAvailability(selectedDate, slot);
    }
  };

  // Handle nurse selection from dialog
  const handleSelectNurse = (nurse: NurseItemType) => {
    onNurseSelect(nurse);
    setDialogOpen(false);
    setIsNurseAvailable(true); // Assume new nurse is available
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold">Chọn thời gian</h2>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-12 h-12 px-0 py-0">
              <CalendarIcon className="h-10 w-10" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                  setSelectedTimeSlot(null);
                  setIsNurseAvailable(null);
                }
              }}
              locale={vi}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Display current month and year in Vietnamese */}
      <div className="text-2xl font-semibold">
        <span>{`${currentMonth} ${currentYear}`}</span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 mb-4">
          {getDaysInWeek().map((date) => {
            const formattedDate = formatDate(date);
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();

            return (
              <Button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(null);
                  setIsNurseAvailable(null);
                }}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center w-24 h-24 rounded-full",
                  isSelected && "bg-primary text-white"
                )}
              >
                <span className="text-3xl font-bold">{formattedDate.day}</span>
                <span className="text-base">{formattedDate.dayName}</span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedDate && (
        <StartTimeSelection
          startTime={startTime}
          onStartTimeChange={(newTime) => {
            setStartTime(newTime);
            setSelectedTimeSlot(null);
            setIsNurseAvailable(null);
          }}
        />
      )}

      {selectedDate && startTime && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Khung giờ có sẵn (Tổng thời gian dịch vụ:{" "}
            <span className="text-red-500">{totalTime} phút</span>)
          </h3>
          {selectedNurse && isNurseAvailable !== null && (
            <div className="mb-4 flex items-center gap-2">
              {isNurseAvailable ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <CircleX className="h-6 w-6 text-red-500" />
              )}
              <p className="text-lg">
                {isNurseAvailable
                  ? `Điều dưỡng ${selectedNurse["nurse-name"]} khả dụng`
                  : `Điều dưỡng ${selectedNurse["nurse-name"]} không khả dụng`}
              </p>
            </div>
          )}
          <div className="grid grid-cols-5 gap-4">
            {getTimeSlots(startTime).map((slot) => (
              <Button
                key={slot.display}
                variant={
                  selectedTimeSlot?.display === slot.display
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "rounded-full text-xl py-3 px-6",
                  selectedTimeSlot?.display === slot.display &&
                    "bg-primary text-white"
                )}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={loading}
              >
                {slot.display}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Availability Dialog */}
      <AvailabilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        sessionIndex={0} // Assuming single session for simplicity
        loading={loading}
        error={error}
        onSelectNurse={handleSelectNurse}
      />
    </div>
  );
};

export default TimeSelection;