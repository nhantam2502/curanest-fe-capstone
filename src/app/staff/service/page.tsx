"use client";

import serviceApiRequest from "@/apiRequest/service/apiServices";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, // Import CardDescription
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react"; // Icons for loading and error
import { useToast } from "@/hooks/use-toast"; // Import useToast for feedback

// --- Constants ---
const MAX_DESC_LENGTH = 80; // Max characters before truncating

// --- Type Definitions (moved outside component) ---
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
  status?: string; // e.g., "available", "unavailable"
}

// Represents the structure expected *after* processing the API response
interface ProcessedStaffServiceData {
  categoryInfo: StaffServiceCategory;
  listServices: StaffService[];
}

// Optional: Interface for the raw API response structure if known
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
  // Add other potential fields from the response
}

// --- Service Card Component ---
interface ServiceCardProps {
  service: StaffService;
  isExpanded: boolean;
  onToggleDescription: (serviceId: string) => void;
  onClick: (serviceId: string, serviceName: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isExpanded,
  onToggleDescription,
  onClick,
}) => {
  const description = service.description || "";
  const needsTruncation = description.length > MAX_DESC_LENGTH;
  const displayDescription =
    needsTruncation && !isExpanded
      ? `${description.substring(0, MAX_DESC_LENGTH)}...`
      : description;

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Prevent card click when toggling description
      onToggleDescription(service.id);
  }

  const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
     switch (status?.toLowerCase()) {
       case "available": return "default"; // Default often maps to primary or a standard 'active' look
       // case "unavailable": return "secondary"; // Use secondary for less emphasis
       default: return "secondary"; // Use secondary for unavailable or unknown
     }
  };

  const getStatusBadgeClass = (status?: string): string => {
     switch (status?.toLowerCase()) {
       case "available": return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"; // Softer green
       default: return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"; // Softer gray
     }
  };

  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(service.id, service.name)}
      className="cursor-pointer h-full" // Ensure motion div takes full height
    >
      {/* Card takes full height of parent and uses flex column */}
      <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold flex-grow break-words"> {/* Allow title to wrap */}
              {service.name}
            </CardTitle>
            {service.status && (
              <Badge
                // variant={getStatusBadgeVariant(service.status)} // Use variant if defined in theme
                className={`flex-shrink-0 border ${getStatusBadgeClass(service.status)}`}
              >
                {service.status.toLowerCase() === "available"
                  ? "Khả dụng"
                  : "Không khả dụng"}
              </Badge>
            )}
          </div>
        </CardHeader>
        {/* Content grows and pushes footer (duration) down */}
        <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-4">
          <div>
            {description ? (
              <>
                <p className="text-sm text-gray-600 mb-1 whitespace-pre-wrap">
                  {displayDescription}
                </p>
                {needsTruncation && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs" // Smaller link
                    onClick={handleToggleClick}
                  >
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </Button>
                )}
              </>
            ) : (
                <p className="text-sm text-gray-400 italic mb-1">Không có mô tả.</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-dashed">
            ⏳ Thời gian dự kiến: {service.est_duration || "N/A"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function Page() {
  const [staffServices, setStaffServices] = useState<ProcessedStaffServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExpandedDescriptions({});
    setStaffServices([]); // Clear previous data

    try {
      const response = await serviceApiRequest.getListServiceOfStaff(null);

      if (response.status === 200 && response.payload?.success && response.payload.data) {
        const data = response.payload.data as RawApiResponseData; // Type assertion
        if (data["category-info"] && Array.isArray(data["list-services"])) {
          const processedData: ProcessedStaffServiceData[] = [ // Explicitly type
            {
              categoryInfo: {
                id: data["category-info"].id,
                name: data["category-info"].name,
              },
              listServices: data["list-services"].map((serviceItem) => ({ // Map safely
                id: serviceItem.id,
                category_id: serviceItem["category-id"],
                name: serviceItem.name || "Unnamed Service", // Default name
                description: serviceItem.description,
                est_duration: serviceItem["est-duration"],
                status: serviceItem.status,
              })),
            },
          ];
          setStaffServices(processedData);
        } else {
          console.warn("API response structure might be different than expected:", data);
          throw new Error("Định dạng dữ liệu dịch vụ trả về không đúng.");
        }
      } else {
        throw new Error(response.payload?.message || `Không thể tải dịch vụ (Status: ${response.status})`);
      }
    } catch (err: any) {
      console.error("Failed to fetch services:", err);
      const errorMessage = err.message || "Lỗi không xác định khi tải dịch vụ.";
      setError(errorMessage);
      toast({ // Provide feedback on error
          title: "Lỗi tải dịch vụ",
          description: errorMessage,
          variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleDescription = useCallback((serviceId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  }, []);

  const handleServiceClick = useCallback((serviceId: string, serviceName: string) => {
    const encodedName = encodeURIComponent(serviceName);
    router.push(`/staff/service/service-package/${serviceId}?name=${encodedName}`);
  }, [router]); // Depends on router

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Đang tải danh sách dịch vụ...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 px-4">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-semibold mb-2">Lỗi tải dữ liệu</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchServices} variant="outline">
              Thử lại
            </Button>
        </div>
      );
    }

    if (staffServices.length === 0) {
      return (
        <p className="text-gray-500 text-center py-10">
          Không có dịch vụ nào được phân công cho bạn.
        </p>
      );
    }

    return staffServices.map((categoryItem) => (
      <div key={categoryItem.categoryInfo.id} className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          {categoryItem.categoryInfo.name}
        </h2>
        {categoryItem.listServices.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {categoryItem.listServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isExpanded={expandedDescriptions[service.id] || false}
                onToggleDescription={toggleDescription}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            Không có dịch vụ nào trong danh mục này.
          </p>
        )}
      </div>
    ));
  };

  return (
    <div className="mx-auto p-4"> {/* Add container and padding */}
      <Card className="mb-6 bg-gradient-to-r from-emerald-300/10 to-transparent border-l-4 border-emerald-200">
         <CardHeader>
             <CardTitle className="text-2xl font-bold text-emerald-500">
                Dịch vụ của tôi
             </CardTitle>
             <CardDescription>
                Chọn một dịch vụ bạn được phân công để xem chi tiết hoặc quản lý gói dịch vụ liên quan.
             </CardDescription>
         </CardHeader>
      </Card>
      {renderContent()}
    </div>
  );
}

export default Page;