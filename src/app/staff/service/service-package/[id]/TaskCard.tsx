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
  getStatusText: (status: string) => string; // <-- Added prop
}

export function SortableTaskCard({
  serviceTask,
  isReorderingEnabled,
  servicePackageId,
  onTaskUpdated,
  getTaskStatusColor,
  getStatusText, // <-- Destructured prop
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

  // Handle potential null/undefined status gracefully
  const status = serviceTask.status ?? "unavailable"; // Default if status is missing

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`border transition-shadow duration-150 ${ // Using default border
          isReorderingEnabled ? "hover:shadow-md" : "hover:shadow-sm" // Slightly reduced hover shadow
        } ${isDragging ? "shadow-lg border-primary" : ""}`} // Add emphasis when dragging
      >
        <CardContent className="p-4 flex justify-between items-start gap-3"> {/* Adjusted gap */}
          {isReorderingEnabled && (
            <div
              {...listeners} // Apply listeners only to the handle
              className="cursor-grab touch-none p-2 -ml-2 -my-2 text-muted-foreground hover:bg-accent rounded self-center" // Center handle vertically, adjust padding/margin
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
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"> {/* Style adjustment */}
                Tên công việc
              </h4>
              <p className="text-base font-bold"> {/* Adjusted size */}
                {serviceTask.name}
              </p>
            </div>
           {serviceTask.description && ( // Only show if description exists
             <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mô tả
                </h4>
                <p className="text-sm text-gray-700 line-clamp-2"> {/* Added line-clamp */}
                    {serviceTask.description}
                </p>
             </div>
           )}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-1"> {/* Added gap and padding top */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trạng thái
                </h4>
                <Badge
                  variant="outline" // Use outline variant
                  className={`${getTaskStatusColor(status)} text-xs`} // Use computed classes
                >
                  {getStatusText(status)} {/* <-- Use getStatusText here */}
                </Badge>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Giá (VNĐ)
                </h4>
                 {/* Format currency */}
                 <p className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('vi-VN').format(serviceTask.cost ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button (only when not reordering) */}
          {!isReorderingEnabled && servicePackageId && (
            <div className="flex-shrink-0 self-start"> {/* Keep button at the top right */}
              <EditServiceTask
                serviceTask={serviceTask}
                svcpackageId={servicePackageId}
                onTaskUpdated={onTaskUpdated}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}