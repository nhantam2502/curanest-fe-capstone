// hooks/useStaffServices.ts
"use client";

import { useState, useCallback, useEffect } from 'react';
import serviceApiRequest from '@/apiRequest/service/apiServices';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is client-side

// --- Type Definitions (copied from your Page component or a shared types file) ---
interface StaffServiceCategory {
  id: string;
  name: string;
}

interface StaffService {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  est_duration?: string;
  status?: string;
}

interface ProcessedStaffServiceData {
  categoryInfo: StaffServiceCategory;
  listServices: StaffService[];
}

interface RawApiResponseData {
  "category-info": { id: string; name: string };
  "list-services": Array<{
    id: string;
    "category-id": string;
    name: string;
    description?: string;
    "est-duration"?: string;
    status?: string;
  }>;
}

export function useStaffServices() {
  const [staffServices, setStaffServices] = useState<ProcessedStaffServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStaffServices([]); // Clear previous data before fetching

    try {
      const response = await serviceApiRequest.getListServiceOfStaff(null);

      if (response.status === 200 && response.payload?.success && response.payload.data) {
        const data = response.payload.data as RawApiResponseData;
        if (data["category-info"] && Array.isArray(data["list-services"])) {
          const processedData: ProcessedStaffServiceData[] = [
            {
              categoryInfo: {
                id: data["category-info"].id,
                name: data["category-info"].name,
              },
              listServices: data["list-services"].map((serviceItem) => ({
                id: serviceItem.id,
                category_id: serviceItem["category-id"],
                name: serviceItem.name || "Unnamed Service",
                description: serviceItem.description,
                est_duration: serviceItem["est-duration"],
                status: serviceItem.status,
              })),
            },
          ];
          setStaffServices(processedData);
        } else {
          console.warn("API response structure for getListServiceOfStaff might be different than expected:", data);
          throw new Error("Định dạng dữ liệu dịch vụ trả về không đúng.");
        }
      } else {
        throw new Error(response.payload?.message || `Không thể tải dịch vụ (Status: ${response.status})`);
      }
    } catch (err: any) {
      console.error("Failed to fetch services in useStaffServices:", err);
      const errorMessage = err.message || "Lỗi không xác định khi tải dịch vụ.";
      setError(errorMessage);
      toast({
          title: "Lỗi tải dịch vụ",
          description: errorMessage,
          variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // toast is a dependency

  useEffect(() => {
    fetchServices();
  }, [fetchServices]); // fetchServices is stable due to useCallback

  return { staffServices, loading, error, refetchServices: fetchServices };
}