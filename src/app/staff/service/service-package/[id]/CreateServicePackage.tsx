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

interface ServicePackageCreationFormProps {
  serviceId: string; // Prop to receive serviceId
  onPackageCreated?: () => void; // Optional callback after package creation
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  "combo-days": z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  "time-interval": z.coerce.number().default(0),
});

const ServicePackageCreationForm: React.FC<ServicePackageCreationFormProps> = ({
  serviceId,
  onPackageCreated,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      "combo-days": 0,
      discount: 0,
      "time-interval": 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false); // State to control AlertDialog visibility

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const packageData = {
        ...values,
        description: values.description || "",
      };
      const response = await servicePackageApiRequest.createServicePackage(
        serviceId,
        packageData
      );
      if (response.status === 201 && response.payload) {
        form.reset();
        onPackageCreated?.();
        setOpen(false);
      } else {
        console.error("Service package creation failed:", response);
      }
    } catch (error) {
      console.error("Service package creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Tạo gói dịch vụ mới</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo gói dịch vụ mới</AlertDialogTitle>
          <AlertDialogDescription>
            Điền vào các thông tin dưới đây để tạo một gói dịch vụ mới.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-2 sm:grid-cols-1 gap-4"> {/* Added grid layout */}
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
                      placeholder="Nhập mô tả"
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
                    Số ngày mà gói dịch vụ này có hiệu lực.
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
                    Mức giảm giá cho gói dịch vụ (%).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time-interval"
              render={({ field }) => (
                <FormItem className="sm:col-span-2"> {/* Take full width on small screens */}
                  <FormLabel>Thời gian giữa các lần sử dụng (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Khoảng thời gian tối thiểu giữa các lần sử dụng dịch vụ
                    trong gói (phút).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="col-span-2"> 
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo gói dịch vụ"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ServicePackageCreationForm;