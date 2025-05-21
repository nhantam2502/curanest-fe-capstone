import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { NurseItemType } from "@/types/nurse";
import NursingCard from "./NursingCard";

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableNurses: NurseItemType[] | null;
  selectedNurse: NurseItemType | null;
  sessionIndex: number | null;
  loading: boolean;
  error: string | null;
  onSelectNurse?: (nurse: NurseItemType) => void;
}

const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  open,
  onOpenChange,
  availableNurses,
  selectedNurse,
  sessionIndex,
  loading,
  error,
  onSelectNurse,
}) => {
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);
  const [selectedNurseData, setSelectedNurseData] =
    useState<NurseItemType | null>(null);

  // Reset selected nurse when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedNurseId(selectedNurse ? selectedNurse["nurse-id"] : null);
      setSelectedNurseData(selectedNurse);
    }
  }, [open, selectedNurse]);

  const handleSelectNurse = (nurse: NurseItemType) => {
    setSelectedNurseId(nurse["nurse-id"]);
    setSelectedNurseData(nurse);
  };

  const handleConfirm = () => {
    if (selectedNurseData && onSelectNurse) {
      onSelectNurse(selectedNurseData); // Gọi hàm onSelectNurse khi xác nhận
    }
    onOpenChange(false); // Đóng dialog
  };

  // Kiểm tra để tránh hiển thị lỗi khi sessionIndex là null
  if (sessionIndex === null) {
    return null;
  }

  // console.log("availableNurses: ", availableNurses);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedNurse && availableNurses?.length === 0
              ? "Thông tin điều dưỡng"
              : `Chọn điều dưỡng cho buổi ${sessionIndex + 1}`}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-2">
            {selectedNurse && (
  <div className="p-3 bg-red-50 rounded-md mb-4 flex items-center">
    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
    <div className="text-base">
      Điều dưỡng{" "}
      <span className="font-semibold">
        {selectedNurse["nurse-name"]}
      </span>{" "}
      hiện tại không khả dụng trong thời gian này, vui lòng chọn điều dưỡng khác.
    </div>
  </div>
)}

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg">
                    Đang tải danh sách điều dưỡng...
                  </span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Không thể tải danh sách điều dưỡng
                    </p>
                    <p>{error}</p>
                  </div>
                </div>
              ) : availableNurses && availableNurses.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xl text-primary font-medium mb-4">
                    Chọn một điều dưỡng khả dụng:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableNurses.map((nurse) => (
                      <NursingCard
                        key={nurse["nurse-id"]}
                        nurse={nurse}
                        onSelect={() => handleSelectNurse(nurse)}
                        isSelected={selectedNurseId === nurse["nurse-id"]}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <div className="font-semibold">
                      Không có điều dưỡng khả dụng
                    </div>

                    <div>
                      Thời gian này hiện không có điều dưỡng khả dụng. Vui lòng
                      chọn một thời gian khác hoặc liên hệ hỗ trợ để biết thêm
                      chi tiết.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {availableNurses && availableNurses.length > 0 ? "Hủy" : "Đóng"}
          </Button>
          {availableNurses && availableNurses.length > 0 && (
            <Button
              onClick={handleConfirm}
              disabled={!selectedNurseId || loading}
              className="bg-primary text-white"
            >
              Xác nhận
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;
