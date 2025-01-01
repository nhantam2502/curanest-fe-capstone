"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import dummy_services from "@/dummy_data/dummy_service.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DetailBooking = ({ params }: { params: { id: string } }) => {
  const { id } = params;
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

  const steps = [
    { id: 1, title: "Chọn dịch vụ" },
    { id: 2, title: "Hình thức đặt" },
    { id: 3, title: "Chọn thời gian" },
    { id: 4, title: "Xác nhận & thanh toán" },
  ];

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

  const calculateTotal = () => {
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

  const getAvailableTimeSlots = (totalTime: number) => {
    const availableSlots = [];
    const startTime = 8 * 60; 
    const endTime = 18 * 60;

    for (let i = startTime; i <= endTime - totalTime; i += 30) {
      const startHour = Math.floor(i / 60);
      const startMinute = i % 60;
      const endHour = Math.floor((i + totalTime) / 60);
      const endMinute = (i + totalTime) % 60;
      availableSlots.push(
        `${startHour}:${startMinute === 0 ? "00" : startMinute} - ${endHour}:${
          endMinute === 0 ? "00" : endMinute
        }`
      );
    }

    return availableSlots;
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
            <ScrollArea className="w-full">
              <div className="flex gap-4 mb-6">
                {Object.keys(dummy_services).map((major) => (
                  <Button
                    key={major}
                    variant={selectedMajor === major ? "default" : "outline"}
                    className={cn(
                      "whitespace-nowrap text-lg rounded-full transition-colors duration-150 py-3 px-6",
                      selectedMajor === major && "bg-primary text-white"
                    )}
                    onClick={() => handleMajorChange(major)}
                  >
                    {major}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <ScrollArea className="w-full">
              <div
                className={cn(
                  "space-y-6 mr-4",
                  dummy_services[selectedMajor].length > 4 && "max-h-96"
                )}
              >
                {dummy_services[selectedMajor].map((service) => (
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
                  <h3 className="text-xl font-medium">Tự chọn điều dưỡng</h3>
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
                onClick={() => setNurseSelectionMethod("auto")}
              >
                <div>
                  <h3 className="text-xl font-medium">Hệ thống tự chọn</h3>
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
        const totalTime = calculateTotalTime();
        const availableTimeSlots = getAvailableTimeSlots(totalTime);

        return (
          <div className="space-y-6 text-lg">
            <h2 className="text-4xl font-bold">Chọn thời gian</h2>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Khung giờ có sẵn:</h3>
              <div className="flex flex-wrap gap-4">
                {availableTimeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="rounded-full text-lg py-3 px-6"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-lg">
            <h2 className="text-4xl font-bold">Xác nhận & thanh toán</h2>
            {/* Add your confirmation and payment UI here */}
          </div>
        );
    }
  };

  return (
    <section className="hero_section h-[930px]">
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
          {/* Left Side */}
          <div className="w-2/3">{renderStepContent(currentStep)}</div>

          {/* Right Side */}
          <div className="w-1/3">
            <Card className="sticky top-12">
              <CardContent className="pt-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6">Dịch vụ đã chọn</h2>
                  </div>

                  <div className="space-y-6">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-lg">{service.name}</span>
                          <span className="font-semibold text-lg">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <span className="text-lg text-gray-500">
                          {service.time} phút
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-2xl">Tổng tiền</span>
                      <span className="font-bold text-2xl">
                        {formatCurrency(calculateTotal())}
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
                        className="w-1/2 text-lg"
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
        </div>
      </div>
    </section>
  );
};

export default DetailBooking;
