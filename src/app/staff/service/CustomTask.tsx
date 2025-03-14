"use client";

import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Task {
  id?: string;
  name: string;
  unit: string;
  price: number;
  time: number;
}

const taskSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, {
          message: "Task name must be at least 2 characters.",
        }),
        unit: z.string().default("session"),
        price: z.coerce
          .number()
          .nonnegative({ message: "Price must be a non-negative number." }),
        time: z.coerce
          .number()
          .nonnegative({ message: "Time must be a non-negative number." }),
      })
    )
    .min(1, { message: "At least one task is required." }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CustomizeTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string | null;
  serviceName: string | null;
  initialTasks: Task[];
  onTasksSaved: (updatedTasks: Task[]) => void;
}

const CustomizeTasksDialog: React.FC<CustomizeTasksDialogProps> = ({
  open,
  onOpenChange,
  serviceId,
  serviceName,
  initialTasks,
  onTasksSaved,
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      tasks:
        initialTasks.length > 0
          ? initialTasks
          : [{ id: "", name: "", unit: "session", price: 0, time: 0 }],
    },
    mode: "onSubmit",
  });

  // Reset form when initialTasks change
  useEffect(() => {
    form.reset({
      tasks:
        initialTasks.length > 0
          ? initialTasks
          : [{ id: "", name: "", unit: "session", price: 0, time: 0 }],
    });
  }, [initialTasks, form]);

  const onSubmit = useCallback(
    (values: TaskFormValues) => {
      console.log("Saving Tasks for Service ID:", serviceId, "Tasks:", values.tasks);
      // Simulate a save delay then trigger the callback
      setTimeout(() => {
        onTasksSaved(values.tasks);
        onOpenChange(false);
      }, 500);
    },
    [onOpenChange, onTasksSaved, serviceId]
  );

  const addTaskRow = useCallback(() => {
    const currentTasks = form.getValues("tasks");
    form.setValue("tasks", [
      ...currentTasks,
      { id: "", name: "", unit: "session", price: 0, time: 0 },
    ]);
  }, [form]);

  const removeTaskRow = useCallback(
    (index: number) => {
      const updatedTasks = form.getValues("tasks").filter((_, i) => i !== index);
      form.setValue("tasks", updatedTasks);
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <FormProvider {...form}>
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Customize Tasks for {serviceName || "Selected Service"}
              </DialogTitle>
              {serviceName && (
                <DialogDescription>
                  Manage and customize tasks for "{serviceName}" below.
                </DialogDescription>
              )}
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Task Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Unit</th>
                      <th className="px-4 py-2 text-left font-semibold">Price</th>
                      <th className="px-4 py-2 text-left font-semibold">Time (mins)</th>
                      <th className="px-4 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {form.watch("tasks").map((_, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.name`}
                            render={({ field, fieldState }) => (
                              <>
                                <Input placeholder="Task Name" {...field} />
                                {fieldState.error && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.unit`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="session">Session</SelectItem>
                                  <SelectItem value="hour">Hour</SelectItem>
                                  <SelectItem value="visit">Visit</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.price`}
                            render={({ field, fieldState }) => (
                              <>
                                <Input
                                  type="number"
                                  placeholder="Price"
                                  {...field}
                                />
                                {fieldState.error && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <FormField
                            control={form.control}
                            name={`tasks.${index}.time`}
                            render={({ field, fieldState }) => (
                              <>
                                <Input
                                  type="number"
                                  placeholder="Time"
                                  {...field}
                                />
                                {fieldState.error && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {fieldState.error.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTaskRow(index)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button type="button" onClick={addTaskRow} className="mt-2">
                Add Task
              </Button>
              <DialogFooter className="pt-4">
                <Button type="submit" className="mr-2">
                  Save Tasks
                </Button>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeTasksDialog;
