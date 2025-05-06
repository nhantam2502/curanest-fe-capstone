"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import medicalReportApiRequest from "@/apiRequest/medicalReport/apiMedicalReport";
import { ConfirmCompletionDialog } from "./ConfirmCompletionDialog";

// Define MedicalReport interface
interface MedicalReport {
  id: string;
  "svc-package-id": string;
  "patient-id": string;
  "nursing-report": string;
  "staff-confirmation": string;
  status: string;
  "created-at": string;
}

// Define props
interface ViewMedicalReportDialogProps {
  appId: string | null; // This is the appointment ID
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMedicalReportDialog({
  appId,
  open,
  onOpenChange,
}: ViewMedicalReportDialogProps) {
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch medical report using appointment ID
  useEffect(() => {
    const fetchMedicalReport = async () => {
      if (!appId) {
        setReport(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await medicalReportApiRequest.getMedicalReport(appId);

        if (response.status === 200) {
          let data: MedicalReport | null = null;

          // Handle array or object response
          if (Array.isArray(response.payload?.data)) {
            data = response.payload.data[0] || null;
          } else if (response.payload?.data) {
            data = response.payload.data;
          }

          if (data) {
            setReport(data);
          } else {
            setReport(null);
            toast({
              title: "Thông báo",
              description: "Không có báo cáo y tế nào được tìm thấy",
            });
          }
        } else {
          throw new Error("Failed to fetch medical report");
        }
      } catch (err) {
        console.error("Error fetching medical report:", err);
        setError("Không thể tải báo cáo y tế. Vui lòng thử lại sau.");
        toast({
          title: "Lỗi",
          description: "Không thể tải báo cáo y tế. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && appId) {
      fetchMedicalReport();
    }
  }, [appId, open]);

  // Handle confirmation input submission
  const handleConfirm = async (confirmation: string) => {
    if (!report?.id) return;

    try {
      await medicalReportApiRequest.updateMedicalReport(report.id, {
        "nursing-report": "", // optional
        "staff-confirmation": confirmation.trim(),
      });

      toast({
        title: "Thành công",
        description: "Cập nhật xác nhận thành công",
      });

      // Update UI
      setReport((prev) =>
        prev
          ? {
              ...prev,
              "staff-confirmation": confirmation.trim(),
            }
          : null
      );
    } catch (error) {
      console.error("Error confirming completion:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Báo cáo y tế</DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-destructive">{error}</div>
        ) : report ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mã báo cáo</p>
                <p className="font-medium">{report.id}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Ghi chú điều dưỡng</p>
              <p className="font-medium">
                {report["nursing-report"] || "Chưa có ghi chú"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Xác nhận của nhân viên</p>
              <p className="font-medium">
                {report["staff-confirmation"] || "Chưa xác nhận"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    report.status === "done"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status === "done" ? "Hoàn thành" : "Chưa hoàn thành"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Không có báo cáo nào tồn tại cho cuộc hẹn này
          </div>
        )}

        {/* Buttons */}
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Đóng
          </Button>
          <Button
            variant="default"
            onClick={() => setIsConfirmDialogOpen(true)}
            disabled={!report || isLoading}
          >
            Xác nhận hoàn thành
          </Button>
        </DialogFooter>

        {/* Confirmation Dialog */}
        <ConfirmCompletionDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          reportId={report?.id || ""}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
}