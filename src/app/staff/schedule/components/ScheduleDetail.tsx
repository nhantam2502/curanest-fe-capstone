"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  // AlertDialogAction, // Can remove if only using Button
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GetAppointment } from "@/types/appointment";
import {
  Clock,
  Users,
  // Tag, // Can remove if service/package info is commented out
  Info,
  CalendarDays,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { NurseItemType } from "@/types/nurse";
import { PatientRecord, PatientRecordRes } from "@/types/patient"; // Ensure correct import
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import patientApiRequest from "@/apiRequest/patient/apiPatient"; // Ensure correct import
import { translateStatusToVietnamese } from "@/lib/utils";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: GetAppointment | null;
}

// --- Helper functions (formatDateTimePart, getStatusClass) ---
const formatDateTimePart = (
  isoString: string | null | undefined,
  part: "date" | "time"
): string => {
  if (!isoString) {
    return part === "date" ? "Không xác định" : "--:--";
  }
  try {
    const dateObj = new Date(isoString);
    // Check if the date object is valid
    if (isNaN(dateObj.getTime())) {
      return part === "date" ? "Ngày không hợp lệ" : "Giờ không hợp lệ";
    }
    if (part === "date") {
      return dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long", // "Thứ Hai", "Thứ Ba", etc.
      });
    } else {
      // part === 'time'
      return dateObj.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format
      });
    }
  } catch (error) {
    return part === "date" ? "Lỗi định dạng ngày" : "Lỗi định dạng giờ";
  }
};
const getStatusClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "upcoming":
      return "bg-orange-200 text-orange-800";
    case "success":
      return "bg-green-100 text-green-800";
    case "waiting":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
}) => {
  const [users, setUsers] = useState<NurseItemType[]>([]);
  const [patientDetails, setPatientDetails] = useState<PatientRecord | null>(
    null
  );
  const [isFetchingPatient, setIsFetchingPatient] = useState<boolean>(false);
  const [patientFetchError, setPatientFetchError] = useState<string | null>(
    null
  );

  // --- Fetch Nurses Effect ---
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await nurseApiRequest.getListNurse(1, 100);
        if (response.status === 200 && response.payload?.data) {
          console.log("Data received from API:", response.payload.data); // Log data before setting
          setUsers(response.payload.data); // Schedule state update
          // DO NOT log `users` immediately here
        } else {
          console.error("Failed to fetch staff:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    fetchStaff();
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    if (users.length > 0) {
      console.log("Users state updated:", users);
    }
  }, [users]);

  const nurseIdToNameMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    // console.log("Recomputing nurse map. Users:", users); // Debugging line
    users.forEach((user) => {
      // Ensure both id and name exist and are strings before adding
      if (
        user["nurse-id"] &&
        typeof user["nurse-id"] === "string" &&
        user["nurse-name"] &&
        typeof user["nurse-name"] === "string"
      ) {
        map[user["nurse-id"]] = user["nurse-name"];
      } else {
        // console.warn("Skipping user due to missing/invalid id or name:", user);
      }
    });
    return map;
  }, [users]);

  // --- Fetch Patient Details Effect ---
  useEffect(() => {
    const fetchPatientData = async (patientId: string) => {
      setIsFetchingPatient(true);
      setPatientFetchError(null);
      setPatientDetails(null);
      console.log(`Fetching patient with ID: ${patientId}`);
      try {
        const response = await patientApiRequest.getPatientById(patientId);

        // --- CORRECTED LOGIC ---
        if (response.status === 200 && response.payload?.data) {
          // Check if the nested 'data' object exists and looks like a patient
          const patientData = response.payload.data;
          console.log("Patient data fetched:", patientData);
          // Add a more specific check if possible (e.g., presence of name or id)
          if (
            patientData &&
            (patientData["patient-id"] ||
              patientData["id"] ||
              patientData["full-name"])
          ) {
            // Check for common fields
            setPatientDetails(patientData); // Set the actual patient record
          } else {
            console.warn(
              "Fetched patient data missing expected fields:",
              patientData
            );
            setPatientFetchError("Dữ liệu bệnh nhân không hợp lệ.");
            setPatientDetails(null);
          }
        } else if (response.status === 200) {
          console.warn(
            "Patient fetch successful but payload.data missing:",
            response.payload
          );
          setPatientFetchError("Không tìm thấy dữ liệu bệnh nhân.");
          setPatientDetails(null); // Ensure state is cleared
        } else {
          console.error(
            "Failed to fetch patient details (status !== 200):",
            response
          );
          setPatientFetchError(
            response.payload?.message ||
              `Lỗi ${response.status}: Không thể tải thông tin bệnh nhân.`
          );
          setPatientDetails(null); // Ensure state is cleared
        }
      } catch (error: any) {
        console.error("Error executing fetchPatient:", error);
        setPatientFetchError(
          error.message || "Lỗi mạng khi tải thông tin bệnh nhân."
        );
        setPatientDetails(null); // Ensure state is cleared
      } finally {
        setIsFetchingPatient(false);
      }
    };

    // Trigger fetch logic
    if (isOpen && event?.["patient-id"]) {
      fetchPatientData(event["patient-id"]);
    } else {
      setPatientDetails(null);
      setIsFetchingPatient(false);
      setPatientFetchError(null);
    }
  }, [isOpen, event]); // Re-run if dialog opens/closes or the event object changes

  // --- Prepare Display Values ---
  const displayDate = formatDateTimePart(event?.["est-date"], "date");
  const startTime = formatDateTimePart(event?.["est-date"], "time");

  // Nurse Display Logic
  const nursingId = event?.["nursing-id"];
  let nurseDisplay = "Chưa gán";
  if (nursingId && typeof nursingId === "string") {
    nurseDisplay = nurseIdToNameMap[nursingId] || nursingId; // Fallback to ID
  }
  let patientDisplay: React.ReactNode;
  if (isFetchingPatient) {
    patientDisplay = (
      <span className="flex items-center gap-1 text-gray-500 italic">
        Đang tải...
      </span>
    );
  } else if (patientFetchError) {
    patientDisplay = (
      <span
        className="flex items-center gap-1 text-red-600"
        title={patientFetchError}
      >
        <AlertCircle className="w-3 h-3" /> Lỗi
      </span>
    );
  } else if (patientDetails && patientDetails["full-name"]) {
    patientDisplay = patientDetails["full-name"];
  } else {
    patientDisplay = event?.["patient-id"] || "N/A";
  }

  if (!event) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-blue-600" />
            Chi tiết lịch hẹn
          </AlertDialogTitle>
          <div className="pt-5 space-y-4 text-sm text-gray-700 border-t mt-3">
            {/* Date */}
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">Ngày hẹn:</span>
                <span className="ml-1 font-semibold text-gray-800">
                  {displayDate}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">
                  Thời gian bắt đầu:
                </span>
                <span className="ml-1 font-semibold text-gray-800">
                  {startTime}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">
                  Tổng thời gian (dự kiến):
                </span>
                <span className="ml-1 font-semibold text-gray-800">
                  {(event as any)["total-est-duration"]
                    ? `${(event as any)["total-est-duration"]} phút`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-start gap-3 min-h-[20px]">
              {" "}
              <Users className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">Bệnh nhân:</span>
                <span className="ml-1 font-semibold text-gray-800">
                  {patientDisplay} {/* Use the state-driven display variable */}
                </span>
              </div>
            </div>

            {/* Assigned Nurse */}
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">Điều dưỡng:</span>
                <span className="ml-1 font-semibold text-gray-800">
                  {nurseDisplay}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Trạng thái:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}
                >
                  {translateStatusToVietnamese(event.status)}
                </span>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventDetailsDialog;
