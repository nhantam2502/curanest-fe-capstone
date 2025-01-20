"use client";

import { useToast } from "@/hooks/use-toast";
import { CheckIcon, SearchIcon, UserIcon } from "lucide-react";

import Image from "next/image";
import React, { useState, useEffect } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

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

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>
);

const SchedulePage: React.FC = () => {
  const nurses: Nurse[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
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
        selectedNurseData.workingHours.forEach((wh:any) => {
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
      if (
        window.confirm(
          "Bạn có thay đổi chưa lưu. Bạn có chắc muốn chuyển sang điều dưỡng khác không?"
        )
      ) {
        setSelectedNurse(nurseId);
      }
    } else {
      setSelectedNurse(nurseId);
    }
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
      return "bg-emerald-300 hover:bg-emerald-400 border-2 border-black";
    return "bg-white hover:bg-gray-100";
  };

  const getCellIcon = (time: string, day: string) => {
    const isSelected = schedule.some(
      (s) => s.nurseId === selectedNurse && s.day === day && s.time === time
    );

    if (isSelected) return <CheckIcon />;
    return null;
  };

  return (
    <div className="flex gap-4 p-4 h-screen bg-gray-50">
      <Card className="w-80 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Điều dưỡng</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="text-gray-400 absolute left-3 top-2.5">
            <SearchIcon />
          </span>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1">
          {filteredNurses.map((nurse) => (
            <div
              key={nurse.id}
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
                selectedNurse === nurse.id
                  ? "bg-teal-50 shadow-md rounded-xl"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNurseSelect(nurse.id)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {nurse.avatar ? (
                  <Image
                    src={nurse.avatar}
                    alt={nurse.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-gray-500">
                    <UserIcon />
                  </span>
                )}
              </div>
              <div>
                <span className="font-medium">{nurse.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex-1 p-4 overflow-hidden flex flex-col relative">
        <div className="flex-row flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Lịch làm việc</h2>
          <button 
            className="text-lg font-bold mb-4 p-3 bg-teal-300 rounded-xl text-white hover:bg-teal-400 transition-colors"
            onClick={handleRegister}
          >
            Đăng ký
          </button>
        </div>
        <div className="overflow-auto flex-1">
          <div className="min-w-[800px]">
            <div
              className={`grid grid-cols-8 border border-gray-200 rounded-xl overflow-hidden ${
                !selectedNurse ? "opacity-50" : ""
              }`}
            >
              <div className="font-bold p-3 text-center">Giờ</div>
              {days.map((day) => (
                <div
                  key={day}
                  className="font-bold text-center p-3 border-gray-200"
                >
                  {day}
                </div>
              ))}

              {hours.map((time) => (
                <React.Fragment key={time}>
                  <div className="py-3 px-2 font-semibold text-gray-600 text-center">
                    {time}
                  </div>
                  {days.map((day) => (
                    <div
                      key={`${day}-${time}`}
                      className={`p-2 rounded-xl cursor-pointer transition-all flex items-center justify-center border-t border-l border-gray-200 ${getCellColor(
                        time,
                        day
                      )}`}
                      onClick={() => handleCellClick(time, day)}
                    >
                      {getCellIcon(time, day)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {!selectedNurse && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 rounded-lg">
            <span className="text-white text-xl font-bold">
              Vui lòng chọn điều dưỡng trước khi đăng ký lịch
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SchedulePage;
