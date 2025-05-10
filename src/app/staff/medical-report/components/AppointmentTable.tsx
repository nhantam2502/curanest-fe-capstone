"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GetAppointment } from "@/types/appointment";
import { PatientRecord } from "@/types/patient";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { ServiceItem } from "@/types/service";
import { Button } from "@/components/ui/button";
import { ViewMedicalReportDialog } from "./MedicalReportDialog";

interface PatientInfo {
  id: string;
  "patient-id"?: string;
  "full-name": string;
}

interface AppointmentTableProps {
  onSelect: (appointment: GetAppointment) => void;
}

export default function AppointmentTable({ onSelect }: AppointmentTableProps) {
  const [appointments, setAppointments] = useState<GetAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [patientDetailsMap, setPatientDetailsMap] = useState<
    Record<string, PatientInfo | null>
  >({});
  const [isFetchingPatients, setIsFetchingPatients] = useState(false);
  const [serviceMap, setServiceMap] = useState<Record<string, ServiceItem>>({});
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + 1);

      const params = {
        // "had-nurse": "false",
        // "est-date-from": estDateFrom,
        // "est-date-to": estDateTo,
        "appointment-status": "upcoming",
      };

      console.log("Fetching appointments with params:", params);
      const response = await appointmentApiRequest.getAppointments(params);

      if (response.status === 200 && Array.isArray(response.payload?.data)) {
        return response.payload.data as GetAppointment[];
      } else {
        console.error(
          "Failed to fetch appointments:",
          response.payload?.message || `Status: ${response.status}`
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoadingServices(true);

      try {
        const response = await serviceApiRequest.getListService(null);

        if (
          response.status === 200 &&
          response.payload?.success &&
          Array.isArray(response.payload.data)
        ) {
          const categories = response.payload.data;
          const newServiceMap: Record<string, ServiceItem> = {};

          categories.forEach((category: any) => {
            if (Array.isArray(category["list-services"])) {
              category["list-services"].forEach((service: ServiceItem) => {
                if (service.id && service.name) {
                  newServiceMap[service.id] = service;
                } else {
                  console.warn(
                    "Skipping service due to missing id or name:",
                    service
                  );
                }
              });
            }
          });

          setServiceMap(newServiceMap);
        } else {
          console.error("Failed to fetch services:", response);
          setServiceMap({});
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServiceMap({});
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServiceData();
  }, []);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoadingAppointments(true);
      setPatientDetailsMap({});
      const data = await fetchAppointments();
      setAppointments(data);
      setIsLoadingAppointments(false);
    };

    loadAppointments();
  }, []);

  useEffect(() => {
    const fetchAllPatientDetails = async (patientIds: string[]) => {
      if (patientIds.length === 0) {
        setIsFetchingPatients(false);
        return;
      }

      setIsFetchingPatients(true);
      console.log("Fetching details for Patient IDs:", patientIds);

      const results = await Promise.allSettled(
        patientIds.map(
          (id) =>
            patientApiRequest.getPatientById(id as any) as Promise<{
              status: number;
              payload?: { data: PatientRecord };
            }>
        )
      );

      const newPatientDetailsMap: Record<string, PatientInfo | null> = {};

      results.forEach((result, index) => {
        const patientId = patientIds[index];

        if (result.status === "fulfilled") {
          const response = result.value;

          if (response.status === 200 && response.payload?.data) {
            const patientData = response.payload.data;

            if (
              patientData &&
              (patientData.id || (patientData as any)["patient-id"]) &&
              (patientData as any)["full-name"]
            ) {
              newPatientDetailsMap[patientId] = {
                id: patientData.id || (patientData as any)["patient-id"] || "",
                "patient-id": (patientData as any)["patient-id"],
                "full-name": (patientData as any)["full-name"],
              };
            } else {
              console.warn(
                `Fetched data for patient ${patientId} missing expected fields:`,
                patientData
              );
              newPatientDetailsMap[patientId] = null;
            }
          } else {
            console.error(
              `Failed to fetch patient ${patientId}:`,
              response.payload || `Status ${response.status}`
            );
            newPatientDetailsMap[patientId] = null;
          }
        } else {
          console.error(`Error fetching patient ${patientId}:`, result.reason);
          newPatientDetailsMap[patientId] = null;
        }
      });

      setPatientDetailsMap(newPatientDetailsMap);
      setIsFetchingPatients(false);
    };

    if (appointments.length > 0 && !isLoadingAppointments) {
      const uniquePatientIds = Array.from(
        new Set(
          appointments
            .map((app) => app["patient-id"])
            .filter(
              (id): id is string => typeof id === "string" && id.trim() !== ""
            )
        )
      );

      if (uniquePatientIds.length > 0) {
        fetchAllPatientDetails(uniquePatientIds);
      } else {
        setIsFetchingPatients(false);
      }
    } else {
      setIsFetchingPatients(false);
    }
  }, [appointments, isLoadingAppointments]);
  //   reportId: string,
  //   confirmation: string
  // ) => {
  //   try {
  //     await medicalReportApiRequest.updateMedicalReport(reportId, {
  //       "nursing-report": null,
  //       "staff-confirmation": confirmation.trim(),
  //     });
  //   } catch (error) {
  //     console.error("Failed to update medical report:", error);
  //     console.log(reportId, confirmation);
  //     throw error;
  //   }
  // };

  const filteredAppointments = useMemo(() => {
    if (isLoadingServices) return [];

    return appointments.filter((app) => {
      const patientId = app["patient-id"];
      const serviceId = app["service-id"];

      const validPatientId =
        typeof patientId === "string" && patientId.trim() !== "";
      const validServiceId =
        typeof serviceId === "string" && serviceId.trim() !== "";

      const patient = validPatientId ? patientDetailsMap[patientId] : null;
      const service = validServiceId ? serviceMap[serviceId] : null;

      const patientName = patient?.["full-name"]?.toLowerCase() || "";
      const serviceName = service?.name?.toLowerCase() || "";
      const lowerSearchTerm = searchTerm.toLowerCase();

      return (
        (validPatientId && patientId.toLowerCase().includes(lowerSearchTerm)) ||
        patientName.includes(lowerSearchTerm) ||
        (validServiceId && serviceId.toLowerCase().includes(lowerSearchTerm)) ||
        serviceName.includes(lowerSearchTerm)
      );
    });
  }, [
    appointments,
    patientDetailsMap,
    serviceMap,
    searchTerm,
    isLoadingServices,
  ]);

  // Render helper for patient cell
  const renderPatientCell = (app: GetAppointment) => {
    const patientId = app["patient-id"];

    if (typeof patientId !== "string" || patientId.trim() === "") {
      return (
        <TableCell className="font-medium text-muted-foreground italic">
          ID BN không hợp lệ
        </TableCell>
      );
    }

    const patient = patientDetailsMap[patientId];

    if (isFetchingPatients && !(patientId in patientDetailsMap)) {
      return (
        <TableCell className="font-medium italic text-muted-foreground">
          Đang tải tên BN...
        </TableCell>
      );
    }

    if (patient === null) {
      return (
        <TableCell className="font-medium text-destructive">
          {patientId} (Lỗi tải)
        </TableCell>
      );
    }

    const displayName = patient?.["full-name"]?.trim() || patientId;
    return <TableCell className="font-medium">{displayName}</TableCell>;
  };

  const renderServiceCell = (app: GetAppointment) => {
    const serviceId = app["service-id"];

    if (typeof serviceId !== "string" || serviceId.trim() === "") {
      return (
        <TableCell className="text-muted-foreground italic">
          ID DV không hợp lệ
        </TableCell>
      );
    }

    if (isLoadingServices) {
      return (
        <TableCell className="italic text-muted-foreground">
          Đang tải DV...
        </TableCell>
      );
    }

    const service = serviceMap[serviceId];

    if (!service) {
      return (
        <TableCell className="text-orange-600">
          {serviceId} (Không tìm thấy tên)
        </TableCell>
      );
    }

    return <TableCell>{service.name}</TableCell>;
  };

  const isLoading = isLoadingAppointments || isLoadingServices;

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>Cuộc hẹn chờ phê duyệt</CardTitle>
        <CardDescription>
          Danh sách các cuộc hẹn đang chờ được phê duyệt là hoàn thành.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Hành động</TableHead>{" "}
              {/* Right-aligned header */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {appointments.length === 0
                    ? "Không có cuộc hẹn nào chờ giao hôm nay."
                    : "Không tìm thấy kết quả phù hợp."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted"
                >
                  {renderPatientCell(app)}
                  {renderServiceCell(app)}
                  <TableCell>
                    {app["act-date"]
                      ? new Date(app["act-date"]).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "Chưa có thời gian"}
                    <div>
                      {app["act-date"]
                        ? new Date(app["act-date"]).toLocaleDateString("vi-VN")
                        : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppId(app.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ViewMedicalReportDialog
          appId={selectedAppId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </CardContent>
    </Card>
  );
}
