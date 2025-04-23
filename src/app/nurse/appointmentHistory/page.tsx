"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

const AppointmentHistory: React.FC = () => {
  // State for API data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [packageDetails, setPackageDetails] = useState<
    Record<string, CusPackageResponse>
  >({});
  // Thêm state lưu thông tin bệnh nhân
  const [patientRecords, setPatientRecords] = useState<
    Record<string, PatientRecord>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data: session } = useSession();
  const nursingId = session?.user?.id || "";

  // State for filters
  const [filters, setFilters] = useState({
    patientName: "",
    serviceName: "",
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: "",
    paymentStatus: "",
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
      return null;
    }
  };

  // Thêm hàm fetch thông tin bệnh nhân
  const fetchPatientRecord = async (patientId: string) => {
    try {
      const response = await patientApiRequest.getPatientRecordByID(patientId);
      return response.payload.data; // Điều chỉnh theo cấu trúc response thực tế của API
    } catch (error) {
      console.error(
        `Error fetching patient record for ID ${patientId}:`,
        error
      );
      return null;
    }
  };

  // Fetch appointment history data
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // Format date if provided
      const estDateFrom = filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined;

      // Call API with current page and filters
      const response = await appointmentApiRequest.getHistoryAppointment(
        currentPage,
        nursingId,
        undefined,
        estDateFrom
      );

      if (response.payload.success) {
        const appointmentsData = response.payload.data;
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        setTotalPages(
          Math.ceil(
            response.payload.paging.total / response.payload.paging.size
          )
        );

        // Fetch package details for each appointment
        const packageDetailsMap: Record<string, CusPackageResponse> = {};
        // Tạo map lưu thông tin bệnh nhân
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
        setPatientRecords(patientRecordsMap); // Lưu thông tin bệnh nhân vào state
      } else {
        console.error("Failed to fetch appointments");
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when page or filters change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, nursingId, filters.fromDate]);

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
      status: "all" as "all" | "completed" | "cancelled" | "no-show",
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
      // patient_id: appointment["patient-id"],
      patient_name: patientRecord?.["full-name"] || "Không có thông tin",
      patient_info: patientRecord,
      date: appointment["est-date"],
      cusPackageID: appointment["cuspackage-id"],
      status: appointment.status,
      totalAmount:
        packageDetail?.data?.package?.["total-fee"]?.toString() ||
        "Không có thông tin",
      paymentStatus:
        packageDetail?.data?.package?.["payment-status"] || ("unpaid" as any),
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
