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
import dummyNursing from "@/dummy_data/dummy_nurse.json";

import { PatientRecord } from "@/types/patient";
import { Badge } from "@/components/ui/badge";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { ServicePackageSelection } from "@/app/components/Relatives/Step2";
import { ServiceAdjustment } from "@/app/components/Relatives/Step3";
import { OrderConfirmationComponent } from "@/app/components/Relatives/Step7";

type SelectedTime = {
  timeSlot: TimeSlot;
  date: string;
};
type DummyServices = Record<string, Service[]>;
const services: DummyServices = dummy_services;

interface ServiceItem {
  name: string;
  price: number;
  time: string;
  description?: string;
  validityPeriod?: number;
  usageTerms?: string;
}

interface ServicePackages {
  [packageName: string]: ServiceItem[];
}

interface ServiceTypes {
  [key: string]: ServicePackages;
}

const servicesByType: ServiceTypes = {
  oneTime: {
    "Chăm sóc bệnh nhân nội khoa": [
      { name: "Theo dõi và chăm sóc người bệnh", time: "120", price: 200000 },
      { name: "Dùng thuốc theo y lệnh", time: "60", price: 100000 },
      { name: "Theo dõi diễn biến bệnh", time: "90", price: 150000 },
      { name: "Chăm sóc dinh dưỡng", time: "120", price: 200000 },
      { name: "Chăm sóc vết thương", time: "90", price: 150000 },
    ],
    "Chăm sóc bệnh nhân ngoại khoa": [
      { name: "Chăm sóc vết thương", time: "90", price: 150000 },
      { name: "Hỗ trợ phẫu thuật", time: "180", price: 300000 },
      { name: "Thay băng vô trùng", time: "60", price: 120000 },
      { name: "Theo dõi sau phẫu thuật", time: "120", price: 200000 },
    ],
  },
  subscription: {
    "Gói Chăm Sóc Hàng Tháng": [
      {
        name: "Theo dõi sức khỏe tổng quát",
        time: "60",
        price: 400000,
        validityPeriod: 30,
        usageTerms: "Tối đa 4 lần trong 30 ngày",
      },
      {
        name: "Chăm sóc bệnh nhân nội trú",
        time: "120",
        price: 800000,
        validityPeriod: 30,
        usageTerms: "Tối đa 2 lần trong 30 ngày",
      },
    ],
    "Gói Tiêm Ngừa": [
      {
        name: "Tiêm chủng định kỳ",
        time: "60",
        price: 1500000,
        validityPeriod: 60,
        usageTerms: "Tối đa 3 lần trong 60 ngày",
      },
    ],
  },
};
const BookingNurse = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [selectedServices, setSelectedServices] = useState<
    Array<{
      name: string;
      price: number;
      time: string;
      description?: string;
    }>
  >([]);
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<
    "oneTime" | "subscription"
  >("oneTime");
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [serviceQuantities, setServiceQuantities] = useState<{
    [key: string]: number;
  }>({});
  //   const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
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

  const selectedNurse: Nurse | null =
    dummyNursing.find((nurse: Nurse) => String(nurse.id) === id) ?? null;
  //  Compare as strings
  // console.log("selectedNurse: ", selectedNurse);

  const handleMajorChange = (newMajor: string) => {
    if (selectedMajor !== newMajor) {
      setSelectedMajor(newMajor);

      // Ensure the new major exists in the services object
      const newServices = services[newMajor] || []; // Default to an empty array

      setSelectedServices(newServices);

      // Initialize quantities only if there are valid services
      const initialQuantities: { [key: string]: number } = {};

      newServices.forEach((service) => {
        initialQuantities[service.name] = 1;
      });

      setServiceQuantities(initialQuantities);
    }
  };

  const calculatePackagePrice = (services: Service[]): number => {
    return services.reduce(
      (total: number, service: Service) => total + service.price,
      0
    );
  };

  const calculatePackageTotalTime = (services: Service[]): number => {
    return services.reduce(
      (total: number, service: Service) => total + parseInt(service.time),
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

  const updateServiceQuantity = (serviceName: string, newQuantity: number) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceName]: Math.max(0, newQuantity),
    }));
  };

  const removeService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.name !== serviceName)
    );
    const newQuantities = { ...serviceQuantities };
    delete newQuantities[serviceName];
    setServiceQuantities(newQuantities);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const calculateTotalPrice = () => {
    return (selectedServices || []).reduce(
      (total, service) =>
        total + service.price * (serviceQuantities?.[service.name] || 1),
      0
    );
  };

  const calculateTotalTime = () => {
    return selectedServices.reduce(
      (total, service) =>
        total + parseInt(service.time) * (serviceQuantities[service.name] || 1),
      0
    );
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selectedProfile !== null;
      case 2:
        return selectedMajor !== null && (selectedServices?.length || 0) > 0;
      case 4:
        return selectedTime !== null;
      default:
        return true;
    }
  };

  const handleCompleteBooking = () => {
    if (!selectedServices.length || !selectedTime || !selectedProfile) {
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
          <ServicePackageSelection
            selectedServiceType={selectedServiceType}
            setSelectedServiceType={setSelectedServiceType}
            selectedMajor={selectedMajor}
            setSelectedMajor={setSelectedMajor}
            setSelectedServices={setSelectedServices}
            setServiceQuantities={setServiceQuantities}
            formatCurrency={formatCurrency}
            servicesByType={servicesByType}
            handleMajorChange={handleMajorChange}
            calculatePackageTotalTime={calculatePackageTotalTime}
            calculatePackagePrice={calculatePackagePrice}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );

      case 3:
        return (
          <ServiceAdjustment
            selectedServices={selectedServices}
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

      case 5:
        return (
          <OrderConfirmationComponent
            selectedServices={selectedServices}
            serviceQuantities={serviceQuantities}
            formatCurrency={formatCurrency}
            selectedNurse={selectedNurse}
            selectedTime={selectedTime}
            calculateTotalPrice={calculateTotalPrice}
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
                   <h2 className="text-2xl font-be-vietnam-pro font-bold mb-6">
                       Dịch vụ đã chọn
                     </h2>
   
                     {selectedServices && selectedServices.length > 0 ? (
                       <div className="space-y-3">
                         {/* Hiển thị tên gói nếu đã chọn */}
                         {selectedMajor && (
                           <div className="pb-3 mb-3 border-b">
                             <span className="text-lg font-semibold text-primary">
                               {selectedMajor}
                             </span>
                             {selectedServiceType === "subscription" &&
                               Array.isArray(
                                 servicesByType[selectedServiceType]?.[
                                   selectedMajor
                                 ]
                               ) &&
                               servicesByType[selectedServiceType][selectedMajor]
                                 .length > 0 && (
                                 <div className="text-sm text-blue-600 mt-1">
                                   Áp dụng trong{" "}
                                   {
                                     servicesByType[selectedServiceType][
                                       selectedMajor
                                     ][0].validityPeriod
                                   }{" "}
                                   ngày
                                 </div>
                               )}
                           </div>
                         )}
   
                         {selectedServices.map((service, index) => (
                           <div key={index} className="flex flex-col gap-1">
                             <div className="flex justify-between text-xl">
                               <span className="font-semibold">
                                 {service.name}
                               </span>
                               <span className="font-semibold">
                                 {formatCurrency(
                                   service.price *
                                     (serviceQuantities[service.name] || 1)
                                 )}
                               </span>
                             </div>
   
                             {/* Hiển thị thời gian và giá theo từng lần đặt */}
                             <div className="text-lg text-gray-600 flex items-center justify-between w-full">
                               <span>{service.time} phút</span>
                               <span className="flex items-center">
                                 {/* Hiển thị giá ban đầu */}
                                 <span className="text-gray-600 mr-1">
                                   {formatCurrency(service.price)}/lần
                                 </span>
   
                                 {/* Hiển thị số lượng nếu > 1 */}
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
   
                     {/* Hiển thị điều dưỡng đã chọn - kept for compatibility but will be auto-assigned */}
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

export default BookingNurse;
