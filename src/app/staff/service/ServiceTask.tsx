"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Example: if you want to use badges for units
import { PencilIcon, TrashIcon } from "lucide-react";
import CustomizeTasksDialog from "./CustomTask";

// Define your Task type (adjust to your actual API response type)
interface Task {
  id: string;
  name: string;
  unit: string;
  price: number;
  time: number;
}

interface ServiceTasksPanelProps {
  selectedServiceId: string | null; // ID of the currently selected service (or null if none)
}

const ServiceTasksPanel: React.FC<ServiceTasksPanelProps> = ({
  selectedServiceId,
}) => {
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      name: "Initial Assessment",
      unit: "session",
      price: 50.0,
      time: 60,
    },
    {
      id: "task-2",
      name: "Manual Therapy",
      unit: "session",
      price: 75.0,
      time: 45,
    },
    {
      id: "task-3",
      name: "Exercise Prescription",
      unit: "session",
      price: 60.0,
      time: 30,
    },
    {
      id: "task-4",
      name: "Wound Dressing Change",
      unit: "visit",
      price: 40.0,
      time: 20,
    },
    {
      id: "task-5",
      name: "Medication Administration",
      unit: "visit",
      price: 30.0,
      time: 15,
    },
    // ... more tasks
  ]);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (selectedServiceId) {
      const tasksForService = tasks.filter((task) =>
        task.id.includes(selectedServiceId)
      );
      setFilteredTasks(tasksForService);
    } else {
      setFilteredTasks([]);
    }
  }, [selectedServiceId, tasks]);

  return (
    <Card className="h-[75vh] w-full">
      <CardHeader>
        <CardTitle>Service Tasks</CardTitle>
        {selectedServiceId && (
          <CardTitle className="text-md text-muted-foreground">
            Service ID: {selectedServiceId}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {selectedServiceId ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time (mins)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${task.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          alert(`Edit Task: ${task.name} (Placeholder)`)
                        }
                      >
                        {" "}
                        {/* Placeholder */}
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() =>
                          alert(`Delete Task: ${task.name} (Placeholder)`)
                        }
                      >
                        {" "}
                        {/* Placeholder */}
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <p>Select a service from the left to view its tasks.</p>
          </div>
        )}
      </CardContent>
      {selectedServiceId && (
        <div className="p-4 border-t">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsCustomizeDialogOpen(true)}
          >
            Customize Tasks
          </Button>
        </div>
      )}

      <CustomizeTasksDialog
        open={isCustomizeDialogOpen}
        onOpenChange={setIsCustomizeDialogOpen}
        serviceId={selectedServiceId}
        onTasksSaved={(updatedTasks) => {
          console.log("Tasks saved in dialog:", updatedTasks);
          setIsCustomizeDialogOpen(false);
        }}
        serviceName={null}
        initialTasks={[]}
      />
    </Card>
  );
};

export default ServiceTasksPanel;
