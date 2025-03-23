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
import { ServicePackage } from "@/types/servicesPack"; // Import ServicePackage interface
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditServicePackageProps {
  serviceId: string;
  servicePackage: ServicePackage; // Prop to receive existing service package data
  onPackageUpdated?: () => void; // Optional callback after update
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  "combo-days": z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  "time-interval": z.coerce.number().default(0),
  status: z.string().default("available"), // Assuming status is editable, add to schema
});

const EditServicePackage: React.FC<EditServicePackageProps> = ({
  serviceId,
  servicePackage,
  onPackageUpdated,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: servicePackage.name, // Pre-fill with existing data
      description: servicePackage.description || "",
      "combo-days": servicePackage["combo-days"],
      discount: servicePackage.discount,
      "time-interval": servicePackage["time-interval"],
      status: servicePackage.status || "available", // Pre-fill status
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const packageData = {
        ...values,
        description: values.description || "",
      };

      const response = await servicePackageApiRequest.updateServicePackage(
        serviceId,
        servicePackage.id, 
        packageData
      );

      if (response.status === 200 && response.payload) {
        form.reset();
        onPackageUpdated?.(); 
        setOpen(false);
      } else {
        console.error("Service package update failed:", response);
      }
    } catch (error) {
      console.error("Service package update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Sửa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Chỉnh sửa gói dịch vụ</AlertDialogTitle>{" "}
          {/* Modal title changed to "Chỉnh sửa" */}
          <AlertDialogDescription>
            Cập nhật thông tin gói dịch vụ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 grid grid-cols-2 sm:grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tên gói dịch vụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên gói dịch vụ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả ngắn gọn về gói dịch vụ này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="combo-days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số ngày combo</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Số ngày mà gói dịch vụ này có hiệu lực (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giảm giá (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Mức giảm giá cho gói dịch vụ (%) (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time-interval"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Thời gian giữa các lần sử dụng (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Khoảng thời gian tối thiểu giữa các lần sử dụng dịch vụ
                    trong gói (phút) (mặc định 0).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái"/>
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

            <AlertDialogFooter className="col-span-2">
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditServicePackage;
