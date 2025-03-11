import React from "react";

interface Nurse {
  id: number;
  name: string;
  specialization: string;
  // Add other nurse properties as needed
}

interface SelectedTime {
  timeSlot: { display: string; value: string };
  date: string;
}

interface Step5Props {
  nurseSelectionMethod: "manual" | "auto";
  nurses: Nurse[];
  selectedMajor: string | null;
  setSelectedNurse: (nurse: Nurse | null) => void;
  calculateTotalTime: () => number;
  setSelectedTime: (time: SelectedTime) => void;
  NurseSelectionList: React.ComponentType<{
    nurses: Nurse[];
    onSelect: (nurseId: number) => void;
  }>;
  TimeSelection: React.ComponentType<{
    totalTime: number;
    onTimeSelect: ({
      date,
      timeSlot,
    }: {
      date: Date | string;
      timeSlot: { display: string; value: string };
    }) => void;
  }>;
}

export const Step5Component: React.FC<Step5Props> = ({
  nurseSelectionMethod,
  nurses,
  selectedMajor,
  setSelectedNurse,
  calculateTotalTime,
  setSelectedTime,
  NurseSelectionList,
  TimeSelection,
}) => {
  if (nurseSelectionMethod === "manual") {
    const handleNurseSelect = (nurseId: number) => {
      console.log(`Selected nurse ID: ${nurseId}`);
      const selectedNurse = nurses.find((nurse) => nurse.id === nurseId);
      if (selectedNurse) {
        setSelectedNurse(selectedNurse);
      }
    };

    // Lọc điều dưỡng theo chuyên ngành được chọn
    const filteredNurses = nurses.filter(
      (nurse) => nurse.specialization === selectedMajor
    );

    return (
      <div className="space-y-6 text-lg">
        <h2 className="text-3xl font-bold">Chọn điều dưỡng</h2>
        {filteredNurses.length > 0 ? (
          <NurseSelectionList
            nurses={filteredNurses}
            onSelect={handleNurseSelect}
          />
        ) : (
          <p className="text-gray-600">Không có điều dưỡng nào phù hợp</p>
        )}
      </div>
    );
  }

  // If auto selection, show time selection
  return (
    <TimeSelection
      totalTime={calculateTotalTime()}
      onTimeSelect={({ date, timeSlot }) => {
        const formattedDate =
          date instanceof Date
            ? date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : date;
        setSelectedTime({ timeSlot, date: formattedDate });
      }}
    />
  );
};
