"use client";

import React, { useCallback, useEffect, useState } from "react";
// Removed useParams as servicePackageId is passed as prop
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceTask as ServiceTaskType, UpdateServiceOrder, UpdateServiceOrderPayload } from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";
// EditServiceTask is now used inside SortableTaskCard
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Label } from "@/components/ui/label";   // Import Label
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy, // Use this strategy for a vertical list
} from '@dnd-kit/sortable';
import { SortableTaskCard } from './TaskCard'; // Import SortableTaskCard
import { useToast } from "@/hooks/use-toast";

interface ServiceTaskComponentProps {
  servicePackageId: string | null;
  onTaskCreated: () => void; // Keep this if CreateServiceTask needs it
  refresh: boolean; // Keep refresh prop if parent component controls it
}

function ServiceTaskComponent({
  servicePackageId,
  onTaskCreated,
  refresh,
}: ServiceTaskComponentProps) {

  const { toast } = useToast();

  const [serviceTasks, setServiceTasks] = useState<ServiceTaskType[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [isReorderingEnabled, setIsReorderingEnabled] = useState(false); // State for DnD toggle
  const [isSavingOrder, setIsSavingOrder] = useState(false); 

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTasks = useCallback(async () => {
    if (!servicePackageId) {
      setServiceTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const response = await servicePackageApiRequest.getServiceTask(servicePackageId);
      if (
        response.status === 200 &&
        response.payload &&
        response.payload.data
      ) {
        // Sort tasks initially by task-order if available
        const sortedTasks = response.payload.data.sort((a: ServiceTaskType, b: ServiceTaskType) => (a["task-order"] ?? 0) - (b["task-order"] ?? 0));
        setServiceTasks(sortedTasks);
      } else {
        console.warn("Error fetching service tasks:", response);
        toast({
          variant: "destructive",
          title: "Tải công việc thất bại",
          description: response?.payload.message || "Please try again later.",
        });
        setServiceTasks([]);
      }
    } catch (error) {
      console.error("Error fetching service tasks:", error);
      toast({
        variant: "destructive",
        title: "Tải công việc thất bại",
        description:"Có lỗi xảy ra.",
     });
      setServiceTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [servicePackageId]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  const handleSingleTaskUpdated = useCallback(() => {
    fetchTasks(); // Refetch to ensure data consistency
  }, [fetchTasks]);

  // --- DnD Drag End Handler ---
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setServiceTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // Use arrayMove for correct reordering
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

const handleSaveChanges = useCallback(async () => {
  if (!servicePackageId) return;

  setIsSavingOrder(true);
  try {
    const tasksToUpdate: UpdateServiceOrder[] = serviceTasks.map((task, index) => ({
      "additional-cost": task["additional-cost"] ?? 0,
      "additional-cost-desc": task["additional-cost-desc"] ?? "",
      cost: task.cost,
      description: task.description,
      "est-duration": task["est-duration"],
      id: task.id, // Make sure ID is included
      "is-must-have": task["is-must-have"] ?? false,
      name: task.name,
      "price-of-step": task["price-of-step"] ?? task.cost,
      "staff-advice": task["staff-advice"] ?? "",
      status: task.status,
      "svcpackage-id": servicePackageId!, // Ensure ID is non-null
      unit: task.unit,
      "task-order": index, // Assign the new order
  }));
    const payload: UpdateServiceOrderPayload = {
        svctasks: tasksToUpdate
    };
    const response = await servicePackageApiRequest.updateServiceOrder(payload);
    if (response.status === 200 || response.status === 201) { // Check for success codes
      toast({
        title: "Đã lưu thứ tự",
        description: "Thứ tự công việc đã được cập nhật thành công.",
      });
      setIsReorderingEnabled(false);
    } else {
      console.error("Failed to update task order:", response);
      toast({
        variant: "destructive",
        title: "Lưu thất bại",
        description: response?.payload.message || "Không thể cập nhật thứ tự.",
      });
    }
  } catch (error) {
    console.error("Error updating task order:", error);
    toast({
      variant: "destructive",
      title: "Lưu thất bại",
      description:"Không thể cập nhật thứ tự.",
    });
  } finally {
    setIsSavingOrder(false);
  }
}, [serviceTasks, servicePackageId, fetchTasks]);


  const getTaskStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-300 text-white hover:bg-green-400"; // Added hover
      default:
        return "bg-gray-400 text-black hover:bg-gray-500"; // Darker gray
    }
  };

  if (loadingTasks) {
    return (
        <div className="space-y-4">
             {/* Simplified Skeleton */}
            <Card>
                <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
          <div className="space-y-1">
             <CardTitle className="text-xl">Công việc gói dịch vụ</CardTitle>
             <CardDescription>Quản lý các công việc trong gói.</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
             {/* Reorder Toggle Switch */}
            <div className="flex items-center space-x-2">
                <Switch
                    id="reorder-mode"
                    checked={isReorderingEnabled}
                    onCheckedChange={setIsReorderingEnabled}
                    disabled={serviceTasks.length < 2} // Disable if less than 2 items
                />
                <Label htmlFor="reorder-mode">Sắp xếp</Label>
             </div>
            {/* Save Button (shown only when reordering) */}
            {isReorderingEnabled && (
                <Button
                    onClick={handleSaveChanges}
                    disabled={isSavingOrder}
                    size="sm"
                >
                    {isSavingOrder ? "Đang lưu..." : "Lưu thứ tự"}
                </Button>
            )}
            {/* Create Button (always visible if servicePackageId exists) */}
            {servicePackageId && !isReorderingEnabled && (
                <CreateServiceTask
                    svcpackageId={servicePackageId}
                    onTaskCreated={() => {
                        onTaskCreated(); // Call prop if needed by parent
                        fetchTasks(); // Refetch list after creating
                    }}
                 />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {serviceTasks.length > 0 ? (
            // --- Dnd Context Wrapper ---
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={serviceTasks.map(task => task.id)} // Pass array of IDs
                strategy={verticalListSortingStrategy}
              >
                {/* Render SortableTaskCard within the context */}
                <div className="grid gap-4">
                  {serviceTasks.map((serviceTask) => (
                    <SortableTaskCard
                      key={serviceTask.id}
                      serviceTask={serviceTask}
                      isReorderingEnabled={isReorderingEnabled}
                      servicePackageId={servicePackageId!} // Assert non-null if logic ensures it
                      onTaskUpdated={handleSingleTaskUpdated}
                      getTaskStatusColor={getTaskStatusColor}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            // -------------------------
          ) : (
            <p className="text-muted-foreground text-center py-4">Chưa có task nào được tạo.</p>
          )}
        </CardContent>
      </Card>

      {/* Modal for Editing Task - Removed from here, handled within SortableTaskCard/EditServiceTask */}
      {/*
      {editingTask && servicePackageId && (
        <EditServiceTask
          svcpackageId={servicePackageId}
          serviceTask={editingTask}
          onTaskUpdated={handleSingleTaskUpdated}
          // Consider adding an onCancel prop if needed
        />
      )}
      */}
    </div>
  );
}

export default ServiceTaskComponent;