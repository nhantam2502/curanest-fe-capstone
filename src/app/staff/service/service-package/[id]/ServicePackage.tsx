"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServicePackage } from "@/types/servicesPack";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServicePackage from "./CreateServicePackage";

interface ServicePackageComponentProps {
  onPackageClick: (packageId: string) => void;
  onPackageCreated: () => void;
  serviceId: string | null;
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

  return (
    <div>
      {loadingPackages && (
        <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      )}

      {serviceId && (
        <div className="my-4">
          <CreateServicePackage
            serviceId={serviceId}
            onPackageCreated={onPackageCreated} // Pass the callback down
          />
        </div>
      )}
      {servicePackages.length > 0 ? (
        servicePackages.map((servicePackage) => (
          <Card
            key={servicePackage.id}
            className="h-min w-full cursor-pointer hover:shadow-md transition-shadow duration-150 rounded-none"
            onClick={() => onPackageClick(servicePackage.id)}
          >
            <CardContent className="p-4 space-y-2">
            <div>
                <h4 className="text-sm font-semibold text-gray-500">Tên gói</h4>
                <p className="text-gray-700 font-bold">{servicePackage.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Mô tả</h4>
                <p className="text-gray-700">{servicePackage.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">
                  Trạng thái
                </h4>
                <Badge variant="outline" className="text-sm">
                  {servicePackage.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">Hiện chưa có gói dịch vụ.</p>
      )}
    </div>
  );
}

export default ServicePackageComponent;
