"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import servicePackageApiRequest from "@/apiRequest/servicePackage/apiServicePackage";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask"; // Import ServiceTask type
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";

interface EditServiceTaskProps {
  svcpackageId: string;
  serviceTask: ServiceTaskType; // Prop to receive existing service task data
  onTaskUpdated?: () => void; // Optional callback after update
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên task phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  "additional-cost": z.coerce.number().default(0),
  "additional-cost-desc": z.string().optional(),
  cost: z.coerce.number().default(0),
  "est-duration": z.coerce.number().default(0),
  "is-must-have": z.boolean().default(false),
  "price-of-step": z.coerce.number().default(0),
  "staff-advice": z.string().optional(),
  "task-order": z.coerce.number().default(0),
  unit: z.string().default("quantity"),
  status: z.string().default("available"), // Assuming status is editable
});

const EditServiceTask: React.FC<EditServiceTaskProps> = ({
  svcpackageId,
  serviceTask,
  onTaskUpdated,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: serviceTask.name,
      description: serviceTask.description || "",
      "additional-cost": serviceTask["additional-cost"],
      "additional-cost-desc": serviceTask["additional-cost-desc"] || "",
      cost: serviceTask.cost,
      "est-duration": serviceTask["est-duration"],
      "is-must-have": serviceTask["is-must-have"],
      "price-of-step": serviceTask["price-of-step"],
      "staff-advice": serviceTask["staff-advice"] || "",
      "task-order": serviceTask["task-order"],
      unit: serviceTask.unit || "quantity",
      status: serviceTask.status || "available", // Initialize status
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...values,
        description: values.description || "",
        "additional-cost-desc": values["additional-cost-desc"] || "",
        "staff-advice": values["staff-advice"] || "",
      };

      const response = await servicePackageApiRequest.updateServiceTask(
        svcpackageId,
        serviceTask.id, // Use serviceTask.id for update API call
        taskData
      );

      if (response.status === 200 && response.payload) {
        form.reset();
        onTaskUpdated?.();
        setOpen(false);
      } else {
        console.error("Service task update failed:", response);
      }
    } catch (error) {
      console.error("Service task update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row justify-between items-center">
          <div>
            <AlertDialogTitle>Chỉnh sửa Task dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Cập nhật thông tin task dịch vụ.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 grid grid-cols-6 sm:grid-cols-1 gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>
                    Tên Task<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả task (không bắt buộc)"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả chi tiết về task dịch vụ này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Chi phí</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Chi phí cơ bản cho task này (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="task-order"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Thứ tự Task</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Thứ tự hiển thị của task trong gói dịch vụ (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="est-duration"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Thời lượng ước tính (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Thời gian ước tính để hoàn thành task (phút) (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additional-cost"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Chi phí phát sinh</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Chi phí phát sinh thêm cho task này (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additional-cost-desc"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Mô tả chi phí phát sinh</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả chi phí phát sinh (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả chi tiết về chi phí phát sinh nếu có.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price-of-step"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Giá theo bước</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Giá cho mỗi bước thực hiện của task (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Đơn vị tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Chọn đơn vị tính"
                          className="opacity-0 focus:opacity-100 cursor-pointer"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quantity">Lần</SelectItem>
                      <SelectItem value="time">Phút</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="staff-advice"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Lời khuyên cho nhân viên</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lời khuyên cho nhân viên (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Lời khuyên hoặc hướng dẫn cho nhân viên thực hiện task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Trạng thái gói dịch vụ.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="col-span-6">
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật Task dịch vụ"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditServiceTask;
