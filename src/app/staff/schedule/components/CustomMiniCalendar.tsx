"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
// Removed GetAppointment import as it's no longer used here

interface CalendarProps {
  onDateSelect: (date: string) => void; // Callback with YYYY-MM-DD string
  initialDate?: Date; // Optional initial date to sync with parent
}

const CustomMiniCalendar: React.FC<CalendarProps> = ({ onDateSelect, initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ? new Date(initialDate) : new Date());

  // Update internal state if initialDate prop changes externally (e.g., "Today" button)
  useEffect(() => {
    if (initialDate) {
      const newInitial = new Date(initialDate);
      // Check if the new date is valid
      if (!isNaN(newInitial.getTime())) {
         // Always update the visual selection based on the parent's date
         setSelectedDate(newInitial);
  
         // Only change the displayed *month* if the new date falls outside the currently displayed month
         if (newInitial.getFullYear() !== currentDate.getFullYear() || newInitial.getMonth() !== currentDate.getMonth()) {
           setCurrentDate(newInitial); // Change displayed month to match the parent's selected date's month
         }
      } else {
          console.warn("CustomMiniCalendar received invalid initialDate:", initialDate);
      }
    }
  }, [initialDate]); // Added currentDate to dependency

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get the day of the week for the 1st of the month (0=Mon, 1=Tue, ..., 6=Sun)
  const firstDayOfMonth = (new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay() + 6) % 7; // Adjust so Monday is 0

  // --- Week Highlighting Logic ---
  const getWeekDates = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1)); // Adjust for Sunday start
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
  };

  const isInSelectedWeek = (dayOfMonth: number) => {
    if (!selectedDate) return false;

    const currentDateInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayOfMonth
    );
    currentDateInMonth.setHours(12, 0, 0, 0); // Use midday to avoid DST issues

    const { monday, sunday } = getWeekDates(selectedDate);

    // Compare date objects directly after setting times
    return currentDateInMonth >= monday && currentDateInMonth <= sunday;
  };
  // --- End Week Highlighting Logic ---


  const handleDateClick = (dayOfMonth: number) => {
    const newClickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayOfMonth
    );
    setSelectedDate(newClickedDate); // Update internal state for highlighting

    // Format date as YYYY-MM-DD for the callback
    const formattedDate = `${newClickedDate.getFullYear()}-${String(
      newClickedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;

    onDateSelect(formattedDate); // Call the parent component's handler
  };

  const changeMonth = (increment: number) => {
    console.log("changeMonth called with increment:", increment);
    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + increment);
        // Optionally clear selected date when changing month, or keep it
        // setSelectedDate(null);
        console.log("New calculated date:", newDate);
        return newDate;
    });
  };


  const getMonthYearString = () => {
    return currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    // const months = [
    //   "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    //   "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    // ];
    // return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const renderCalendar = () => {
    const dayElements: React.ReactNode[] = [];
    let day = 1;

    // Weekday Headers (T2 to CN)
    const header = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName) => (
      <div
        key={`header-${dayName}`}
        className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500" // Slightly larger touch target
      >
        {dayName}
      </div>
    ));

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayElements.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Add day cells for the current month
    while (day <= daysInMonth) {
      const currentDay = day; // Capture day value for closure
      const isSelected = isInSelectedWeek(currentDay);
      const today = new Date();
      const isToday =
        today.getFullYear() === currentDate.getFullYear() &&
        today.getMonth() === currentDate.getMonth() &&
        today.getDate() === currentDay;

      dayElements.push(
        <button // Use button for accessibility
          key={day}
          onClick={() => handleDateClick(currentDay)}
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer
            transition-colors duration-150 ease-in-out hover:bg-blue-100 text-xs relative focus:outline-none focus:ring-2 focus:ring-blue-300
            ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
            ${!isSelected && isToday ? "text-green-600 font-bold" : ""}
            ${!isSelected && !isToday ? "" : ""}
          `}
          aria-label={`Select date ${currentDay}`} // Accessibility
          // aria-pressed={isSelected}
        >
          <span className={`relative z-[1] ${isSelected ? 'font-semibold' : ''}`}>
            {currentDay}
          </span>
          {!isSelected && isToday && (
             <div className="absolute inset-0 border border-green-300 rounded-lg pointer-events-none"></div>
          )}
           {/* Highlighting for the selected week */}
           {isSelected && (
             <div className="absolute inset-0 bg-blue-500 rounded-lg pointer-events-none opacity-80"></div>
           )}
             <span className={`absolute z-[2] ${isSelected ? 'text-white' : isToday ? 'text-green-600 font-bold' : 'text-gray-700' } group-hover:text-black`}>
                {currentDay}
            </span>
        </button>
      );
      day++;
    }

    return (
      <div className="w-full bg-white rounded-lg select-none">
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Previous month"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-semibold text-gray-800">
            {getMonthYearString()}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Next month"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-y-1 justify-items-center"> {/* Center items horizontally */}
          {header}
          {dayElements}
        </div>
      </div>
    );
  };

  return renderCalendar();
};

export default CustomMiniCalendar;