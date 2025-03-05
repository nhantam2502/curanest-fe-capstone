"use client";
import { Button } from "@/components/ui/button";
import { Major } from "@/types/category";
import AddMajorModal from "./AddMajorModal";

interface MajorListProps {
  majors: Major[];
  selectedMajorId: number | null;
  onSelectMajor: (majorId: number | null) => void;
  onAddMajor: (newMajor: Major) => void; // Keep this prop
}

function MajorList({
  majors,
  selectedMajorId,
  onSelectMajor,
  onAddMajor,
}: MajorListProps) {
  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Chuyên môn</h2>
      <div className="flex-grow space-y-2 mb-4">
        {majors.map((major) => (
          <Button
            key={major.id}
            variant={selectedMajorId === major.id ? "default" : "outline"}
            className="w-full"
            onClick={() => onSelectMajor(major.id)}
          >
            {major.name}
          </Button>
        ))}
      </div>
      <div>
        <AddMajorModal onAddMajor={onAddMajor} />
      </div>
    </div>
  );
}

export default MajorList;
