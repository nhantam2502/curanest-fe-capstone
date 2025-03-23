"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";

interface ServiceTaskComponentProps {
  servicePackageId: string | null;
  onTaskCreated: () => void;
  refresh: boolean;
}

function ServiceTaskComponent({
  servicePackageId,
  onTaskCreated,
  refresh,
}: ServiceTaskComponentProps) {
  const [serviceTasks, setServiceTasks] = useState<ServiceTaskType[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!servicePackageId) {
      setServiceTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const id = Array.isArray(servicePackageId)
        ? servicePackageId[0]
        : servicePackageId;
      const response = await servicePackageApiRequest.getServiceTask(id);
      if (
        response.status === 200 &&
        response.payload &&
        response.payload.data
      ) {
        setServiceTasks(response.payload.data);
      } else {
        console.warn("Error fetching service tasks:", response);
        setServiceTasks([]);
      }
    } catch (error) {
      console.error("Error fetching service tasks:", error);
      setServiceTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [servicePackageId, refresh]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      {loadingTasks && (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {servicePackageId && (
        <div className="my-4">
          <CreateServiceTask
            svcpackageId={servicePackageId}
            onTaskCreated={onTaskCreated} // Pass the callback down
          />
        </div>
      )}
      {serviceTasks.length > 0 ? (
        serviceTasks.map((serviceTask) => (
          <Card key={serviceTask.id} className="h-min w-full rounded-none">
            <CardContent className="p-4 space-y-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">
                  Tên công việc
                </h4>
                <p className="text-gray-700 font-bold">{serviceTask.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Mô tả</h4>
                <p className="text-gray-700">{serviceTask.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500">
                  Trạng thái
                </h4>
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
    </div>
  );
}

export default ServiceTaskComponent;
