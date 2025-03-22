"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServicePackage } from "@/types/servicesPack";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServicePackage from "./CreateServicePackage"; // Import CreateServicePackage

interface ServicePackageComponentProps {
  onPackageClick: (packageId: string) => void; // Add onPackageClick prop
}

function ServicePackageComponent({ onPackageClick }: ServicePackageComponentProps) {
  const params = useParams<{ id: string }>();
  const serviceId = params.id;
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (serviceId) {
        console.log("Service ID received in ServicePackagePage:", serviceId);
        try {
          const response = await servicePackageApiRequest.getServicePackage(serviceId);
          console.log("Service package response:", response);
          if (response.payload && response.payload.data) {
            setServicePackages(response.payload.data); // Store the array directly
          } else {
            console.warn("Invalid response structure:", response.payload);
          }
        } catch (error) {
          console.error("Error fetching service package:", error);
        }
      }
    };

    fetchData();
  }, [serviceId]);

  return (
    <div>
      {/* Map through servicePackages and create a Card for each */}
      {servicePackages.length > 0 ? (
        servicePackages.map((servicePackage) => (
          <Card
            key={servicePackage.id}
            className="h-fit w-full cursor-pointer hover:shadow-md transition-shadow duration-150 mb-4"
            onClick={() => onPackageClick(servicePackage.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{servicePackage.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Mô tả</h4>
                <p className="text-gray-700">{servicePackage.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Trạng thái</h4>
                <Badge variant="outline" className="text-sm">{servicePackage.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No service packages available.</p>
      )}

      {/* Conditionally render CreateServicePackage if serviceId is available */}
      {serviceId && (
        <div className="mt-4">
          <CreateServicePackage
            serviceId={serviceId}
            onPackageCreated={() => {
              console.log("Service package created callback in ServicePackageComponent");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ServicePackageComponent;
