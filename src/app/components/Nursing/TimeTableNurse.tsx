import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, Clock7 } from "lucide-react";

interface TimetableProps {
  id: number;
}

const TimeTableNurse = ({ id }: TimetableProps) => {
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString("vi-VN");
  });

  const getDates = () => {
    const dates = [];
    const today = new Date();

    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    );

    for (let i = 0; i < 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toLocaleDateString("vi-VN"));
    }

    return dates;
  };

  const timeSlots = [
    { id: 1, time: "Sáng", hours: "08:00 - 12:00" },
    { id: 2, time: "Chiều", hours: "13:00 - 17:00" },
    { id: 3, time: "Tối", hours: "18:00 - 22:00" },
  ];

  interface Availability {
    [date: string]: {
      [slot: string]: string;
    };
  }

  const availability: Availability = {
    "24/02/2025": {
      Sáng: "available",
      Chiều: "booked",
      Tối: "unavailable",
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-500";
      case "booked":
        return "text-yellow-500";
      default:
        return "text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5" />;
      case "booked":
        return <Calendar className="w-5 h-5" />;
      default:
        return <XCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-nowrap gap-4 overflow-x-auto pb-6">
        {getDates().map((date) => (
          <Button
            key={date}
            onClick={() => {
              setSelectedDate(date);
              setExpandedSlot(null);
            }}
            className={`max-w-[150px] text-black hover:bg-[#71DDD7] hover:text-white hover:font-semibold  flex-shrink-0 h-16 text-base px-4 ${
              selectedDate === date
                ? "bg-[#71DDD7] text-white font-semibold"
                : "bg-transparent"
            }`} // Thêm màu nền, màu chữ và font đậm khi được chọn
          >
            <div className="text-center">
              <div className="text-lg">{date}</div>
              <div className="text-sm">
                {new Date(
                  date.split("/").reverse().join("-")
                ).toLocaleDateString("vi-VN", {
                  weekday: "short",
                })}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {timeSlots.map((slot) => (
          <Card
            key={slot.id}
            className="p-4 cursor-pointer"
            onClick={() => {
              if (availability[selectedDate]?.[slot.time] === "available") {
                setExpandedSlot(expandedSlot === slot.time ? null : slot.time);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-medium text-xl">{slot.time}</h3>
                <p className="text-lg text-gray-500">{slot.hours}</p>
              </div>

              <div className="flex items-center gap-3">
                {availability[selectedDate]?.[slot.time] ? (
                  <>
                    <span
                      className={getStatusColor(
                        availability[selectedDate][slot.time]
                      )}
                    >
                      {getStatusIcon(availability[selectedDate][slot.time])}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${
                        availability[selectedDate][slot.time] === "available"
                          ? "bg-green-50 text-base text-green-700 border-green-200"
                          : availability[selectedDate][slot.time] === "booked"
                          ? "bg-yellow-50 text-base text-yellow-700 border-yellow-200"
                          : "bg-gray-50 text-base text-gray-500 border-gray-200"
                      }`}
                    >
                      {availability[selectedDate][slot.time] === "available"
                        ? "Có thể đặt"
                        : availability[selectedDate][slot.time] === "booked"
                        ? "Đã có người đặt"
                        : "Không có lịch"}
                    </Badge>
                  </>
                ) : (
                  <>
                    <span className="text-gray-300">
                      <XCircle className="w-5 h-5" />
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-500 border-gray-200"
                    >
                      Không có lịch
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {expandedSlot === slot.time && (
              <div className="mt-4 flex space-x-2">
                <div className="p-2 bg-green-50 rounded-full shadow-sm flex items-center justify-between">
                  <span>08:00 - 09:00</span>
                </div>
                <div className="p-2 bg-green-50 rounded-full shadow-sm flex items-center justify-between">
                  <span>09:00 - 10:00</span>
                </div>
                <div className="p-2 bg-green-50 rounded-full shadow-sm flex items-center justify-between">
                  <span>10:00 - 11:00</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimeTableNurse;
