"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Calendar from "@/app/components/Relatives/Calendar";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import { Appointment } from "@/types/appointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";

// Keep the original dummy data
const dummyData: Appointment[] = [
  {
    id: 1,
    nurse_name: "Nguyễn Văn A",
    avatar: "https://github.com/shadcn.png",
    status: "pending",
    phone_number: "0987654321",
    techniques: "Kỹ thuật A- Kỹ thuật B-Kỹ thuật C - Kỹ thuật G",
    total_fee: 500000,
    appointment_date: "2025-04-02",
    time_from_to: "08:00 - 09:00",
  },
  {
    id: 2,
    nurse_name: "Trần Thị B",
    avatar: "https://github.com/shadcn.png",
    status: "pending",
    phone_number: "0912345678",
    techniques: "Kỹ thuật D-Kỹ thuật E",
    total_fee: 300000,
    appointment_date: "2025-04-05",
    time_from_to: "10:00 - 11:00",
  },
  {
    id: 3,
    nurse_name: "Trần Thị D",
    avatar: "https://github.com/shadcn.png",
    status: "pending",
    phone_number: "0912345678",
    techniques: "Kỹ thuật D-Kỹ thuật E",
    total_fee: 300000,
    appointment_date: "2025-04-12",
    time_from_to: "10:00 - 11:00",
  },
];

const getStatusColor = (status: Appointment["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: Appointment["status"]) => {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "pending":
      return "Đang chờ";
    case "canceled":
      return "Đã hủy";
    default:
      return status;
  }
};

const AppointmentPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] =
    useState<Appointment[]>(dummyData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);

  // Fetch patient records when component mounts
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        setLoading(true);
        const response = await patientApiRequest.getPatientRecord();
        setPatients(response.payload.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching patient records:", err);
        setError("Failed to load patient records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRecords();
  }, []);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleViewDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedNurse({ id: appointment.id, name: appointment.nurse_name });
    setIsDialogOpen(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    let filtered = [...dummyData];
    if (selectedDate) {
      filtered = filtered.filter(
        (apt) => apt.appointment_date === selectedDate
      );
    }
    setFilteredAppointments(filtered);
  }, [selectedPatientId, selectedDate]);

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed min-h-screen flex flex-col">
      <div className="max-w-full w-[1500px] px-4 mx-auto flex-grow">
        {/* Header and Patient Selection */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} className="text-primary" />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch hẹn sắp tới
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-xl">
                Đang tải hồ sơ bệnh nhân...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-xl">{error}</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Show calendar and appointments only after patient selection */}
        {selectedPatientId ? (
          <>
            <div className="bg-amber-50 rounded-lg p-4 my-6 flex items-center justify-center text-[18px] leading-[30px] font-medium text-amber-700">
              <Info className="mr-3 h-6 w-6 flex-shrink-0" />
              <span>Những ngày nào có lịch hẹn sẽ được tô vàng lên</span>
            </div>

            {/* <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
              <Info className="mr-2" />
              Những ngày nào có lịch hẹn sẽ được tô vàng lên
            </p> */}

            {/* Main Content - Side by Side Layout */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Left Side - Appointments List (Moved to the right on desktop) */}
              <div className="lg:w-2/3 order-2 lg:order-1">
                {selectedDate ? (
                  filteredAppointments.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold flex items-center mb-4">
                        Danh sách lịch hẹn {formatDate(new Date(selectedDate))}
                      </h3>

                      {filteredAppointments.map((appointment) => (
                        <Card
                          key={appointment.id}
                          className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Left sidebar with avatar and status */}
                              <div className="bg-gray-50 p-6 flex flex-col items-center justify-center md:w-48">
                                <Avatar className="w-20 h-20 mb-4 ring-2 ring-primary ring-offset-2">
                                  <AvatarImage
                                    src={appointment.avatar}
                                    alt={appointment.nurse_name}
                                  />
                                  <AvatarFallback className="text-lg font-bold bg-primary text-white">
                                    {appointment.nurse_name
                                      .split(" ")
                                      .map((name) => name[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <Badge
                                  className={`${getStatusColor(appointment.status)} hover:${getStatusColor(appointment.status)} text-white text-lg px-4 py-1 rounded-full`}
                                >
                                  {getStatusText(appointment.status)}
                                </Badge>
                              </div>

                              {/* Main content area */}
                              <div className="flex-1 p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium">
                                      Điều dưỡng
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">
                                      {appointment.nurse_name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium">
                                      Số điện thoại
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">
                                      {appointment.phone_number}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium">
                                      Ngày hẹn
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">
                                      {formatDate(
                                        new Date(appointment.appointment_date)
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium">
                                      Thời gian
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">
                                      {appointment.time_from_to}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium">
                                      Tổng tiền
                                    </p>
                                    <p className="font-semibold text-lg text-red-500">
                                      {Number(
                                        appointment.total_fee
                                      ).toLocaleString("vi-VN")}{" "}
                                      VND
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xl text-gray-500 font-medium mb-2">
                                      Dịch vụ
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {appointment.techniques
                                        .split("-")
                                        .map((technique, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-primary bg-blue-50 hover:bg-blue-100 text-[16px]"
                                          >
                                            {technique.trim()}
                                          </Badge>
                                        ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-primary text-lg border-primary hover:bg-primary hover:text-white transition-colors"
                                    onClick={() =>
                                      handleViewDetail(appointment)
                                    }
                                  >
                                    Xem chi tiết{" "}
                                    <Eye className="ml-2 w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className=" p-12 text-center">
                      <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-xl font-medium">
                        Không có lịch hẹn nào vào ngày đã chọn
                      </p>
                      <p className="text-gray-500 mt-2">
                        Vui lòng chọn một ngày khác để xem lịch hẹn
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-12 text-center">
                    <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-xl font-medium">
                      Vui lòng chọn ngày để xem lịch hẹn
                    </p>
                    <p className="text-gray-500 mt-2">
                      Chọn một ngày từ lịch bên cạnh để xem chi tiết các cuộc
                      hẹn
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side - Calendar (Moved to the left on desktop) */}
              <div className="lg:w-1/3 order-1 lg:order-2">
                <div className="p-4 sticky top-4">
                  <Calendar
                    onDateSelect={handleDateSelect}
                    appointments={dummyData}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center flex-1 flex items-center justify-center min-h-[50vh]">
            <div>
              <CalendarDays className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-600 text-xl font-medium">
                Vui lòng chọn hồ sơ bệnh nhân để xem lịch hẹn
              </p>
              <p className="text-gray-500 mt-2">
                Chọn một hồ sơ bệnh nhân từ danh sách phía trên để tiếp tục
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Patient Detail Dialog */}
      {selectedAppointment && (
        <DetailAppointment
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          appointment={selectedAppointment}
          nurse={selectedNurse}
          patient={patients[0]}
        />
      )}
    </section>
  );
};

export default AppointmentPage;
