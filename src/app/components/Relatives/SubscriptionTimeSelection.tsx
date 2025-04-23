import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  isSameDay,
  isAfter,
} from "date-fns";
import { vi } from "date-fns/locale";
import StartTimeSelection from "./StartTimeSelection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TimeSlot {
  start: string;
  end: string;
  display?: string;
  value?: string;
}

export interface SelectedDateTime {
  date: Date;
  timeSlot: TimeSlot;
  isoString?: string;
}

interface SubscriptionTimeSelectionProps {
  totalTime: number;
  timeInterval: number;
  comboDays: number;
  onTimesSelect: (datetimes: SelectedDateTime[]) => void;
}

const SubscriptionTimeSelection: React.FC<SubscriptionTimeSelectionProps> = ({
  totalTime,
  timeInterval,
  comboDays,
  onTimesSelect,
}) => {
  const [selectedDates, setSelectedDates] = useState<SelectedDateTime[]>([]);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [expandedDays, setExpandedDays] = useState<string>("0");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

 // Function to get the days in the next 14 days
const getDaysInRange = (): Date[] => {
  const days: Date[] = [];
  const startOfRange = new Date();

  for (let i = 0; i <= 14; i++) {
    const date = new Date(startOfRange);
    date.setDate(startOfRange.getDate() + i);
    days.push(date);
  }
  return days;
};

  // Function to generate available time slots based on start time
  const getTimeSlots = (startTimeStr: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHourNum, startMinute] = startTimeStr.split(":").map(Number);
    const startTime = startHourNum * 60 + startMinute;
    const endTime = 22 * 60; 

    const interval = 30; 

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

  // Function to convert date and time slot to ISO string format
  const createISOString = (date: Date, timeSlot: TimeSlot): string => {
    const [hours, minutes] = timeSlot.start.split(":").map(Number);

    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, 0, 0);

    // Convert to UTC for backend: 2025-03-30T03:00:00Z format
    return dateObj.toISOString();
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date) => {
    setActiveDate(date);
    setCalendarOpen(false);
    setSelectedTimeSlot(null);
  };

  // Function to handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);

    // If editing an existing session
    if (editingIndex !== null) {
      // Create ISO string for the edited date and time
      const isoString = createISOString(selectedDates[editingIndex].date, timeSlot);

      // Update only the time slot for this specific session
      const updatedDates = [...selectedDates];
      updatedDates[editingIndex] = {
        ...updatedDates[editingIndex],
        timeSlot: timeSlot,
        isoString: isoString,
      };

      setSelectedDates(updatedDates);
      setEditingIndex(null);
      
      // Notify parent component of the selection
      onTimesSelect(updatedDates);
      return;
    }

    // Create ISO string for the selected date and time
    const isoString = createISOString(activeDate, timeSlot);

    const newSelection: SelectedDateTime = {
      date: activeDate,
      timeSlot: timeSlot,
      isoString: isoString,
    };

    // Update the selected dates array
    const updatedDates: SelectedDateTime[] = [];

    // Add the first date with selected time slot
    updatedDates.push(newSelection);

    // Calculate and add the remaining dates with the same time slot
    for (let i = 1; i < comboDays; i++) {
      const nextDate = addDays(activeDate, (timeInterval + 1) * i);
      const nextIsoString = createISOString(nextDate, timeSlot);

      updatedDates.push({
        date: nextDate,
        timeSlot: timeSlot,
        isoString: nextIsoString,
      });
    }

    setSelectedDates(updatedDates);

    // Notify parent component of the selection
    onTimesSelect(updatedDates);
  };

  // Function to edit a specific session
  const handleEditSession = (index: number) => {
    setEditingIndex(index);
    setExpandedDays(index.toString());
    
    // Set the current session's time slot as selected
    setSelectedTimeSlot(selectedDates[index].timeSlot);
  };

  // Function to check if a date is already selected
  const isDateAlreadySelected = (
    date: Date,
    datesList: SelectedDateTime[] = selectedDates
  ): boolean => {
    return datesList.some((selectedDate) => isSameDay(selectedDate.date, date));
  };

  // Function to get the formatted date for display
  const getFormattedDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  // Function to check if a date is already selected with a time slot
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(
      (selectedDate) =>
        isSameDay(selectedDate.date, date) && selectedDate.timeSlot !== null
    );
  };

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    // Không cho phép chọn các ngày trong quá khứ
    if (date < new Date()) return true;

    // Không cho phép chọn các ngày đã được chọn
    if (isDateAlreadySelected(date)) return true;

    return false;
  };

  // Function to get the day number (1-based) for a selected date
  const getSelectedDayNumber = (date: Date): number | null => {
    const index = selectedDates.findIndex((selectedDate) =>
      isSameDay(selectedDate.date, date)
    );
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold">
          Chọn thời gian cho gói {comboDays} ngày
        </h2>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-12 h-12 px-0 py-0">
              <CalendarIcon className="h-10 w-10" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={activeDate}
              onSelect={(date) => {
                if (date) handleDateSelect(date);
              }}
              locale={vi}
              initialFocus
              disabled={(date) => isDateDisabled(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Display current month and year in Vietnamese */}
      <div className="text-2xl font-semibold">
        <span>
          {activeDate
            ? `${vietnameseMonths[activeDate.getMonth()]} ${activeDate.getFullYear()}`
            : `${vietnameseMonths[new Date().getMonth()]} ${new Date().getFullYear()}`}
        </span>
      </div>

      {/* Quick date selection */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 mb-4">
          {getDaysInRange().map((date) => {
            const formattedDate = formatDate(date);
            const isActive = isSameDay(activeDate, date);
            const isSelected = isDateSelected(date);
            const dayNumber = getSelectedDayNumber(date);
            const isDisabled = isDateDisabled(date) && !isSelected;

            return (
              <TooltipProvider key={date.toISOString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button
                        onClick={() => {
                          if (!isDisabled && selectedDates.length === 0) {
                            setActiveDate(date);
                            setSelectedTimeSlot(null);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center w-24 h-24 rounded-full bg-white text-black hover:bg-gray-100",
                          isActive
                            ? "bg-primary text-white hover:bg-blue-500"
                            : isSelected
                              ? "bg-blue-500 text-white hover:bg-blue-500"
                              : "bg-white text-black hover:bg-gray-100",
                          (isDisabled || selectedDates.length > 0) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-3xl font-bold">
                          {formattedDate.day}
                        </span>
                        <span className="text-base">
                          {formattedDate.dayName}
                        </span>
                      </Button>

                      {/* Badge for selected days */}
                      {isSelected && (
                        <div className="absolute -top-0 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          {dayNumber}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-black p-2 rounded-lg shadow-lg text-sm font-semibold">
                    {isSelected
                      ? `Ngày đã chọn (buổi ${dayNumber})`
                      : isDisabled
                        ? "Ngày đã được chọn cho buổi khác"
                        : selectedDates.length > 0
                          ? "Không thể chọn (đã chọn buổi đầu tiên)"
                          : "Có thể chọn cho buổi đầu tiên"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Updated notice about time slots */}
      {selectedDates.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 text-yellow-700">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              Lưu ý về khung giờ và khoảng thời gian
            </p>
            <p>
              Mặc định tất cả các buổi sẽ cùng một khung giờ{" "}
              {selectedDates[0].timeSlot.display}, với khoảng cách{" "}
              {timeInterval} ngày giữa mỗi buổi. Bạn có thể chọn chỉnh sửa giờ riêng cho từng buổi nếu cần.
            </p>
          </div>
        </div>
      )}

      {/* Show all selected days in accordion */}
      <Accordion
        type="single"
        collapsible
        value={expandedDays}
        onValueChange={setExpandedDays}
      >
        {Array.from({ length: comboDays }).map((_, index) => {
          const isSelected = selectedDates.length > index;
          const selectedDate = isSelected ? selectedDates[index] : null;
          const isEditing = editingIndex === index;

          return (
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger className="text-xl py-4">
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="font-semibold">
                    Buổi {index + 1}
                    {isSelected && (
                      <span className="font-normal text-gray-500 ml-2">
                        ({getFormattedDate(selectedDate!.date)},{" "}
                        {selectedDate!.timeSlot.display})
                      </span>
                    )}
                  </span>

                  {(expandedDays === index.toString() || isEditing) && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded">
                      {index === 0 && selectedDates.length === 0 
                        ? "Đang chọn"
                        : isEditing 
                          ? "Đang chỉnh sửa" 
                          : "Chi tiết"}
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {index === 0 && selectedDates.length === 0 ? (
                  // First day selection UI (initial state)
                  <div className="border-0 shadow-none">
                    <CardContent className="p-0 pt-4">
                      <StartTimeSelection
                        startTime={startTime}
                        onStartTimeChange={(newTime) => {
                          setStartTime(newTime);
                          setSelectedTimeSlot(null);
                        }}
                      />

                      <div className="mt-6">
                        <h3 className="text-2xl font-semibold mb-4">
                          Khung giờ có sẵn cho ngày{" "}
                          {getFormattedDate(activeDate)}
                          <span className="text-red-500 ml-2">
                            ({totalTime} phút)
                          </span>
                        </h3>
                        <div className="grid grid-cols-5 gap-4">
                          {getTimeSlots(startTime).map((slot) => {
                            const isActive =
                              selectedTimeSlot?.display === slot.display;
                            return (
                              <Button
                                key={slot.display}
                                variant={isActive ? "default" : "outline"}
                                className={cn(
                                  "rounded-full text-xl py-3 px-6",
                                  isActive && "bg-primary text-white"
                                )}
                                onClick={() => handleTimeSlotSelect(slot)}
                              >
                                {slot.display}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                ) : isEditing ? (
                  // Editing mode for any session
                  <div className="border-0 shadow-none">
                    <CardContent className="p-0 pt-4">
                      <StartTimeSelection
                        startTime={startTime}
                        onStartTimeChange={(newTime) => {
                          setStartTime(newTime);
                          setSelectedTimeSlot(null);
                        }}
                      />

                      <div className="mt-6">
                        <h3 className="text-2xl font-semibold mb-4">
                          Chỉnh sửa giờ cho buổi {index + 1} - ngày{" "}
                          {getFormattedDate(selectedDate!.date)}
                          <span className="text-red-500 ml-2">
                            ({totalTime} phút)
                          </span>
                        </h3>
                        <div className="grid grid-cols-5 gap-4">
                          {getTimeSlots(startTime).map((slot) => {
                            const isActive =
                              selectedTimeSlot?.display === slot.display;
                            return (
                              <Button
                                key={slot.display}
                                variant={isActive ? "default" : "outline"}
                                className={cn(
                                  "rounded-full text-xl py-3 px-6",
                                  isActive && "bg-primary text-white"
                                )}
                                onClick={() => handleTimeSlotSelect(slot)}
                              >
                                {slot.display}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingIndex(null)}
                          className="mr-2"
                        >
                          Hủy
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                ) : isSelected ? (
                  // Session display with edit option
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg text-gray-700">
                          <span className="font-semibold">Ngày: </span>
                          {getFormattedDate(selectedDate!.date)}
                        </p>
                        <p className="text-lg text-gray-700">
                          <span className="font-semibold">Thời gian: </span>
                          {selectedDate!.timeSlot.display}
                        </p>                      
                      </div>

                      {/* Edit button for each session */}
                      <Button
                        variant="outline"
                        onClick={() => handleEditSession(index)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Chỉnh sửa giờ
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 italic">
                    {selectedDates.length === 0
                      ? "Vui lòng chọn ngày và thời gian cho buổi đầu tiên."
                      : "Các buổi tiếp theo sẽ được tự động tính toán dựa trên buổi đầu tiên."}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Confirmation status */}
      {selectedDates.length === comboDays && (
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 text-green-700">
          <CheckCircle2 className="h-6 w-6" />
          <p className="font-semibold">
            Đã chọn đủ {comboDays} buổi cho gói dịch vụ!
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTimeSelection;