"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GetAppointment } from "@/types/appointment";
import {
  Clock,
  Users,
  Info,
  CalendarDays,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { NurseItemType } from "@/types/nurse";
import { PatientRecord } from "@/types/patient";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { translateStatusToVietnamese } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: GetAppointment | null;
  onAppointmentUpdated?: () => void;
}

// --- Helper Functions ---
const formatDateTimePart = (
  isoString: string | null | undefined,
  part: "date" | "time"
): string => {
  if (!isoString) return part === "date" ? "Không xác định" : "--:--";
  try {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return part === "date" ? "Ngày không hợp lệ" : "Giờ không hợp lệ";
    if (part === "date") {
      return dateObj.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    } else {
      return dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
  } catch (error) {
    return part === "date" ? "Lỗi định dạng ngày" : "Lỗi định dạng giờ";
  }
};

const getStatusClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "upcoming": return "bg-orange-100 text-orange-800 border border-orange-300";
    case "success": return "bg-green-100 text-green-800 border border-green-300";
    case "waiting": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "confirmed": return "bg-blue-100 text-blue-800 border border-blue-300";
    case "cancel": return "bg-red-100 text-red-800 border border-red-300";
    default: return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getPaymentStatusClass = (isPaid?: boolean) => {
  if (isPaid === undefined || isPaid === null) return "bg-gray-100 text-gray-800 border border-gray-300";
  return isPaid ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300";
};

const translatePaymentStatusToVietnamese = (isPaid?: boolean): string => {
  if (isPaid === undefined || isPaid === null) return "Chưa rõ";
  return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
};

// --- NEW: Helper to check if a date is today ---
const isDateToday = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  try {
    const eventDate = new Date(dateString);
    if (isNaN(eventDate.getTime())) return false; // Invalid date string

    const today = new Date();

    // Compare year, month, and day
    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()
    );
  } catch (error) {
    console.error("Error parsing date for 'isToday' check:", dateString, error);
    return false;
  }
};


