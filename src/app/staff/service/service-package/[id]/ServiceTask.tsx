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
import { Input } from "@/components/ui/input";
import {
  ServiceTask as ServiceTaskType,
  UpdateServiceOrder,
  UpdateServiceOrderPayload,
} from "@/types/servicesTask";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import CreateServiceTask from "./CreateServiceTask";
// EditServiceTask is now used inside SortableTaskCard
// Removed Skeleton import
// import { Skeleton } from "@/components/ui/skeleton";
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
  const [searchTerm, setSearchTerm] = useState("");

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
    // Reset search term when fetching new package's tasks
    setSearchTerm("");
    // Reset reordering mode when fetching new package's tasks
    setIsReorderingEnabled(false);
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
          description: response?.payload?.message || "Vui lòng thử lại sau.",
        });
        setServiceTasks([]);
      }
    } catch (error) {
      console.error("Error fetching service tasks:", error);
      toast({
        variant: "destructive",
        title: "Lỗi tải công việc",
        description: "Có lỗi xảy ra khi tải công việc.",
      });
      setServiceTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [servicePackageId, toast]);

  useEffect(() => {
    fetchTasks();
    // Disable reordering when the package changes or refresh is triggered
    setIsReorderingEnabled(false);
  }, [fetchTasks, refresh]); // Depend on fetchTasks and refresh

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
      setServiceTasks((currentTasks) => {
        const oldIndex = currentTasks.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = currentTasks.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentTasks;
        return arrayMove(currentTasks, oldIndex, newIndex);
      });
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!servicePackageId) return;

    setIsSavingOrder(true);
    try {
      const tasksToUpdate: UpdateServiceOrder[] = serviceTasks.map(
        (task, index) => ({
          // Ensure all required fields are present, providing defaults
          "additional-cost": task["additional-cost"] ?? 0,
          "additional-cost-desc": task["additional-cost-desc"] ?? "",
          cost: task.cost ?? 0, // Default cost if missing
          description: task.description ?? "", // Default description
          "est-duration": task["est-duration"] ?? 0, // Default duration
          id: task.id,
          "is-must-have": task["is-must-have"] ?? false,
          name: task.name ?? "Unnamed Task", // Default name
          "price-of-step": task["price-of-step"] ?? task.cost ?? 0,
          "staff-advice": task["staff-advice"] ?? "",
          status: task.status ?? "unavailable", // Default status
          "svcpackage-id": servicePackageId!,
          unit: task.unit ?? "unit", // Default unit
          "task-order": index,
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
        setIsReorderingEnabled(false);
        // Re-fetch after saving to ensure data is synchronised with backend order
        fetchTasks();
      } else {
        console.error("Failed to update task order:", response);
        toast({
          variant: "destructive",
          title: "Lưu thứ tự thất bại",
          description:
            response?.payload?.message ||
            "Không thể cập nhật thứ tự công việc.",
        });
        // Revert to last known good order from backend on failure
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task order:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi lưu thứ tự",
        description: "Có lỗi xảy ra khi lưu thứ tự công việc.",
      });
      fetchTasks(); // Revert to last known good order
    } finally {
      setIsSavingOrder(false);
    }
  }, [serviceTasks, servicePackageId, toast, fetchTasks]); // Added fetchTasks dependency

  const getTaskStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "Khả dụng";
      default:
        return "Không khả dụng";
    }
  };

  // --- Simple Loading State ---
  if (loadingTasks) {
    return (
      <Card>
        <CardHeader>
          {/* Keep header structure */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Công việc gói dịch vụ</CardTitle>
              <CardDescription>
                Quản lý các công việc trong gói.
              </CardDescription>
            </div>
            {/* Show disabled controls */}
            <div className="flex gap-4">
              <div className="flex items-center space-x-2 h-9 order-3 sm:order-none">
                <Switch id="reorder-mode-disabled" disabled />
                <Label htmlFor="reorder-mode-disabled">Sắp xếp</Label>
              </div>
              <div className="order-2 sm:order-none">
                <Button disabled>Tạo công việc</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-10 min-h-[200px]">
          {/* Simple text loading indicator */}
          <p className="text-muted-foreground">Đang tải công việc...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Công việc gói dịch vụ</CardTitle>
            <CardDescription>
              {isReorderingEnabled
                ? "Kéo thả để thay đổi thứ tự công việc."
                : "Quản lý các công việc trong gói. Tìm kiếm hoặc tạo mới."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 h-9">
              <Switch
                id="reorder-mode"
                checked={isReorderingEnabled}
                onCheckedChange={setIsReorderingEnabled}
                disabled={serviceTasks.length < 2 || isSavingOrder}
              />
              <Label htmlFor="reorder-mode">Sắp xếp</Label>
            </div>

            {servicePackageId && !isReorderingEnabled && (
              <div>
                {" "}
                {/* Removed order class */}
                <CreateServiceTask
                  svcpackageId={servicePackageId}
                  onTaskCreated={() => {
                    onTaskCreated();
                  }}
                />
              </div>
            )}

            {/* Save Button (shown only when reordering) */}
            {isReorderingEnabled && (
              <Button
                onClick={handleSaveChanges}
                disabled={isSavingOrder}
                size="sm"
                className="h-9 bg-emerald-400 hover:bg-emerald-400/90"
              >
                {isSavingOrder ? "Đang lưu..." : "Lưu thứ tự"}
              </Button>
            )}
          </div>
        </div>

        {/* Second line: Description */}
      </CardHeader>
      <CardContent>
        {!isReorderingEnabled && (
          <div className="mb-4">
            {" "}
            {/* Added margin-top for spacing */}
            <Input
              type="search"
              placeholder="Tìm theo tên công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Full width on small screens, limited width on larger screens
              className="h-9 w-full sm:max-w-xs"
            />
          </div>
        )}
        {/* Use min-height on the container for task cards */}
        <div className="grid gap-4 min-h-[200px]">
          {filteredTasks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={serviceTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
                // Disable sorting interactions if not in reordering mode
                disabled={!isReorderingEnabled}
              >
                {/* Map over filteredTasks for rendering */}
                {filteredTasks.map((serviceTask) => (
                  <SortableTaskCard
                    key={serviceTask.id}
                    serviceTask={serviceTask}
                    isReorderingEnabled={isReorderingEnabled}
                    servicePackageId={servicePackageId!}
                    onTaskUpdated={handleSingleTaskUpdated}
                    getTaskStatusColor={getTaskStatusColor} // Pass helper function
                    getStatusText={getStatusText} // Pass helper function
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            // Centered empty state message
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center py-4">
                {
                  searchTerm
                    ? "Không tìm thấy công việc nào khớp."
                    : serviceTasks.length === 0 // Distinguish between no tasks at all vs. no search results
                      ? "Chưa có công việc nào được tạo cho gói này."
                      : "Không có công việc nào khớp với tìm kiếm." // Message when filtering hides all tasks
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceTaskComponent;
