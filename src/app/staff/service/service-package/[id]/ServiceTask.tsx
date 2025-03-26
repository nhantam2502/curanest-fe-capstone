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
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";
import EditServiceTask from "./EditServiceTask";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [editingTask, setEditingTask] = useState<ServiceTaskType | null>(null);

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

  const handleTaskUpdated = useCallback(() => {
    setEditingTask(null);
    fetchTasks();
  }, [fetchTasks]);

  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-black";
    }
  };

  if (loadingTasks) {
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
        <CardHeader className="flex justify-between">
          <CardTitle className="text-xl">Công việc gói dịch vụ</CardTitle>
          {servicePackageId && (
            <CreateServiceTask
              svcpackageId={servicePackageId}
              onTaskCreated={onTaskCreated}
            />
          )}
        </CardHeader>
        <CardContent>
          {serviceTasks.length > 0 ? (
            <div className="grid gap-4">
              {serviceTasks.map((serviceTask) => (
                <Card
                  key={serviceTask.id}
                  className="border-2 hover:shadow-md transition-shadow duration-150"
                >
                  <CardContent className="p-6 space-y-4 flex justify-between items-start">
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Tên công việc
                        </h4>
                        <p className="text-lg font-bold">{serviceTask.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Mô tả
                        </h4>
                        <p className="text-sm text-gray-700">
                          {serviceTask.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                          Trạng thái
                        </h4>
                        <Badge
                          className={getTaskStatusColor(serviceTask.status)}
                        >
                          {serviceTask.status}
                        </Badge>
                      </div>
                    </div>
                    {servicePackageId && (
                      <EditServiceTask
                        serviceTask={serviceTask}
                        svcpackageId={servicePackageId}
                        onTaskUpdated={handleTaskUpdated}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Chưa có task nào</p>
          )}
        </CardContent>
      </Card>

      {/* Modal for Editing Task */}
      {editingTask && servicePackageId && (
        <EditServiceTask
          svcpackageId={servicePackageId}
          serviceTask={editingTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

export default ServiceTaskComponent;
