// components/ConfirmCompletionDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ConfirmCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  onConfirm: (reportId: string, confirmation: string) => Promise<void>;
}

export function ConfirmCompletionDialog({
  open,
  onOpenChange,
  reportId,
  onConfirm,
}: ConfirmCompletionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!inputValue.trim().toString()) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(reportId, inputValue);
      setInputValue("");
      onOpenChange(false);
      // window.location.reload();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể báo cáo. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      console.error("Error confirming completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hoàn thành</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Nội dung xác nhận:
          </label>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập nội dung xác nhận..."
            disabled={isLoading}
            required
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
