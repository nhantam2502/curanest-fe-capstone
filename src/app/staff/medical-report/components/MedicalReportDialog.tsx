// components/ViewMedicalReportDialog.tsx
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
  status: string; // Assuming status might change, e.g., to "done"
  "created-at": string;
}

interface ViewMedicalReportDialogProps {
  appId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportConfirmed?: () => void; // New prop to signal confirmation
}

export function ViewMedicalReportDialog({
  appId,
  open,
  onOpenChange,
  onReportConfirmed, // Destructure the new prop
}: ViewMedicalReportDialogProps) {
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
          if (Array.isArray(response.payload?.data)) {
            data = response.payload.data[0] || null;
          } else if (response.payload?.data) {
            data = response.payload.data;
          }

          if (data) {
            setReport(data);
          } else {
            setReport(null);
            // Removed toast here, parent can decide or show "No report" message
          }
        } else {
          // Use message from payload if available
          const errorMessage = response.payload?.message || "Failed to fetch medical report";
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        console.error("Error fetching medical report:", err);
        const displayError = err.message || "Không thể tải báo cáo y tế. Vui lòng thử lại sau.";
        setError(displayError);
        toast({
          title: "Lỗi",
          description: displayError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && appId) {
      fetchMedicalReport();
    }
    if (!open) { // Reset state when dialog is closed
        setReport(null);
        setError(null);
    }
  }, [appId, open]);

  const handleConfirm = async (confirmation: string) => {
    if (!report?.id) return;
    try {
      await medicalReportApiRequest.updateMedicalReport(report.id, {
        "nursing-report": null, // Set nursing-report to null as per original AppointmentTable comment
        "staff-confirmation": confirmation.trim(),
      });
      toast({
        title: "Thành công",
        description: "Xác nhận hoàn thành báo cáo y tế thành công.",
      });
      setIsConfirmDialogOpen(false); // Close the confirmation input dialog
      
      // Update local report state to reflect changes immediately
      setReport((prev) =>
        prev
          ? {
              ...prev,
              "staff-confirmation": confirmation.trim(),
              status: "done", // Assuming confirmation marks it as 'done'
            }
          : null
      );
      
      onOpenChange(false); // Close the ViewMedicalReportDialog

      if (onReportConfirmed) {
        onReportConfirmed(); // Call the callback to trigger refetch in parent
      }

    } catch (error) {
      console.error("Error confirming completion:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xác nhận hoàn thành.",
        variant: "destructive",
      });
    }
  };

  const isAlreadyConfirmed = !!report?.["staff-confirmation"]; // Check if already confirmed

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Báo cáo y tế</DialogTitle>
        </DialogHeader>

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
                <p className="font-medium text-nowrap">{report.id}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Ghi chú điều dưỡng
              </p>
              <p className="font-medium">
                {report["nursing-report"] || "Chưa có ghi chú"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Xác nhận của nhân viên
              </p>
              <p className="font-medium">
                {report["staff-confirmation"] || "Chưa xác nhận"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    report.status === "done" || isAlreadyConfirmed // Reflect confirmation in status display
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status === "done" || isAlreadyConfirmed ? "Hoàn thành" : "Chưa hoàn thành"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Không có báo cáo nào tồn tại cho cuộc hẹn này.
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Đóng
          </Button>
          <Button
            onClick={() => setIsConfirmDialogOpen(true)}
            disabled={!report || isLoading || isAlreadyConfirmed} // Disable if no report, loading, or already confirmed
            className="bg-emerald-400 hover:bg-emerald-400/90"
          >
            {isAlreadyConfirmed ? "Đã xác nhận" : "Xác nhận hoàn thành"}
          </Button>
        </DialogFooter>

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