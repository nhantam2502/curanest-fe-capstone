// src/components/NurseSheet.tsx
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NurseItemType } from "@/types/nurse";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { GetAppointment } from "@/types/appointment";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NurseSheetProps {
  nurse: NurseItemType | null;
  selectedAppointment: GetAppointment | null;
  onClose: () => void;
}

interface Appointment {
  "appointment-id": string;
  "est-date": string;
  "est-end-time": string;
  "total-est-duration": number;
  "est-travel-time": number;
  status: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export function NurseSheet({
  nurse,
  onClose,
  selectedAppointment,
}: NurseSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const handleAssignNurse = async () => {
    if (!nurse || !selectedAppointment) return;
    try {
      setAssigning(true);
      const nursingId = nurse["nurse-id"];
      const appointmentId = selectedAppointment.id;

      await appointmentApiRequest.assignNurseToAppointment(
        appointmentId,
        nursingId
      );
      toast({
        title: "Thành công",
        description: "Điều dưỡng đã được phân công thành công!",
      });

      onClose(); // Close sheet after successful assignment
      window.location.reload();
    } catch (error) {
      console.error("Error assigning nurse:", error);
      toast({
        title: "Lỗi",
        description: "Không thể phân công điều dưỡng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Sheet open={!!nurse} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Thông tin điều dưỡng</SheetTitle>
        </SheetHeader>

        {nurse && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={nurse["nurse-picture"]}
                  alt={nurse["nurse-name"]}
                />
                <AvatarFallback>{nurse["nurse-name"].charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{nurse["nurse-name"]}</h3>
                <p className="text-sm text-muted-foreground">
                  {nurse.gender ? "Nam" : "Nữ"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-medium">Nơi công tác:</span>{" "}
                {nurse["current-work-place"]}
              </p>
              <p>
                <span className="font-medium">Đánh giá:</span> ⭐ {nurse.rate}
              </p>
            </div>

            {/* Timesheet Section */}
            <div className="mt-6 pt-4 border-t">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={assigning}
                className="w-full"
              >
                {assigning ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Đang phân công...
                  </>
                ) : (
                  "Phân công điều dưỡng"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận phân công?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn phân công điều dưỡng{" "}
                <span className="font-medium">{nurse?.["nurse-name"]}</span> cho
                cuộc hẹn này ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={assigning}>Hủy</AlertDialogCancel>
              <Button
                onClick={handleAssignNurse}
                disabled={assigning}
                className="bg-primary hover:bg-primary/90"
              >
                {assigning ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
