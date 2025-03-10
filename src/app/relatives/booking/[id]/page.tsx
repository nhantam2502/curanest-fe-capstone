"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import dummy_services from "@/dummy_data/dummy_service_booking.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TimeSelection, {
  TimeSlot,
} from "@/app/components/Relatives/TimeSelection";
import { Service } from "@/types/service";
import { Separator } from "@/components/ui/separator";
import NurseSelectionList from "@/app/components/Relatives/NurseSelectionList";
import nurses from "@/dummy_data/dummy_nurse.json";
import { Nurse } from "@/types/nurse";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type DummyServices = Record<string, Service[]>;

const services: DummyServices = dummy_services;

type SelectedTime = {
  timeSlot: TimeSlot;
  date: string;
};

const DetailBooking = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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

  const [nurseSelectionMethod, setNurseSelectionMethod] = useState<
    "manual" | "auto"
  >("manual");
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Chọn dịch vụ" },
      { id: 2, title: "Hình thức đặt" },
    ];

    if (nurseSelectionMethod === "manual") {
      baseSteps.push({ id: 3, title: "Chọn điều dưỡng" });
    }

    return [
      ...baseSteps,
      {
        id: nurseSelectionMethod === "manual" ? 4 : 3,
        title: "Chọn thời gian",
      },
      {
        id: nurseSelectionMethod === "manual" ? 5 : 4,
        title: "Xác nhận & thanh toán",
      },
    ];
  };

  const steps = getSteps();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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

  const handleMajorChange = (newMajor: string) => {
    if (selectedMajor !== newMajor) {
      setSelectedMajor(newMajor);
      setSelectedServices([]);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
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

      case 2:
        return (
          <div className="space-y-6 text-lg">
            <h2 className="text-3xl font-bold">Chọn hình thức đặt</h2>
            <div className="space-y-6">
              {/* Tùy chọn Tự chọn điều dưỡng */}
              <button
                className={`w-full p-6 border rounded-lg text-left shadow-md hover:shadow-lg transition-shadow flex items-center justify-between ${
                  nurseSelectionMethod === "manual" ? "border-primary" : ""
                }`}
                onClick={() => setNurseSelectionMethod("manual")}
              >
                <div>
                  <h3 className="text-xl">Tự chọn điều dưỡng</h3>
                  <p className="text-lg text-gray-500">
                    Bạn có thể tự chọn điều dưỡng phù hợp.
                  </p>
                </div>
                {nurseSelectionMethod === "manual" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>

              {/* Tùy chọn Hệ thống tự chọn */}
              <button
                className={`w-full p-6 border rounded-lg text-left shadow-md hover:shadow-lg transition-shadow flex items-center justify-between ${
                  nurseSelectionMethod === "auto" ? "border-primary" : ""
                }`}
                onClick={() => {
                  setNurseSelectionMethod("auto");
                  // Reset selected nurse khi chọn hình thức auto
                  setSelectedNurse(null);
                }}
              >
                <div>
                  <h3 className="text-xl">Hệ thống tự chọn</h3>
                  <p className="text-lg text-gray-500">
                    Hệ thống sẽ tự động chọn điều dưỡng phù hợp cho bạn.
                  </p>
                </div>
                {nurseSelectionMethod === "auto" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        if (nurseSelectionMethod === "manual") {
          const handleNurseSelect = (nurseId: number) => {
            console.log(`Selected nurse ID: ${nurseId}`);
            const selectedNurse = nurses.find((nurse) => nurse.id === nurseId);
            if (selectedNurse) {
              setSelectedNurse(selectedNurse);
            }
          };

          // Lọc điều dưỡng theo chuyên ngành được chọn
          const filteredNurses = nurses.filter(
            (nurse) => nurse.specialization === selectedMajor
          );

          return (
            <div className="space-y-6 text-lg">
              <h2 className="text-3xl font-bold">Chọn điều dưỡng</h2>
              {filteredNurses.length > 0 ? (
                <NurseSelectionList
                  nurses={filteredNurses}
                  onSelect={handleNurseSelect}
                />
              ) : (
                <p className="text-gray-600">Không có điều dưỡng nào phù hợp</p>
              )}
            </div>
          );
        }

        // If auto selection, fall through to time selection
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
        if (nurseSelectionMethod === "manual") {
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
        }
        // If auto selection, show confirmation
        return (
          <div className="space-y-6 text-lg">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
              <h3 className="text-3xl font-semibold mb-4">Dịch vụ đã chọn</h3>

              {/* Hiển thị dịch vụ đã chọn */}
              <div className="space-y-2">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2"
                    >
                      <span className="font-semibold text-xl">
                        {service.name}
                      </span>
                      <span className="font-semibold text-xl text-red-600">
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

              <Separator className="my-3" />

              {selectedNurse && (
                <div className="mb-4">
                  <h3 className="text-xl font-be-vietnam-pro font-semibold">
                    Điều dưỡng đã chọn
                  </h3>
                  <div className="text-lg text-gray-600">
                    {selectedNurse.name}
                  </div>
                </div>
              )}

              {/* Hiển thị thời gian đã chọn */}
              {selectedTime && (
                <div className="mt-4">
                  <h3 className="text-3xl font-semibold mb-4">
                    Thời gian đã chọn
                  </h3>
                  <div className="text-lg text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-primary" />
                      <span className="text-xl">{selectedTime.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-primary" />
                      <span className="text-xl">
                        {selectedTime.timeSlot.display}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-3" />

              {/* Hiển thị hình thức đặt */}
              <div className="mt-4">
                <h3 className="text-3xl font-semibold">Hình thức đặt</h3>
                <div className="text-lg text-gray-600">
                  <span className="font-semibold text-xl">
                    {nurseSelectionMethod === "auto"
                      ? "Hệ thống tự chọn"
                      : nurseSelectionMethod === "manual"
                      ? "Tự chọn điều dưỡng"
                      : ""}
                  </span>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Hiển thị tổng tiền */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl">Tổng tiền</span>
                  <span className="font-bold text-2xl text-red-600">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Nút hoàn tất đặt lịch và quay lại */}
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
                    console.log("Thông tin đặt lịch:", {
                      selectedServices,
                      selectedTime,
                      total: calculateTotalPrice(),
                      nurseSelectionMethod,
                    });
                    if (
                      !selectedServices.length ||
                      !selectedTime ||
                      !nurseSelectionMethod
                    ) {
                      toast({
                        variant: "destructive",
                        title: "Đặt lịch không thành công",
                        description:
                          "Vui lòng chọn đầy đủ thông tin thông tin!",
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

      case 5:
        return (
          <div className="space-y-6 text-lg">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
              <h3 className="text-3xl font-semibold mb-4">Dịch vụ đã chọn</h3>

              {/* Hiển thị dịch vụ đã chọn */}
              <div className="space-y-2">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2"
                    >
                      <span className="font-semibold text-xl">
                        {service.name}
                      </span>
                      <span className="font-semibold text-xl text-red-600">
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

              <Separator className="my-3" />

              {selectedNurse && (
                <div>
                  <h3 className="text-3xl font-be-vietnam-pro font-semibold">
                    Điều dưỡng đã chọn
                  </h3>
                  <div className="text-lg text-gray-600 space-y-1">
                    {selectedNurse.name}
                  </div>
                </div>
              )}

              <Separator className="my-3" />

              {/* Hiển thị thời gian đã chọn */}
              {selectedTime && (
                <div>
                  <h3 className="text-3xl font-semibold mb-4">
                    Thời gian đã chọn
                  </h3>
                  <div className="text-lg text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-primary" />
                      <span className="text-xl">{selectedTime.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-primary" />
                      <span className="text-xl">
                        {selectedTime.timeSlot.display}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-3" />

              {/* Hiển thị hình thức đặt */}
              <div className="mt-4">
                <h3 className="text-3xl font-semibold">Hình thức đặt</h3>
                <div className="text-lg text-gray-600">
                  <span className="font-semibold text-xl">
                    {nurseSelectionMethod === "manual"
                      ? "Tự chọn điều dưỡng"
                      : "Hệ thống tự chọn"}
                  </span>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Hiển thị tổng tiền */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl">Tổng tiền</span>
                  <span className="font-bold text-2xl text-red-600">
                    {formatCurrency(calculateTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Nút hoàn tất đặt lịch và quay lại */}
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
                    console.log("Thông tin đặt lịch:", {
                      selectedServices,
                      selectedTime,
                      total: calculateTotalPrice(),
                      nurseSelectionMethod,
                    });
                    if (
                      !selectedServices.length ||
                      !selectedTime ||
                      !nurseSelectionMethod
                    ) {
                      toast({
                        variant: "destructive",
                        title: "Đặt lịch không thành công",
                        description:
                          "Vui lòng chọn đầy đủ thông tin thông tin!",
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
            className={`w-full ${
              currentStep === (nurseSelectionMethod === "manual" ? 5 : 4)
                ? "md:w-full"
                : "md:w-2/3"
            }`}
          >
            {renderStepContent(currentStep)}
          </div>

          {/* Right Side */}
          {currentStep !== (nurseSelectionMethod === "manual" ? 5 : 4) && (
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
                            <span className="font-semibold ">
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

                    {/* Hiển thị điều dưỡng đã chọn */}
                    {selectedNurse && (
                      <div className="mb-4">
                        <h3 className="text-xl font-be-vietnam-pro font-semibold">
                          Điều dưỡng đã chọn
                        </h3>
                        <div className="text-lg text-gray-600">
                          {selectedNurse.name}
                        </div>
                      </div>
                    )}

                    {/* Hiển thị thời gian đã chọn */}
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
                          className="w-1/2 text-lg bg-[#71DDD7] hover:bg-[#71DDD7]"
                          size="lg"
                          disabled={
                            (currentStep === 1 &&
                              selectedServices.length === 0) ||
                            (currentStep === 2 && !nurseSelectionMethod)
                          }
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

export default DetailBooking;