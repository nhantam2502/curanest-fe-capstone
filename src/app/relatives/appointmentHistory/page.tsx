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

interface AppointmentProp {
  time_from_to: string;
  apiData: Appointment;
  cusPackage?: CusPackageResponse | null;
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
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
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

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch nurse data when component mounts
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
      if (!selectedPatientId) return;

      try {
        setIsLoading(true);
        const estDateFrom = selectedDay
          ? `${monthFilter}-${String(selectedDay).padStart(2, "0")}`
          : `${monthFilter}-01`;

        const response = await appointmentApiRequest.getHistoryAppointment(
          currentPage,
          undefined,
          selectedPatientId,
          estDateFrom
        );

        if (response.payload && response.payload.success) {
          setTotalPages(
            Math.ceil(
              response.payload.paging.total / response.payload.paging.size
            )
          );

          const formattedAppointmentsPromises = response.payload.data.map(
            async (appointment: Appointment) => {
              const nursingId = appointment["nursing-id"];

              const matchedNurse = nurses.find((nurse) => {
                const nurseMatches =
                  String(nurse["nurse-id"]) === String(nursingId);
                return nurseMatches;
              });

              return await transformAppointment(
                appointment,
                matchedNurse || null
              );
            }
          );

          const formattedAppointments = await Promise.all(
            formattedAppointmentsPromises
          );
          setAppointments(formattedAppointments);
        } else {
          setAppointmentError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching appointment history:", err);
        setError("Failed to load appointment history. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedPatientId, monthFilter, selectedDay, currentPage]);

  const transformAppointment = async (
    appointment: Appointment,
    matchedNurse: NurseItemType | null
  ): Promise<AppointmentProp> => {
    // Extract time information from appointment
    const estDate = appointment["est-date"];
    const date = new Date(estDate);

    // Định dạng ngày: YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Định dạng giờ: HH:MM (24h format)
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    const endTime = new Date(
      date.getTime() + appointment["total-est-duration"] * 60000
    );
    const formattedEndTime = `${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`;

    let cusPackage = null;
    // Gọi API để lấy thông tin cusPackage nếu có cusPackageID
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

    // Store additional appointment details in the appointmentDetails state
    const nursingName = matchedNurse
      ? matchedNurse["nurse-name"]
      : "Không có thông tin";

    // Update appointment details in the state
    setAppointmentDetails((prev) => ({
      ...prev,
      [appointment.id]: {
        nursingName,
        appointment_date: formattedDate,
        estTimeFrom: formattedTime,
        estTimeTo: formattedEndTime,
        totalPrice: cusPackage?.data?.price || undefined,
        status: appointment.status,
      },
    }));

    // Return formatted appointment data
    return {
      time_from_to: formattedTime,
      apiData: appointment,
      cusPackage: cusPackage,
    };
  };

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, selectedDay, selectedPatientId]);

  const handleViewDetail = (appointment: any) => {
    const nurse = nurses.find(
      (nurse) => nurse["nurse-id"] === appointment.apiData["nursing-id"]
    );
    setSelectedAppointment(appointment);
    setSelectedNurse(nurse);
    setIsDialogOpen(true);
  };

  const handleViewMedicalReport = (appointment: AppointmentProp) => {
    const details = appointmentDetails[appointment.apiData.id];
    const sampleReport = {
      nurse_name: details.nursingName,
      avatar: "https://github.com/shadcn.png", // Default avatar
      report_date: formatDate(new Date(appointment.apiData["est-date"])),
      report_time: `${details.estTimeFrom} - ${details.estTimeTo}`,
      report:
        "Bệnh nhân đến khám trong tình trạng tỉnh táo, các chỉ số sinh tồn trong giới hạn bình thường.\n\nHuyết áp: 120/80 mmHg\nNhịp tim: 75 lần/phút\nNhiệt độ: 36.5°C\n\nĐã thực hiện đầy đủ các kỹ thuật theo yêu cầu. Bệnh nhân hợp tác tốt trong quá trình điều trị.",
      advice: [
        "Duy trì chế độ ăn uống lành mạnh, hạn chế thức ăn nhiều dầu mỡ",
        "Tập thể dục đều đặn, mỗi ngày 30 phút",
        "Uống đủ nước, ít nhất 2 lít mỗi ngày",
        "Theo dõi huyết áp hàng ngày và ghi chép lại",
      ],
    };

    setSelectedReport(sampleReport);
    setIsMedicalReportOpen(true);
  };

  const handleSendFeedback = (appointment: AppointmentProp) => {
    setSelectedAppointment(appointment);
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = async (feedback: {
    rating: number;
    content: string;
  }) => {
    console.log("Submitting feedback:", feedback);
    // Implement API call to submit feedback
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

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng số trang tối đa, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu tổng số trang nhiều hơn số trang tối đa
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        // Nếu trang hiện tại gần đầu
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // Dấu "..."
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        // Nếu trang hiện tại gần cuối
        pageNumbers.push(1);
        pageNumbers.push(null); // Dấu "..."
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Nếu trang hiện tại ở giữa
        pageNumbers.push(1);
        pageNumbers.push(null); // Dấu "..."
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // Dấu "..."
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover min-h-screen pb-16">
      <div className="max-w-full w-[1600px] px-4 mx-auto flex flex-col ">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch sử cuộc hẹn
            </h2>
          </div>

          {/* Patient Selection Component */}
          <PatientSelection
            patients={patients}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
          />
        </div>

        {selectedPatientId ? (
          <>
            {/* Month Filter Component */}
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
            {/* Appointments Table */}
            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-xl">
                      Điều dưỡng
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
                        <p className="text-red-600 text-lg">
                          {appointmentError}
                        </p>
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
                            {details.nursingName}
                          </TableCell>

                          <TableCell className="font-semibold text-red-500 text-lg">
                            {`${appointment.cusPackage?.data.package["total-fee"].toLocaleString()} VND`}
                          </TableCell>
                          <TableCell className="text-lg">
                            {formatDate(
                              new Date(appointment.apiData["est-date"])
                            )}
                          </TableCell>
                          <TableCell className="text-lg">
                            {`${details.estTimeFrom} - ${details.estTimeTo}`}
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
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() =>
                                  handleViewMedicalReport(appointment)
                                }
                                className="flex items-center text-blue-600 text-lg"
                              >
                                <FileText className="mr-1 h-4 w-4" /> Báo cáo
                              </Button>
                              <Button
                                variant="outline"
                                size="default"
                                onClick={() => handleSendFeedback(appointment)}
                                className="flex items-center text-green-600 text-lg"
                              >
                                <MessageCircle className="mr-1 h-4 w-4" /> Đánh
                                giá
                              </Button>
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

              {/* Pagination */}
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
                              onClick={() =>
                                handlePageChange(pageNumber as number)
                              }
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
          </>
        ) : (
          <div className="text-center py-12 flex-1 flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-600 text-xl font-medium">
              Vui lòng chọn hồ sơ bệnh nhân để xem lịch sử cuộc hẹn
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      {selectedAppointment && (
        <DetailAppointment
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          appointment={selectedAppointment}
          nurse={nurses.find(
            (nurse) =>
              nurse["nurse-id"] === selectedAppointment.apiData["nursing-id"]
          )}
          patient={patients[0]}
        />
      )}

      {/* Medical report */}
      {selectedReport && (
        <MedicalReport
          isOpen={isMedicalReportOpen}
          onClose={() => setIsMedicalReportOpen(false)}
          medical_report={selectedReport}
        />
      )}

      {/* Send Feedback */}
      {selectedAppointment && (
        <FeedbackDialog
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          appointment={selectedAppointment}
          onSubmit={handleSubmitFeedback}
          nurse={nurses.find(
            (nurse) =>
              nurse["nurse-id"] === selectedAppointment.apiData["nursing-id"]
          )}
        />
      )}
    </section>
  );
};

export default AppointmentHistory;
