import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Appointment {
  id: number;
  nurse_name: string;
  avatar: string;
  status: string
  phone_number: string;
  techniques: string;
  total_fee: number;
  appointment_date: string;
  time_from_to: string;
}

interface CalendarProps {
  onDateSelect: (date: string) => void;
  appointments: Appointment[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth =
    (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() +
      6) %
    7;

  const hasAppointment = (date: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return appointments.some((apt) => apt.appointment_date === dateString);
  };

  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    // Tính ngày thứ 2 của tuần (điều chỉnh CN về 7 thay vì 0)
    const monday = new Date(date);
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));

    // Tính ngày CN của tuần
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const isInSelectedWeek = (date: number) => {
    if (!selectedDate) return false;

    const currentDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );

    const { monday, sunday } = getWeekDates(selectedDate);

    // Set time to start of day for accurate comparison
    currentDateObj.setHours(0, 0, 0, 0);
    monday.setHours(0, 0, 0, 0);
    sunday.setHours(0, 0, 0, 0);

    return currentDateObj >= monday && currentDateObj <= sunday;
  };

  const handleDateClick = (date: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    setSelectedDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${String(
      newDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

    console.log("Selected Date:", {
      fullDate: newDate.toLocaleDateString("vi-VN"),
      formattedDate: formattedDate,
      day: date,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      dayOfWeek: newDate.toLocaleDateString("vi-VN", { weekday: "long" }),
      week: getWeekDates(newDate),
    });

    onDateSelect(formattedDate);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const getDayOfWeek = (day: number) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[day % 7];
  };

  const getMonthYearString = () => {
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
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const renderCalendar = () => {
    const days: React.ReactNode[] = [];
    let day = 1;

    const header = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName) => (
      <div
        key={dayName}
        className="w-12 h-12 flex items-center justify-center font-semibold text-gray-600"
      >
        {dayName}
      </div>
    ));

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-12 h-12" />);
    }

    while (day <= daysInMonth) {
      const currentDay = day;
      const hasAppt = hasAppointment(currentDay);
      const isSelected = isInSelectedWeek(currentDay);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(currentDay)}
          className={`
              w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer
              transition-all duration-200 hover:bg-blue-100
              ${hasAppt ? "bg-yellow-100 hover:bg-yellow-200" : ""}
              ${
                isSelected
                  ? "bg-[#71DDD7] text-white hover:bg-[#71DDD7]/90"
                  : ""
              }
            `}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs">
              {getDayOfWeek(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDay
                ).getDay()
              )}
            </span>
            <span className="font-semibold">{currentDay}</span>
          </div>
        </div>
      );
      day++;
    }

    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-xl font-bold text-center">
            {getMonthYearString()}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {header}
          {days}
        </div>
      </div>
    );
  };

  return renderCalendar();
};

export default Calendar;
