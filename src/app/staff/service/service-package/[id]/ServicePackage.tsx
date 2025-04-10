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
import { Input } from "@/components/ui/input"; // Import Input
import { ServicePackage } from "@/types/servicesPack";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServicePackage from "./CreateServicePackage";
import { Button } from "@/components/ui/button";
import EditServicePackage from "./EditServicePackage";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicePackageComponentProps {
  onPackageClick: (packageId: string) => void;
  onPackageCreated: () => void;
  serviceId: string | null; // Keep this for consistency if needed elsewhere, but we use params.id
  refresh: boolean;
}

function ServicePackageComponent({
  onPackageClick,
  onPackageCreated,
  refresh,
}: ServicePackageComponentProps) {
  const params = useParams<{ id: string }>();
  const serviceId = params.id;
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const fetchPackages = useCallback(async () => {
    if (!serviceId) {
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
        return "bg-green-300 text-white hover:bg-green-400";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  if (loadingPackages) {
    // --- Skeleton Loading State (remains the same) ---
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                  onPackageCreated();
                  fetchPackages();
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
              className="w-full flex-grow sm:flex-grow-0"
            />
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid gap-4">
              {filteredPackages.map((servicePackage) => (
                <Card
                  key={servicePackage.id}
                  className="border-2 hover:shadow-md transition-shadow duration-150 cursor-pointer"
                  onClick={() => onPackageClick(servicePackage.id)}
                >
                  <CardContent className="p-6 space-y-4 flex justify-between items-start">
                    {/* Package details */}
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Tên gói
                        </h4>
                        <p className="text-lg font-bold">
                          {servicePackage.name}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Mô tả
                        </h4>
                        <p className="text-sm text-gray-700">
                          {servicePackage.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Trạng thái
                        </h4>
                        <Badge
                          className={getStatusColor(servicePackage.status)}
                        >
                          {servicePackage.status}
                        </Badge>
                      </div>
                    </div>
                    {/* Edit Button */}
                    <div className="flex flex-col space-y-2 items-end">
                      {/* Stop propagation to prevent Card onClick */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <EditServicePackage
                          serviceId={serviceId}
                          servicePackage={servicePackage}
                          onPackageUpdated={handlePackageUpdated}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Adjust empty message based on whether a search is active
            <p className="text-muted-foreground">
              {searchTerm
                ? "Không tìm thấy gói dịch vụ nào khớp."
                : "Hiện chưa có gói dịch vụ."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ServicePackageComponent;
