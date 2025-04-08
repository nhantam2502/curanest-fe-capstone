import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StartTimeSelectionProps {
  startTime: string;
  onStartTimeChange: (time: string) => void;
}

const StartTimeSelection: React.FC<StartTimeSelectionProps> = ({ 
  startTime, 
  onStartTimeChange 
}) => {
  const timeSlots = Array.from({ length: ((22 - 8) * 4) + 1 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h3 className="text-2xl font-semibold">
          Chọn giờ bắt đầu
        </h3>
      </div>
      
      <Select 
        value={startTime} 
        onValueChange={(value) => onStartTimeChange(value)}
      >
        <SelectTrigger className="w-[220px] h-14 text-xl">
          <SelectValue placeholder="Chọn giờ" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((time) => (
            <SelectItem key={time} value={time} className="text-xl p-3">
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StartTimeSelection;
