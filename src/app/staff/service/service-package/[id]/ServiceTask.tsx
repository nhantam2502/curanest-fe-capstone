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
import { Input } from "@/components/ui/input"; // <-- Import Input
import {
  ServiceTask as ServiceTaskType,
  UpdateServiceOrder,
  UpdateServiceOrderPayload,
} from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";
// EditServiceTask is now used inside SortableTaskCard
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskCard } from "./TaskCard";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const [serviceTasks, setServiceTasks] = useState<ServiceTaskType[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [isReorderingEnabled, setIsReorderingEnabled] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <-- State for search term

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Require 10px drag before activating
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
      const response =
        await servicePackageApiRequest.getServiceTask(servicePackageId);
      if (
        response.status === 200 &&
        response.payload &&
        response.payload.data
      ) {
        const sortedTasks = response.payload.data.sort(
          (a: ServiceTaskType, b: ServiceTaskType) =>
            (a["task-order"] ?? 0) - (b["task-order"] ?? 0)
        );
        setServiceTasks(sortedTasks);
      } else {
        console.warn("Error fetching service tasks:", response);
        toast({
          variant: "destructive",
          title: "Tải công việc thất bại",
          description: response?.payload?.message || "Please try again later.",
        });
        setServiceTasks([]);
      }
    } catch (error) {
      console.error("Error fetching service tasks:", error);
      toast({
        variant: "destructive",
        title: "Tải công việc thất bại",
        description: "Có lỗi xảy ra khi tải công việc.",
      });
      setServiceTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [servicePackageId, toast]); // <-- Added toast to dependency array

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  // Filter tasks based on search term (case-insensitive)
  const filteredTasks = serviceTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSingleTaskUpdated = useCallback(() => {
    fetchTasks(); // Refetch to ensure data consistency
  }, [fetchTasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // IMPORTANT: Operate on the *filteredTasks* list for visual consistency during drag
      // but remember the saved order will use the full `serviceTasks` list later
      setServiceTasks((currentTasks) => {
        const oldIndex = currentTasks.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = currentTasks.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentTasks; // Safety check
        return arrayMove(currentTasks, oldIndex, newIndex);
      });
      // Note: This visually reorders based on the current list (which might be filtered).
      // The `handleSaveChanges` uses the state `serviceTasks` which reflects this new order.
    }
  }, []); // No dependencies needed as it operates on the state updater function

  const handleSaveChanges = useCallback(async () => {
    if (!servicePackageId) return;

    setIsSavingOrder(true);
    try {
      // Use the potentially reordered `serviceTasks` state
      const tasksToUpdate: UpdateServiceOrder[] = serviceTasks.map(
        (task, index) => ({
          "additional-cost": task["additional-cost"] ?? 0,
          "additional-cost-desc": task["additional-cost-desc"] ?? "",
          cost: task.cost,
          description: task.description,
          "est-duration": task["est-duration"],
          id: task.id,
          "is-must-have": task["is-must-have"] ?? false,
          name: task.name,
          "price-of-step": task["price-of-step"] ?? task.cost,
          "staff-advice": task["staff-advice"] ?? "",
          status: task.status,
          "svcpackage-id": servicePackageId!,
          unit: task.unit,
          "task-order": index, // Assign the new index as the order
        })
      );
      const payload: UpdateServiceOrderPayload = {
        svctasks: tasksToUpdate,
      };
      const response =
        await servicePackageApiRequest.updateServiceOrder(payload);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Đã lưu thứ tự",
          description: "Thứ tự công việc đã được cập nhật thành công.",
        });
        setIsReorderingEnabled(false); // Turn off reordering mode on successful save
        // Optional: Refetch to confirm the saved order from the backend
        // fetchTasks();
      } else {
        console.error("Failed to update task order:", response);
        toast({
          variant: "destructive",
          title: "Lưu thứ tự thất bại",
          description:
            response?.payload?.message ||
            "Không thể cập nhật thứ tự công việc.",
        });
        // Consider reverting the local order change if save fails?
        // fetchTasks(); // Revert to last known good order from backend
      }
    } catch (error) {
      console.error("Error updating task order:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi lưu thứ tự",
        description: "Có lỗi xảy ra khi lưu thứ tự công việc.",
      });
      // fetchTasks(); // Revert to last known good order
    } finally {
      setIsSavingOrder(false);
    }
  }, [serviceTasks, servicePackageId, toast]); // <-- Added toast to dependency array

  const getTaskStatusColor = (status: string) => {
    // ... (status color logic remains the same)
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-300 text-white hover:bg-green-400";
      default:
        return "bg-gray-400 text-black hover:bg-gray-500";
    }
  };

  // --- Loading State ---
  if (loadingTasks) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
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
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Công việc gói dịch vụ</CardTitle>
              <CardDescription>
                Quản lý các công việc trong gói.
              </CardDescription>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2 h-9 order-3 sm:order-none">
                <Switch
                  id="reorder-mode"
                  checked={isReorderingEnabled}
                  onCheckedChange={setIsReorderingEnabled}
                  disabled={filteredTasks.length < 2 || isSavingOrder} // Disable if fewer than 2 FILTERED items or saving
                />
                <Label htmlFor="reorder-mode">Sắp xếp</Label>
              </div>
              {servicePackageId && !isReorderingEnabled && (
                <div className="order-2 sm:order-none">
                  <CreateServiceTask
                    svcpackageId={servicePackageId}
                    onTaskCreated={() => {
                      onTaskCreated();
                      fetchTasks();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mb-4">
            {!isReorderingEnabled && (
              <Input
                type="search"
                placeholder="Tìm theo tên công việc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full flex-grow sm:flex-grow-0 order-1 sm:order-none" // Adjust width and order
              />
            )}

            {/* Save Button (shown only when reordering) */}
            {isReorderingEnabled && (
              <Button
                onClick={handleSaveChanges}
                disabled={isSavingOrder}
                size="sm"
                className="h-9 order-4 sm:order-none"
              >
                {isSavingOrder ? "Đang lưu..." : "Lưu thứ tự"}
              </Button>
            )}
          </div>
          {filteredTasks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* Pass filtered task IDs to SortableContext */}
              <SortableContext
                items={filteredTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-4">
                  {/* Map over filteredTasks for rendering */}
                  {filteredTasks.map((serviceTask) => (
                    <SortableTaskCard
                      key={serviceTask.id}
                      serviceTask={serviceTask}
                      isReorderingEnabled={isReorderingEnabled}
                      servicePackageId={servicePackageId!}
                      onTaskUpdated={handleSingleTaskUpdated}
                      getTaskStatusColor={getTaskStatusColor}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            // Adjusted empty message
            <p className="text-muted-foreground text-center py-4">
              {searchTerm
                ? "Không tìm thấy công việc nào khớp."
                : "Chưa có công việc nào được tạo cho gói này."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ServiceTaskComponent;
