"use client";
import { Calendar, Check, Clock, FileText, Info, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  calculateAdvancedPricing,
  calculatePackagePrice,
  calculatePackageTotalTime,
  cn,
  formatCurrency,
} from "@/lib/utils";
import {
  PackageServiceItem,
  ServicePackageType,
  ServiceTaskType,
} from "@/types/service";
import TimeSelection, {
  TimeSlot,
} from "@/app/components/Relatives/TimeSelection";
import { DetailNurseItemType, Nurse, NurseItemType } from "@/types/nurse";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import PatientProfileSelection from "@/app/components/Relatives/PatientRecordSelection";
import { PatientRecord } from "@/types/patient";
import { Badge } from "@/components/ui/badge";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { ServicePackageSelection } from "@/app/components/Relatives/Step2";
import { ServiceAdjustment } from "@/app/components/Relatives/Step3";
import { OrderConfirmationComponent } from "@/app/components/Relatives/Step7";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import SubscriptionTimeSelection, {
  SelectedDateTime,
} from "@/app/components/Relatives/SubscriptionTimeSelection";
import { CreateAppointmentCusPackage } from "@/types/appointment";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface SelectedTime {
  timeSlot: { display: string; value: string };
  date: Date;
}
type ServicesByType = {
  oneTime: { [categoryName: string]: PackageServiceItem[] };
  subscription: { [categoryName: string]: PackageServiceItem[] };
};

