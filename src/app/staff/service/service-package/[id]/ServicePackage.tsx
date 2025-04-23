"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ServicePackage } from "@/types/servicesPack";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServicePackage from "./CreateServicePackage";
import { Button } from "@/components/ui/button";
import EditServicePackage from "./EditServicePackage";
import { Loader2 } from "lucide-react";
// Removed Skeleton import
// import { Skeleton } from "@/components/ui/skeleton";

interface ServicePackageComponentProps {
  onPackageClick: (packageId: string) => void;
  onPackageCreated: () => void;
  // serviceId prop is technically redundant here as we get it from params,
  // but kept for potential external usage if needed. Consider removing if only used internally.
  serviceId?: string | null; // Made optional as it's derived internally now
  refresh: boolean;
}

function ServicePackageComponent({
  onPackageClick,
  onPackageCreated,
  refresh,
}: ServicePackageComponentProps) {
  const params = useParams<{ id: string }>();
  const serviceId = params.id; // Primary way to get the service ID
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPackages = useCallback(async () => {
    if (!serviceId) {
      console.warn("Service ID is missing from params.");
      setServicePackages([]);
      return;
    }
    setLoadingPackages(true);
    try {
      const response =
        await servicePackageApiRequest.getServicePackage(serviceId);
      if (
        response.status === 200 &&
        response.payload &&
        response.payload.data
      ) {
        setServicePackages(response.payload.data);
      } else {
        console.warn("Error fetching service packages:", response);
        setServicePackages([]);
      }
    } catch (error) {
      console.error("Error fetching service packages:", error);
      setServicePackages([]);
    } finally {
      setLoadingPackages(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages, refresh]);

  const handlePackageUpdated = () => {
    fetchPackages(); // Refetch packages after update
  };

  // Filter packages based on search term (case-insensitive)
  const filteredPackages = servicePackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        // Using softer, more accessible colors with better contrast
        return "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
        case "available": return "Khả dụng";
        default: return "Không khả dụng"; // Or map other statuses
    }
  }

  if (loadingPackages) {
    return (
        <Card>
          <CardHeader>
            {/* Keep header structure for consistency */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl">Gói dịch vụ</CardTitle>
                <CardDescription>
                  Quản lý các gói. Tìm kiếm hoặc tạo mới.
                </CardDescription>
              </div>
              {/* Optionally disable create button while loading */}
              <Button disabled>Tạo gói mới</Button>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-10 min-h-[200px]">
            {/* Simple text loading indicator */}
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
    );
  }
  // --- End Simple Loading State ---

  return (
    // Removed outer space-y-4 div, Card handles its own structure
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Gói dịch vụ</CardTitle>
            <CardDescription>
              Quản lý các gói. Tìm kiếm hoặc tạo mới.
            </CardDescription>
          </div>
          {serviceId && (
            <CreateServicePackage
              serviceId={serviceId}
              onPackageCreated={() => {
                onPackageCreated(); // Notify parent
                // fetchPackages(); // fetch is already triggered by 'refresh' prop change
              }}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center w-full mb-4">
          <Input
            type="search"
            placeholder="Tìm theo tên gói..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs" // Limit search bar width on larger screens
          />
        </div>

        {/* Add a minimum height to prevent layout collapse when empty/loading */}
        <div className="grid gap-4 min-h-[150px]">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((servicePackage) => (
              <Card
                key={servicePackage.id}
                className="border hover:shadow-md transition-shadow duration-150 cursor-pointer overflow-hidden" // Added overflow-hidden
                onClick={() => onPackageClick(servicePackage.id)}
              >
                <CardContent className="p-4 flex justify-between items-start gap-4"> {/* Reduced padding slightly */}
                  {/* Package details */}
                  <div className="space-y-2 flex-grow"> {/* Allow text section to grow */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"> {/* Style adjustments */}
                        Tên gói
                      </h4>
                      <p className="text-base font-bold"> {/* Adjusted size */}
                        {servicePackage.name}
                      </p>
                    </div>
                    {servicePackage.description && ( // Conditionally render description
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Mô tả
                        </h4>
                        {/* Basic truncation example (can be expanded with "Xem thêm") */}
                        <p className="text-sm text-gray-700 line-clamp-2"> {/* line-clamp for CSS truncation */}
                          {servicePackage.description}
                        </p>
                      </div>
                    )}
                     <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Trạng thái
                        </h4>
                        <Badge
                            variant="outline" // Use outline variant for subtle look
                            className={`${getStatusColor(servicePackage.status)} text-xs`} // Pass computed classes
                        >
                          {getStatusText(servicePackage.status)}
                        </Badge>
                      </div>
                  </div>
                  {/* Edit Button */}
                  <div className="flex-shrink-0"> {/* Prevent button from shrinking */}
                    {/* Stop propagation to prevent Card onClick */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <EditServicePackage
                        serviceId={serviceId} // Pass serviceId from params
                        servicePackage={servicePackage}
                        onPackageUpdated={handlePackageUpdated}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Centered empty state message
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center py-4">
                {searchTerm
                    ? "Không tìm thấy gói dịch vụ nào khớp."
                    : "Hiện chưa có gói dịch vụ nào cho dịch vụ này."}
                </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ServicePackageComponent;