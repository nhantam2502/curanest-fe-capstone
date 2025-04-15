"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GetAppointment } from "@/types/appointment"; // Corrected type import if needed
import {
  Clock,
  Users,
  Tag,
  Info,
  CalendarDays,
  ShieldCheck,
} from "lucide-react"; // Added ShieldCheck for Status
import { NurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: GetAppointment | null;
}

// Helper function to format date/time parts safely
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
      console.warn(`Invalid date string encountered: ${isoString}`);
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
    console.error(`Error formatting ${part} for: ${isoString}`, error);
    return part === "date" ? "Lỗi định dạng ngày" : "Lỗi định dạng giờ";
  }
};

const getStatusClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "success": // Treat success and completed same visually
      return "bg-green-100 text-green-800";
    case "waiting":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "refused": // Treat cancelled and refused same visually
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "changed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
}) => {
  if (!event) {
    return null; // Don't render anything if there's no event data
  }

  // Format date and time using the helper function
  const displayDate = formatDateTimePart(event["est-date"], "date");
  const startTime = formatDateTimePart(event["est-date"], "time");
  // Format end time only if act-date exists, otherwise use placeholder
  const [users, setUsers] = useState<NurseItemType[]>([]);
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

  const nursingId = event["nursing-id"];
  let nurseDisplay = "Chưa có"; // Default text
  let nurseTitle = nurseDisplay; // Title attribute text
  if (nursingId && typeof nursingId === "string") {
    // Lookup name using the memoized map
    const foundName = nurseIdToNameMap[nursingId];
    if (foundName) {
      nurseDisplay = foundName; // Use the found name
      nurseTitle = foundName;
    } else {
      nurseDisplay = `${nursingId}`; // Fallback to ID
      nurseTitle = `${nursingId} (Không tìm thấy tên)`;
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        {" "}
        {/* Optional: Adjust max width */}
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg">
            {" "}
            {/* Slightly larger title */}
            <Info className="w-5 h-5 text-blue-600" />
            Chi tiết lịch hẹn
          </AlertDialogTitle>
          {/* Use a container for details */}
          <div className="pt-5 space-y-4 text-sm text-gray-700 border-t mt-3">
            {/* Service/Package Info */}
            {/* Display Service ID first maybe? */}
            
            {/* <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">Dịch vụ:</span>
                <span className="ml-1 font-semibold text-gray-800">
                  {event["service-id"] || "N/A"}
                </span>
              </div>
            </div>
            {event["cuspackage-id"] && (
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500">Gói:</span>
                  <span className="ml-1 font-semibold text-gray-800">
                    {event["cuspackage-id"]}
                  </span>
                </div>
              </div>
            )} */}

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
                <span className="font-medium text-gray-500">Thời gian:</span>
                {/* Display formatted start and end times */}
                <span className="ml-1 font-semibold text-gray-800">
                  {startTime}
                </span>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500">Bệnh nhân:</span>
                <span className="ml-1 font-semibold text-gray-800">
                  {event["patient-id"] || "N/A"}
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
              <ShieldCheck className="w-4 h-4 text-gray-500 flex-shrink-0" />{" "}
              {/* Using ShieldCheck for status */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Trạng thái:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}
                >
                  {event.status || "N/A"}
                </span>
              </div>
            </div>

            {/* Add more details if available in GetAppointment */}
            {/* e.g., Notes, Address, etc. */}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          {/* Keep only the Close button */}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventDetailsDialog;