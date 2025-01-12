"use client";
import { useEffect, useState } from "react";
import { CalendarDays, ArrowLeft, ArrowRight, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import nurseData from "@/dummy_data/dummy_nurse.json";

const dummyData = [
  {
    id: 1,
    nurse_name: "Nguyễn Văn A",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0987654321",
    techniques: "Kỹ thuật A- Kỹ thuật B-Kỹ thuật C - Kỹ thuật G",
    total_fee: 500000,
    appointment_date: "2025-01-20",
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
    appointment_date: "2025-01-20",
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
    appointment_date: "2025-01-22",
    time_from_to: "10:00 - 11:00",
  },
];

const getStatusColor = (status: string) => {
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

const Appointment = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState(dummyData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from: formatDateForApi(start), to: formatDateForApi(end) };
  };

  const getDayOfWeek = (day: number) => {
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    return days[day];
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForApi = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };

  const getPrevWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeek);
  };
  const handleViewDetail = (appointment: any) => {
    const nurse = nurseData.find((n) => n.id === appointment.id);
    setSelectedAppointment(appointment);
    setSelectedNurse(nurse);
    setIsDialogOpen(true);
  }

  const hasAppointmentOnDate = (date: string) => {
    return dummyData.some(
      (appointment) => appointment.appointment_date === date
    );
  };

  // Filter appointments based on selected patient and date
  const updateFilteredAppointments = () => {
    let filtered = [...dummyData];
    console.log("Selected Date:", selectedDate); // Kiểm tra ngày được chọn
    console.log(
      "Dummy Data Dates:",
      dummyData.map((apt) => apt.appointment_date)
    ); // Kiểm tra danh sách ngày

    if (selectedDate) {
      filtered = filtered.filter(
        (apt) => apt.appointment_date === selectedDate
      );
    }
    console.log("Filtered Appointments:", filtered); // Kiểm tra kết quả lọc
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    updateFilteredAppointments();
  }, [selectedPatientId, selectedDate]);

  return (
    <section className="hero_section h-full">
      <div className="max-w-full w-[1500px] px-4 mx-auto flex flex-col gap-8">
        {/* Patient Selection */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch hẹn sắp tới
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-2xl font-bold">Hồ sơ bệnh nhân:</p>
            {[...Array(3)].map((_, index) => (
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
                <Avatar className="mr-3 w-12 h-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={`Bệnh nhân ${index + 1}`}
                  />
                  <AvatarFallback className="text-lg">{`B${
                    index + 1
                  }`}</AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold">
                  Bệnh nhân {index + 1}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
          <Info className="mr-2" />
          Những ngày nào có lịch hẹn sẽ được tô vàng lên
        </p>

        {/* Calendar className="bg-white rounded-lg p-6 shadow-md*/}
        <div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={getPrevWeek}
              className="w-12 h-12 flex items-center justify-center"
            >
              <ArrowLeft size={24} />
            </Button>

            <div className="grid grid-cols-7 gap-4 flex-1 mx-4">
              {[...Array(7)].map((_, index) => {
                const today = new Date(currentWeekStart);
                today.setDate(today.getDate() + index - today.getDay() + 1);
                const dayString = formatDateForApi(today);
                const formattedDate = formatDate(today);
                const isSelected = selectedDate === dayString;
                const hasAppointment = hasAppointmentOnDate(dayString);

                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "ghost"}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all 
              ${
                isSelected
                  ? "py-8 text-white bg-[#71DDD7] hover:bg-[#71DDD7]"
                  : "hover:bg-gray-100 py-8 text-gray-800"
              }
              ${hasAppointment && !isSelected ? "bg-yellow-100" : ""}
            `}
                    onClick={() => setSelectedDate(dayString)}
                    disabled={!selectedPatientId}
                  >
                    <span className="text-xl font-semibold">
                      {getDayOfWeek(today.getDay())}
                    </span>
                    <span className="text-lg font-bold">{formattedDate}</span>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              onClick={getNextWeek}
              className="w-12 h-12 flex items-center justify-center"
            >
              <ArrowRight size={24} />
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        <div>
          {selectedDate ? (
            filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300 mb-5"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="relative flex flex-col items-center">
                        <Avatar className="w-20 h-20 mb-3">
                          <AvatarImage
                            src={appointment.avatar}
                            alt={appointment.nurse_name}
                            width={80}
                            height={80}
                          />
                          <AvatarFallback className="text-lg font-bold">
                            {appointment.nurse_name}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          className={` ${getStatusColor(
                            appointment.status
                          )} text-white text-lg px-4 py-1 rounded-full`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-lg text-gray-500">Điều dưỡng</p>{" "}
                          <p className="font-semibold text-xl text-gray-900">
                            {appointment.nurse_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500">Số điện thoại</p>
                          <p className="font-semibold text-xl text-gray-900">
                            {appointment.phone_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500">Dịch vụ</p>
                          <div className="flex flex-wrap gap-3">
                            {appointment.techniques
                              .split("-")

                              .map((technique, index) => (
                                <Badge
                                  key={index}
                                  className="text-white text-base cursor-pointer"
                                >
                                  {technique.trim()}
                                </Badge>
                              ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500">Tổng tiền</p>
                          <p className="font-semibold text-xl text-red-500">
                            {Number(appointment.total_fee).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VND
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500">Ngày hẹn</p>
                          <p className="font-semibold text-xl text-gray-900">
                            {formatDate(new Date(appointment.appointment_date))}
                          </p>
                        </div>
                        <div>
                          <p className="text-lg text-gray-500">Thời gian</p>
                          <p className="font-semibold text-xl text-gray-900">
                            {appointment.time_from_to}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center md:justify-end">
                        <Button
                          variant="outline"
                          className="text-lg px-6 py-5"
                          onClick={() => handleViewDetail(appointment)}
                        >
                          Xem chi tiết <Eye className="ml-2 w-5 h-5" />{" "}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl font-medium">
                  Không có lịch hẹn nào vào ngày đã chọn
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl font-medium">
                Vui lòng chọn hồ sơ trước để xem lịch hẹn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Dialog */}
      {selectedAppointment && (
        <DetailAppointment
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        appointment={selectedAppointment}
        nurse={selectedNurse}
        />
      )}
    </section>
  );
};

export default Appointment;
