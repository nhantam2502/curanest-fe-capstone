"use client";

import { useToast } from "@/hooks/use-toast";
import {
  CheckIcon,
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkingHour {
  day: string;
  startTime: string;
  endTime: string;
}

interface Nurse {
  id: number;
  name: string;
  avatar?: string;
  workingHours: WorkingHour[];
}

interface ScheduleSlot {
  nurseId: number;
  day: string;
  time: string;
}

const SchedulePage: React.FC = () => {
  const nurses: Nurse[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/avatars/01.png",
      workingHours: [
        { day: "Thứ Hai", startTime: "08:00", endTime: "10:00" },
        { day: "Thứ Hai", startTime: "13:00", endTime: "15:00" },
        { day: "Thứ Ba", startTime: "09:00", endTime: "11:00" },
        { day: "Thứ Tư", startTime: "07:00", endTime: "12:00" },
      ],
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/avatars/02.png",
      workingHours: [
        { day: "Thứ Hai", startTime: "14:00", endTime: "16:00" },
        { day: "Thứ Tư", startTime: "13:00", endTime: "15:00" },
        { day: "Thứ Sáu", startTime: "10:00", endTime: "12:00" },
      ],
    },
  ];

  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedNurse, setSelectedNurse] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const filteredNurses = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hours: string[] = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const days: string[] = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  useEffect(() => {
    if (selectedNurse) {
      const selectedNurseData = nurses.find(
        (nurse) => nurse.id === selectedNurse
      );
      if (selectedNurseData) {
        const newSchedule: ScheduleSlot[] = [];
        selectedNurseData.workingHours.forEach((wh: any) => {
          const startHour = parseInt(wh.startTime.split(":"));
          const endHour = parseInt(wh.endTime.split(":"));
          for (let hour = startHour; hour < endHour; hour++) {
            const time = `${hour.toString().padStart(2, "0")}:00`;
            newSchedule.push({ nurseId: selectedNurse, day: wh.day, time });
          }
        });
        setSchedule(newSchedule);
        setHasChanges(false);
      }
    } else {
      setSchedule([]);
      setHasChanges(false);
    }
  }, [selectedNurse]);

  const handleNurseSelect = (nurseId: number) => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      setSelectedNurse(nurseId);
    }
  };

  const handleConfirmChangeNurse = () => {
    setSelectedNurse(
      nurses.find((nurse) => nurse.id !== selectedNurse)?.id || null
    );
    setShowConfirmDialog(false);
  };

  const handleCancelChangeNurse = () => {
    setShowConfirmDialog(false);
  };

  const handleCellClick = (time: string, day: string): void => {
    if (!selectedNurse) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn điều dưỡng để xem lịch làm việc.",
        variant: "destructive",
      });
      return;
    }

    const existingSchedule = schedule.find(
      (s) => s.nurseId === selectedNurse && s.day === day && s.time === time
    );

    if (existingSchedule) {
      setSchedule(
        schedule.filter(
          (s) =>
            !(s.nurseId === selectedNurse && s.day === day && s.time === time)
        )
      );
    } else {
      setSchedule([...schedule, { nurseId: selectedNurse, day, time }]);
    }
    setHasChanges(true);
  };

  const handleRegister = () => {
    if (!selectedNurse) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn điều dưỡng trước khi đăng ký.",
        variant: "destructive",
      });
      return;
    }

    const selectedNurseData = nurses.find((nurse) => nurse.id === selectedNurse);
    if (!selectedNurseData) return;

    console.log("Thông tin đăng ký:");
    console.log("Điều dưỡng:", selectedNurseData.name);
    console.log("Lịch làm việc đã đăng ký:");

    const sortedSchedule = [...schedule].sort((a, b) => {
      const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return a.time.localeCompare(b.time);
    });

    sortedSchedule.forEach((slot) => {
      console.log(`- ${slot.day} lúc ${slot.time}`);
    });

    toast({
      title: "Thành công",
      description: "Đăng ký lịch thành công!",
    });
    setHasChanges(false);
  };

  const getCellColor = (time: string, day: string): string => {
    const isSelected = schedule.some(
      (s) => s.nurseId === selectedNurse && s.day === day && s.time === time
    );

    if (isSelected)
      return "bg-emerald-100 hover:bg-emerald-200 text-emerald-600";
    return "bg-white hover:bg-gray-100";
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="w-72 bg-white rounded-lg shadow-md p-4 space-y-6">
        <h2 className="text-xl font-semibold">Điều dưỡng</h2>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredNurses.map((nurse) => (
            <div
              key={nurse.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                selectedNurse === nurse.id
                  ? "bg-emerald-50 shadow-lg ring-1 ring-emerald-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNurseSelect(nurse.id)}
            >
              <Image
                src={nurse.avatar || "/"}
                alt={nurse.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span
                className={`font-medium ${
                  selectedNurse === nurse.id ? "text-emerald-600" : ""
                }`}
              >
                {nurse.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lịch làm việc</h2>
          <Button
            onClick={handleRegister}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Đăng ký
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  Giờ
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="py-2 px-4 border-b border-gray-300 text-left"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((time) => (
                <tr key={time}>
                  <td className="py-2 px-4 border-b border-gray-300 font-medium">
                    {time}
                  </td>
                  {days.map((day) => (
                    <td
                      key={`${day}-${time}`}
                      className={`py-2 px-4 border border-gray-300 cursor-pointer text-center align-middle ${getCellColor(
                        time,
                        day
                      )}`}
                      onClick={() => handleCellClick(time, day)}
                    >
                      {schedule.some(
                        (s) =>
                          s.nurseId === selectedNurse &&
                          s.day === day &&
                          s.time === time
                      ) && <CheckIcon className="h-4 w-4 text-emerald-600" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!selectedNurse && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <span className="text-white text-xl font-semibold">
              Vui lòng chọn điều dưỡng để xem lịch
            </span>
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có thay đổi chưa lưu. Bạn có chắc muốn chuyển sang điều dưỡng
              khác không?
            </h3>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="px-4 py-2 rounded-lg"
                onClick={handleCancelChangeNurse}
              >
                Hủy
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                onClick={handleConfirmChangeNurse}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;