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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  isSameDay,
  differenceInDays,
  isAfter,
  parseISO,
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
  const [currentEditingDay, setCurrentEditingDay] = useState<number>(0);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [expandedDays, setExpandedDays] = useState<string>("0");

  // Function to get the days in the next 30 days
  const getDaysInRange = (): Date[] => {
    const days: Date[] = [];
    const startOfRange = new Date();

    for (let i = 0; i <= 29; i++) {
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
    const endTime = 22 * 60; // Thay đổi từ 20:00 thành 22:00

    const interval = 30; // 30 phút mỗi slot

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
    const [hours, minutes] = timeSlot.start.split(':').map(Number);
    
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
  
    // After selecting the first date with timeInterval > 0,
    // we need to adjust the currentEditingDay
    if (timeInterval > 0 && selectedDates.length === 0) {
      // We just selected the first date, so make sure we're editing day 0
      setCurrentEditingDay(0);
    }
  };

  // Function to handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  
    // Create ISO string for the selected date and time
    const isoString = createISOString(activeDate, timeSlot);
  
    const newSelection: SelectedDateTime = {
      date: activeDate,
      timeSlot: timeSlot,
      isoString: isoString, // Add ISO string
    };
  
    // Update the selected dates for the current day only
    const updatedDates = [...selectedDates];
  
    // Replace or add the current day selection
    if (updatedDates.length > currentEditingDay) {
      updatedDates[currentEditingDay] = newSelection;
  
      // If we're editing a day that's not the last one, we need to update subsequent days
      if (currentEditingDay < updatedDates.length - 1) {
        // Remove all selections after the current editing day
        updatedDates.splice(currentEditingDay + 1);
      }
    } else {
      updatedDates.push(newSelection);
    }
  
    setSelectedDates(updatedDates);
  
    // Move to the next day if there are more days to select
    if (currentEditingDay < comboDays - 1) {
      setCurrentEditingDay(currentEditingDay + 1);
  
      // Set the next active date based on the timeInterval
      if (timeInterval > 0) {
        // For fixed interval, calculate from the first date
        const nextDate = addDays(
          updatedDates[0].date,
          timeInterval * (currentEditingDay + 1)
        );
        setActiveDate(nextDate);
      } else {
        // For flexible scheduling (timeInterval = 0)
        // Find the nearest available date that isn't already selected and is after all previously selected dates
        const lastSelectedDate = getLatestSelectedDate(updatedDates);
        setActiveDate(addDays(lastSelectedDate || new Date(), 1));
      }
    }
  
    // Notify parent component of the selection
    onTimesSelect(updatedDates);
  };

  // Function to edit a specific day
  const handleEditDay = (index: number) => {
    setCurrentEditingDay(index);

    // Set the active date to the date being edited
    if (selectedDates.length > index) {
      setActiveDate(selectedDates[index].date);
      setSelectedTimeSlot(selectedDates[index].timeSlot);
    } else {
      // If this is a new day after the last selected one
      const lastSelectedDate = getLatestSelectedDate();
      if (lastSelectedDate) {
        if (timeInterval === 0) {
          // For flexible scheduling, set to day after the latest selected date
          setActiveDate(addDays(lastSelectedDate, 1));
        } else {
          // For fixed interval, calculate from the first date
          if (selectedDates.length > 0) {
            const nextDate = addDays(
              selectedDates[0].date,
              timeInterval * index
            );
            setActiveDate(nextDate);
          }
        }
      }
      setSelectedTimeSlot(null);
    }
  };

  // Function to get the latest selected date
  const getLatestSelectedDate = (
    datesList: SelectedDateTime[] = selectedDates
  ): Date | null => {
    if (datesList.length === 0) return null;

    let latestDate = datesList[0].date;
    for (let i = 1; i < datesList.length; i++) {
      if (isAfter(datesList[i].date, latestDate)) {
        latestDate = datesList[i].date;
      }
    }
    return latestDate;
  };

  // Function to check if a date is already selected (for any day)
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

  // Function to get suggested dates based on first selection and timeInterval
const getSuggestedDates = (): Date[] => {
  if (selectedDates.length === 0) return [];

  const dates: Date[] = [];

  // Handle special case when timeInterval is 0
  if (timeInterval === 0) {
    // When timeInterval is 0, any future date that's not already selected is valid
    const lastSelectedDate = getLatestSelectedDate();
    const availableDates = getDaysInRange().filter(
      (date) =>
        !isDateAlreadySelected(date) &&
        (lastSelectedDate ? isAfter(date, lastSelectedDate) : true)
    );

    // Return the currently active date if it's available, otherwise the first available date
    const activeIsAvailable =
      !isDateAlreadySelected(activeDate) &&
      (lastSelectedDate ? isAfter(activeDate, lastSelectedDate) : true);
    return activeIsAvailable
      ? [activeDate]
      : availableDates.length > 0
        ? [availableDates[0]]
        : [];
  } else {
    // Normal case with timeInterval > 0
    const firstDate = selectedDates[0].date;
    
    // For each day in the combo, suggest a date based on the interval
    // First date is already selected, so start from 1
    for (let i = 0; i < comboDays; i++) {
      if (i === 0) {
        // For the first day, use the already selected date
        dates.push(firstDate);
      } else {
        // For subsequent days, add (timeInterval + 1) * dayIndex
        // Adding +1 because we want to skip exactly timeInterval days
        // For example, if timeInterval = 3, from day 1 (9/4) to day 2 should be 13/4 (4 days later)
        const suggestedDate = addDays(firstDate, (timeInterval + 1) * i);
        dates.push(suggestedDate);
      }
    }
  }

  return dates;
};
  
  // Function to check if a date is one of the suggested dates
