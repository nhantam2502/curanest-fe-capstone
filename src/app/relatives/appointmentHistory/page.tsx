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
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import MedicalReport from "@/app/components/Relatives/MedicalReport";
import nurseData from "@/dummy_data/dummy_nurse.json";
import FeedbackDialog from "@/app/components/Relatives/FeedbackDialog";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";

const dummyData = [
  {
    id: 1,
    patientId: "patient-0",
    nurse_name: "Ho Dac Nhan Tam",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0987654321",
    techniques: "Kỹ thuật A- Kỹ thuật B-Kỹ thuật C - Kỹ thuật G",
    total_fee: 500000,
    appointment_date: "2025-04-01",
    time_from_to: "08:00 - 09:00",
  },
  {
    id: 2,
    nurse_name: "Trần Thị B",
    patientId: "patient-1",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0912345678",
    techniques: "Kỹ thuật D-Kỹ thuật E",
    total_fee: 300000,
    appointment_date: "2025-04-01",
    time_from_to: "10:00 - 11:00",
  },
];

const months = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - i
).reverse();

const AppointmentHistory = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);
  const [monthFilter, setMonthFilter] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
  });
  const [isMedicalReportOpen, setIsMedicalReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleViewMedicalReport = (appointment: any) => {
    const sampleReport = {
      nurse_name: appointment.nurse_name,
      avatar: appointment.avatar,
      report_date: formatDate(new Date(appointment.appointment_date)),
      report_time: appointment.time_from_to.split("-")[1].trim(),
      report:
        "Bệnh nhân đến khám trong tình trạng tỉnh táo, các chỉ số sinh tồn trong giới hạn bình thường.\n\nHuyết áp: 120/80 mmHg\nNhịp tim: 75 lần/phút\nNhiệt độ: 36.5°C\n\nĐã thực hiện đầy đủ các kỹ thuật theo yêu cầu. Bệnh nhân hợp tác tốt trong quá trình điều trị.",
      advice: [
        "Duy trì chế độ ăn uống lành mạnh, hạn chế thức ăn nhiều dầu mỡ",
        "Tập thể dục đều đặn, mỗi ngày 30 phút",
        "Uống đủ nước, ít nhất 2 lít mỗi ngày",
        "Theo dõi huyết áp hàng ngày và ghi chép lại",
      ],
      techniques: appointment.techniques,
    };

    setSelectedReport(sampleReport);
    setIsMedicalReportOpen(true);
  };

  const handleSendFeedback = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = async (feedback: {
    rating: number;
    content: string;
  }) => {
    console.log("Submitting feedback:", feedback);
  };

  const filteredAppointments = dummyData.filter((appointment) => {
    const appointmentMonth = appointment.appointment_date.substring(0, 7);
    console.log("Appointment Month:", appointmentMonth);
    return (
      appointment.status === "completed" &&
      appointmentMonth === monthFilter &&
      appointment.patientId === selectedPatientId
    );
  });

  console.log("Filtered Appointments:", filteredAppointments);

  const handleMonthChange = (year: string, monthIndex: number) => {
    const formattedMonth = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    setMonthFilter(formattedMonth);
  };

  const currentYear = monthFilter.split("-")[0];
  const currentMonthIndex = parseInt(monthFilter.split("-")[1], 10) - 1;

  // Hàm để hiển thị kỹ thuật dưới dạng badges
  const renderTechniques = (techniquesString: string) => {
    return techniquesString.split("-").map((technique, index) => (
      <Badge key={index} variant="secondary" className="mr-1 mb-1 text-[16px]">
        {technique.trim()}
      </Badge>
    ));
  };

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover min-h-screen pb-16">
      <div className="max-w-full w-[1600px] px-4 mx-auto flex flex-col gap-8 py-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch sử cuộc hẹn
            </h2>
          </div>

          {/* Patient Selection */}
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-2xl font-bold">Hồ sơ bệnh nhân:</p>
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <Button
                  key={index}
                  variant={
                    selectedPatientId === `patient-${index}`
                      ? "default"
                      : "outline"
                  }
                  className={`px-6 py-8 rounded-full transition-all text-lg ${
                    selectedPatientId === `patient-${index}`
                      ? "text-white"
                      : "border"
                  }`}
                  onClick={() => setSelectedPatientId(`patient-${index}`)}
                >
                  <span className="text-xl font-semibold">
                    {patient["full-name"] || `Bệnh nhân ${index + 1}`}
                  </span>
                </Button>
              ))
            ) : (
              <p className="text-gray-600 text-xl">
                Không có hồ sơ bệnh nhân nào
              </p>
            )}
          </div>
        </div>

        {selectedPatientId ? (
          <>
            {/* Month Filter */}
            <div className="flex justify-end items-center space-x-4 mb-6">
              <label className="text-xl font-medium">Chọn tháng:</label>

              <select
                value={currentMonthIndex}
                onChange={(e) =>
                  handleMonthChange(currentYear, parseInt(e.target.value, 10))
                }
                className="px-4 py-2 border rounded-lg text-xl"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) =>
                  handleMonthChange(e.target.value, currentMonthIndex)
                }
                className="px-4 py-2 border rounded-lg text-xl"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

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
                      Dịch vụ
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
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="text-lg">
                          {appointment.nurse_name}
                        </TableCell>

                        <TableCell className="text-lg">
                          {appointment.phone_number}
                        </TableCell>

                        <TableCell className="max-w-[250px]">
                          <div className="flex flex-wrap ">
                            {renderTechniques(appointment.techniques)}
                          </div>
                        </TableCell>

                        <TableCell className="font-semibold text-red-500 text-lg">
                          {Number(appointment.total_fee).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          VND
                        </TableCell>

                        <TableCell className="text-lg">
                          {formatDate(new Date(appointment.appointment_date))}
                        </TableCell>

                        <TableCell className="text-lg">
                          {appointment.time_from_to}
                        </TableCell>

                        <TableCell>
                          <Badge className="bg-green-500 text-[16px]">
                            Hoàn thành
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-gray-600 text-lg">
                          Không có lịch sử cuộc hẹn nào trong tháng này
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
