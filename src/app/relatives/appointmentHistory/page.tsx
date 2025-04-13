"use client";
import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Eye,
  FileText,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import nurseData from "@/dummy_data/dummy_nurse.json";
import FeedbackDialog from "@/app/components/Relatives/FeedbackDialog";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";
import PatientSelection from "@/app/components/Relatives/PatientSelection";
import MonthFilter from "@/app/components/Relatives/MonthFilter";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";

const dummyData = [
  {
    id: 1,
    patientId: "01960e73-dcbe-7dfc-af7f-bc341a064fc7",
    nurse_name: "Ho Dac Nhan Tam",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0987654321",
    total_fee: 500000,
    appointment_date: "2025-04-01",
    time_from_to: "08:00 - 09:00",
  },
  {
    id: 2,
    nurse_name: "Trần Thị B",
    patientId: "01960e73-dcbe-7dfc-af7f-bc341a064fc7",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0912345678",
    total_fee: 300000,
    appointment_date: "2025-04-05",
    time_from_to: "10:00 - 11:00",
  },
  // Thêm thêm dữ liệu giả để kiểm tra phân trang
  {
    id: 3,
    patientId: "01960e73-dcbe-7dfc-af7f-bc341a064fc7",
    nurse_name: "Nguyễn Văn C",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0978123456",
    total_fee: 450000,
    appointment_date: "2025-04-10",
    time_from_to: "14:00 - 15:00",
  },
  {
    id: 4,
    patientId: "01960e73-dcbe-7dfc-af7f-bc341a064fc7",
    nurse_name: "Lê Thị D",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0901234567",
    total_fee: 350000,
    appointment_date: "2025-04-15",
    time_from_to: "09:00 - 10:00",
  },
  {
    id: 5,
    patientId: "01960e73-dcbe-7dfc-af7f-bc341a064fc7",
    nurse_name: "Phạm Văn E",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0923456789",
    total_fee: 520000,
    appointment_date: "2025-04-20",
    time_from_to: "16:00 - 17:00",
  },
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedPatientId) return;

      try {
        setIsLoading(true);
        // Tạo chuỗi ngày từ monthFilter
        const estDateFrom = selectedDay
          ? `${monthFilter}-${String(selectedDay).padStart(2, "0")}`
          : `${monthFilter}-01`;

        const response = await appointmentApiRequest.getHistoryAppointment(
          currentPage,
          undefined, // nursingId không được sử dụng trong trường hợp này
          selectedPatientId,
          estDateFrom
        );

        if (response.payload.data) {
          setAppointments(response.payload.data || []);

          setTotalPages(
            Math.ceil(
              response.payload.paging.total / response.payload.paging.size
            )
          );

          // Giả lập thông tin chi tiết cho mỗi cuộc hẹn
          // Trong thực tế, bạn có thể cần gọi API khác để lấy thông tin chi tiết này
          // const details: Record<string, any> = {};
          // response.data.forEach(appointment => {
          //   details[appointment.id] = {
          //     nursingName: "Điều dưỡng " + appointment.id.substring(0, 5),
          //     nursingPhoneNumber: "09" + Math.floor(Math.random() * 100000000),
          //     estTimeFrom: "08:00",
          //     estTimeTo: "09:00",
          //     totalPrice: Math.floor(Math.random() * 500000) + 200000,
          //     // Thêm các thông tin khác nếu cần
          //   };
          // });
          // setAppointmentDetails(details);
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

  console.log("Appointments: ", appointments);

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, selectedDay, selectedPatientId]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleViewDetail = (appointment: any) => {
    const nurse = nurseData.find((n) => n.id === appointment.id);
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
      // techniques: appointment.techniques || [],
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

  // const filteredAppointments = dummyData.filter((appointment) => {
  //   const appointmentMonth = appointment.appointment_date.substring(0, 7);
  //   const appointmentDay = parseInt(
  //     appointment.appointment_date.substring(8, 10),
  //     10
  //   );

  //   return (
  //     appointment.status === "completed" &&
  //     appointmentMonth === monthFilter &&
  //     appointment.patientId === selectedPatientId &&
  //     (selectedDay === null || appointmentDay === selectedDay)
  //   );
  // });

  // Tính toán số trang
  // const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  // Lấy dữ liệu cho trang hiện tại
  // const paginatedAppointments = filteredAppointments.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

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

            {/* Appointments Table */}
            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-xl">
                      Điều dưỡng
                    </TableHead>
                    <TableHead className="font-semibold text-xl">
                      Số điện thoại
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
                    <TableHead className="font-semibold text-xl">
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
                          Đang tải dữ liệu...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : appointments.length > 0 ? (
                    appointments.map((appointment) => {
                      const details =
                        appointment.apiData && appointment.apiData.id
                          ? appointmentDetails[appointment.apiData.id]
                          : null; // or some default value
                      return (
                        <TableRow key={appointment.apiData.id}>
                          <TableCell className="text-lg">
                            {details.nursingName}
                          </TableCell>
                          <TableCell className="text-lg">
                            {details.nursingPhoneNumber}
                          </TableCell>
                          <TableCell className="font-semibold text-red-500 text-lg">
                            {Number(details.totalPrice).toLocaleString("vi-VN")}{" "}
                            VND
                          </TableCell>
                          <TableCell className="text-lg">
                            {formatDate(
                              new Date(appointment.apiData["est-date"])
                            )}
                          </TableCell>
                          <TableCell className="text-lg">
                            {`${details.estTimeFrom} - ${details.estTimeTo}`}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 text-[16px]">
                              {appointment.apiData.status === "completed"
                                ? "Hoàn thành"
                                : appointment.apiData.status}
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
          nurse={selectedNurse}
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
        />
      )}
    </section>
  );
};

export default AppointmentHistory;
