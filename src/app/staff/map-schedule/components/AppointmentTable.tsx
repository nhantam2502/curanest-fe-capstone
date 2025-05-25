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
// import { Input } from "@/components/ui/input"; // Uncomment if search is re-enabled
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
import { useStaffServices } from "@/hooks/useStaffService";

// Interface for patient details stored in the map
// Assuming app['patient-id'] is the key for the map.
interface PatientInfo {
  canonicalId: string; // The patient's own primary ID (e.g., patientData.id)
  apiProvidedPatientId?: string; // The 'patient-id' field if it comes from the patient record itself
  "full-name": string;
}

interface AppointmentTableProps {
  onSelect: (appointment: GetAppointment) => void;
}

export default function AppointmentTable({ onSelect }: AppointmentTableProps) {
  const { staffServices, loading: isLoadingStaffServices } = useStaffServices();

  const [appointments, setAppointments] = useState<GetAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  // patientDetailsMap: Key is app['patient-id']
  const [patientDetailsMap, setPatientDetailsMap] = useState<
    Record<string, PatientInfo | null>
  >({});
  const [isFetchingPatientDetails, setIsFetchingPatientDetails] = useState(false); // Renamed for clarity

  const [serviceMap, setServiceMap] = useState<Record<string, ServiceItem>>({});
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  // Derived state for filterCategoryId from staffServices
  const derivedFilterCategoryId = useMemo(() => {
    if (isLoadingStaffServices || !staffServices || staffServices.length === 0) {
      // console.log("derivedFilterCategoryId: Staff services loading or not available, returning null.");
      return null;
    }
    const categoryId = staffServices[0]?.categoryInfo?.id || null;
    // console.log("derivedFilterCategoryId: Determined categoryId:", categoryId);
    return categoryId;
  }, [staffServices, isLoadingStaffServices]);

  // --- FUNCTION TO FETCH APPOINTMENTS ---
  const fetchAppointmentsData = useCallback(async (categoryId: string | null) => {
    // This function now expects categoryId to be passed, assuming it's stable when called.
    // setIsLoadingAppointments(true); // This will be handled by the calling effect/function

    try {
      const today = new Date();
      const estDateFrom = today.toISOString().split("T")[0];
      const nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + 30); // Fetch for the next 30 days
      const estDateTo = nextDay.toISOString().split("T")[0];

      // Define a more specific type for params if possible
      const params: Record<string, string | undefined> = {
        "had-nurse": "false",
        "est-date-from": estDateFrom,
        "est-date-to": estDateTo,
        "category-id": categoryId || undefined,
      };
      // console.log("Fetching appointments with params:", params);
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
    // finally { setIsLoadingAppointments(false); } // Handled by the caller
  }, []); // No external dependencies here if dates are always "today" based. categoryId is passed as arg.

  // --- EFFECT TO LOAD APPOINTMENTS (calls fetchAppointmentsData) ---
  useEffect(() => {
    const loadAppointments = async () => {
      // Wait until staff services (and thus derivedFilterCategoryId) are resolved
      if (isLoadingStaffServices) {
        // console.log("loadAppointments Effect: Waiting for staff services to resolve category.");
        setIsLoadingAppointments(true); // Keep loading indicator on
        setAppointments([]); // Clear existing appointments while waiting for category
        return;
      }

      // console.log("loadAppointments Effect: Proceeding to fetch with derivedFilterCategoryId:", derivedFilterCategoryId);
      setIsLoadingAppointments(true);
      setPatientDetailsMap({}); // Clear old patient details
      const data = await fetchAppointmentsData(derivedFilterCategoryId);
      setAppointments(data);
      setIsLoadingAppointments(false);
    };

    loadAppointments();
  }, [derivedFilterCategoryId, isLoadingStaffServices, fetchAppointmentsData]);

  // --- EFFECT TO FETCH SERVICE DATA (for service names) ---
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
                }
              });
            }
          });
          setServiceMap(newServiceMap);
        } else {
          console.error("Failed to fetch services:", response);
          setServiceMap({}); // Ensure map is empty on failure
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServiceMap({}); // Ensure map is empty on error
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServiceData();
  }, []); // Runs once on mount

  // --- EFFECT TO FETCH PATIENT DETAILS ---
  useEffect(() => {
    const fetchPatientDetailsForAppointments = async (patientApiIdsToFetch: string[]) => {
      if (patientApiIdsToFetch.length === 0) {
        // setIsFetchingPatientDetails(false); // Not needed if nothing to fetch
        return;
      }
      setIsFetchingPatientDetails(true);
      const results = await Promise.allSettled(
        patientApiIdsToFetch.map(
          (apiId) => // apiId here is app['patient-id'] and is confirmed string
            patientApiRequest.getPatientById(apiId) as Promise<{ // Type assertion for response structure
              status: number;
              payload?: { data: PatientRecord };
            }>
        )
      );

      const newPatientDetailsUpdates: Record<string, PatientInfo | null> = {};
      results.forEach((result, index) => {
        const patientApiId = patientApiIdsToFetch[index]; // This is app['patient-id']
        if (result.status === "fulfilled") {
          const response = result.value;
          if (response.status === 200 && response.payload?.data) {
            const patientData = response.payload.data;
            // Ensure consistent property access and existence
            const canonicalId = patientData.id || (patientData as any)["patient-id"];
            const fullName = (patientData as any)["full-name"];

            if (canonicalId && fullName) {
              newPatientDetailsUpdates[patientApiId] = {
                canonicalId: String(canonicalId),
                apiProvidedPatientId: (patientData as any)["patient-id"],
                "full-name": fullName,
              };
            } else {
              newPatientDetailsUpdates[patientApiId] = null; // Data incomplete
            }
          } else {
            newPatientDetailsUpdates[patientApiId] = null; // API error for this patient
          }
        } else {
          console.error(`Failed to fetch patient details for API ID ${patientApiId}:`, result.reason);
          newPatientDetailsUpdates[patientApiId] = null; // Network or other error
        }
      });

      setPatientDetailsMap((prevMap) => ({
        ...prevMap,
        ...newPatientDetailsUpdates,
      }));
      setIsFetchingPatientDetails(false);
    };

    // Only proceed if appointments are loaded and there are appointments
    if (!isLoadingAppointments && appointments.length > 0) {
      const uniquePatientApiIdsToFetch = Array.from(
        new Set(
          appointments
            .map((app) => app["patient-id"]) // This is the ID used to link appointment to patient
            .filter(
              (apiId): apiId is string =>
                typeof apiId === "string" &&
                apiId.trim() !== "" &&
                !(apiId in patientDetailsMap) // Fetch only if not already in map (or previously failed: null)
            )
        )
      );

      if (uniquePatientApiIdsToFetch.length > 0) {
        fetchPatientDetailsForAppointments(uniquePatientApiIdsToFetch);
      } else {
        setIsFetchingPatientDetails(false); // All known patients processed or no new ones
      }
    } else if (appointments.length === 0 && !isLoadingAppointments) {
      setIsFetchingPatientDetails(false); // No appointments, so no patients to fetch
    }
  }, [appointments, isLoadingAppointments]); // Dependencies: re-run if appointments list changes or its loading state changes

  // --- MEMOIZED FILTERED APPOINTMENTS ---
  const filteredAppointments = useMemo(() => {
    // Wait for essential data: appointments themselves and services (for names)
    if (isLoadingAppointments || isLoadingServices) return [];

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerSearchTerm) {
      return appointments; // Return all if no search term
    }

    return appointments.filter((app) => {
      const patientApiId = app["patient-id"]; // ID from appointment record
      const serviceId = app["service-id"];

      const patientInfo =
        typeof patientApiId === "string" ? patientDetailsMap[patientApiId] : null;
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
    isLoadingAppointments, // Ensure re-filter when appointments finish loading
    isLoadingServices,   // Ensure re-filter when services finish loading
  ]);

  // --- RENDER HELPERS (useCallback for stability if passed as props) ---
  const renderPatientCell = useCallback((app: GetAppointment) => {
    const patientApiId = app["patient-id"];
    if (typeof patientApiId !== "string" || !patientApiId.trim()) {
      return <TableCell className="font-medium text-muted-foreground italic">ID BN không hợp lệ</TableCell>;
    }

    // If patient details for this specific ID are being fetched OR haven't been fetched yet (undefined in map)
    if (isFetchingPatientDetails && patientDetailsMap[patientApiId] === undefined) {
      return <TableCell className="font-medium italic text-muted-foreground">Đang tải tên BN...</TableCell>;
    }

    const patientInfo = patientDetailsMap[patientApiId];
    if (patientInfo === null) { // Explicitly null means fetch failed or data invalid
      return <TableCell className="font-medium text-destructive">{patientApiId} (Lỗi tải)</TableCell>;
    }
    // Fallback to patientApiId if full-name is somehow missing after successful-like fetch
    const displayName = patientInfo?.["full-name"]?.trim() || patientApiId;
    return <TableCell className="font-medium">{displayName}</TableCell>;
  }, [patientDetailsMap, isFetchingPatientDetails]);

  const renderServiceCell = useCallback((app: GetAppointment) => {
    const serviceId = app["service-id"];
    if (typeof serviceId !== "string" || !serviceId.trim()) {
      return <TableCell className="text-muted-foreground italic">ID DV không hợp lệ</TableCell>;
    }
    if (isLoadingServices) { // Overall service list loading
      return <TableCell className="italic text-muted-foreground">Đang tải DV...</TableCell>;
    }
    const service = serviceMap[serviceId];
    if (!service) {
      return <TableCell className="text-orange-600">{serviceId} (Không tìm thấy tên)</TableCell>;
    }
    return <TableCell>{service.name}</TableCell>;
  }, [serviceMap, isLoadingServices]);

  // Combined loading state for the main table content
  // We are loading if staff services (for category) are loading,
  // OR if appointments (which depend on category) are loading,
  // OR if general services list is loading.
  const isContentLoading = useMemo(() => {
    return isLoadingStaffServices || isLoadingAppointments || isLoadingServices;
  }, [isLoadingStaffServices, isLoadingAppointments, isLoadingServices]);


  // --- JSX RENDER ---
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cuộc hẹn chờ giao</CardTitle>
        <CardDescription>
          Danh sách các cuộc hẹn chưa có điều dưỡng.
          {/* Example Input for search (uncomment and style if needed)
          <div className="mt-2">
            <Input // Make sure to import Input from "@/components/ui/input"
              placeholder="Tìm kiếm bệnh nhân, dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm" // Example styling
            />
          </div>
          */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isContentLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  {/* Differentiate based on whether appointments array is empty vs. filter not matching */}
                  {appointments.length === 0 && !searchTerm
                    ? "Không có cuộc hẹn nào phù hợp."
                    : "Không tìm thấy kết quả phù hợp với tìm kiếm."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow
                  key={app.id}
                  onClick={() => {
                    // console.log("Row clicked:", app);
                    onSelect(app);
                  }}
                  className="cursor-pointer hover:bg-muted"
                >
                  {renderPatientCell(app)}
                  {renderServiceCell(app)}
                  <TableCell>
                    {app["est-date"] ? ( // Check if est-date exists
                      <>
                        <div>
                          {new Date(app["est-date"]).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(app["est-date"]).toLocaleDateString("vi-VN")}
                        </div>
                      </>
                    ) : (
                      "N/A" // Fallback if est-date is not available
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}