const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
  onAppointmentUpdated,
}) => {
  const [users, setUsers] = useState<NurseItemType[]>([]);
  const [patientDetails, setPatientDetails] = useState<PatientRecord | null>(null);
  const [isFetchingPatient, setIsFetchingPatient] = useState<boolean>(false);
  const [patientFetchError, setPatientFetchError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [showConfirmArrivalDialog, setShowConfirmArrivalDialog] = useState<boolean>(false);
  const { toast } = useToast();

  // --- Fetch Nurses Effect ---
  useEffect(() => {
    const fetchStaff = async () => {
      // ... (fetch staff logic - no changes)
      try {
        const response = await nurseApiRequest.getListNurse(1, 100);
        if (response.status === 200 && response.payload?.data) {
          setUsers(response.payload.data);
        } else {
          console.error("Failed to fetch staff:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  const nurseIdToNameMap = useMemo(() => {
    // ... (nurseIdToNameMap logic - no changes)
    const map: { [key: string]: string } = {};
    users.forEach((user) => {
      if (user["nurse-id"] && typeof user["nurse-id"] === 'string' && user["nurse-name"] && typeof user["nurse-name"] === 'string') {
        map[user["nurse-id"]] = user["nurse-name"];
      }
    });
    return map;
  }, [users]);

  // --- Fetch Patient Details Effect ---
  useEffect(() => {
    const fetchPatientData = async (patientId: string) => {
      // ... (fetch patient logic - no changes)
      setIsFetchingPatient(true);
      setPatientFetchError(null);
      setPatientDetails(null);
      try {
        const response = await patientApiRequest.getPatientById(patientId);
        if (response.status === 200 && response.payload?.data) {
          const patientData = response.payload.data;
          if (patientData && (patientData["patient-id"] || patientData["id"] || patientData["full-name"])) {
            setPatientDetails(patientData);
          } else {
            setPatientFetchError("Dữ liệu bệnh nhân không hợp lệ.");
          }
        } else {
          setPatientFetchError(response.payload?.message || `Lỗi ${response.status}: Không thể tải thông tin bệnh nhân.`);
        }
      } catch (error: any) {
        setPatientFetchError(error.message || "Lỗi mạng khi tải thông tin bệnh nhân.");
      } finally {
        setIsFetchingPatient(false);
      }
    };

    if (isOpen && event?.["patient-id"]) {
      fetchPatientData(event["patient-id"]);
    } else {
      setPatientDetails(null);
      setIsFetchingPatient(false);
      setPatientFetchError(null);
    }
  }, [isOpen, event]);

  // --- Handler for Confirming Arrival ---
  const handleConfirmArrival = useCallback(async () => {
    // ... (handleConfirmArrival logic - no changes)
    if (!event?.id) {
      toast({ title: "Lỗi", description: "Không tìm thấy ID lịch hẹn.", variant: "destructive" });
      return;
    }
    setIsUpdatingStatus(true);
    setShowConfirmArrivalDialog(false);
    try {
      const response = await appointmentApiRequest.updateAppointmentToUpcoming(event.id);
      if (response.status === 200 || response.status === 204) {
        toast({
          title: "Thành công",
          description: "Đã xác nhận điều dưỡng đến. Trạng thái lịch hẹn đã được cập nhật.",
          className: "bg-green-100 text-green-800",
        });
        onOpenChange(false);
        if (onAppointmentUpdated) {
          onAppointmentUpdated();
        }
      } else {
        throw new Error(response.payload?.message || `Không thể cập nhật trạng thái (Status: ${response.status})`);
      }
    } catch (error: any) {
      console.error("Error updating appointment status:", error);
      toast({
        title: "Lỗi cập nhật",
        description: error.message || "Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [event, onOpenChange, onAppointmentUpdated, toast]);

  // --- Prepare Display Values ---
  const displayDate = formatDateTimePart(event?.["est-date"], "date");
  const startTime = formatDateTimePart(event?.["est-date"], "time");
  const nursingId = event?.["nursing-id"];
  let nurseDisplay = "Chưa gán";
  if (nursingId && typeof nursingId === 'string') {
    nurseDisplay = nurseIdToNameMap[nursingId] || `${nursingId} (Không tìm thấy tên)`;
  }

  let patientDisplay: React.ReactNode;
  if (isFetchingPatient) {
    patientDisplay = (<span className="flex items-center gap-1 text-gray-500 italic"><Loader2 className="w-3 h-3 animate-spin" /> Đang tải...</span>);
  } else if (patientFetchError) {
    patientDisplay = (<span className="flex items-center gap-1 text-red-600" title={patientFetchError}><AlertCircle className="w-3 h-3" /> Lỗi tải BN</span>);
  } else if (patientDetails && patientDetails["full-name"]) {
    patientDisplay = patientDetails["full-name"];
  } else if (event?.["patient-id"]){
    patientDisplay = `${event["patient-id"]} (Không có tên)`;
  } else {
    patientDisplay = "N/A";
  }

  const isPaidStatus = event?.["is-paid"];

  // --- NEW: Determine if the "Confirm Arrival" button should be shown ---
  const shouldShowConfirmButton = useMemo(() => {
    if (!event) return false;
    return event.status?.toLowerCase() === "confirmed" && isDateToday(event["est-date"]);
  }, [event]);


  if (!event) {
    return null;
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Info className="w-5 h-5 text-blue-600" />
              Chi tiết lịch hẹn
            </AlertDialogTitle>
            <div className="pt-4 space-y-3 text-sm text-gray-700 border-t mt-2 max-h-[60vh] overflow-y-auto pr-2">
              {/* Date */}
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Ngày hẹn:</span>
                  <span className="ml-1 font-semibold text-gray-800">{displayDate}</span>
                </div>
              </div>
              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Thời gian bắt đầu:</span>
                  <span className="ml-1 font-semibold text-gray-800">{startTime}</span>
                </div>
              </div>
              {/* Duration */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Tổng thời gian (dự kiến):</span>
                  <span className="ml-1 font-semibold text-gray-800">
                    {(event as any)["total-est-duration"] ? `${(event as any)["total-est-duration"]} phút` : "N/A"}
                  </span>
                </div>
              </div>
              {/* Patient */}
              <div className="flex items-start gap-3 min-h-[20px]">
                <Users className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Bệnh nhân:</span>
                  <span className="ml-1 font-semibold text-gray-800">{patientDisplay}</span>
                </div>
              </div>
              {/* Assigned Nurse */}
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Điều dưỡng:</span>
                  <span className="ml-1 font-semibold text-gray-800">{nurseDisplay}</span>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-500">Trạng thái lịch hẹn:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}
                  >
                    {translateStatusToVietnamese(event.status)}
                  </span>
                </div>
              </div>
              {/* Payment Status Section */}
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-500">Trạng thái thanh toán:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(isPaidStatus)}`}
                  >
                    {translatePaymentStatusToVietnamese(isPaidStatus)}
                  </span>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdatingStatus}>
              Đóng
            </Button>
            {/* --- MODIFIED: Conditional Rendering for Confirm Button --- */}
            {shouldShowConfirmButton && (
              <Button
                onClick={() => setShowConfirmArrivalDialog(true)}
                disabled={isUpdatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Xác nhận đã đến
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmArrivalDialog} onOpenChange={setShowConfirmArrivalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận điều dưỡng đã đến?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ cập nhật trạng thái của lịch hẹn thành "Sắp diễn ra".
              Bạn có chắc chắn muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingStatus}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmArrival}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdatingStatus ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</>) : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventDetailsDialog;