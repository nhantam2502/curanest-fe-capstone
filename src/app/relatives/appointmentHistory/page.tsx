"use client";
import React, { useState, useEffect } from "react";
import { CalendarDays, Eye, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import MedicalReport from "@/app/components/Relatives/MedicalReport";
import FeedbackDialog from "@/app/components/Relatives/FeedbackDialog";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";
import PatientSelection from "@/app/components/Relatives/PatientSelection";
import MonthFilter from "@/app/components/Relatives/MonthFilter";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { NurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils";
import { toast } from "react-toastify"; // Thêm thư viện thông báo

interface AppointmentProp {
  estTimeFrom: string;
  estTimeTo: string;
  apiData: Appointment;
  cusPackage?: CusPackageResponse | null;
  patientInfo?: PatientRecord | null;
}

const AppointmentHistory = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentProp | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);
  const [nurses, setNurses] = useState<NurseItemType[]>([]);
  const [monthFilter, setMonthFilter] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentProp[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState<
    Record<string, any>
  >({});
  const [loadingNurses, setLoadingNurses] = useState<boolean>(false);
  const [nurseError, setNurseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  // Thêm state cho medical record
  const [medicalRecordLoading, setMedicalRecordLoading] =
    useState<boolean>(false);
  const [medicalRecordError, setMedicalRecordError] = useState<string | null>(
    null
  );
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [medicalReportIds, setMedicalReportIds] = useState<Record<string, string>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, selectedDay, selectedPatientId]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await patientApiRequest.getPatientRecord();
        setPatients(response.payload.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching patient records:", err);
        setError("Failed to load patient records. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchListNurse = async () => {
      try {
        setLoadingNurses(true);
        const response = await nurseApiRequest.getListNurseNoFilter();
        if (response.payload && response.payload.data) {
          setNurses(response.payload.data);
          setNurseError(null);
        } else {
          console.error("Invalid nurse data format:", response);
          setNurseError("Định dạng dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Error fetching nurses:", error);
        setNurseError("Không thể tải thông tin điều dưỡng.");
      } finally {
        setLoadingNurses(false);
      }
    };
    fetchListNurse();
  }, []);

 useEffect(() => {
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setAppointmentError(null); // Reset lỗi trước khi gọi API
      const estDateFrom = selectedDay
        ? `${monthFilter}-${String(selectedDay).padStart(2, "0")}`
        : `${monthFilter}-01`;
      console.log("Fetching appointments with params:", {
        page: currentPage,
        pageSize,
        patientId: selectedPatientId || undefined,
        estDateFrom,
      });
      const response = await appointmentApiRequest.getHistoryAppointment(
        currentPage,
        pageSize,
        undefined,
        selectedPatientId || undefined,
        estDateFrom
      );
      if (response.payload && response.payload.success) {
        setTotalPages(response.payload.paging.total);
        const formattedAppointmentsPromises = response.payload.data.map(
          async (appointment: Appointment) => {
            const nursingId = appointment["nursing-id"];
            const patientId = appointment["patient-id"];
            const matchedNurse = nurses.find(
              (nurse) => String(nurse["nurse-id"]) === String(nursingId)
            );
            const patientInfo = patients.find(
              (patient) => String(patient.id) === String(patientId)
            );
            return await transformAppointment(
              appointment,
              matchedNurse || null,
              patientInfo || null
            );
          }
        );
        const formattedAppointments = await Promise.all(
          formattedAppointmentsPromises
        );
        setAppointments(formattedAppointments);
        if (formattedAppointments.length === 0) {
          toast.info(
            `Không tìm thấy cuộc hẹn cho tháng ${monthFilter} và ngày ${
              selectedDay || "tất cả"
            }`
          );
        }
      } else {
        setAppointmentError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching appointment history:", err);
      setAppointmentError("Lỗi khi tải lịch sử cuộc hẹn. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };
  fetchAppointments();
}, [selectedPatientId, monthFilter, selectedDay, currentPage, patients, nurses]);

  const transformAppointment = async (
    appointment: Appointment,
    matchedNurse: NurseItemType | null,
    patientInfo: PatientRecord | null
  ): Promise<AppointmentProp> => {
    const estDate = appointment["est-date"];
    const date = new Date(estDate);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const endTime = new Date(
      date.getTime() + appointment["total-est-duration"] * 60000
    );
    const formattedEndTime = `${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`;
    let cusPackage = null;
    if (appointment["cuspackage-id"]) {
      try {
        const response = await appointmentApiRequest.getCusPackage(
          appointment["cuspackage-id"],
          appointment["est-date"]
        );
        if (response && response.payload && response.payload.success) {
          cusPackage = response.payload;
        } else {
          console.error("Failed to fetch cusPackage data:", response);
        }
      } catch (error) {
        console.error("Error fetching cusPackage:", error);
      }
    }
    const nursingName = matchedNurse
      ? matchedNurse["nurse-name"]
      : "Không có thông tin";
    setAppointmentDetails((prev) => ({
      ...prev,
      [appointment.id]: {
        nursingName,
        appointment_date: formattedDate,
        estTimeFrom: formattedTime,
        estTimeTo: formattedEndTime,
        totalPrice: cusPackage?.data?.price || undefined,
        status: appointment.status,
        patientName: patientInfo
          ? patientInfo["full-name"]
          : "Không có thông tin",
      },
    }));
    return {
      estTimeFrom: formattedTime,
      estTimeTo: formattedEndTime,
      apiData: appointment,
      cusPackage: cusPackage,
      patientInfo: patientInfo,
    };
  };

  const handleViewDetail = (appointment: any) => {
    const nurse = nurses.find(
      (nurse) => nurse["nurse-id"] === appointment.apiData["nursing-id"]
    );
    setSelectedAppointment(appointment);
    setSelectedNurse(nurse);
    setIsDialogOpen(true);
  };


  const handleViewMedicalReport = async (appointmentID: string) => {
    if (!appointmentID) {
      toast.error("Không tìm thấy ID cuộc hẹn.");
      return;
    }
    const controller = new AbortController();
    setMedicalRecordLoading(true);
    setMedicalRecordError(null);

    try {
      const response =
        await appointmentApiRequest.getMedicalRecord(appointmentID);
      if (response.payload.data && response.payload.data) {
        // Tìm thông tin y tá từ appointmentID
        const appointment = appointments.find(
          (app) => app.apiData.id === appointmentID
        );
        const nurseId = appointment?.apiData["nursing-id"];
        const nurse = nurses.find((nurse) => nurse["nurse-id"] === nurseId);
    
        const formattedReport = {
          nurse_name: nurse?.["nurse-name"] || "Không xác định",
          avatar: nurse?.["nurse-picture"] || "/default-avatar.png",
          report: response.payload.data,
        };

        setSelectedReport(formattedReport);
        setIsMedicalReportOpen(true);
      } else {
        throw new Error("Dữ liệu báo cáo y tế không hợp lệ.");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch medical record aborted");
        return;
      }
      console.error("Error fetching medical record:", error);
      setMedicalRecordError(
        "Không thể tải báo cáo y tế. Vui lòng thử lại sau."
      );
      toast.error("Không thể tải báo cáo y tế. Vui lòng thử lại sau.");
    } finally {
      setMedicalRecordLoading(false);
    }

    return () => {
      controller.abort();
    };
  };

  const handleViewFeedback = async (appointment: AppointmentProp) => {
    const appointmentId = appointment.apiData.id;
    // Chỉ lấy medical report ID nếu chưa có trong state
    if (!medicalReportIds[appointmentId]) {
      try {
        const response = await appointmentApiRequest.getMedicalRecord(appointmentId);
        if (response.payload.data) {
          setMedicalReportIds(prev => ({
            ...prev,
            [appointmentId]: response.payload.data.id
          }));
        }
      } catch (error) {
        console.error(`Error fetching medical report ID for appointment ${appointmentId}:`, error);
        toast.error("Không thể tải thông tin báo cáo y tế");
      }
    }
    setSelectedAppointment(appointment);
    setIsFeedbackOpen(true);
  };

  const handleMonthChange = (year: string, monthIndex: number) => {
    const formattedMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    setMonthFilter(formattedMonth);
    setSelectedDay(null);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day === "" ? null : parseInt(day, 10));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentYear = monthFilter.split("-")[0];
  const currentMonthIndex = parseInt(monthFilter.split("-")[1], 10) - 1;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // console.log(
  //   "medicalReportIds: ",
  //   selectedAppointment ? medicalReportIds[selectedAppointment.apiData.id] : null
  // );
  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover min-h-screen pb-16">
      <div className="max-w-full w-[1600px] px-4 mx-auto flex flex-col">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch sử cuộc hẹn
            </h2>
          </div>
          <PatientSelection
            patients={patients}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
          />
        </div>
        <MonthFilter
          currentYear={currentYear}
          currentMonthIndex={currentMonthIndex}
          selectedDay={selectedDay}
          handleMonthChange={handleMonthChange}
          handleDayChange={handleDayChange}
        />
        {loadingNurses && (
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-600 text-lg">
              Đang tải thông tin điều dưỡng...
            </p>
          </div>
        )}
        {nurseError && (
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-600 text-lg">{nurseError}</p>
          </div>
        )}
        {appointmentError && (
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-600 text-lg">{appointmentError}</p>
          </div>
        )}
        {medicalRecordError && (
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-600 text-lg">{medicalRecordError}</p>
          </div>
        )}
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-xl">
                  Điều dưỡng
                </TableHead>
                <TableHead className="font-semibold text-xl">
                  Bệnh nhân
                </TableHead>
                <TableHead className="font-semibold text-xl">
                  Tổng tiền
                </TableHead>
                <TableHead className="font-semibold text-xl">
                  Ngày hẹn
                </TableHead>
                <TableHead className="font-semibold text-xl">
                  Thời gian
                </TableHead>
                <TableHead className="font-semibold text-xl text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="font-semibold text-xl text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-600 text-lg">
                      Đang tải dữ liệu lịch sử cuộc hẹn...
                    </p>
                  </TableCell>
                </TableRow>
              ) : appointmentError ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-red-600 text-lg">{appointmentError}</p>
                  </TableCell>
                </TableRow>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const details =
                    appointment.apiData && appointment.apiData.id
                      ? appointmentDetails[appointment.apiData.id]
                      : null;
                  return (
                    <TableRow key={appointment.apiData.id}>
                      <TableCell className="text-lg font-semibold">
                        {details?.nursingName}
                      </TableCell>
                      <TableCell className="text-lg font-semibold">
                        {details?.patientName || "Không có thông tin"}
                      </TableCell>
                      <TableCell className="font-semibold text-red-500 text-lg">
                        {appointment.cusPackage?.data?.package?.["total-fee"]
                          ? `${appointment.cusPackage?.data?.package?.["total-fee"].toLocaleString()} VND`
                          : "Không có thông tin"}
                      </TableCell>
                      <TableCell className="text-lg">
                        {formatDate(new Date(appointment.apiData["est-date"]))}
                      </TableCell>
                      <TableCell className="text-lg">
                        {details
                          ? `${details.estTimeFrom} - ${details.estTimeTo}`
                          : "Không có thông tin"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`${getStatusColor(appointment.apiData.status)} hover:${getStatusColor(appointment.apiData.status)} text-white text-lg`}
                        >
                          {getStatusText(appointment.apiData.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => handleViewDetail(appointment)}
                            className="flex items-center text-lg"
                          >
                            <Eye className="mr-1 h-4 w-4" /> Chi tiết
                          </Button>
                          {appointment.apiData.status === "success" && (
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() =>
                                handleViewMedicalReport(appointment.apiData.id)
                              }
                              className="flex items-center text-blue-600 text-lg"
                              disabled={medicalRecordLoading}
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              {medicalRecordLoading ? "Đang tải..." : "Báo cáo"}
                            </Button>
                          )}
                          {appointment.apiData.status === "success" && (
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => handleViewFeedback(appointment)}
                              className="flex items-center text-green-600 text-lg"
                            >
                              <MessageCircle className="mr-1 h-4 w-4" /> Đánh
                              giá
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-600 text-lg">
                      Không có lịch sử cuộc hẹn nào trong thời gian đã chọn
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {appointments.length > 0 && (
            <div className="py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers().map((pageNumber, index) =>
                    pageNumber === null ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${pageNumber}`}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => handlePageChange(pageNumber as number)}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center mt-4 text-gray-500">
                Trang {currentPage} / {totalPages} • Hiển thị{" "}
                {appointments.length} cuộc hẹn
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <DetailAppointment
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          appointment={selectedAppointment}
          nurse={nurses.find(
            (nurse) =>
              nurse["nurse-id"] === selectedAppointment.apiData["nursing-id"]
          )}
          patient={
            selectedAppointment.patientInfo ||
            patients.find(
              (patient) =>
                patient.id === selectedAppointment.apiData["patient-id"]
            ) ||
            ({} as PatientRecord)
          }
        />
      )}
      {selectedReport && selectedAppointment && (
        <MedicalReport
          isOpen={isMedicalReportOpen}
          onClose={() => setIsMedicalReportOpen(false)}
          medical_report={selectedReport}
          appointment={selectedAppointment}
        />
      )}
      {selectedAppointment && (
        <FeedbackDialog
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          appointment={selectedAppointment}
          nurse={nurses.find(
            (nurse) =>
              nurse["nurse-id"] === selectedAppointment.apiData["nursing-id"]
          )}
          medicalReportId={medicalReportIds[selectedAppointment.apiData.id]}
          patientName={appointmentDetails[selectedAppointment.apiData.id]?.patientName}
        />
      )}
    </section>
  );
};

export default AppointmentHistory;