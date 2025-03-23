"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";
import EditServiceTask from "./EditServiceTask"; // Ensure EditServiceTask is imported

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
  const [editingTask, setEditingTask] = useState<ServiceTaskType | null>(null); // State for editing task

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
  }, [servicePackageId, refresh]); // refresh dependency added here

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskUpdated = useCallback(() => {
    setEditingTask(null); // Close edit modal
    fetchTasks(); // Refresh tasks list
  }, [fetchTasks]);

  const handleEditClick = (task: ServiceTaskType) => {
    setEditingTask(task); // Open edit modal for this task
  };

  const handleCancelEdit = () => {
    setEditingTask(null); // Close edit modal
  };


  return (
    <div>
      {loadingTasks && (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Công việc gói dịch vụ</h2>
      {servicePackageId && (
        <div className="my-4">
          <CreateServiceTask
            svcpackageId={servicePackageId}
            onTaskCreated={onTaskCreated}
          />
        </div>
      )}
      {serviceTasks.length > 0 ? (
        serviceTasks.map((serviceTask) => (
          <Card key={serviceTask.id} className="h-min w-full rounded-none">
            <CardContent className="p-4 space-y-2 flex justify-between items-center"> {/* Flex for edit button */}
              <div className="text-left">
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
              </div>
              {/* Edit button integration */}
              {servicePackageId && (
                <EditServiceTask
                  serviceTask={serviceTask}
                  svcpackageId={servicePackageId}
                  onTaskUpdated={handleTaskUpdated}
                />
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">Chưa có task nào</p>
      )}

      {/* Conditionally render EditServiceTask Modal */}
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