"use client";
import React, { useState } from "react";
import { CalendarDays, Eye, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";

const dummyData = [
  {
    id: 1,
    patientId: "patient-0",
    nurse_name: "Nguyễn Văn A",
    avatar: "https://github.com/shadcn.png",
    status: "completed",
    phone_number: "0987654321",
    techniques: "Kỹ thuật A- Kỹ thuật B-Kỹ thuật C - Kỹ thuật G",
    total_fee: 500000,
    appointment_date: "2025-01-20",
    time_from_to: "08:00 - 09:00",
  },
  // Add more completed appointments here
];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const handleViewDetail = (appointment: any) => {
    setSelectedAppointment(appointment);
    setSelectedNurse(appointment);
    setIsDialogOpen(true);
  };

  const handleViewMedicalReport = (appointment: any) => {
    console.log("View medical report for appointment:", appointment.id);
  };

  const handleSendFeedback = (appointment: any) => {
    console.log("Send feedback for appointment:", appointment.id);
  };

  const filteredAppointments = dummyData.filter((appointment) => {
    const appointmentMonth = appointment.appointment_date.substring(0, 7);
    return (
      appointment.status === "completed" &&
      appointmentMonth === monthFilter &&
      appointment.patientId === selectedPatientId
    );
  });

  return (
    <section className="hero_section h-full">
      <div className="max-w-full w-[1500px] px-4 mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Lịch sử cuộc hẹn
            </h2>
          </div>

          {/* Patient Selection */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
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
                <span className="text-lg font-medium">
                  Bệnh nhân {index + 1}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {selectedPatientId && (
          <>
            {/* Month Filter */}
            <div className="flex justify-end items-center space-x-4">
              <label className="text-lg font-medium">Chọn tháng:</label>
              <input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Appointments List */}
            <div className="space-y-6">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="relative flex flex-col items-center">
                          <Avatar className="w-20 h-20 mb-3">
                            <AvatarImage
                              src={appointment.avatar}
                              alt={appointment.nurse_name}
                            />
                            <AvatarFallback className="text-lg">
                              {appointment.nurse_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <Badge className="bg-green-500 text-white text-lg px-4 py-1 rounded-full">
                            Hoàn thành
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
                            <p className="text-lg text-gray-500">
                              Số điện thoại
                            </p>
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
                                    className="bg-[#71DDD7] hover:bg-[#71DDD7] text-white text-base"
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
                              {formatDate(appointment.appointment_date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-500">Thời gian</p>
                            <p className="font-semibold text-xl text-gray-900">
                              {appointment.time_from_to}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 justify-center">
                          <Button
                            variant="outline"
                            className="text-lg px-6 py-5 flex items-center justify-center"
                            onClick={() => handleViewDetail(appointment)}
                          >
                            Xem chi tiết <Eye className="ml-2 w-5 h-5" />
                          </Button>
                          <Button
                            variant="outline"
                            className="text-lg px-6 py-5 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 flex items-center justify-center"
                            onClick={() => handleViewMedicalReport(appointment)}
                          >
                            Xem báo cáo <FileText className="ml-2 w-5 h-5" />
                          </Button>
                          <Button
                            variant="outline"
                            className="text-lg px-6 py-5 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 flex items-center justify-center"
                            onClick={() => handleSendFeedback(appointment)}
                          >
                            Gửi đánh giá{" "}
                            <MessageCircle className="ml-2 w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-600 text-xl font-medium">
                    Không có lịch sử cuộc hẹn nào trong tháng này
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedPatientId && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
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
        />
      )}
    </section>
  );
};

export default AppointmentHistory;
