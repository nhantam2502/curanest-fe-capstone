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

interface ServiceTaskCreationFormProps {
  svcpackageId: string;
  onTaskCreated?: () => void;
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
});

const ServiceTaskCreationForm: React.FC<ServiceTaskCreationFormProps> = ({
  svcpackageId,
  onTaskCreated,
}) => {
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
        form.reset();
        onTaskCreated?.();
        setOpen(false);
      } else {
        console.error("Service task creation failed:", response);
      }
    } catch (error) {
      console.error("Service task creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Tạo Task dịch vụ mới</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        {" "}
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
            {/* Name (spans 2 columns) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
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

            {/* Description (spans 2 columns) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
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

            {/* Task Order */}
            <FormField
              control={form.control}
              name="task-order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự Task</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Thứ tự hiển thị của task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estimated Duration */}
            <FormField
              control={form.control}
              name="est-duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng ước tính (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Thời gian ước tính để hoàn thành task.
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
                <FormItem>
                  <FormLabel>Chi phí</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                <FormItem>
                  <FormLabel>Chi phí phát sinh</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Cost Description */}
            <FormField
              control={form.control}
              name="additional-cost-desc"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Mô tả chi phí phát sinh</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả chi phí phát sinh (không bắt buộc)"
                      {...field}
                    />
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
                <FormItem>
                  <FormLabel>Giá theo bước</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Staff Advice */}
            <FormField
              control={form.control}
              name="staff-advice"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Lời khuyên cho nhân viên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập lời khuyên cho nhân viên (không bắt buộc)"
                      {...field}
                    />
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
                <FormItem>
                  <FormLabel>Đơn vị tính</FormLabel>
                  <FormControl>
                    <Input placeholder="quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Must-Have */}
            <FormField
              control={form.control}
              name="is-must-have"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bắt buộc</FormLabel>
                    <FormDescription>
                      Task này có bắt buộc phải có trong gói dịch vụ không?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <AlertDialogFooter className="col-span-3 flex justify-end gap-4">
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
