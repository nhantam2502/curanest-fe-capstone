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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ServicePackage } from "@/types/servicesPack";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServicePackage from "./CreateServicePackage";
import { Button } from "@/components/ui/button";
import EditServicePackage from "./EditServicePackage";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServicePackageComponentProps {
  onPackageClick: (packageId: string) => void;
  onPackageCreated: () => void;
  serviceId?: string | null;
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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPackages = useCallback(async () => {
    if (!serviceId) {
      console.warn("Service ID is missing from params.");
      setServicePackages([]);
      return;
    }
    setLoadingPackages(true);
    try {
      const response = await servicePackageApiRequest.getServicePackage(serviceId);
      if (response.status === 200 && response.payload?.data) {
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
    fetchPackages();
  };

  const filteredPackages = servicePackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "Khả dụng";
      default:
        return "Không khả dụng";
    }
  };

  if (loadingPackages) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Gói dịch vụ</CardTitle>
              <CardDescription>
                Quản lý các gói. Tìm kiếm hoặc tạo mới.
              </CardDescription>
            </div>
            <Button disabled>Tạo gói mới</Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-10 min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
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
            className="w-full sm:max-w-xs"
          />
        </div>

        <TooltipProvider>
          <div className="grid gap-4 min-h-[150px]">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((servicePackage) => (
                <Tooltip key={servicePackage.id} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "border hover:shadow-md transition-shadow duration-150 cursor-pointer overflow-hidden",
                        servicePackage.status === "available"
                          ? "border-green-200"
                          : "border-gray-200"
                      )}
                      onClick={() => onPackageClick(servicePackage.id)}
                    >
                      <CardContent className="p-4 flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-grow">
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Tên gói
                            </h4>
                            <p className="text-base font-bold truncate">
                              {servicePackage.name}
                            </p>
                          </div>
                          {servicePackage.description && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Mô tả
                              </h4>
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {servicePackage.description}
                              </p>
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Trạng thái
                            </h4>
                            <Badge className={getStatusColor(servicePackage.status)}>
                              {getStatusText(servicePackage.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
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
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-3 bg-white text-black">
                    <p>Chọn để xem các công việc trong gói</p>
                  </TooltipContent>
                </Tooltip>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center py-4">
                  {searchTerm
                    ? "Không tìm thấy gói dịch vụ nào khớp."
                    : "Hiện chưa có gói dịch vụ nào cho dịch vụ này."}
                </p>
              </div>
            )}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export default ServicePackageComponent;