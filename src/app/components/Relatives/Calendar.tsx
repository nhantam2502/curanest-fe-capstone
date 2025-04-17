import { Appointment } from "@/types/appointment";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

interface AppointmentDisplay {
  id: string;
  nurse_name: string;
  avatar: string;
  total_fee?: number;
  appointment_date: string;
  estTimeFrom?: string;
  estTimeTo?: string;
    apiData: Appointment;
}

interface CalendarProps {
  onDateSelect: (date: string) => void;
  appointments: AppointmentDisplay[];
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

  // Tạo tập hợp các ngày có lịch hẹn để kiểm tra nhanh hơn
  const appointmentDates = useMemo(() => {
    const dates = new Set<string>();
    appointments.forEach((apt) => {
      // Chuẩn hóa định dạng ngày từ appointment_date (giả sử là YYYY-MM-DD)
      const date = new Date(apt.appointment_date);
      if (!isNaN(date.getTime())) {
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        dates.add(formattedDate);
      }
    });
    return dates;
  }, [appointments]);

  const hasAppointment = (date: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return appointmentDates.has(dateString);
  };

  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
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
    onDateSelect(formattedDate);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate >= today) {
      setCurrentDate(newDate);
    }
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

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
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
            ${isSelected ? "bg-[#71DDD7] text-black hover:bg-[#71DDD7]/90" : ""}
            ${isToday(currentDay) ? "border-2 border-red-500" : ""}
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
            disabled={
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
            }
            className={`p-2 rounded-full transition-colors ${
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
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