const BookingNurse = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const params = useParams();
  const serviceIdRaw = params.serviceId;
  const serviceId =
    typeof serviceIdRaw === "string" ? serviceIdRaw : (serviceIdRaw?.[0] ?? "");
  const decodedServiceId = serviceId
    ? decodeURIComponent(decodeURIComponent(serviceId))
    : "";

  const searchParams = useSearchParams();
  const serviceID = searchParams.get("serviceID");

  const [selectedPackage, setSelectedPackage] =
    useState<PackageServiceItem | null>(null);
  const [servicesByType, setServicesByType] = useState<ServicesByType>({
    oneTime: {},
    subscription: {},
  });
  const [isPackagesLoading, setIsPackagesLoading] = useState(false);

  const [serviceNotes, setServiceNotes] = useState<{ [key: string]: string }>(
    {}
  );
  const [serviceTasks, setServiceTasks] = useState<Record<string, any[]>>({});
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [selectedServicesTask, setSelectedServicesTask] = useState<
    ServiceTaskType[]
  >([]);

  const [selectedTimes, setSelectedTimes] = useState<SelectedDateTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<NurseItemType | null>(
    null
  );
  const [detailNurse, setDetailNurse] = useState<DetailNurseItemType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceQuantities, setServiceQuantities] = useState<{
    [key: string]: number;
  }>({});

  const [selectedProfile, setSelectedProfile] = useState<PatientRecord | null>(
    null
  );
  const [profiles, setProfiles] = useState<PatientRecord[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [errorProfiles, setErrorProfiles] = useState<string | null>(null);

  const steps = [
    { id: 1, title: "Hồ sơ bệnh nhân" },
    { id: 2, title: "Chọn gói theo dịch vụ" },
    { id: 3, title: "Điều chỉnh gói" },
    { id: 4, title: "Chọn thời gian" },
    { id: 5, title: "Xác nhận & thanh toán" },
  ];

  const handleNextStep = () => {
    setCurrentStep((current) => current + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((current) => current - 1);
  };

  const updateServiceQuantity = (serviceName: string, newQuantity: number) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceName]: Math.max(0, newQuantity),
    }));
  };

  const updateServiceNote = (serviceName: string, note: string) => {
    setServiceNotes((prev) => ({
      ...prev,
      [serviceName]: note,
    }));
  };

  const removeService = (serviceName: string) => {
    setSelectedServicesTask((prev) =>
      prev.filter((service) => service.name !== serviceName)
    );
    const newQuantities = { ...serviceQuantities };
    delete newQuantities[serviceName];
    setServiceQuantities(newQuantities);
  };

  const calculateTotalPrice = () => {
    return selectedServicesTask.reduce((total, service) => {
      const quantity = serviceQuantities[service.name] || 1;
      const { totalCost } = calculateAdvancedPricing(service, quantity);
      return total + totalCost;
    }, 0);
  };

  const calculateTotalTime = () => {
    return selectedServicesTask.reduce((total, service) => {
      const quantity = serviceQuantities[service.name] || 1;
      let additionalDuration = 0;
      if (quantity > 1) {
        if (service.unit === "time") {
          additionalDuration = (quantity - 1) * service["price-of-step"];
        } else if (service.unit === "quantity") {
          additionalDuration =
            (quantity - 1) *
            (service["price-of-step"] * service["est-duration"]);
        }
      }
      const totalDuration = service["est-duration"] + additionalDuration;
      return total + totalDuration;
    }, 0);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selectedProfile !== null;
      case 2:
        return (selectedServicesTask?.length || 0) > 0;
      case 4:
        return selectedTime !== null || selectedTimes !== null;
      default:
        return true;
    }
  };

  const handleCompleteBooking = async () => {
    const isMultiDayPackage =
      selectedPackage?.["combo-days"] && selectedPackage["combo-days"] > 1;
    const hasValidTime = isMultiDayPackage
      ? selectedTimes && selectedTimes.length > 0
      : selectedTime !== null;

    if (!selectedServicesTask.length || !hasValidTime || !selectedProfile) {
      toast({
        variant: "destructive",
        title: "Đặt lịch không thành công",
        description: "Vui lòng chọn đầy đủ thông tin!",
      });
      return;
    }

    try {
      const convertToUTCString = (date: Date, startTime: string): string => {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const day = date.getDate();
        
        const [hours, minutes] = startTime.split(':').map(Number);
        
        const localDate = new Date(year, month, day, hours, minutes);
        
        console.log("date: ", date);
        console.log("startTime: ", startTime);
        console.log("Ngày đã chọn (local): ", `${day}/${month + 1}/${year}`);
        console.log("localDate: ", localDate);
        
        if (isNaN(localDate.getTime())) {
          throw new Error("Không thể tạo Date hợp lệ từ date và time");
        }
        
        // Chuyển đổi thành chuỗi ISO UTC
        const isoString = localDate.toISOString();
        return isoString.replace(".000Z", "Z");
      };

      const nursingId =
        typeof params.nursingId === "string" ? params.nursingId : "";

      const dateNurseMappings = isMultiDayPackage
        ? selectedTimes.map((time) => ({
            date: convertToUTCString(time.date, time.timeSlot.start),
            "nursing-id": nursingId,
          }))
        : selectedTime !== null
        ? [
            {
              date: convertToUTCString(
                selectedTime.date,
                selectedTime.timeSlot.value.split("-")[0]
              ),
              "nursing-id": nursingId,
            },
          ]
        : [];

      const appointmentData: CreateAppointmentCusPackage = {
        "date-nurse-mappings": dateNurseMappings,
        "patient-address": `${selectedProfile.address},${selectedProfile.ward},${selectedProfile.district},${selectedProfile.city}`,
        "patient-id": selectedProfile.id ?? "",
        "svcpackage-id": selectedPackage?.id ?? "",
        "task-infos": selectedServicesTask.map((service) => {
          const { totalCost, totalDuration } = calculateAdvancedPricing(
            service,
            serviceQuantities[service.name] || 1
          );
          return {
            "client-note": serviceNotes[service.name] || "",
            "est-duration": totalDuration || 0,
            "svctask-id": service.id,
            "total-cost": totalCost || 0,
            "total-unit": serviceQuantities[service.name] || 1,
          };
        }),
      };

      console.log("appointmentData: ", appointmentData);
      const response =
        await appointmentApiRequest.createAppointmentCusPackage(
          appointmentData
        );

      toast({
        variant: "default",
        title: "Bạn đã đặt lịch thành công",
        description: `Tổng tiền: ${formatCurrency(calculateTotalPrice())}`,
      });

      router.push("/relatives/appointments");
    } catch (error) {
      console.error("Lỗi khi tạo cuộc hẹn:", error);
      toast({
        variant: "destructive",
        title: "Đặt lịch không thành công",
        description: "Đã có lỗi xảy ra khi tạo cuộc hẹn",
      });
    }
  };

  const nursingId =
    typeof params.nursingId === "string" ? params.nursingId : undefined;

  useEffect(() => {
    const fetchDetailNurse = async () => {
      try {
        if (nursingId) {
          const response = await nurseApiRequest.getDetailNurse(nursingId);
          setDetailNurse(response.payload.data);
          setSelectedNurse(response.payload.data);
        } else {
          throw new Error("Nursing ID không hợp lệ.");
        }
      } catch (error) {
        setError("Không thể tải thông tin điều dưỡng.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailNurse();
  }, [nursingId]);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      setIsLoadingProfiles(true);
      try {
        const response = await patientApiRequest.getPatientRecord();
        setProfiles(response.payload.data);
        setErrorProfiles(null);
      } catch (err) {
        setErrorProfiles("Không thể tải hồ sơ bệnh nhân");
        console.error(err);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    fetchPatientRecords();
  }, []);

  useEffect(() => {
    const fetchServicePackages = async () => {
      if (!serviceID) return;
      console.log("serviceID: ", serviceID);

      try {
        setIsPackagesLoading(true);
        const response =
          await serviceApiRequest.getListServicePackage(serviceID);

        if (response.payload.data) {
          const packagesData = response.payload.data;
          const updatedServicesByType: ServicesByType = {
            oneTime: {},
            subscription: {},
          };

          packagesData.forEach((pkg: ServicePackageType) => {
            const packageType =
              pkg["combo-days"] && pkg["combo-days"] > 1
                ? "subscription"
                : "oneTime";
            const categoryName = pkg.name;

            const serviceItem: PackageServiceItem = {
              id: pkg.id,
              name: pkg.name,
              status: pkg.status,
              description: pkg.description,
              "service-id": pkg["service-id"],
              "time-interval": pkg["time-interval"] || 0,
              discount: parseInt(pkg.discount),
              "combo-days": pkg["combo-days"] || 0,
            };

            if (!updatedServicesByType[packageType][categoryName]) {
              updatedServicesByType[packageType][categoryName] = [];
            }

            updatedServicesByType[packageType][categoryName].push(serviceItem);
          });

          setServicesByType(updatedServicesByType);
        }
      } catch (error) {
        console.error("Failed to fetch service packages:", error);
        toast({
          variant: "destructive",
          title: "Lỗi khi tải gói dịch vụ",
          description:
            "Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.",
        });
      } finally {
        setIsPackagesLoading(false);
      }
    };

    fetchServicePackages();
  }, [toast]);

  const fetchServiceTasks = async (packageId: string) => {
    try {
      setIsTasksLoading(true);
      const response = await serviceApiRequest.getListServiceTask(packageId);

      if (response.payload.data) {
        return response.payload.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch service tasks:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi tải chi tiết công việc",
        description: "Không thể tải danh sách công việc. Vui lòng thử lại sau.",
      });
      return [];
    } finally {
      setIsTasksLoading(false);
    }
  };

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
          <ServicePackageSelection
            setSelectedServicesTask={setSelectedServicesTask}
            formatCurrency={formatCurrency}
            servicesByType={servicesByType}
            calculatePackageTotalTime={calculatePackageTotalTime}
            calculatePackagePrice={calculatePackagePrice}
            isLoading={isPackagesLoading}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            fetchServiceTasks={fetchServiceTasks}
            serviceTasks={serviceTasks}
            setServiceTasks={setServiceTasks}
            isTasksLoading={isTasksLoading}
          />
        );

      case 3:
        return (
          <ServiceAdjustment
            selectedServiceTask={selectedServicesTask}
            serviceQuantities={serviceQuantities}
            updateServiceQuantity={updateServiceQuantity}
            updateServiceNote={updateServiceNote}
            removeService={removeService}
            calculateTotalPrice={calculateTotalPrice}
            calculateTotalTime={calculateTotalTime}
            formatCurrency={formatCurrency}
            calculateAdvancedPricing={calculateAdvancedPricing}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            setCurrentStep={setCurrentStep}
            selectedPackage={selectedPackage}
          />
        );

      case 4:
        return selectedPackage &&
          selectedPackage["combo-days"] &&
          selectedPackage["combo-days"] > 1 ? (
          <SubscriptionTimeSelection
            totalTime={calculateTotalTime()}
            timeInterval={selectedPackage["time-interval"]}
            comboDays={selectedPackage["combo-days"] || 0}
            onTimesSelect={(selectedDates) => {
              setSelectedTimes(selectedDates);
            }}
          />
        ) : (
          <TimeSelection
            totalTime={calculateTotalTime()}
            onTimeSelect={({ date, timeSlot }) => {
              setSelectedTime({ timeSlot, date });
            }}
          />
        );

      case 5:
        return (
          <OrderConfirmationComponent
            selectedProfile={selectedProfile}
            selectedServiceTask={selectedServicesTask}
            selectedPackage={selectedPackage}
            serviceQuantities={serviceQuantities}
            formatCurrency={formatCurrency}
            selectedNurse={selectedNurse}
            selectedTime={selectedTime}
            selectedTimes={selectedTimes}
            calculateTotalTime={calculateTotalTime}
            calculateTotalPrice={calculateTotalPrice}
            setCurrentStep={setCurrentStep}
            toast={toast}
            router={router}
            serviceNotes={serviceNotes}
          />
        );
    }
  };

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed">
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
          <div className="w-full md:w-2/3">
            {renderStepContent(currentStep)}
          </div>

          <div className="w-1/3">
            <Card>
              <CardContent className="pt-8">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-be-vietnam-pro font-bold">
                      Dịch vụ đã chọn
                    </h2>
                    <Badge
                      variant="outline"
                      className="w-[230px] text-xl bg-[#e5ab47] text-white border-[#e5ab47] justify-center"
                    >
                      {decodedServiceId}
                    </Badge>
                  </div>

                  {detailNurse && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                      <h3 className="text-xl font-be-vietnam-pro font-semibold text-gray-800">
                        Điều dưỡng đã chọn
                      </h3>
                      <div className="text-lg text-gray-600 space-y-1">
                        <div className="flex items-center ">
                          <User className="mr-2 text-gray-500" size={16} />
                          <span>{detailNurse["nurse-name"]}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProfile ? (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 ">
                      <h3 className="text-xl font-be-vietnam-pro font-semibold text-gray-800">
                        Hồ sơ bệnh nhân đã chọn
                      </h3>
                      <div className="text-lg text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Tên:</span>
                          <span>{selectedProfile["full-name"]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Ngày sinh:</span>
                          <span>
                            {new Date(selectedProfile.dob).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Giới tính:</span>
                          <span>
                            {selectedProfile.gender === true ? "Nam" : "Nữ"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-4">
                      Chưa chọn hồ sơ bệnh nhân
                    </div>
                  )}

                  {selectedServicesTask && selectedServicesTask.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPackage && (
                        <div>
                          <span className="text-xl font-semibold text-primary block">
                            {selectedPackage.name}
                          </span>
                        </div>
                      )}

                      {selectedServicesTask.map((service, index) => {
                        const quantity = serviceQuantities[service.name] || 1;
                        const { totalCost, totalDuration } =
                          calculateAdvancedPricing(service, quantity);

                        let additionalDuration = 0;
                        let additionalCost = 0;

                        if (quantity > 1) {
                          if (service.unit === "time") {
                            additionalDuration =
                              (quantity - 1) * service["price-of-step"];
                            additionalCost =
                              (quantity - 1) * service["additional-cost"];
                          } else if (service.unit === "quantity") {
                            additionalDuration =
                              (quantity - 1) *
                              (service["price-of-step"] *
                                service["est-duration"]);
                            additionalCost =
                              (quantity - 1) * service["additional-cost"];
                          }
                        }

                        return (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-xl text-gray-800 truncate max-w-[70%]">
                                {service.name}
                              </span>
                              <span className="font-bold text-primary text-lg">
                                {formatCurrency(totalCost)}
                              </span>
                            </div>

                            <div className="text-lg text-gray-600 flex items-center justify-between">
                              <span className="flex items-center">
                                <Clock
                                  className="mr-2 text-gray-500"
                                  size={16}
                                />
                                <span>
                                  {service["est-duration"]} phút
                                  {quantity > 1 && (
                                    <div className="text-lg text-yellow-500 font-semibold">
                                      (+{additionalDuration.toFixed(0)} phút)
                                    </div>
                                  )}
                                </span>
                              </span>
                              <span className="flex items-center">
                                <span className="text-gray-600 mr-2">
                                  {formatCurrency(service.cost)}
                                  {quantity > 1 && (
                                    <div className="text-lg text-green-600">
                                      (+{formatCurrency(additionalCost)})
                                    </div>
                                  )}
                                </span>

                                {quantity > 1 && (
                                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm">
                                    x{quantity}
                                  </span>
                                )}
                              </span>
                            </div>

                            {serviceNotes[service.name] && (
                              <div className="text-lg text-gray-600 mt-2">
                                <FileText
                                  className="inline-block mr-2 text-gray-500"
                                  size={16}
                                />
                                <span className="italic">
                                  Ghi chú: {serviceNotes[service.name]}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-4">
                      Chưa có dịch vụ nào được chọn
                    </div>
                  )}

                  {selectedTime && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                      <h3 className="text-xl font-be-vietnam-pro font-semibold text-gray-800">
                        Thời gian đã chọn
                      </h3>

                      <div className="text-lg text-gray-600 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="text-gray-500" size={16} />
                          <span>{selectedTime.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-500" size={16} />
                          <span>{selectedTime.timeSlot.display}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTimes &&
                    selectedTimes.length > 0 &&
                    selectedPackage &&
                    selectedPackage["combo-days"] &&
                    selectedPackage["combo-days"] > 1 && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                        <h3 className="text-xl font-be-vietnam-pro font-semibold text-gray-800">
                          Lịch đã đặt ({selectedTimes.length}/
                          {selectedPackage["combo-days"]} ngày)
                        </h3>

                        <div className="max-h-64 overflow-y-auto pr-2">
                          {selectedTimes.map((timeItem, index) => (
                            <div
                              key={index}
                              className="mb-3 pb-2 border-b border-gray-200 last:border-b-0"
                            >
                              <div className="flex items-center space-x-2 text-lg text-gray-600">
                                <Calendar className="text-gray-500" size={16} />
                                <span>
                                  {new Date(timeItem.date).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-lg text-gray-600 mt-1">
                                <Clock className="text-gray-500" size={16} />
                                <span>{timeItem.timeSlot.display}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedTimes.length <
                          selectedPackage["combo-days"] && (
                          <div className="text-yellow-500 font-medium text-lg italic">
                            Vui lòng chọn đủ {selectedPackage["combo-days"]}{" "}
                            ngày
                          </div>
                        )}
                      </div>
                    )}

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-2xl text-gray-800">
                        Tổng thời gian của 1 buổi:
                      </span>
                      <span className="font-bold font-be-vietnam-pro text-2xl text-primary">
                        {calculateTotalTime()} phút
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-2xl text-gray-800">
                        Tổng tiền (1 buổi)
                      </span>
                      <div className="flex flex-col items-end">
                        {selectedPackage &&
                        selectedPackage.discount &&
                        selectedPackage.discount > 0 ? (
                          <>
                            <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                              {formatCurrency(
                                calculateTotalPrice() *
                                  (1 - selectedPackage.discount / 100)
                              )}
                            </span>
                            <span className="text-gray-500 text-lg line-through">
                              {formatCurrency(calculateTotalPrice())}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                            {formatCurrency(calculateTotalPrice())}
                          </span>
                        )}
                      </div>
                    </div>

                    {(selectedPackage?.["combo-days"] ?? 0) > 1 && (
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-2xl text-gray-800">
                          Tổng tiền combo ({selectedPackage?.["combo-days"]}{" "}
                          buổi)
                        </span>
                        <div className="flex flex-col items-end">
                          {selectedPackage &&
                          selectedPackage.discount &&
                          selectedPackage.discount > 0 ? (
                            <>
                              <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                                {formatCurrency(
                                  calculateTotalPrice() *
                                    (selectedPackage["combo-days"] ?? 0) *
                                    (1 - selectedPackage.discount / 100)
                                )}
                              </span>
                              <span className="text-gray-500 text-lg line-through">
                                {formatCurrency(
                                  calculateTotalPrice() *
                                    (selectedPackage["combo-days"] ?? 0)
                                )}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold font-be-vietnam-pro text-2xl text-red-500">
                              {formatCurrency(
                                calculateTotalPrice() *
                                  (selectedPackage?.["combo-days"] ?? 0)
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
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
                        className="w-1/2 text-lg bg-[#71DDD7] hover:bg-[#71DDD7]/90"
                        size="lg"
                        disabled={!canContinue()}
                        onClick={() => {
                          if (currentStep === steps.length) {
                            handleCompleteBooking();
                          } else {
                            setCurrentStep(currentStep + 1);
                          }
                        }}
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

export default BookingNurse;