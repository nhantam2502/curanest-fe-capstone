import React from "react";
import { Button } from "@/components/ui/button";
import { PatientRecord } from "@/types/patient";

interface PatientSelectionProps {
  patients: PatientRecord[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string) => void;
  isFilter?: boolean; // Thêm prop để xác định đây là bộ lọc

  
}

const PatientSelection = ({
  patients,
  selectedPatientId,
  setSelectedPatientId,
  isFilter = false, // Giá trị mặc định là false
}: PatientSelectionProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <p className="text-2xl font-bold">Hồ sơ bệnh nhân:</p>
      {patients.length > 0 ? (
        patients.map((patient, index) => (
          <Button
            key={patient.id}
            variant={selectedPatientId === patient.id ? "default" : "outline"}
            className={`px-6 py-8 rounded-full transition-all text-lg ${
              selectedPatientId === patient.id ? "text-white" : "border"
            }`}
            onClick={() => setSelectedPatientId(patient.id)}
          >
            <span className="text-xl font-semibold">
              {patient["full-name"] || `Bệnh nhân`}
            </span>
          </Button>
        ))
      ) : (
        <p className="text-gray-600 text-xl">
          Đang tải hồ sơ bệnh nhân, vui lòng đợi...
        </p>
      )}
    </div>
  );
};

export default PatientSelection;
