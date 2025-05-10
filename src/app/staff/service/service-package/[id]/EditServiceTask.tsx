"use client";

import React, { useState, useCallback } from "react"; // Added useCallback
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ServiceTask as ServiceTaskType } from "@/types/servicesTask";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditServiceTaskProps {
  svcpackageId: string;
  serviceTask: ServiceTaskType;
  onTaskUpdated?: () => void;
}

// Schema không thay đổi
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên task phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  "additional-cost": z.coerce.number().min(0).default(0),
  "additional-cost-desc": z.string().optional(),
  cost: z.coerce.number().min(0).default(0),
  "est-duration": z.coerce.number().min(0).default(0),
  "is-must-have": z.boolean().default(false),
  "price-of-step": z.coerce.number().min(0).default(0),
  "staff-advice": z.string().optional(),
  unit: z.string().default("quantity"),
  status: z.string().default("available"),
});


const EditServiceTask: React.FC<EditServiceTaskProps> = ({
  svcpackageId,
  serviceTask,
  onTaskUpdated,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // --- 4. Reset form khi mở dialog ---
  const resetFormValues = useCallback(() => {
     form.reset({
        name: serviceTask.name,
        description: serviceTask.description || "",
        "additional-cost": serviceTask["additional-cost"] ?? 0, 
        "additional-cost-desc": serviceTask["additional-cost-desc"] || "",
        cost: serviceTask.cost ?? 0,
        "est-duration": serviceTask["est-duration"] ?? 0,
        "is-must-have": serviceTask["is-must-have"] ?? false,
        "price-of-step": serviceTask["price-of-step"] ?? 0,
        "staff-advice": serviceTask["staff-advice"] || "",
        unit: serviceTask.unit || "quantity",
        status: serviceTask.status || "available",
      });
  }, [form, serviceTask]) // Phụ thuộc vào form và serviceTask


  // --- Xử lý onOpenChange ---
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      resetFormValues(); // Reset giá trị khi dialog mở
    }
    setOpen(isOpen);
  };

  // --- Hàm onSubmit với Toast ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...values,
        description: values.description || "",
        "additional-cost-desc": values["additional-cost-desc"] || "",
        "staff-advice": values["staff-advice"] || "",
      };

      // Giả sử bạn có hàm updateServiceTask trong apiServicePackage
      const response = await servicePackageApiRequest.updateServiceTask(
        svcpackageId,
        serviceTask.id,
        taskData
      );

      if (response.status === 200 && response.payload) {
        // --- 3. Toast Thành Công ---
        toast({
          title: "Thành công",
          description: `Đã cập nhật task "${taskData.name}" thành công.`,
        });
        onTaskUpdated?.(); // Gọi callback để component cha có thể fetch lại dữ liệu
        setOpen(false); // Đóng dialog
      } else {
        console.error("Service task update failed:", response);
        // --- 3. Toast Lỗi API ---
        toast({
          variant: "destructive",
          title: "Cập nhật thất bại",
          description: response?.payload.message || "Không thể cập nhật task. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      console.error("Service task update error:", error);
      // --- 3. Toast Lỗi Ngoại Lệ ---
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: error?.message || "Có lỗi không mong muốn xảy ra khi cập nhật task.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // JSX giữ nguyên cấu trúc
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}> {/* Sử dụng handleOpenChange */}
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <AlertDialogHeader> {/* Không cần flex ở đây */}
            <AlertDialogTitle>Chỉnh sửa Task dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Cập nhật thông tin cho task "{serviceTask.name}".
            </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 py-4" // Sử dụng grid layout ở form
          >
            {/* Name (spans 3 columns) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
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

            {/* Estimated Duration */}
            <FormField
              control={form.control}
              name="est-duration"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Thời lượng (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                   <FormDescription>Ước tính hoàn thành.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost */}
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Chi phí</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description (spans 3 columns) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả task (không bắt buộc)"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Cost */}
            <FormField
              control={form.control}
              name="additional-cost"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Chi phí PS</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                   <FormDescription>Chi phí phát sinh.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Per Step */}
            <FormField
              control={form.control}
              name="price-of-step"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Giá theo bước</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                   <FormDescription>Giá mỗi bước.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Đơn vị</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value} // Default value phải được set khi reset form
                    value={field.value} // Control value
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quantity">Lần</SelectItem>
                      <SelectItem value="time">Phút</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormDescription>Đơn vị tính.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Staff Advice (spans 3 columns) */}
            <FormField
              control={form.control}
              name="staff-advice"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <FormLabel>Lời khuyên NV</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lời khuyên (không bắt buộc)"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Cost Description (spans 3 columns) */}
            <FormField
              control={form.control}
              name="additional-cost-desc"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <FormLabel>Mô tả chi phí PS</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả chi phí PS (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value} // Default value set khi reset form
                    value={field.value} // Control value
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Khả dụng</SelectItem>
                      <SelectItem value="unavailable">Không khả dụng</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormDescription>Trạng thái task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Must-Have */}
            <FormField
              control={form.control}
              name="is-must-have"
              render={({ field }) => (
                // Điều chỉnh col-span nếu cần
                <FormItem className="col-span-1 sm:col-span-2 flex flex-row items-center justify-between p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bắt buộc</FormLabel>
                    <FormDescription>
                      Task này có bắt buộc không?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly // Chỉ đọc nếu không cho sửa
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <AlertDialogFooter className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-4">
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-400 hover:bg-emerald-400/90">
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật Task"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditServiceTask;