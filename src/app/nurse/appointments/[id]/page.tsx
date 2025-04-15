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
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { calculateAge } from "@/app/components/Relatives/PatientRecord";
import { formatDate } from "@/lib/utils";

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
  const patientID = params.id as string;
  const searchParams = useSearchParams();
  const [appointment, setAppointment] = useState<CusPackageResponse["data"] | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientID) return;
      
      try {
        setPatientLoading(true);
        const response = await patientApiRequest.getPatientRecordByID(patientID);
        setPatientData(response.payload.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setPatientLoading(false);
      }
    };

    fetchPatientData();
  }, [patientID]);

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
          duration: `${task["est-duration"]}`,
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

  if (loading || patientLoading) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Không tìm thấy thông tin cuộc hẹn.</div>;
  }

  if (!patientData) {
    return <div>Không tìm thấy thông tin bệnh nhân.</div>;
  }

  const totalDuration = appointment.tasks.reduce(
    (sum, task) => sum + task["est-duration"],
    0
  );

  // Tạo dữ liệu cho component PatientProfile từ thông tin bệnh nhân thực tế
  const formattedPatientData = {
    id: patientData.id || appointment.package.id,
    patient_name: patientData["full-name"] || "Chưa có thông tin",
    phone_number: patientData["phone-number"] || "N/A",
    birth_date: formatDate(new Date(patientData.dob)) || "N/A",
    age:  calculateAge(patientData.dob) || "N/A",
    address: patientData.address || "N/A",
    ward: patientData.ward || "N/A",
    district: patientData.district || "N/A",
    city: patientData.city || "N/A",
    "desc-pathology": patientData["desc-pathology"] || "N/A",
    "note-for-nurse": patientData["note-for-nurse"] || "N/A",
    servicePackage: {
      id: appointment.package.id,
      name: appointment.package.name,
      appointmentDate: searchParams.get("estDate") || "N/A",
      estTimeFrom: searchParams.get("estTimeFrom") || "N/A",
      estTimeTo: searchParams.get("estTimeTo") || "N/A",
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
      totalPrice: appointment.package["total-fee"],
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
              Chi tiết cuộc hẹn: {formattedPatientData.patient_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h2 className="text-3xl font-bold mb-8">Chi tiết cuộc hẹn</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatientProfile appointment={formattedPatientData as any} />
          
          <div>
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Thông tin dịch vụ</TabsTrigger>
                <TabsTrigger value="checklist">Danh sách kiểm tra</TabsTrigger>
              </TabsList>
              <TabsContent value="services">
                <ServicesList servicePackage={formattedPatientData.servicePackage} />
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