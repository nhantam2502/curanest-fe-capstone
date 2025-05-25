"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep Label if not using FormLabel exclusively
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CreateServiceCate } from "@/types/service"; // Ensure this type aligns with form data
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { Textarea } from "@/components/ui/textarea";

// Import Zod and Form components from react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// --- Zod Schema Definition ---
const serviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Tên dịch vụ không được để trống." }),
  description: z
    .string()
    .max(1000, { message: "Mô tả không được vượt quá 1000 ký tự." })
    .or(z.literal("")), 
  "est-duration": z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (val === "" || val === undefined) return true; // Optional, so empty is fine
        const num = Number(val);
        return !isNaN(num) && num >= 0 && Number.isInteger(num); // Must be a non-negative integer
      },
      {
        message: "Thời gian dự kiến phải là một số nguyên không âm (ví dụ: 30, 60).",
      }
    ),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  categoryId: string | null;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  categoryId,
  onSuccess,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      "est-duration": "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        name: "",
        description: "",
        "est-duration": "",
      });
    }
  }, [isDialogOpen, form]);

  const onSubmit = async (data: ServiceFormData) => {
    if (!categoryId) {
      toast({
        title: "Chưa chọn danh mục",
        description: "Vui lòng chọn một danh mục trước khi thêm dịch vụ.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payloadForApi: CreateServiceCate = {
        name: data.name,
        description: data.description || "", 
        "est-duration": data["est-duration"] || ""
      };
      console.log("Sending payload:", payloadForApi);


      const response = await serviceApiRequest.createService(
        categoryId,
        payloadForApi
      );

      if (response && (response.status === 201 || response.status === 200)) {
        toast({
          title: "Thành công",
          description: `Đã tạo dịch vụ "${data.name}" thành công.`,
        });
        onSuccess();
        form.reset();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Lỗi tạo dịch vụ",
          description:
            response?.payload?.message ||
            "Không thể tạo dịch vụ. Vui lòng thử lại.",
          variant: "destructive",
        });
        console.error("Error creating service (API):", response);
      }
    } catch (error: any) {
      toast({
        title: "Lỗi hệ thống",
        description: error?.message || "Không thể tạo dịch vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error creating service (Catch):", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!categoryId}
          className="bg-emerald-400 hover:bg-emerald-400/90"
        >
          Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cho dịch vụ mới vào danh mục đã chọn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên dịch vụ <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Thay băng vết thương"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Mô tả ngắn gọn về dịch vụ (không bắt buộc)"
                      rows={3}
                      {...field}
                      // Zod handles optional, so no need to worry about field.value being null/undefined here
                      // unless you want specific behavior.
                      // value={field.value || ""}
                      // onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="est-duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian dự kiến (phút)</FormLabel>
                  <FormControl>
                    <Input
                      type="number" // Keep type="number" for browser native controls
                      min="0" // Browser-level min
                      step="1" // Ensure integer steps
                      placeholder="Ví dụ: 30"
                      {...field}
                      // value={field.value || ""}
                      // onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSaving}>Hủy</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving || !categoryId || !form.formState.isValid} className="bg-emerald-400 hover:bg-emerald-400/90">
                {isSaving ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : "Lưu dịch vụ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;