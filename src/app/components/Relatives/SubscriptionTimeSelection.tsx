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
import {
  CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Clock,
  CircleX,
} from "lucide-react";
import {
  cn,
  createISOString,
  getDaysInRange,
  vietnameseMonths,
} from "@/lib/utils";
import { format, addDays, isSameDay, isAfter } from "date-fns";
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
import { NurseItemType } from "@/types/nurse";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import AvailabilityDialog from "./ChangeNurse";

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
  nurse?: NurseItemType | null;
}

interface SubscriptionTimeSelectionProps {
  totalTime: number;
  timeInterval: number;
  comboDays: number;
  onTimesSelect: (datetimes: SelectedDateTime[]) => void;
  selectedNurse: NurseItemType | null;
  serviceID: string | null;
  onNurseSelect: (nurse: NurseItemType, sessionIndex: number | null) => void; // Cập nhật để truyền sessionIndex
}

const SubscriptionTimeSelection: React.FC<SubscriptionTimeSelectionProps> = ({
  totalTime,
  timeInterval,
  comboDays,
  onTimesSelect,
  selectedNurse,
  serviceID,
  onNurseSelect,
}) => {
  const [selectedDates, setSelectedDates] = useState<SelectedDateTime[]>([]);
  const [activeDate, setActiveDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [expandedDays, setExpandedDays] = useState<string>("0");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCalendarOpen, setEditCalendarOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<Date | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    Record<number, boolean>
  >({});
  const [availableNurses, setAvailableNurses] = useState<
    NurseItemType[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number | null>(
    null
  );

  const verifyNurseAvailability = useCallback(
    async (nurse: NurseItemType, sessionIndex: number) => {
      try {
        const session = selectedDates[sessionIndex];
        if (!session) return;

        const body = {
          "nurses-dates": [
            {
              "nurse-id": nurse["nurse-id"],
              "est-duration": totalTime,
              "est-start-date": session.isoString!,
            },
          ],
        };

        const response = await appointmentApiRequest.verifyNurse(body);
        const isAvailable =
          response.payload.data[0]?.["is-availability"] || false;

        setAvailabilityStatus((prev) => ({
          ...prev,
          [sessionIndex]: isAvailable,
        }));
      } catch (error) {
        console.error("Verify nurse error:", error);
        setError("Không thể kiểm tra tính khả dụng của điều dưỡng");
      }
    },
    [selectedDates, totalTime]
  );

  useEffect(() => {
    const fetchAvailableNurses = async () => {
      if (!dialogOpen) return;

      if (!serviceID) {
        console.error("Service ID is missing");
        setError("Không có thông tin dịch vụ");
        return;
      }

      if (selectedDates.length === 0) {
        console.error("No dates selected");
        setError("Chưa có lịch điều trị được chọn");
        return;
      }

      if (currentSessionIndex === null) {
        console.error("No session index selected");
        setError("Không có thông tin buổi điều trị");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const sessionIndex = currentSessionIndex;

        if (sessionIndex < 0 || sessionIndex >= selectedDates.length) {
          throw new Error(`Index không hợp lệ: ${sessionIndex}`);
        }

        const selectedSession = selectedDates[sessionIndex];
        const estDate = selectedSession.isoString;

        if (!estDate) {
          throw new Error("Không có thông tin ngày giờ");
        }

        const response = await appointmentApiRequest.getNurseAvailable(
          serviceID,
          estDate,
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
          console.error("Response structure is unexpected:", response);
          setError("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        console.error("Error fetching available nurses:", err);
        setError("Đã xảy ra lỗi khi tải danh sách điều dưỡng");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableNurses();
  }, [serviceID, selectedDates, totalTime, dialogOpen, currentSessionIndex]);

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
        start: `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`,
        end: `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
        display: `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")} - ${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
        value: `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}-${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
      };

      slots.push(timeSlot);
    }
    return slots;
  };

  const formatDate = (date: Date): { day: number; dayName: string } => {
    const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    return {
      day: date.getDate(),
      dayName: days[date.getDay()],
    };
  };

  const handleDateSelect = (date: Date) => {
    setActiveDate(date);
    setCalendarOpen(false);
    setSelectedTimeSlot(null);
  };

  const handleEditDateSelect = (date: Date) => {
    setEditingDate(date);
    setEditCalendarOpen(false);

    if (editingIndex !== null && date) {
      const isDateUsed = selectedDates.some(
        (selectedDate, idx) =>
          idx !== editingIndex && isSameDay(selectedDate.date, date)
      );

      if (!isDateUsed) {
        const updatedDates = [...selectedDates];
        const currentTimeSlot = updatedDates[editingIndex].timeSlot;
        const isoString = createISOString(date, currentTimeSlot);

        updatedDates[editingIndex] = {
          ...updatedDates[editingIndex],
          date: date,
          isoString: isoString,
        };

        if (editingIndex < selectedDates.length - 1) {
          for (let i = editingIndex + 1; i < selectedDates.length; i++) {
            const previousDate = updatedDates[i - 1].date;
            const newDate = addDays(previousDate, timeInterval + 1);
            const timeSlot = updatedDates[i].timeSlot;
            const newIsoString = createISOString(newDate, timeSlot);

            updatedDates[i] = {
              ...updatedDates[i],
              date: newDate,
              isoString: newIsoString,
            };
          }
        }

        setSelectedDates(updatedDates);
        onTimesSelect(updatedDates);
      } else {
        setEditingDate(selectedDates[editingIndex].date);
      }
    }
  };

  const handleTimeSlotSelect = async (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);

    if (editingIndex !== null) {
      const isoString = createISOString(
        selectedDates[editingIndex].date,
        timeSlot
      );
      const updatedDates = [...selectedDates];
      updatedDates[editingIndex] = {
        ...updatedDates[editingIndex],
        timeSlot: timeSlot,
        isoString: isoString,
      };

      setSelectedDates(updatedDates);
      setEditingIndex(null);
      onTimesSelect(updatedDates);
      return;
    }

    const isoString = createISOString(activeDate, timeSlot);

    const newSelection: SelectedDateTime = {
      date: activeDate,
      timeSlot: timeSlot,
      isoString: isoString,
      nurse: selectedNurse, // Gán điều dưỡng ban đầu
    };

    const updatedDates: SelectedDateTime[] = [];
    updatedDates.push(newSelection);

    for (let i = 1; i < comboDays; i++) {
      const nextDate = addDays(activeDate, (timeInterval + 1) * i);
      const nextIsoString = createISOString(nextDate, timeSlot);

      updatedDates.push({
        date: nextDate,
        timeSlot: timeSlot,
        isoString: nextIsoString,
        nurse: selectedNurse, // Gán điều dưỡng ban đầu
      });
    }

    if (selectedNurse && updatedDates.length === comboDays) {
      try {
        const body = {
          "nurses-dates": updatedDates.map((d) => ({
            "nurse-id": selectedNurse["nurse-id"],
            "est-duration": totalTime,
            "est-start-date": d.isoString!,
          })),
        };

        const response = await appointmentApiRequest.verifyNurse(body);
        const newAvailabilityStatus: Record<number, boolean> = {};
        response.payload.data.forEach(
          (item: { "is-availability": boolean }, index: number) => {
            newAvailabilityStatus[index] = item["is-availability"];
          }
        );
        setAvailabilityStatus(newAvailabilityStatus);
      } catch (error) {
        console.error("Verify nurse error:", error);
      }
    }
    setSelectedDates(updatedDates);
    onTimesSelect(updatedDates);
  };

  const handleEditSession = (index: number) => {
    setEditingIndex(index);
    setExpandedDays(index.toString());
    setEditingDate(selectedDates[index].date);
    setSelectedTimeSlot(selectedDates[index].timeSlot);
  };

  const isDateAlreadySelected = (
    date: Date,
    datesList: SelectedDateTime[] = selectedDates
  ): boolean => {
    return datesList.some((selectedDate) => isSameDay(selectedDate.date, date));
  };

  const getFormattedDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(
      (selectedDate) =>
        isSameDay(selectedDate.date, date) && selectedDate.timeSlot !== null
    );
  };

  const isDateDisabled = (date: Date): boolean => {
    if (date < new Date()) return true;
    if (isDateAlreadySelected(date)) return true;
    return false;
  };

  const isEditDateDisabled = (date: Date): boolean => {
    if (date < new Date()) return true;
    if (editingIndex !== null) {
      return selectedDates.some(
        (selectedDate, idx) =>
          idx !== editingIndex && isSameDay(selectedDate.date, date)
      );
    }
    return false;
  };

  const getSelectedDayNumber = (date: Date): number | null => {
    const index = selectedDates.findIndex((selectedDate) =>
      isSameDay(selectedDate.date, date)
    );
    return index >= 0 ? index + 1 : null;
  };

  const handleOpenAvailabilityDialog = (index: number) => {
    setCurrentSessionIndex(index);
    setDialogOpen(true);
  };

  const handleSelectNurse = (nurse: NurseItemType) => {
    if (currentSessionIndex !== null) {
      const updatedDates = [...selectedDates];
      updatedDates[currentSessionIndex] = {
        ...updatedDates[currentSessionIndex],
        nurse: nurse, // Cập nhật điều dưỡng cho buổi cụ thể
      };
      setSelectedDates(updatedDates);
      onTimesSelect(updatedDates);
      onNurseSelect(nurse, currentSessionIndex);
      verifyNurseAvailability(nurse, currentSessionIndex);
    }
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

      <div className="text-2xl font-semibold">
        <span>
          {activeDate
            ? `${vietnameseMonths[activeDate.getMonth()]} ${activeDate.getFullYear()}`
            : `${vietnameseMonths[new Date().getMonth()]} ${new Date().getFullYear()}`}
        </span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 mb-4">
          {getDaysInRange(activeDate).map((date) => {
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
              {timeInterval} ngày giữa mỗi buổi. Bạn có thể chọn chỉnh sửa ngày
              và giờ riêng cho từng buổi nếu cần.
            </p>
            <p className="mt-1">
              <strong>Quan trọng:</strong> Khi thay đổi ngày của một buổi, các
              buổi tiếp theo sẽ được tự động tính toán lại để duy trì khoảng
              cách {timeInterval} ngày.
            </p>
          </div>
        </div>
      )}

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
                    availabilityStatus[index] === false ? (
                      <CircleX className="h-6 w-6 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    )
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
                  <div className="border-0 shadow-none">
                    <CardContent className="p-0 pt-4">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4">
                          Chỉnh sửa ngày cho buổi {index + 1}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="text-xl bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                            <span>
                              Ngày hiện tại:{" "}
                              {getFormattedDate(
                                editingDate || selectedDate!.date
                              )}
                            </span>
                          </div>
                          <Popover
                            open={editCalendarOpen}
                            onOpenChange={setEditCalendarOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2 text-xl"
                              >
                                <CalendarIcon className="h-4 w-4" />
                                Chọn ngày khác
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={editingDate || selectedDate!.date}
                                onSelect={(date) => {
                                  if (date) handleEditDateSelect(date);
                                }}
                                locale={vi}
                                initialFocus
                                disabled={(date) => isEditDateDisabled(date)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

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
                          {getFormattedDate(editingDate || selectedDate!.date)}
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
                          onClick={() => {
                            setEditingIndex(null);
                            setEditingDate(null);
                          }}
                          className="mr-2"
                        >
                          Hủy
                        </Button>
                        {editingIndex !== null &&
                          editingIndex < selectedDates.length && (
                            <Button
                              onClick={() => {
                                const updatedDates = [...selectedDates];
                                updatedDates[editingIndex] = {
                                  ...updatedDates[editingIndex],
                                  date:
                                    editingDate ||
                                    selectedDates[editingIndex].date,
                                  timeSlot:
                                    selectedTimeSlot ||
                                    selectedDates[editingIndex].timeSlot,
                                  isoString: createISOString(
                                    editingDate ||
                                      selectedDates[editingIndex].date,
                                    selectedTimeSlot ||
                                      selectedDates[editingIndex].timeSlot
                                  ),
                                };
                                setSelectedDates(updatedDates);
                                setEditingIndex(null);
                                setEditingDate(null);
                                onTimesSelect(updatedDates);
                              }}
                              className="bg-primary text-white"
                            >
                              Lưu thay đổi
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </div>
                ) : isSelected ? (
                  <div className="border-0 shadow-none">
                    <CardContent className="p-0 pt-4">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <Card className="border-0 shadow-none bg-transparent">
                          <CardHeader className="px-0 pt-0">
                            <h3 className="text-2xl font-semibold">
                              Thông tin buổi điều trị {index + 1}
                            </h3>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="flex items-center gap-3">
                                <CalendarIcon className="h-6 w-6 text-blue-500" />
                                <div>
                                  <p className="text-gray-500">Ngày</p>
                                  <p className="text-xl font-semibold">
                                    {getFormattedDate(selectedDate!.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="h-6 w-6 text-blue-500" />
                                <div>
                                  <p className="text-gray-500">Thời gian</p>
                                  <p className="text-xl font-semibold">
                                    {selectedDate!.timeSlot.display}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="flex items-center gap-3">
                                {availabilityStatus[index] === false ? (
                                  <CircleX className="h-6 w-6 text-red-500" />
                                ) : (
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                )}
                                <div>
                                  <p className="text-gray-500">Trạng thái</p>
                                  <p className="text-xl font-semibold">
                                    {availabilityStatus[index] === false
                                      ? "Điều dưỡng không khả dụng"
                                      : selectedDate!.nurse
                                        ? `Điều dưỡng: ${selectedDate!.nurse["nurse-name"]}`
                                        : "Chưa chọn điều dưỡng"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                              {availabilityStatus[index] === true && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleEditSession(index)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Chỉnh sửa
                                </Button>
                              )}

                              {selectedNurse &&
                                availabilityStatus[index] === false && (
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleOpenAvailabilityDialog(index)
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    Thay đổi điều dưỡng
                                  </Button>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  <div className="border-0 shadow-none">
                    <CardContent className="p-0 pt-4">
                      <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center gap-4">
                        <p className="text-xl text-gray-500">
                          Buổi này sẽ được tự động đặt lịch sau khi bạn chọn
                          buổi đầu tiên
                        </p>
                        <p className="text-gray-500">
                          Khoảng cách giữa các buổi: {timeInterval} ngày
                        </p>
                      </div>
                    </CardContent>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <AvailabilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        sessionIndex={currentSessionIndex}
        loading={loading}
        error={error}
        onSelectNurse={handleSelectNurse}
      />
    </div>
  );
};

export default SubscriptionTimeSelection;
