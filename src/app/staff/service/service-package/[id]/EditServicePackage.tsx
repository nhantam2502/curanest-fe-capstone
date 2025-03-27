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
import { ServicePackage } from "@/types/servicesPack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditServicePackageProps {
  serviceId: string;
  servicePackage: ServicePackage;
  onPackageUpdated?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.", // Tiếng Việt
  }),
  description: z.string().optional(),
  "combo-days": z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  "time-interval": z.coerce.number().default(0),
  status: z.string().default("available"),
});

const EditServicePackage: React.FC<EditServicePackageProps> = ({
  serviceId,
  servicePackage,
  onPackageUpdated,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: servicePackage.name,
      description: servicePackage.description || "",
      "combo-days": servicePackage["combo-days"],
      discount: servicePackage.discount,
      "time-interval": servicePackage["time-interval"],
      status: servicePackage.status || "available",
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
        // --- 3. Toast Thành Công ---
        toast({
          title: "Thành công",
          description: `Đã cập nhật gói dịch vụ "${packageData.name}" thành công.`,
        });
        // Không reset form ngay để người dùng có thể xem lại, chỉ đóng dialog
        onPackageUpdated?.();
        setOpen(false); // Đóng dialog
      } else {
        console.error("Service package update failed:", response);
        // --- 3. Toast Lỗi API ---
        toast({
          variant: "destructive",
          title: "Cập nhật thất bại",
          description: response?.payload.message || "Không thể cập nhật gói dịch vụ. Vui lòng thử lại.",
        });
      }
    } catch (error: any) {
      console.error("Service package update error:", error);
      // --- 3. Toast Lỗi Ngoại Lệ ---
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: error?.message || "Có lỗi không mong muốn xảy ra khi cập nhật.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Xử lý khi dialog mở ra để đảm bảo form có giá trị mới nhất nếu servicePackage prop thay đổi
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset form về giá trị của prop khi mở dialog
      form.reset({
        name: servicePackage.name,
        description: servicePackage.description || "",
        "combo-days": servicePackage["combo-days"],
        discount: servicePackage.discount,
        "time-interval": servicePackage["time-interval"],
        status: servicePackage.status || "available",
      });
    }
    setOpen(isOpen);
  };


  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}> {/* Sử dụng handleOpenChange */}
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Chỉnh sửa gói dịch vụ</AlertDialogTitle>
          <AlertDialogDescription>
            Cập nhật thông tin chi tiết cho gói dịch vụ "{servicePackage.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả (không bắt buộc)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả ngắn gọn về gói dịch vụ.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="combo-days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số ngày combo</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>Ngày hiệu lực.</FormDescription>
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
                    <FormDescription>Mức giảm giá.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time-interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giãn cách (phút)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Giữa các lần dùng.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
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
                      <SelectItem value="available">Khả dụng</SelectItem>
                      <SelectItem value="unavailable">
                        Không khả dụng
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Trạng thái hiện tại của gói dịch vụ.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
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