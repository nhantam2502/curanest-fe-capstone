"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GetAppointment } from "@/types/appointment";
import { PatientRecord } from "@/types/patient";
import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { ServiceItem } from "@/types/service";
import { Button } from "@/components/ui/button";
import { ViewMedicalReportDialog } from "./MedicalReportDialog";
import { useStaffServices } from "@/hooks/useStaffService";

interface PatientInfo {
  id: string; // The canonical patient record ID
  "full-name": string;
}

interface AppointmentTableProps {
  onSelect: (appointment: GetAppointment) => void; // Prop for potential future use
}

export default function AppointmentTable({ onSelect }: AppointmentTableProps) {
  const [appointments, setAppointments] = useState<GetAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [patientDetailsMap, setPatientDetailsMap] = useState<
    Record<string, PatientInfo | null>
  >({});
  const [isFetchingPatientDetails, setIsFetchingPatientDetails] =
    useState(false);
  const [serviceMap, setServiceMap] = useState<Record<string, ServiceItem>>({});
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { staffServices, loading: isLoadingStaffServices } = useStaffServices();

  const derivedFilterCategoryId = useMemo(() => {
    if (
      isLoadingStaffServices ||
      !staffServices ||
      staffServices.length === 0
    ) {
      return null; // Or undefined, depending on how your API handles missing category-id
    }

    return staffServices[0]?.categoryInfo?.id || null;
  }, [staffServices, isLoadingStaffServices]);

  const fetchAppointmentsData = useCallback(async () => {
    if (isLoadingStaffServices) {
      return [];
    }

    setIsLoadingAppointments(true);
    try {
      const params: Record<string, string | undefined> = {
        "appointment-status": "upcoming",
      };
      if (derivedFilterCategoryId) {
        params["category-id"] = derivedFilterCategoryId;
      }

      const response = await appointmentApiRequest.getAppointments(params);

      if (response.status === 200 && Array.isArray(response.payload?.data)) {
        return response.payload.data as GetAppointment[];
      } else {
        console.error(
          "AppointmentTable: Failed to fetch appointments:",
          response.payload?.message || `Status: ${response.status}`
        );
        return [];
      }
    } catch (error) {
      console.error("AppointmentTable: Error fetching appointments:", error);
      return [];
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [derivedFilterCategoryId, isLoadingStaffServices]);

  // Effect to load appointments when derivedFilterCategoryId changes or on manual trigger
  useEffect(() => {
    // console.log("useEffect [fetchAppointmentsData]: Triggering appointment fetch.");
    fetchAppointmentsData().then((data) => {
      setAppointments(data);
      if (data.length > 0) {
        setPatientDetailsMap({}); // Clear old patient details when appointments are re-fetched
      }
    });
  }, [fetchAppointmentsData]);

  useEffect(() => {
    const fetchAllServices = async () => {
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
                }
              });
            }
          });
          setServiceMap(newServiceMap);
        } else {
          console.error("Failed to fetch services:", response);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchAllServices();
  }, []);

  // Effect to fetch patient details when appointments data changes
  useEffect(() => {
    const fetchPatientDetailsForAppointments = async (
      patientApiIdsToFetch: string[]
    ) => {
      if (patientApiIdsToFetch.length === 0) return;

      setIsFetchingPatientDetails(true);
      const results = await Promise.allSettled(
        patientApiIdsToFetch.map((apiId) =>
          patientApiRequest.getPatientById(apiId)
        )
      );

      const newPatientDetailsUpdates: Record<string, PatientInfo | null> = {};
      results.forEach((result, index) => {
        const patientApiId = patientApiIdsToFetch[index]; // This is app['patient-id']
        if (result.status === "fulfilled") {
          const response = result.value as {
            status: number;
            payload?: { data: PatientRecord };
          };
          if (response.status === 200 && response.payload?.data) {
            const patientData = response.payload.data;
            // Assuming patientData.id is the canonical ID and patientData['full-name'] exists
            if (patientData.id && patientData["full-name"]) {
              newPatientDetailsUpdates[patientApiId] = {
                id: String(patientData.id),
                "full-name": patientData["full-name"],
              };
            } else {
              newPatientDetailsUpdates[patientApiId] = null; // Data incomplete
            }
          } else {
            newPatientDetailsUpdates[patientApiId] = null; // API error
          }
        } else {
          console.error(
            `Failed to fetch patient details for API ID ${patientApiId}:`,
            result.reason
          );
          newPatientDetailsUpdates[patientApiId] = null; // Network or other error
        }
      });

      setPatientDetailsMap((prevMap) => ({
        ...prevMap,
        ...newPatientDetailsUpdates,
      }));
      setIsFetchingPatientDetails(false);
    };

    if (!isLoadingAppointments && appointments.length > 0) {
      const uniquePatientApiIdsToFetch = Array.from(
        new Set(
          appointments
            .map((app) => app["patient-id"])
            .filter(
              (apiId): apiId is string =>
                typeof apiId === "string" &&
                apiId.trim() !== "" &&
                !(apiId in patientDetailsMap) // Only fetch if not already in map (or previously failed: null)
            )
        )
      );

      if (uniquePatientApiIdsToFetch.length > 0) {
        fetchPatientDetailsForAppointments(uniquePatientApiIdsToFetch);
      }
    }
  }, [appointments, isLoadingAppointments]); // Removed patientDetailsMap from deps to avoid potential loops, rely on check inside

  // Memoized list of appointments filtered by search term
  const filteredAppointments = useMemo(() => {
    if (isLoadingAppointments || isLoadingServices) return []; // Wait for essential data

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerSearchTerm) {
      return appointments;
    }

    return appointments.filter((app) => {
      const patientApiId = app["patient-id"]; // This is the ID used in the appointment record
      const serviceId = app["service-id"];

      const patientInfo =
        typeof patientApiId === "string"
          ? patientDetailsMap[patientApiId]
          : null;
      const service =
        typeof serviceId === "string" ? serviceMap[serviceId] : null;

      const patientName = patientInfo?.["full-name"]?.toLowerCase() || "";
      const serviceName = service?.name?.toLowerCase() || "";

      return (
        (typeof patientApiId === "string" &&
          patientApiId.toLowerCase().includes(lowerSearchTerm)) ||
        patientName.includes(lowerSearchTerm) ||
        (typeof serviceId === "string" &&
          serviceId.toLowerCase().includes(lowerSearchTerm)) ||
        serviceName.includes(lowerSearchTerm)
      );
    });
  }, [
    appointments,
    patientDetailsMap,
    serviceMap,
    searchTerm,
    isLoadingAppointments,
    isLoadingServices,
  ]);

  const renderPatientCell = useCallback(
    (app: GetAppointment) => {
      const patientApiId = app["patient-id"];
      if (typeof patientApiId !== "string" || !patientApiId.trim()) {
        return (
          <TableCell className="font-medium text-muted-foreground italic">
            ID BN không hợp lệ
          </TableCell>
        );
      }

      // If patient details for this specific ID are being fetched OR haven't been fetched yet
      if (
        isFetchingPatientDetails &&
        patientDetailsMap[patientApiId] === undefined
      ) {
        return (
          <TableCell className="font-medium italic text-muted-foreground">
            Đang tải tên BN...
          </TableCell>
        );
      }

      const patientInfo = patientDetailsMap[patientApiId];
      if (patientInfo === null) {
        // Explicitly null means fetch failed or data invalid
        return (
          <TableCell className="font-medium text-destructive">
            {patientApiId} (Lỗi tải)
          </TableCell>
        );
      }
      return (
        <TableCell className="font-medium">
          {patientInfo?.["full-name"] || patientApiId}{" "}
          {/* Fallback to ID if name somehow missing after fetch */}
        </TableCell>
      );
    },
    [patientDetailsMap, isFetchingPatientDetails]
  );

  const renderServiceCell = useCallback(
    (app: GetAppointment) => {
      const serviceId = app["service-id"];
      if (typeof serviceId !== "string" || !serviceId.trim()) {
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
            {serviceId} (Không tìm thấy)
          </TableCell>
        );
      }
      return <TableCell>{service.name}</TableCell>;
    },
    [serviceMap, isLoadingServices]
  );

  const handleReportConfirmed = useCallback(() => {
    fetchAppointmentsData().then((data) => {
      setAppointments(data);
      if (data.length > 0) {
        setPatientDetailsMap({});
      }
    });
  }, [fetchAppointmentsData]);

  const showOverallLoadingScreen = useMemo(() => {
    const isWaitingForCategory =
      isLoadingStaffServices && derivedFilterCategoryId === null;
    return isWaitingForCategory || isLoadingAppointments || isLoadingServices;
  }, [
    isLoadingStaffServices,
    derivedFilterCategoryId,
    isLoadingAppointments,
    isLoadingServices,
  ]);

  const handleRowClick = (app: GetAppointment) => {
    // If onSelect is meant to do something on row click, implement it here.
    // For now, it's unused based on the original code's commented out TableRow onClick.
    // onSelect(app);
    // console.log("Row clicked (but onSelect prop is not actively used for navigation):", app);
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Cuộc hẹn chờ phê duyệt</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showOverallLoadingScreen ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {appointments.length === 0 && !searchTerm
                    ? "Không có cuộc hẹn nào."
                    : "Không tìm thấy kết quả phù hợp."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted"
                  // onClick={() => handleRowClick(app)} // Use if row click needs to trigger 'onSelect'
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
                      : "N/A"}
                    <div className="text-xs text-muted-foreground">
                      {app["act-date"]
                        ? new Date(app["act-date"]).toLocaleDateString("vi-VN")
                        : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {selectedAppId && (
        <ViewMedicalReportDialog
          appId={selectedAppId}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedAppId(null);
          }}
          onReportConfirmed={handleReportConfirmed}
        />
      )}
    </Card>
  );
}