const isDateSuggested = (date: Date): boolean => {
  // If timeInterval is 0, all future dates that aren't already selected are suggested
  if (timeInterval === 0) {
    const lastSelectedDate = getLatestSelectedDate();
    return (
      !isDateAlreadySelected(date) &&
      (lastSelectedDate ? isAfter(date, lastSelectedDate) : true)
    );
  }

  // Exit early if no dates selected yet
  if (selectedDates.length === 0) return true;

  const firstSelectedDate = selectedDates[0].date;
  
  // For subsequent selections with timeInterval > 0
  if (selectedDates.length > 0) {
    // Calculate exact days for each interval
    for (let i = 1; i < comboDays; i++) {
      const exactDay = addDays(firstSelectedDate, (timeInterval + 1) * i);
      if (isSameDay(date, exactDay)) {
        return true;
      }
    }
  }
  
  // Any other date is not suggested
  return false;
};

  // Function to check if a date is already selected with a time slot
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(
      (selectedDate) =>
        isSameDay(selectedDate.date, date) && selectedDate.timeSlot !== null
    );
  };

  // Function to check if a date should be disabled
  // Function to check if a date should be disabled
const isDateDisabled = (date: Date): boolean => {
  // Don't allow selecting dates in the past
  if (date < new Date()) return true;

  // Don't allow selecting dates that are already selected
  if (isDateAlreadySelected(date)) return true;

  // If we have selected at least one date and timeInterval > 0
  if (timeInterval > 0 && selectedDates.length > 0) {
    const firstSelectedDate = selectedDates[0].date;
    
    // Calculate how many days have passed since the first selected date
    const daysSinceFirstSelection = differenceInDays(date, firstSelectedDate);
    
    // Exact day of first selection
    if (isSameDay(date, firstSelectedDate)) {
      return false; // Not disabled
    }
    
    // For other days, check if they are one of the suggested dates
    // For timeInterval = 3, only days like firstDate + 4, firstDate + 8, etc. are valid
    return !isDateSuggested(date);
  }

  // For timeInterval = 0, don't allow selecting dates that are before any already selected date
  if (timeInterval === 0 && selectedDates.length > 0) {
    const lastSelectedDate = getLatestSelectedDate();
    if (lastSelectedDate && !isAfter(date, lastSelectedDate)) {
      return true;
    }
  }

  return false;
};

  // Function to get the day number (1-based) for a selected date
  const getSelectedDayNumber = (date: Date): number | null => {
    const index = selectedDates.findIndex((selectedDate) =>
      isSameDay(selectedDate.date, date)
    );
    return index >= 0 ? index + 1 : null;
  };

  // Effect to update expandedDays when currentEditingDay changes
  useEffect(() => {
    setExpandedDays(currentEditingDay.toString());
  }, [currentEditingDay]);

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
            const isSuggested = isDateSuggested(date);
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
                          if (
                            !isDisabled &&
                            (currentEditingDay === 0 || isSuggested)
                          ) {
                            setActiveDate(date);
                            if (isSuggested && timeInterval > 0) {
                              const dayIndex = getSuggestedDates().findIndex(
                                (d) => isSameDay(d, date)
                              );
                              if (dayIndex >= 0) {
                                setCurrentEditingDay(dayIndex);
                              }
                            }
                            setSelectedTimeSlot(null);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center w-24 h-24 rounded-full bg-white text-black hover:bg-gray-100",
                          isActive
                            ? "bg-primary text-white hover:bg-blue-500"
                            : isSelected
                              ? "bg-blue-500 text-white hover:bg-blue-500"
                              : isSuggested
                                ? "border-primary border-dashed"
                                : "bg-white text-black hover:bg-gray-100",
                          (isDisabled ||
                            !(currentEditingDay === 0 || isSuggested)) &&
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
                        ? timeInterval === 0 &&
                          getLatestSelectedDate() &&
                          !isAfter(date, getLatestSelectedDate()!)
                          ? "Ngày đã qua (phải chọn sau ngày đã chọn trước đó)"
                          : "Ngày đã được chọn cho buổi khác"
                        : isSuggested
                          ? timeInterval > 0
                            ? "Ngày đề xuất theo khoảng thời gian"
                            : "Ngày có thể chọn"
                          : "Ngày không phù hợp"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Reminder about date interval - only show if timeInterval > 0 */}
      {selectedDates.length > 0 && timeInterval > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 text-yellow-700">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              Lưu ý về khoảng thời gian giữa các buổi
            </p>
            <p>
              Gói dịch vụ này yêu cầu {timeInterval} ngày giữa mỗi buổi. Các
              ngày đề xuất đã được tính toán tự động.
            </p>
          </div>
        </div>
      )}

      {/* Notice about unique date selection for timeInterval=0 */}
      {selectedDates.length > 0 && timeInterval === 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 text-yellow-700">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Lưu ý về việc lựa chọn ngày</p>
            <p>
              Mỗi buổi cần được chọn vào một ngày khác nhau, và ngày mới phải
              nằm sau các ngày đã chọn trước đó.
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

                  {index === currentEditingDay && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded">
                      Đang chọn
                    </span>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {index === currentEditingDay || (index === 0 && !isSelected) ? (
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
                ) : isSelected ? (
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
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">ISO: </span>
                          {selectedDate!.isoString}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleEditDay(index)}
                      >
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 italic">
                    {index > 0 && selectedDates.length < index
                      ? "Vui lòng chọn ngày và thời gian cho các buổi trước."
                      : "Vui lòng chọn ngày và thời gian cho buổi này."}
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