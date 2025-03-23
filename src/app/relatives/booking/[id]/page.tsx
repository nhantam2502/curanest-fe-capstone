"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Calendar, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import TimeSelection from "@/app/components/Relatives/TimeSelection";
import {
  CategoryInfo,
  PackageServiceItem,
  ServiceItem,
  ServicePackageType,
  ServiceTaskType,
  TransformedCategory,
} from "@/types/service";
import NurseSelectionList from "@/app/components/Relatives/NurseSelectionList";
import nurses from "@/dummy_data/dummy_nurse.json";
import { Nurse } from "@/types/nurse";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ServiceCategorySelection } from "@/app/components/Relatives/Step1";
import { ServicePackageSelection } from "@/app/components/Relatives/Step2";
import { ServiceAdjustment } from "@/app/components/Relatives/Step3";
import { BookingMethodSelection } from "@/app/components/Relatives/Step4";
import { Step6Component } from "@/app/components/Relatives/Step6";
import { OrderConfirmationComponent } from "@/app/components/Relatives/Step7";
import serviceApiRequest from "@/apiRequest/service/apiServices";

interface SelectedTime {
  timeSlot: { display: string; value: string };
  date: string;
}

type ServicesByType = {
  oneTime: { [categoryName: string]: PackageServiceItem[] };
  subscription: { [categoryName: string]: PackageServiceItem[] };
};

