"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppointmentHistoryFilters from "@/app/components/Nursing/AppointmentHistoryFilters";
import AppointmentHistoryTable from "@/app/components/Nursing/AppointmentHistoryTable";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import { format } from "date-fns";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { useSession } from "next-auth/react";
import { PatientRecord } from "@/types/patient";
import { getStartTimeFromEstDate } from "@/lib/utils";
import { toast } from "react-toastify";

const AppointmentHistory: React.FC = () => {
  // State for API data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [packageDetails, setPackageDetails] = useState<
    Record<string, CusPackageResponse>
  >({});
  const [patientRecords, setPatientRecords] = useState<
    Record<string, PatientRecord>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  const { data: session } = useSession();
  const nursingId = session?.user?.id || "";

  // State for filters
  const [filters, setFilters] = useState({
    patientName: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: "all" as "all" | "success" | "cancel" | "confirmed" | "upcoming",
    paymentStatus: "all" as "all" | "paid" | "unpaid" | "partial",
  });

  // Hàm tính thời gian kết thúc từ thời gian bắt đầu và thời lượng (tính bằng phút)
  const calculateEndTime = (startTimeStr: string, durationMinutes: number) => {
    const [hours, minutes] = startTimeStr.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    return `${endHours}:${endMinutes}`;
  };

  // Fetch customer package details
  const fetchPackageDetails = async (cusPackageId: string, estDate: string) => {
    try {
      const response = await appointmentApiRequest.getCusPackage(
        cusPackageId,
        estDate
      );
      return response.payload.data;
    } catch (error) {
      console.error(
        `Error fetching package details for ID ${cusPackageId}:`,
        error
      );
      toast.error(`Không thể lấy thông tin gói dịch vụ ${cusPackageId}`);
      return null;
    }
  };

  // Fetch patient record
  const fetchPatientRecord = async (patientId: string) => {
    try {
      const response = await patientApiRequest.getPatientRecordByID(patientId);
      return response.payload.data;
    } catch (error) {
      console.error(
        `Error fetching patient record for ID ${patientId}:`,
        error
      );
      toast.error(`Không thể lấy thông tin bệnh nhân ${patientId}`);
      return null;
    }
  };

  // Fetch appointment history data
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const estDateFrom = filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined;

      const response = await appointmentApiRequest.getHistoryAppointment(
        currentPage,
        pageSize,
        nursingId,
        undefined,
        estDateFrom
      );

      if (response.payload.success) {
        const appointmentsData = response.payload.data;
        setAppointments(appointmentsData);
        setTotalPages(Math.ceil(response.payload.paging.total / pageSize));

        const packageDetailsMap: Record<string, CusPackageResponse> = {};
        const patientRecordsMap: Record<string, PatientRecord> = {};

        await Promise.all(
          appointmentsData.map(async (appointment: Appointment) => {
            const cusPackageID = appointment["cuspackage-id"];
            const estDate = appointment["est-date"];
            const patientID = appointment["patient-id"];

            if (cusPackageID && estDate) {
              const details = await fetchPackageDetails(cusPackageID, estDate);
              if (details) {
                packageDetailsMap[cusPackageID] = details;
              }
            }

            // Fetch thông tin bệnh nhân nếu có patient-id
            if (patientID && !patientRecordsMap[patientID]) {
              const patientRecord = await fetchPatientRecord(patientID);
              if (patientRecord) {
                patientRecordsMap[patientID] = patientRecord;
              }
            }
          })
        );

        setPackageDetails(packageDetailsMap);
        setPatientRecords(patientRecordsMap);

        // Apply filters to the fetched data
        const updatedFilteredAppointments = appointmentsData.filter(
          (appointment: Appointment) => {
            const patientRecord = patientRecordsMap[appointment["patient-id"]];
            const packageDetail =
              packageDetailsMap[appointment["cuspackage-id"]];
            const appointmentDate = new Date(appointment["est-date"]);

            const matchesName = filters.patientName
              ? (patientRecord?.["full-name"]
                  ?.toLowerCase()
                  .includes(filters.patientName.toLowerCase()) ?? false)
              : true;

            const matchesStatus =
              filters.status === "all" || appointment.status === filters.status;

            const matchesPaymentStatus =
              filters.paymentStatus === "all" ||
              packageDetail?.data?.package["payment-status"] ===
                filters.paymentStatus;

            const matchesFromDate = filters.fromDate
              ? appointmentDate >= filters.fromDate
              : true;

            const matchesToDate = filters.toDate
              ? appointmentDate <= filters.toDate
              : true;

            return (
              matchesName &&
              matchesStatus &&
              matchesPaymentStatus &&
              matchesFromDate &&
              matchesToDate
            );
          }
        );

        setFilteredAppointments(updatedFilteredAppointments);
      } else {
        toast.error("Không thể lấy danh sách cuộc hẹn");
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu");
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when page or filters change
  useEffect(() => {
    if (nursingId) {
      fetchAppointments();
    }
  }, [currentPage, nursingId, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      patientName: "",
      serviceName: "",
      fromDate: null,
      toDate: null,
      status: "all" as "all" | "success" | "cancel" | "confirmed" | "upcoming",
      paymentStatus: "all" as "all" | "paid" | "unpaid" | "partial",
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const transformedAppointments = filteredAppointments.map((appointment) => {
    const packageDetail = packageDetails[appointment["cuspackage-id"]];
    const patientRecord = patientRecords[appointment["patient-id"]];
    const startTime = getStartTimeFromEstDate(appointment["est-date"]);
    const duration = appointment["total-est-duration"] || 0;
    const endTime = calculateEndTime(startTime, duration);

    return {
      id: appointment.id,
      patient_name: patientRecord?.["full-name"] ?? "Không có thông tin",
      patient_info: patientRecord,
      date: appointment["est-date"],
      cusPackageID: appointment["cuspackage-id"],
      status: appointment.status,
      totalAmount:
        packageDetail?.data?.package?.["total-fee"]?.toString() ??
        "Không có thông tin",
      paymentStatus:
        packageDetail?.data?.package?.["payment-status"] ?? "unpaid",
      estTimeFrom: startTime,
      estTimeTo: endTime,
    };
  });

  return (
    <div className="mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Lịch sử cuộc hẹn</h1>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch sử toàn bộ cuộc hẹn</CardTitle>
          <CardDescription>
            Quản lý và xem lại các cuộc hẹn đã hoàn thành, bị hủy hoặc khách
            không đến.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AppointmentHistoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          <div className="mt-6">
            <ScrollArea className="h-[60vh]">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : transformedAppointments.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p>Không có cuộc hẹn nào phù hợp với bộ lọc.</p>
                </div>
              ) : (
                <>
                  <AppointmentHistoryTable
                    appointments={transformedAppointments}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Trước
                      </button>
                      <span className="px-3 py-1">
                        Trang {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentHistory;
