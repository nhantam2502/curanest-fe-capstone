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
  times: number;
};

const DetailAppointment: React.FC = () => {
  const params = useParams();
  const patientID = params.id as string;
  const searchParams = useSearchParams();
  const appointmentID = searchParams.get("appointmentID");
  // console.log("appointmentID: ", appointmentID);

  const [appointment, setAppointment] = useState<
    CusPackageResponse["data"] | null
  >(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [medicalReport, setMedicalReport] = useState("");
  const [savingReport, setSavingReport] = useState(false);
  const [medicalRecordData, setMedicalRecordData] =
    useState<MedicalRecord | null>(null);
  const [medicalRecordLoading, setMedicalRecordLoading] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const { toast } = useToast();

  // Fetch medical record data từ API
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

  useEffect(() => {
    if (medicalRecordData?.["nursing-report"]) {
      setMedicalReport(String(medicalRecordData["nursing-report"]));
      // Nếu có dữ liệu báo cáo y tế, đánh dấu là đã submit
      setReportSubmitted(true);
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

  
  const handleSubmitMedicalReport = async () => {
    if (!medicalReport.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập báo cáo y tế trước khi gửi",
      });
      return;
    }

    if (!medicalRecordData || !medicalRecordData.id) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy ID báo cáo y tế",
      });
      return;
    }

    try {
      setSavingReport(true);

      // Gọi API submitMedicalReport với ID từ medicalRecordData
      const response = await appointmentApiRequest.submitMedicalReport(
        medicalRecordData.id,
        { "nursing-report": medicalReport }
      );

      if (response.payload.success) {
        toast({
          title: "Thành công",
          description: "Báo cáo y tế đã được lưu",
        });
        // Đánh dấu là đã submit báo cáo
        setReportSubmitted(true);
      } else {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("Error saving medical report:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu báo cáo y tế. Vui lòng thử lại sau.",
      });
    } finally {
      setSavingReport(false);
    }
  };

  console.log("medicalRecordData", medicalRecordData?.id);
  console.log("medicalReport", medicalReport);

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
      status:
        appointment.package["payment-status"] === "unpaid"
          ? "pending"
          : ("in-progress" as const),
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
  const showSaveButton = !reportSubmitted && allTasksCompleted;

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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
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
                {reportSubmitted 
                  ? "Báo cáo y tế đã được lưu."
                  : "Tất cả các nhiệm vụ đã hoàn thành. Vui lòng nhập báo cáo y tế để hoàn tất quy trình."}
              </p>

              <Textarea
                placeholder="Nhập báo cáo y tế chi tiết tại đây..."
                className="min-h-[200px] mb-4"
                value={medicalReport}
                onChange={(e) => setMedicalReport(e.target.value)}
                readOnly={reportSubmitted}
              />

              <div className="flex justify-end">
                {showSaveButton && (
                  <Button
                    onClick={handleSubmitMedicalReport}
                    disabled={savingReport || !medicalReport.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {savingReport ? "Đang lưu..." : "Lưu báo cáo"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DetailAppointment;