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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ServicePackageCreationFormProps {
  serviceId: string; // Prop to receive serviceId
  onPackageCreated?: () => void; // Optional callback after package creation
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.", // Tiếng Việt
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
  const { toast } = useToast(); // <--- Gọi hook useToast
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
  const [open, setOpen] = useState(false);

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
        // --- Toast Thành Công ---
        toast({
          title: "Thành công",
          description: "Đã tạo gói dịch vụ mới thành công.",
        });
        form.reset();
        onPackageCreated?.();
        setOpen(false); // Đóng dialog
      } else {
        console.error("Service package creation failed:", response);
        // --- Toast Lỗi API ---
        toast({
          variant: "destructive",
          title: "Tạo thất bại",
          description: response?.payload.message || "Không thể tạo gói dịch vụ. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      console.error("Service package creation error:", error);
      // --- Toast Lỗi Ngoại Lệ ---
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: error?.message || "Có lỗi không mong muốn xảy ra trong quá trình tạo gói dịch vụ.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-emerald-400 hover:bg-emerald-400/90">Tạo gói dịch vụ mới</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo gói dịch vụ mới</AlertDialogTitle>
          <AlertDialogDescription>
            Điền vào các thông tin dưới đây để tạo một gói dịch vụ mới.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 grid grid-cols-1 sm:grid-cols-3 gap-4" // Adjusted grid for smaller screens
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-3"> {/* Full width on small, full on larger */}
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
                <FormItem className="col-span-1 sm:col-span-3"> {/* Full width */}
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả" {...field} />
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
                <FormItem className="col-span-1"> {/* One column */}
                  <FormLabel>Số ngày combo</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Số ngày hiệu lực.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="col-span-1"> {/* One column */}
                  <FormLabel>Giảm giá (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Mức giảm giá (%).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time-interval"
              render={({ field }) => (
                <FormItem className="col-span-1"> {/* One column */}
                  <FormLabel>Giãn cách (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Giữa các lần dùng (phút).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="col-span-1 sm:col-span-3 flex justify-end gap-4 mt-4"> {/* Ensure footer spans full width and has margin */}
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-400 hover:bg-emerald-400/90">
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