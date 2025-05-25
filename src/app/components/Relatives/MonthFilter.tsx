import React from "react";

interface MonthFilterProps {
  currentYear: string;
  currentMonthIndex: number;
  selectedDay: number | null;
  handleMonthChange: (year: string, monthIndex: number) => void;
  handleDayChange: (day: string) => void;
}

const MonthFilter = ({
  currentYear,
  currentMonthIndex,
  selectedDay,
  handleMonthChange,
  handleDayChange,
}: MonthFilterProps) => {
  const months = [
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

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  ).reverse();

  const daysInMonth = new Date(
    parseInt(currentYear, 10),
    currentMonthIndex + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex justify-end items-center space-x-4 mb-6">
      <label className="text-xl font-medium">Chọn thời gian từ:</label>


      <select
        value={selectedDay ?? ""}
        onChange={(e) => {
          console.log("Day selected:", e.target.value);
          handleDayChange(e.target.value);
        }}
        className="px-4 py-2 border rounded-lg text-xl"
      >
        <option value="">Tất cả các ngày</option>
        {days.map((day) => (
          <option key={day} value={day}>
            Ngày {day}
          </option>
        ))}
      </select>

      <select
        value={currentMonthIndex}
        onChange={(e) => {
          console.log("Month selected:", e.target.value);
          handleMonthChange(currentYear, parseInt(e.target.value, 10));
        }}
        className="px-4 py-2 border rounded-lg text-xl"
      >
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>

      <select
        value={currentYear}
        onChange={(e) => {
          console.log("Year selected:", e.target.value);
          handleMonthChange(e.target.value, currentMonthIndex);
        }}
        className="px-4 py-2 border rounded-lg text-xl"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

    </div>
  );
};

export default MonthFilter;