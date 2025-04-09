"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Eye, Info, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Calendar from "@/app/components/Relatives/Calendar";
import DetailAppointment from "@/app/components/Relatives/DetailAppointment";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { NurseItemType } from "@/types/nurse";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface AppointmentDisplay {
  id: string;
  nurse_name: string;
  avatar: string;
  techniques: string;
  total_fee?: number;
  appointment_date: string;
  time_from_to: string;
  apiData: Appointment;
  cusPackage?: CusPackageResponse | null;
}

const DEFAULT_TECHNIQUES = "Chưa có thông tin";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "waiting":
      return "bg-yellow-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
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
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAppointments, setLoadingAppointments] =
    useState<boolean>(false);
  const [loadingNurses, setLoadingNurses] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [nurseError, setNurseError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentDisplay[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDisplay | null>(null);

  const [selectedNurse, setSelectedNurse] = useState<any>(null);
  const [nurses, setNurses] = useState<NurseItemType[]>([]);

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

  // Fetch appointments when patient is selected
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedPatientId) return;

      try {
        setLoadingAppointments(true);
        setAppointmentError(null);

        const response = await appointmentApiRequest.getAppointment(
          undefined,
          selectedPatientId
        );

        if (response.payload && response.payload.success) {
          // console.log("Appointment data:", response.payload.data);
          // console.log("Available nurses:", nurses);

          // Process appointments in sequence to fetch cusPackage for each
          const formattedAppointmentsPromises = response.payload.data.map(
            async (appointment: Appointment) => {
              const nursingId = appointment["nursing-id"];
              console.log(`Looking for nurse with ID: ${nursingId}`);

              const matchedNurse = nurses.find((nurse) => {
                const nurseMatches =
                  String(nurse["nurse-id"]) === String(nursingId);
                if (nurseMatches) {
                  console.log("Found matching nurse:", nurse);
                }
                return nurseMatches;
              });

              return await transformAppointment(appointment, matchedNurse || null);
            }
          );

          const formattedAppointments = await Promise.all(formattedAppointmentsPromises);
          setAppointments(formattedAppointments);
          // console.log("Formatted appointments:", formattedAppointments);
        } else {
          setAppointmentError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointmentError("Lỗi khi tải lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setLoadingAppointments(false);
      }
    };

    // Only fetch appointments if we have both selectedPatientId and nurses loaded
    if (selectedPatientId && nurses.length > 0 && !loadingNurses) {
      fetchAppointments();
    }
  }, [selectedPatientId, nurses, loadingNurses]);

  // Chuyển đổi từ dữ liệu API sang định dạng hiển thị và lấy thông tin cusPackage
  const transformAppointment = async (
    appointment: Appointment,
    matchedNurse: NurseItemType | null
  ): Promise<AppointmentDisplay> => {
    const estDate = appointment["est-date"];
    const date = new Date(estDate);

    // Định dạng ngày: YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Định dạng giờ: HH:MM (24h format)
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    // Lấy cusPackageID từ appointment
    const cusPackageID = appointment["cuspackage-id"];
    let cusPackageData = null;

    // Gọi API để lấy thông tin cusPackage nếu có cusPackageID
    if (cusPackageID) {
      try {
        const response = await appointmentApiRequest.getCusPackage(
          cusPackageID,
          appointment["est-date"]
        );
        if (response && response.payload && response.payload.success) {
          cusPackageData = response.payload;
          console.log("CusPackage data fetched:", cusPackageData);
        } else {
          console.error("Failed to fetch cusPackage data:", response);
        }
      } catch (error) {
        console.error("Error fetching cusPackage:", error);
      }
    }

    return {
      id: appointment.id,
      nurse_name: matchedNurse?.["nurse-name"] || "Chưa có thông tin",
      avatar: matchedNurse?.["nurse-picture"] || "",
      techniques: DEFAULT_TECHNIQUES,
      // total_fee từ cusPackage nếu có
      total_fee: cusPackageData?.data?.price || undefined,
      appointment_date: formattedDate,
      time_from_to: formattedTime,
      apiData: appointment,
      cusPackage: cusPackageData,
    };
  };

  const handleViewDetail = (appointment: AppointmentDisplay) => {
    setSelectedAppointment(appointment);

    const matchedNurse = nurses.find(
      (nurse) =>
        String(nurse["nurse-id"]) === String(appointment.apiData["nursing-id"])
    );

    setSelectedNurse({
      id: appointment.apiData["nursing-id"],
      name: matchedNurse?.["nurse-name"] || "Chưa có thông tin",
    });

    setIsDialogOpen(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  // Lọc cuộc hẹn theo ngày được chọn
  useEffect(() => {
    if (!selectedDate || appointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }

    const filtered = appointments.filter((apt) => {
      return apt.appointment_date === selectedDate;
    });
    setFilteredAppointments(filtered);
  }, [selectedDate, appointments]);

  // Function to get nurse by appointment nursing-id
  const getNurseByAppointment = (appointment: AppointmentDisplay) => {
    return nurses.find(
      (nurse) => nurse["nurse-id"] === appointment.apiData["nursing-id"]
    );
  };

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
                patients.map((patient) => (
                  <Button
                    key={patient.id}
                    variant={
                      selectedPatientId === patient.id ? "default" : "outline"
                    }
                    className={`px-6 py-8 rounded-full transition-all text-lg ${
                      selectedPatientId === patient.id ? "text-white" : "border"
                    }`}
                    onClick={() => setSelectedPatientId(patient.id)}
                  >
                    <span className="text-xl font-semibold">
                      {patient["full-name"] || `Bệnh nhân`}
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

            {/* Main Content - Side by Side Layout */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Left Side - Appointments List (Moved to the right on desktop) */}
              <div className="lg:w-2/3 order-2 lg:order-1">
                {loadingAppointments ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-xl">
                      Đang tải lịch hẹn...
                    </p>
                  </div>
                ) : appointmentError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 text-xl">{appointmentError}</p>
                  </div>
                ) : loadingNurses ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-xl">
                      Đang tải thông tin điều dưỡng...
                    </p>
                  </div>
                ) : nurseError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 text-xl">{nurseError}</p>
                  </div>
                ) : selectedDate ? (
                  filteredAppointments.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold flex items-center mb-4">
                        Danh sách lịch hẹn {formatDate(new Date(selectedDate))}
                      </h3>

                      {filteredAppointments.map((appointment) => {
                        const matchedNurse = getNurseByAppointment(appointment);
                        return (
                          <Card
                            key={appointment.id}
                            className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                {/* Left sidebar with avatar and status */}
                                <div className="bg-gray-50 p-6 flex flex-col items-center justify-center md:w-48">
                                  <Avatar className="w-20 h-20 mb-4 ring-2 ring-gray-300 ring-offset-2">
                                    <AvatarImage
                                      src={matchedNurse?.["nurse-picture"]}
                                      alt={matchedNurse?.["nurse-name"]}
                                    />
                                    <AvatarFallback className="text-lg font-bold text-white">
                                      {matchedNurse?.["nurse-name"] ? (
                                        matchedNurse["nurse-name"]
                                          .split(" ")
                                          .map((name) => name[0])
                                          .join("")
                                      ) : (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: "linear",
                                          }}
                                        >
                                          <Loader className="w-6 h-6 text-gray-600" />
                                        </motion.div>
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <Badge
                                    className={`${getStatusColor(appointment.apiData.status)} hover:${getStatusColor(appointment.apiData.status)} text-white text-lg px-4 py-1 rounded-full`}
                                  >
                                    {getStatusText(appointment.apiData.status)}
                                  </Badge>
                                </div>

                                {/* Main content area */}
                                <div className="flex-1 p-6">
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                      <p className="text-xl text-gray-500 font-medium">
                                        Điều dưỡng
                                      </p>
                                      <p
                                        className={`font-semibold ${matchedNurse?.["nurse-name"] ? "text-xl text-gray-900" : "text-sm text-gray-500 mt-1"}`}
                                      >
                                        {matchedNurse?.["nurse-name"]
                                          ? matchedNurse["nurse-name"]
                                          : "Đang tìm điều dưỡng phù hợp cho bạn..."}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xl text-gray-500 font-medium">
                                        Ngày hẹn
                                      </p>
                                      <p className="font-semibold text-xl text-gray-900">
                                        {formatDate(
                                          new Date(appointment.appointment_date)
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xl text-gray-500 font-medium">
                                        Thời gian
                                      </p>
                                      <p className="font-semibold text-xl text-gray-900">
                                        {appointment.time_from_to}
                                      </p>
                                    </div>
                                  </div>

                                 

                                  <div className="mt-6 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="default"
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
                        );
                      })}
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
                    appointments={appointments}
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
          nurse={
            nurses.find(
              (nurse) => nurse["nurse-id"] === selectedAppointment.apiData["nursing-id"]
            )
          }
          
          patient={
            patients.find((p) => p.id === selectedPatientId) || patients[0]
          }
        />
      )}
    </section>
  );
};

export default AppointmentPage;