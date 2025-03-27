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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ServiceTaskCreationFormProps {
  svcpackageId: string;
  onTaskCreated?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên task phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  "additional-cost": z.coerce.number().min(0, {
    message: "Chi phí phát sinh không được âm.",
  }).default(0),
  "additional-cost-desc": z.string().optional(),
  cost: z.coerce.number().min(0, {
    message: "Chi phí không được âm.",
  }).default(0),
  "est-duration": z.coerce.number().min(0, {
    message: "Thời lượng ước tính không được âm.",
  }).default(0),
  "is-must-have": z.boolean().default(false),
  "price-of-step": z.coerce.number().min(0, {
    message: "Giá theo bước không được âm.",
  }).default(0),
  "staff-advice": z.string().optional(),
  "task-order": z.coerce.number().min(0).default(0),
  unit: z.string().default("quantity"),
});

const ServiceTaskCreationForm: React.FC<ServiceTaskCreationFormProps> = ({
  svcpackageId,
  onTaskCreated,
}) => {
  const { toast } = useToast(); // <--- 2. Gọi hook useToast
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      "additional-cost": 0,
      "additional-cost-desc": "",
      cost: 0,
      "est-duration": 0,
      "is-must-have": false,
      "price-of-step": 0,
      "staff-advice": "",
      "task-order": 0,
      unit: "quantity",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...values,
        description: values.description || "",
        "additional-cost-desc": values["additional-cost-desc"] || "",
        "staff-advice": values["staff-advice"] || "",
      };

      const response = await servicePackageApiRequest.createServiceTask(
        svcpackageId,
        taskData
      );

      if (response.status === 201 && response.payload) {
        // --- 3. Toast Thành Công ---
        toast({
          title: "Thành công",
          description: `Đã tạo task "${taskData.name}" thành công.`,
        });
        form.reset();
        onTaskCreated?.();
        setOpen(false); // Đóng dialog
      } else {
        console.error("Service task creation failed:", response);
        // --- 3. Toast Lỗi API ---
        toast({
          variant: "destructive",
          title: "Tạo thất bại",
          description: response?.payload.message || "Không thể tạo task dịch vụ. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      console.error("Service task creation error:", error);
      // --- 3. Toast Lỗi Ngoại Lệ ---
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: error?.message || "Có lỗi không mong muốn xảy ra khi tạo task.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Phần JSX giữ nguyên cấu trúc, chỉ cần đảm bảo đã import và gọi hook
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Tạo Task dịch vụ mới</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo Task dịch vụ mới</AlertDialogTitle>
          <AlertDialogDescription>
            Điền vào các thông tin dưới đây để tạo một task dịch vụ mới.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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

            {/* Task Order */}
            <FormField
              control={form.control}
              name="task-order"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Thứ tự Task</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Thứ tự hiển thị.</FormDescription>
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
                  <FormDescription>
                    Ước tính hoàn thành.
                  </FormDescription>
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
                      className="min-h-[80px]" // Giảm chiều cao một chút
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
                  <FormLabel>Chi phí phát sinh</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
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
                  <FormLabel>Đơn vị tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {/* Hiển thị giá trị đã chọn */}
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quantity">Lần</SelectItem>
                      <SelectItem value="time">Phút</SelectItem>
                      {/* Thêm các đơn vị khác nếu cần */}
                    </SelectContent>
                  </Select>
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
                    <Input
                      placeholder="Nhập lời khuyên (không bắt buộc)"
                      {...field}
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

             {/* Is Must-Have (spans 1 column, maybe adjust layout if needed) */}
            <FormField
              control={form.control}
              name="is-must-have"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bắt buộc</FormLabel>
                    <FormDescription>
                      Task này có bắt buộc trong gói không?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />


            {/* Form Actions */}
            <AlertDialogFooter className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end gap-4 mt-4">
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo Task dịch vụ"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ServiceTaskCreationForm;