const DetailBooking = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selection, setSelection] = useState<{
    categoryId: string;
    serviceId: string;
    serviceName?: string;
  } | null>(null);

  console.log("selection: ", selection);

  // Replace this hardcoded data
  const [serviceCategories, setServiceCategories] = useState<
    TransformedCategory[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // fetch api get serivce package
  const [servicesByType, setServicesByType] = useState<ServicesByType>({
    oneTime: {},
    subscription: {},
  });
  const [isPackagesLoading, setIsPackagesLoading] = useState(false);

  // fetch api get serivce task
  const [serviceTasks, setServiceTasks] = useState<Record<string, any[]>>({});
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [selectedServicesTask, setSelectedServicesTask] = useState<
    ServiceTaskType[]
  >([]);

  const [serviceQuantities, setServiceQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [nurseSelectionMethod, setNurseSelectionMethod] = useState<
    "manual" | "auto"
  >("manual");
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Chọn dịch vụ" },
      { id: 2, title: "Chọn gói theo dịch vụ" },
      { id: 3, title: "Điều chỉnh gói" },
      { id: 4, title: "Hình thức đặt" },
    ];

    if (nurseSelectionMethod === "manual") {
      baseSteps.push({ id: 5, title: "Chọn điều dưỡng" });
    }

    return [
      ...baseSteps,
      {
        id: nurseSelectionMethod === "manual" ? 6 : 5,
        title: "Chọn thời gian",
      },
      {
        id: nurseSelectionMethod === "manual" ? 7 : 6,
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

  const updateServiceQuantity = (serviceName: string, newQuantity: number) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceName]: Math.max(0, newQuantity),
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
    return (selectedServicesTask || []).reduce(
      (total, service) =>
        total + service.cost * (serviceQuantities?.[service.name] || 1),
      0
    );
  };

  const calculateTotalTime = () => {
    return selectedServicesTask.reduce(
      (total, service) =>
        total + service.cost * (serviceQuantities[service.name] || 1),
      0
    );
  };

  // Handle next step
  const handleNextStep = () => {
    setCurrentStep((current) => current + 1);
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep((current) => current - 1);
  };

  const calculatePackagePrice = (services: PackageServiceItem[]): number => {
    return services.reduce(
      (total: number, service: PackageServiceItem) =>
        total + (service.price ?? 0),
      0
    );
  };

  const calculatePackageTotalTime = (
    services: PackageServiceItem[]
  ): number => {
    return services.reduce(
      (total: number, service: PackageServiceItem) =>
        total + service["time-interval"],
      0
    );
  };

  const handleCompleteBooking = () => {
    if (
      !selectedServicesTask.length ||
      !selectedTime ||
      !nurseSelectionMethod
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
        description: `Tổng tiền: ${formatCurrency(calculateTotalPrice())}`,
      });
      router.push("/relatives/appointments");
    }
  };

  // Kiểm tra xem có thể tiếp tục sang bước tiếp theo không
  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selection !== null;
      case 2:
        return (selectedServicesTask?.length || 0) > 0;
      case 5:
        // Case 5: Nếu là manual thì phải chọn điều dưỡng, nếu là auto thì phải chọn thời gian
        // if (nurseSelectionMethod === "manual") {
        //   return selectedNurse !== null;
        // } else {
        //   return selectedTime !== null; // Auto method - phải chọn thời gian
        // }

        return selectedTime !== null; // Auto method - phải chọn thời gian

      case 6:
        // Case 6: Phải chọn thời gian nếu là manual, hoặc đã đủ thông tin nếu là auto
        if (nurseSelectionMethod === "manual") {
          return selectedTime !== null;
        }
        return true;
      default:
        return true;
    }
  };

  useEffect(() => {
    const fetchFilteredServices = async () => {
      try {
        const nameFilter = searchTerm.trim() ? searchTerm : null;

        const response = await serviceApiRequest.getListService(nameFilter);

        const transformedServices: TransformedCategory[] =
          response.payload.data.map(
            (item: {
              "category-info": CategoryInfo;
              "list-services": ServiceItem[];
            }) => ({
              name: item["category-info"].name,
              id: item["category-info"].id,
              description: item["category-info"].description,
              services: item["list-services"].map((service: ServiceItem) => ({
                name: service.name,
                id: service.id,
                description: service.description,
              })),
            })
          );

        setServiceCategories(transformedServices);
      } catch (error) {
        console.error("Failed to fetch filtered services:", error);
      }
    };

    fetchFilteredServices();
  }, [searchTerm]);

  useEffect(() => {
    const fetchServicePackages = async () => {
      if (!selection?.serviceId) return;

      try {
        setIsPackagesLoading(true);
        const response = await serviceApiRequest.getListServicePackage(
          selection.serviceId
        );

        if (response.payload.data) {
          const packagesData = response.payload.data;
          const updatedServicesByType: ServicesByType = {
            oneTime: {},
            subscription: {},
          };

          packagesData.forEach((pkg: ServicePackageType) => {
            const packageType = pkg["combo-days"] ? "subscription" : "oneTime";
            const categoryName = pkg.name;

            const serviceItem: PackageServiceItem = {
              id: pkg.id,
              name: pkg.name,
              status: pkg.status,
              description: pkg.description,
              "service-id": pkg["service-id"],
              "time-interval": pkg["time-interval"] || 0,
              discount: parseInt(pkg.discount),
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
  }, [selection, toast]);

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
          <ServiceCategorySelection
            serviceCategories={serviceCategories}
            selection={selection}
            setSelection={setSelection}
            onNext={handleNextStep}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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
            selectedServices={selectedServicesTask}
            serviceQuantities={serviceQuantities}
            updateServiceQuantity={updateServiceQuantity}
            removeService={removeService}
            calculateTotalPrice={calculateTotalPrice}
            calculateTotalTime={calculateTotalTime}
            formatCurrency={formatCurrency}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            setCurrentStep={setCurrentStep}
          />
        );

      case 4:
        return (
          <BookingMethodSelection
            nurseSelectionMethod={nurseSelectionMethod}
            setNurseSelectionMethod={setNurseSelectionMethod}
            setSelectedNurse={setSelectedNurse}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );

      case 5:
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
            (nurse) => nurse.specialization === selectedPackage
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

      case 6:
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
          <Step6Component
            nurseSelectionMethod={nurseSelectionMethod}
            calculateTotalTime={calculateTotalTime}
            setSelectedTime={setSelectedTime}
            selectedServicesTask={selectedServicesTask}
            serviceQuantities={serviceQuantities}
            formatCurrency={formatCurrency}
            calculateTotalPrice={calculateTotalPrice}
            selectedNurse={selectedNurse}
            selectedTime={selectedTime}
            setCurrentStep={setCurrentStep}
            toast={toast}
            router={router}
          />
        );

      case 7:
        return (
          <OrderConfirmationComponent
            selectedServicesTask={selectedServicesTask}
            serviceQuantities={serviceQuantities}
            formatCurrency={formatCurrency}
            selectedNurse={selectedNurse}
            selectedTime={selectedTime}
            calculateTotalPrice={calculateTotalPrice}
            nurseSelectionMethod={nurseSelectionMethod}
            setCurrentStep={setCurrentStep}
            toast={toast}
            router={router}
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

          {/* Right Side */}
          <div className="w-1/3">
            <Card>
              <CardContent className="pt-8">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-be-vietnam-pro font-bold">
                      Dịch vụ đã chọn
                    </h2>

                    <Badge className="text-xl bg-[#e5ab47] text-white border-[#e5ab47]">
                      {selection?.serviceName}
                    </Badge>
                  </div>

                  {selectedServicesTask && selectedServicesTask.length > 0 ? (
                    <div className="space-y-3">
                      {/* Hiển thị tên gói nếu đã chọn */}
                      {selectedPackage && (
                        <div className="pb-3 mb-3 border-b">
                          <span className="text-xl font-semibold text-primary">
                            {selectedPackage}
                          </span>
                        </div>
                      )}

                      {selectedServicesTask.map((service, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xl">
                            <span className="font-semibold">
                              {service.name}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                service.cost *
                                  (serviceQuantities[service.name] || 1)
                              )}
                            </span>
                          </div>

                          <div className="text-lg text-gray-600 flex items-center justify-between w-full">
                            <span>{service["est-duration"]} phút</span>
                            <span className="flex items-center">
                              <span className="text-gray-600 mr-1">
                                {formatCurrency(service.cost)}/
                                {service.unit === "quantity" ? "lần" : "phút"}
                              </span>

                              {(serviceQuantities[service.name] || 1) > 1 && (
                                <span className="ml-2 text-gray-600">
                                  (x{serviceQuantities[service.name]})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      Chưa có dịch vụ nào được chọn
                    </div>
                  )}

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
                        disabled={!canContinue()}
                        onClick={() => {
                          if (currentStep === steps.length) {
                            handleCompleteBooking(); // Gọi hàm đặt lịch khi đến bước cuối
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

export default DetailBooking;
