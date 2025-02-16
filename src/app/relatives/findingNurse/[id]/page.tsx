"use client";
import { Calendar, Check, Clock, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import dummy_services from "@/dummy_data/dummy_service_booking.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Service } from "@/types/service";
import TimeSelection, {
  TimeSlot,
} from "@/app/components/Relatives/TimeSelection";
import { Separator } from "@/components/ui/separator";
import { Nurse } from "@/types/nurse";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import PatientProfileSelection from "@/app/components/Relatives/PatientRecordSelection";
import dummyProfiles from "@/dummy_data/dummy_profile.json";
import dummyNursing from "@/dummy_data/dummy_nurse.json";

import { PatientRecord } from "@/types/patient";
import { Badge } from "@/components/ui/badge";
import patientApiRequest from "@/apiRequest/patient/apiPatient";

type SelectedTime = {
  timeSlot: TimeSlot;
  date: string;
};
type DummyServices = Record<string, Service[]>;
const services: DummyServices = dummy_services;

const BookingNurse = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [selectedMajor, setSelectedMajor] = useState(
    "Chăm sóc bệnh nhân nội khoa"
  );
  const [selectedServices, setSelectedServices] = useState<
    Array<{
      name: string;
      price: number;
      time: string;
      description?: string;
    }>
  >([]);
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  //   const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<PatientRecord | null>(null);
  const [profiles, setProfiles] = useState<PatientRecord[]>([]);
const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
const [errorProfiles, setErrorProfiles] = useState<string | null>(null);

  const steps = [
    { id: 1, title: "Hồ sơ bệnh nhân" },
    { id: 2, title: "Chọn dịch vụ" },
    { id: 3, title: "Chọn thời gian" },
    { id: 4, title: "Xác nhận" },
  ];

  const selectedNurse = dummyNursing.find(
    (nurse: Nurse) => String(nurse.id) === id
  ); // Compare as strings
  // console.log("selectedNurse: ", selectedNurse);

  const handleMajorChange = (newMajor: string) => {
    if (selectedMajor !== newMajor) {
      setSelectedMajor(newMajor);
      setSelectedServices([]);
    }
  };

  const toggleService = (service: {
    name: string;
    price: number;
    time: string;
    description?: string;
  }) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.name === service.name)
        ? prev.filter((s) => s.name !== service.name)
        : [...prev, service]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  };

  const calculateTotalTime = () => {
    return selectedServices.reduce(
      (total, service) => total + parseInt(service.time),
      0
    );
  };

  useEffect(() => {
    const fetchPatientRecords = async () => {
      setIsLoadingProfiles(true);
      try {
        const response = await patientApiRequest.getPatientRecord();
        setProfiles(response.payload.data);
        setErrorProfiles(null);

        console.log("patient records :", response.payload.data);
      } catch (err) {
        setErrorProfiles("Không thể tải hồ sơ bệnh nhân");
        console.error(err);
      } finally {
        setIsLoadingProfiles(false);
      }
    };
  
    fetchPatientRecords();
  }, []);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <>
            {isLoadingProfiles ? (
              <div>Đang tải hồ sơ bệnh nhân...</div>
            ) : errorProfiles ? (
              <div className="text-red-500">{errorProfiles}</div>
            ) : (
              <PatientProfileSelection
                profiles={profiles} 
                selectedProfile={selectedProfile}
                onSelectProfile={setSelectedProfile}
              />
            )}
          </>
        );

      case 2:
        return (
          <div className="space-y-6 text-lg">
            <h2 className="text-4xl font-bold">Chọn dịch vụ</h2>
            <p className="flex items-center justify-center text-[18px] leading-[30px] font-[400] text-red-500 mt-[18px]">
              <Info className="mr-2" />
              Mỗi đơn hàng chỉ được chọn một chuyên khoa chính
            </p>

            <div className="w-full">
              <div className="flex flex-wrap gap-4 mb-5">
                {Object.keys(dummy_services).map((major) => (
                  <Button
                    key={major}
                    variant={selectedMajor === major ? "default" : "outline"}
                    className={cn(
                      "text-lg rounded-full transition-colors duration-150 py-3 px-6",
                      selectedMajor === major && "bg-primary text-white"
                    )}
                    onClick={() => handleMajorChange(major)}
                  >
                    {major}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="w-full">
              <div
                className={cn(
                  "space-y-6 mr-4",
                  services[selectedMajor].length > 6 && "max-h-96"
                )}
              >
                {services[selectedMajor].map((service) => (
                  <div
                    key={service.name}
                    className={cn(
                      "border rounded-lg cursor-pointer transition-all overflow-hidden p-4",
                      selectedServices.some((s) => s.name === service.name)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    )}
                    onClick={() => toggleService(service)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {service.name}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <span>{service.time} phút</span>
                          {service.description && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{service.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-2xl">
                          {formatCurrency(service.price)}
                        </span>

                        {selectedServices.some(
                          (s) => s.name === service.name
                        ) && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        );

      case 3:
        return (
          <TimeSelection
            totalTime={calculateTotalTime()}
            onTimeSelect={({ date, timeSlot }) => {
              const formattedDate =
                date instanceof Date
                  ? date.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : date;
              setSelectedTime({ timeSlot, date: formattedDate });
            }}
          />
        );

      case 4:
        return (
          <div className="space-y-6 text-lg">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">
                Thông tin đặt lịch
              </h3>

              {/* Selected Nurse */}
              {selectedNurse && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-3">Thông tin Y tá</h3>
                  <div className="text-gray-700 space-y-2">
                    <div className="flex items-center ">
                      <span className="font-semibold text-lg">
                        {selectedNurse.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="rounded-[50px] bg-[#CCF0F3] text-irisBlueColor text-lg hover:bg-[#CCF0F3]">
                        {selectedNurse.specialization}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Patient Profile */}
              {selectedProfile && (
                <div className="mb-4 space-y-2">
                  <h3 className="text-xl font-semibold">Hồ sơ bệnh nhân</h3>
                  <div className="text-gray-700 text-lg">
                    {selectedProfile["full-name"]}
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Selected Services */}
              <h3 className="text-xl font-semibold mb-3">Dịch vụ đã chọn</h3>
              <div className="space-y-3">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2"
                    >
                      <span className="font-semibold text-lg">
                        {service.name}
                      </span>
                      <span className="font-semibold text-lg text-red-600">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-lg">
                    Chưa có dịch vụ nào được chọn.
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              {/* Selected Time */}
              {selectedTime && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-3">
                    Thời gian đã chọn
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-primary" />
                      <span className="text-lg">{selectedTime.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-primary" />
                      <span className="text-lg">
                        {selectedTime.timeSlot.display}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Total Price */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl">Tổng tiền</span>
                  <span className="font-bold text-xl text-red-600">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-6 mt-8">
                <Button
                  className="text-lg bg-gray-200 hover:bg-gray-300 transition duration-200 rounded-lg shadow-md"
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <span className="font-semibold">Quay lại</span>
                </Button>
                <Button
                  className="text-lg bg-primary text-white hover:bg-primary-dark transition duration-200 rounded-lg shadow-md"
                  size="lg"
                  onClick={() => {
                    if (
                      !selectedProfile ||
                      !selectedServices.length ||
                      !selectedTime
                    ) {
                      toast({
                        variant: "destructive",
                        title: "Đặt lịch không thành công",
                        description: "Vui lòng chọn đầy đủ thông tin!",
                      });
                    } else {
                      toast({
                        variant: "default",
                        title: "Bạn đã đặt lịch thành công",
                        description: `Tổng tiền: ${formatCurrency(
                          calculateTotalPrice()
                        )}`,
                      });
                      router.push("/relatives/appoinments");
                    }
                  }}
                >
                  <span className="font-semibold">Hoàn tất đặt lịch</span>
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="hero_section h-full">
      <div className=" max-w-full w-[1500px] px-5 mx-auto flex flex-col gap-12">
        <div className="flex justify-between items-center w-full px-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2",
                    currentStep >= step.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-8 h-8" />
                  ) : (
                    <span className="text-2xl">{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xl",
                    currentStep >= step.id ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1",
                    currentStep > index + 1 ? "bg-primary" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-12">
          <div
            className={`w-full ${currentStep === 4 ? "md:w-full" : "md:w-2/3"}`}
          >
            {renderStepContent(currentStep)}
          </div>

          {/* Right Side - Only show for steps 1-3 */}
          {currentStep !== 4 && (
            <div className="w-1/3">
              <Card>
                <CardContent className="pt-8">
                  <div className="space-y-8">
                    <h2 className="text-2xl font-be-vietnam-pro font-bold mb-6">
                      Dịch vụ đã chọn
                    </h2>

                    <div className="space-y-3">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xl">
                            <span className="font-semibold">
                              {service.name}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(service.price)}
                            </span>
                          </div>
                          <span className="text-lg text-gray-500">
                            {service.time} phút
                          </span>
                        </div>
                      ))}
                    </div>

                    {selectedTime && (
                      <div className="space-y-2">
                        <h3 className="text-xl font-be-vietnam-pro font-semibold">
                          Thời gian đã chọn
                        </h3>

                        <div className="text-xl text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar />
                            <span>{selectedTime.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock />
                            <span>{selectedTime.timeSlot.display}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t">
                      <div className="flex justify-between items-center mb-8">
                        <span className="font-bold text-2xl">Tổng tiền</span>
                        <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                          {formatCurrency(calculateTotalPrice())}
                        </span>
                      </div>
                      <div className="flex gap-6">
                        {currentStep > 1 && (
                          <Button
                            className="w-1/2 text-lg"
                            size="lg"
                            variant="outline"
                            onClick={() => setCurrentStep(currentStep - 1)}
                          >
                            Quay lại
                          </Button>
                        )}
                        <Button
                          className="w-1/2 text-lg bg-[#71DDD7] hover:bg-[#5CCFC9]"
                          size="lg"
                          disabled={currentStep === 1 && !selectedProfile}
                          onClick={() => setCurrentStep(currentStep + 1)}
                        >
                          {currentStep === steps.length
                            ? "Hoàn tất đặt lịch"
                            : "Tiếp tục"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingNurse;
