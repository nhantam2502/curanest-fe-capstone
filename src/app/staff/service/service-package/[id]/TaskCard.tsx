// components/SortableTaskCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react"; // Using Grip as drag handle
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask";
import EditServiceTask from "./EditServiceTask"; // Assuming path

interface SortableTaskCardProps {
  serviceTask: ServiceTaskType;
  isReorderingEnabled: boolean;
  servicePackageId: string;
  onTaskUpdated: () => void;
  getTaskStatusColor: (status: string) => string;
}

export function SortableTaskCard({
  serviceTask,
  isReorderingEnabled,
  servicePackageId,
  onTaskUpdated,
  getTaskStatusColor,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Useful for styling while dragging
  } = useSortable({ id: serviceTask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1, // Example visual feedback
    zIndex: isDragging ? 10 : "auto", // Ensure dragging item is on top
    cursor: isReorderingEnabled ? "grab" : "default",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {" "}
      <Card
        className={`border-2 transition-shadow duration-150 ${
          isReorderingEnabled ? "hover:shadow-lg" : "hover:shadow-md"
        }`}
      >
        <CardContent className="p-4 sm:p-6 space-y-4 flex justify-between items-start gap-4">
          {isReorderingEnabled && (
            <div
              {...listeners} // Apply listeners only to the handle
              className="cursor-grab touch-none p-2 -ml-2 text-muted-foreground hover:bg-accent rounded"
              aria-label="Drag to reorder"
            >
              <GripVertical size={20} />
            </div>
          )}

          {/* Task Content */}
          <div
            className={`flex-grow space-y-2 ${isReorderingEnabled ? "pointer-events-none select-none" : ""}`}
          >
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                Tên công việc
              </h4>
              <p className="text-base sm:text-lg font-bold">
                {serviceTask.name}
              </p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                Mô tả
              </h4>
              <p className="text-xs sm:text-sm text-gray-700">
                {serviceTask.description}
              </p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                Trạng thái
              </h4>
              <Badge className={getTaskStatusColor(serviceTask.status)}>
                {serviceTask.status}
              </Badge>
            </div>
            <div className="flex">
              <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground mr-2">
                Giá:
              </h4>
              <p className="text-xs sm:text-sm text-gray-700">
                {serviceTask.cost}
              </p>
            </div>
          </div>
          {!isReorderingEnabled && servicePackageId && (
            <EditServiceTask
              serviceTask={serviceTask}
              svcpackageId={servicePackageId}
              onTaskUpdated={onTaskUpdated}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
