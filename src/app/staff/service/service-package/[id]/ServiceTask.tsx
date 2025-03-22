"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask"; 
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask"; 

interface ServiceTaskComponentProps {
  servicePackageId: string | null; 
}

function ServiceTaskComponent({ servicePackageId }: ServiceTaskComponentProps) { 
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskType[]>([]); // Use array state

  useEffect(() => {
    const fetchData = async () => {
      if (servicePackageId) { 
        console.log("Service Package ID received in ServiceTaskComponent:", servicePackageId);
        try {
          const response = await servicePackageApiRequest.getServiceTask(servicePackageId);
          console.log("Service task response:", response);

          if (response.payload && response.payload.data) {
            setServiceTasks(response.payload.data); // Store the array directly
          } else {
            console.warn("Invalid response structure:", response.payload);
          }
        } catch (error) {
          console.error("Error fetching service tasks:", error);
        }
      } else {
        setServiceTasks([]); // Reset when no servicePackageId
      }
    };

    fetchData();
  }, [servicePackageId]); 

  return (
    <div>
      {/* Map through serviceTasks and create a Card for each */}
      {serviceTasks.length > 0 ? (
        serviceTasks.map((serviceTask) => (
          <Card key={serviceTask.id} className="h-fit w-full mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{serviceTask.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Mô tả</h4>
                <p className="text-gray-700">{serviceTask.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Trạng thái</h4>
                <Badge variant="outline" className="text-sm">
                  {serviceTask.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">Chưa có task nào</p>
      )}

      {/* Conditionally render CreateServiceTask if servicePackageId is available */}
      {servicePackageId && (
        <div className="mt-4">
          <CreateServiceTask
            svcpackageId={servicePackageId}
            onTaskCreated={() => {
              console.log("Service task created callback in ServiceTaskComponent");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ServiceTaskComponent;
