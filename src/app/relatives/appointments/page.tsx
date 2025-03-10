"use client"
import React, { useEffect, useState } from "react";
import { CalendarDays, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Calendar from "@/app/components/Relatives/Calendar";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import { Appointment } from "@/types/appointment";

const dummyData: Appointment[] = [
  {
    id: 1,
    nurse_name: "Nguyễn Văn A",
    avatar: "https://github.com/shadcn.png",
    status: "pending",
    phone_number: "0987654321",
    techniques: "Kỹ thuật A- Kỹ thuật B-Kỹ thuật C - Kỹ thuật G",
    total_fee: 500000,
    appointment_date: "2025-03-20",
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
    appointment_date: "2025-03-25",
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

const getStatusColor = (status: Appointment['status']) => {
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

const AppointmentPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(dummyData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);

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

  // const handlePatientSelect = (patientId: string) => {
  //   setSelectedPatientId(patientId);
  //   setSelectedDate(null); // Reset selected date when changing patient
  //   setFilteredAppointments(dummyData); // Reset to show all appointments for new patient
  // };

  useEffect(() => {
    let filtered = [...dummyData];
    if (selectedDate) {
      filtered = filtered.filter(apt => apt.appointment_date === selectedDate);
    }
    setFilteredAppointments(filtered);
  }, [selectedPatientId, selectedDate]);

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed h-full">
      <div className="max-w-full w-[1500px] px-4 mx-auto">
        {/* Header and Patient Selection */}
        <div className="mb-8">
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
                variant={selectedPatientId === `patient-${index}` ? "default" : "outline"}
                className={`px-6 py-8 rounded-full transition-all text-lg ${
                  selectedPatientId === `patient-${index}` ? "text-white" : "border"
                }`}
                onClick={() => setSelectedPatientId(`patient-${index}`)}
              >
                <Avatar className="mr-3 w-12 h-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={`Bệnh nhân ${index + 1}`}
                  />
                  <AvatarFallback className="text-lg">{`B${index + 1}`}</AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold">
                  Bệnh nhân {index + 1}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Show calendar and appointments only after patient selection */}
        {selectedPatientId ? (
          <>
            <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
              <Info className="mr-2" />
              Những ngày nào có lịch hẹn sẽ được tô vàng lên
            </p>

            {/* Main Content - Side by Side Layout */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Left Side - Appointments List */}
              <div className="lg:w-2/3">
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
                              <Badge className={`${getStatusColor(appointment.status)} text-white text-lg px-4 py-1 rounded-full`}>
                                {appointment.status}
                              </Badge>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <p className="text-lg text-gray-500">Điều dưỡng</p>
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
                                  {appointment.techniques.split("-").map((technique, index) => (
                                    <Badge key={index} className="text-white text-base cursor-pointer">
                                      {technique.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-lg text-gray-500">Tổng tiền</p>
                                <p className="font-semibold text-xl text-red-500">
                                  {Number(appointment.total_fee).toLocaleString("vi-VN")} VND
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
                                Xem chi tiết <Eye className="ml-2 w-5 h-5" />
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
                      Vui lòng chọn ngày để xem lịch hẹn
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side - Calendar */}
              <div className="lg:w-1/3">
                <Calendar 
                  onDateSelect={handleDateSelect}
                  appointments={dummyData}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl font-medium">
              Vui lòng chọn hồ sơ bệnh nhân để xem lịch hẹn
            </p>
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
        />
      )}
    </section>
  );
};

export default AppointmentPage;