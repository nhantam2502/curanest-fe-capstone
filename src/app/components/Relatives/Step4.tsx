// Step4Component.tsx
import React from "react";
import { Check } from "lucide-react";

interface Step4Props {
  nurseSelectionMethod: "manual" | "auto";
  setNurseSelectionMethod: (method: "manual" | "auto") => void;
  setSelectedNurse: (nurse: any | null) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const BookingMethodSelection: React.FC<Step4Props> = ({
  nurseSelectionMethod,
  setNurseSelectionMethod,
  setSelectedNurse,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="space-y-6 text-lg">
      <h2 className="text-3xl font-bold">Chọn hình thức đặt</h2>
      <div className="space-y-6">
        {/* Tùy chọn Tự chọn điều dưỡng */}
        <button
          className={`w-full p-6 border rounded-lg text-left shadow-md hover:shadow-lg transition-shadow flex items-center justify-between ${
            nurseSelectionMethod === "manual" ? "border-primary" : ""
          }`}
          onClick={() => setNurseSelectionMethod("manual")}
        >
          <div>
            <h3 className="text-xl">Tự chọn điều dưỡng</h3>
            <p className="text-lg text-gray-500">
              Bạn có thể tự chọn điều dưỡng phù hợp.
            </p>
          </div>
          {nurseSelectionMethod === "manual" && (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
        </button>

        {/* Tùy chọn Hệ thống tự chọn */}
        <button
          className={`w-full p-6 border rounded-lg text-left shadow-md hover:shadow-lg transition-shadow flex items-center justify-between ${
            nurseSelectionMethod === "auto" ? "border-primary" : ""
          }`}
          onClick={() => {
            setNurseSelectionMethod("auto");
            // Reset selected nurse khi chọn hình thức auto
            setSelectedNurse(null);
          }}
        >
          <div>
            <h3 className="text-xl">Hệ thống tự chọn</h3>
            <p className="text-lg text-gray-500">
              Hệ thống sẽ tự động chọn điều dưỡng phù hợp cho bạn.
            </p>
          </div>
          {nurseSelectionMethod === "auto" && (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};