"use client";

import { PatientProfile } from "@/app/components/Nursing/PatientRecord";
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
import { useParams, useSearchParams } from "next/navigation";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { calculateAge } from "@/app/components/Relatives/PatientRecord";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MedicalRecord } from "@/types/appointment";

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

type EnhancedTask = Task & {
  nurseNote?: string;
  isCompleted?: boolean;
  duration: string; // Ánh xạ từ "est-duration" và "unit"
  times: number; // Ánh xạ từ "total-unit"
};

const DetailHistoryAppointment: React.FC = () => {
  const params = useParams();
  const patientID = params.id as string;
  const searchParams = useSearchParams();
  const appointmentID = searchParams.get("appointmentID");
  const appointmentStatus = searchParams.get("status");

  const [appointment, setAppointment] = useState<
    CusPackageResponse["data"] | null
  >(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  const [medicalReport, setMedicalReport] = useState("");
  const [medicalRecordData, setMedicalRecordData] =
    useState<MedicalRecord | null>(null);
  const [medicalRecordLoading, setMedicalRecordLoading] = useState(false);
  const { toast } = useToast();

  // Fetch thông tin báo cáo y tế
  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!appointmentID) return;

      try {
        setMedicalRecordLoading(true);
        const response =
          await appointmentApiRequest.getMedicalRecord(appointmentID);
        setMedicalRecordData(response.payload.data);
      } catch (error) {
        console.error("Error fetching medical record:", error);
      } finally {
        setMedicalRecordLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentID]);

  // Cập nhật trạng thái báo cáo từ dữ liệu y tế
  useEffect(() => {
    if (medicalRecordData?.["nursing-report"]) {
      setMedicalReport(String(medicalRecordData["nursing-report"]));
      setHasReport(true);
    } else {
      setHasReport(false);
    }
  }, [medicalRecordData]);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientID) return;

      try {
        setPatientLoading(true);
        const response =
          await patientApiRequest.getPatientRecordByID(patientID);
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
        const response = await appointmentApiRequest.getCusPackage(
          cusPackageID,
          estDate
        );
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
      const tasks = appointment.tasks.map((task) => ({
        ...task,
        nurseNote: "",
        isCompleted: task.status === "done",
        taskOrder: task["task-order"],
        duration: `${task["est-duration"]}`,
        times: task["total-unit"],
        staffAdvice: task["staff-advice"], // Đổi thành staffAdvice
        customerNote: task["client-note"], // Đổi thành customerNote
      }));

      setUpdatedTasks(tasks);

      // Kiểm tra xem tất cả các task đã hoàn thành chưa
      const allCompleted = tasks.every(
        (task) => task.status === "done" || task.isCompleted
      );
      setAllTasksCompleted(allCompleted);
    }
  }, [appointment]);

  const handleServiceComplete = (taskId: string, nurseNote: string) => {
    setUpdatedTasks((prev) => {
      const newTasks = prev.map((task) =>
        task.id === taskId
          ? { ...task, nurseNote, isCompleted: true, status: "done" }
          : task
      );

      // Kiểm tra nếu tất cả task đã hoàn thành
      const allCompleted = newTasks.every(
        (task) => task.status === "done" || task.isCompleted
      );
      setAllTasksCompleted(allCompleted);

      if (allCompleted) {
        // Chuyển sang tab checklist nếu tất cả đã hoàn thành
        setActiveTab("checklist");
      }

      return newTasks;
    });
  };

  // console.log("medicalRecordData", medicalRecordData?.id);
  // console.log("medicalReport", medicalReport);

  if (loading || patientLoading || medicalRecordLoading) {
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
    age: calculateAge(patientData.dob) || "N/A",
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
      status: appointment.package["payment-status"],
      services: updatedTasks.map((task) => ({
        id: task.id,
        name: task.name,
        taskOrder: task["task-order"],
        duration: task.duration,
        quantity: task["total-unit"],
        staffAdvice: task["staff-advice"],
        clientNote: task["client-note"],
      })),
      totalDuration: `${totalDuration} phút`,
      totalPrice: appointment.package["total-fee"],
    },
  };

  // Kiểm tra có hiển thị nút "Lưu báo cáo" hay không

  const handleTabChange = (value: string) => {
    if (value === "checklist" && appointmentStatus !== "upcoming") {
      toast({
        variant: "warning",
        title: "Không thể truy cập",
        description: "Chỉ khi bắt đầu tới điểm hẹn thì mới được check task",
      });
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="mx-auto max-w-full container ">
      <Breadcrumb className=" py-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/nurse/appointmentHistory"
              className="text-xl"
            >
              Danh sách lịch sử cuộc hẹn
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
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Thông tin dịch vụ</TabsTrigger>
                <TabsTrigger value="checklist">Danh sách kiểm tra</TabsTrigger>
              </TabsList>
              <TabsContent value="services">
                <ServicesList
                  servicePackage={formattedPatientData.servicePackage}
                />
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

        {allTasksCompleted && (
          <Card className="mt-6 border-l-4 border-l-cyan-500 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-xl font-bold mb-4 text-cyan-600">
                Báo cáo y tế
              </h3>
              <p className="text-gray-600 mb-4">
                {hasReport
                  ? "Báo cáo y tế đã được lưu."
                  : "Tất cả các nhiệm vụ đã hoàn thành nhưng chưa có báo cáo y tế."}
              </p>

              <Textarea
                placeholder="Báo cáo y tế chưa được cập nhật."
                className="min-h-[200px] mb-4"
                value={medicalReport}
                readOnly={true}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DetailHistoryAppointment;
