"use client";
import {
  MedicalReport,
  MedicalReportCard,
} from "@/app/components/Nursing/MedicalReportCard";
import {
  Appointment,
  PatientProfile,
} from "@/app/components/Nursing/PatientRecord";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ServicesList from "@/app/components/Nursing/ServicesList";
import ServiceCheckTask from "@/app/components/Nursing/ServiceCheckTask";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";

// Định nghĩa type từ yêu cầu
export type CusPackageResponse = {
  success: boolean;
  data: {
    package: CusPackage;
    tasks: Task[];
  };
};

export type CusPackage = {
  id: string;
  name: string;
  "total-fee": number;
  "paid-amount": number;
  "unpaid-amount": number;
  "payment-status": string;
  "created-at": string;
};

export type Task = {
  id: string;
  "task-order": number;
  name: string;
  "client-note": string;
  "staff-advice": string;
  "est-duration": number;
  unit: string;
  "total-unit": number;
  status: string;
  "est-date": string;
};

// Type EnhancedTask được điều chỉnh để khớp với EnhancedService trong ServiceCheckTask
type EnhancedTask = Task & {
  nurseNote?: string;
  isCompleted?: boolean;
  duration: string; // Ánh xạ từ "est-duration" và "unit"
  description: string; // Giá trị mặc định vì không có trong Task
  times: number; // Ánh xạ từ "total-unit"
};

const DetailAppointment: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [appointment, setAppointment] = useState<CusPackageResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const estDate = searchParams.get("estDate");
      const cusPackageID = searchParams.get("cusPackageID");
      if (!estDate || !cusPackageID) {
        console.error("Missing estDate or cusPackageID in query parameters.");
        return;
      }

      try {
        setLoading(true);
        const response = await appointmentApiRequest.getCusPackage(cusPackageID, estDate);
        const data = response.payload.data;

        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [params, searchParams]);

  const [updatedTasks, setUpdatedTasks] = useState<EnhancedTask[]>([]);

  useEffect(() => {
    if (appointment) {
      setUpdatedTasks(
        appointment.tasks.map((task) => ({
          ...task,
          nurseNote: "",
          isCompleted: task.status === "done",
          duration: `${task["est-duration"]} ${task.unit === "lần" ? "phút" : task.unit}`,
          description: task["staff-advice"] || "Không có mô tả", // Dùng staff-advice làm mô tả
          times: task["total-unit"], // Ánh xạ từ "total-unit"
        }))
      );
    }
  }, [appointment]);

  const handleServiceComplete = (taskId: string, nurseNote: string) => {
    setUpdatedTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, nurseNote, isCompleted: true, status: "done" }
          : task
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Không tìm thấy thông tin cuộc hẹn.</div>;
  }

  const totalDuration = appointment.tasks.reduce(
    (sum, task) => sum + task["est-duration"],
    0
  );

  const patientData = {
    id: appointment.package.id,
    patient_name: "Chưa có thông tin",
    avatar: "/avatars/patient.jpg",
    phone_number: "N/A",
    birth_date: "N/A",
    age: "N/A",
    address: "N/A",
    ward: "N/A",
    district: "N/A",
    city: "N/A",
    description: "N/A",
    note: "N/A",
    servicePackage: {
      id: appointment.package.id,
      name: appointment.package.name,
      appointmentDate: searchParams.get("estDate") || "N/A",
      appointmentTime: new Date(appointment.tasks[0]["est-date"]).toLocaleTimeString(),
      status:
        appointment.package["payment-status"] === "unpaid"
          ? "pending"
          : ("in-progress" as const),
      services: updatedTasks.map((task) => ({
        id: task.id,
        name: task.name,
        duration: task.duration,
        quantity: task["total-unit"],
        staffAdvice: task["staff-advice"],
        clientNote: task["client-note"],
      })),
      totalDuration: `${totalDuration} phút`,
      totalPrice: `${appointment.package["total-fee"]} VND`,
    },
  };

  return (
    <div className="mx-auto max-w-full container ">
      <Breadcrumb className=" py-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/nurse/appointments" className="text-xl">
              Danh sách cuộc hẹn sắp tới
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl">
              Chi tiết cuộc hẹn: {patientData.patient_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div >
        <h2 className="text-3xl font-bold mb-8">Chi tiết cuộc hẹn</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatientProfile appointment={patientData as any} />
          
          <div>
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Thông tin dịch vụ</TabsTrigger>
                <TabsTrigger value="checklist">Danh sách kiểm tra</TabsTrigger>
              </TabsList>
              <TabsContent value="services">
                <ServicesList servicePackage={patientData.servicePackage} />
              </TabsContent>
              <TabsContent value="checklist">
                <ServiceCheckTask
                  services={updatedTasks}
                  onServiceComplete={handleServiceComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAppointment;