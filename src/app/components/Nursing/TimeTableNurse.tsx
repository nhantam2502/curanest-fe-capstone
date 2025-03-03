import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const TimeTableNurse = () => {
  const [weekOffset, setWeekOffset] = useState(0); // Lưu offset của tuần hiện tại
  const [weekDays, setWeekDays] = useState(() => getDates(0));
  const [weekRange, setWeekRange] = useState(() => getWeekRange(0));

  function getDates(offset = 0) {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay() || 7;
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1 + offset);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      // Định dạng ngày luôn có 2 chữ số
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
    setWeekOffset(newOffset); // Cập nhật offset mới
    setWeekDays(getDates(newOffset));
    setWeekRange(getWeekRange(newOffset));
  };

  const resetToCurrentWeek = () => {
    setWeekOffset(0); // Đặt lại offset về 0
    setWeekDays(getDates(0));
    setWeekRange(getWeekRange(0));
  };

  const hours = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ];

  const workList = [
    {
      shift_date: "27/02/2025",
      shift_from: "08:00",
      shift_to: "09:00",
      appointment_id: 1,
    },
    {
      shift_date: "27/02/2025",
      shift_from: "09:00",
      shift_to: "10:00",
      appointment_id: 1,
    },
  ];

  const formatShiftDate = (date: string) => date;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => changeWeek("prev")}
          className="px-5 py-5 rounded-lg shadow-md text-xl"
          disabled={weekOffset === 0} // Disable nếu đang ở tuần hiện tại
        >
          Tuần trước
        </Button>
        <p className="text-xl font-semibold">
          {weekRange.from} - {weekRange.to}
        </p>
        <Button
          onClick={() => changeWeek("next")}
          className="px-5 py-5 rounded-lg shadow-md text-xl"
          disabled={weekOffset === 7} // Disable nếu đang ở tuần kế tiếp
        >
          Tuần kế tiếp
        </Button>
      </div>

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
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="text-lg border border-gray-300 font-semibold text-gray-600 text-center">
                {hour}
              </td>
              {weekDays.map((day) => {
                console.log("Checking day:", day);

                const hasWork = workList.find(
                  ({ shift_date, shift_from, shift_to }) => {
                    console.log(
                      "Comparing with:",
                      shift_date,
                      shift_from,
                      shift_to
                    ); // Log dữ liệu trong workList

                    const isSameDay = shift_date === formatShiftDate(day);
                    const [start, end] = hour
                      .split(" - ")
                      .map((time) => time.trim());
                    return (
                      isSameDay &&
                      shift_from.slice(0, 5) === start.slice(0, 5) &&
                      shift_to.slice(0, 5) === end.slice(0, 5)
                    );
                  }
                );
                console.log("hasWork", hasWork);

                const isAppointment = hasWork?.appointment_id !== null;

                return (
                  <td
                    key={`${day}-${hour}`}
                    className={`border border-gray-300 p-1 text-center ${
                      hasWork
                        ? isAppointment
                          ? "bg-yellow-100"
                          : "bg-green-100"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center p-4 rounded-lg">
                      {hasWork && (
                        <span className="text-green-500 font-bold">
                          {isAppointment ? "" : "✔"}
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

      <div className="mt-4">
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-green-100 border border-gray-300"></span>
            <span className="text-green-700 font-bold text-lg">Lịch rảnh</span>
          </div> */}
          <div className="flex items-center gap-2">
            <span className="block w-4 h-4 bg-gray-300 border border-gray-300"></span>
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
