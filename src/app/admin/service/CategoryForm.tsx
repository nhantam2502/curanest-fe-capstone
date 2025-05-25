"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/form"; // Make sure you have these Shadcn UI components

const categoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Tên danh mục không được bỏ trống.",
  }),
  description: z.string().min(1, {
    message: "Mô tả không được bỏ trống.",
  }),
});

// Infer the TypeScript type from the Zod schema
type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  onCreateCategory: () => void; // Callback after successful creation
}

// No need for React.FC if not using children prop explicitly
const CategoryForm = ({ onCreateCategory }: CategoryFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog open state
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // --- React Hook Form Initialization ---
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when dialog closes or opens
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({ name: "", description: "" }); // Reset form when dialog closes
    }
  }, [isDialogOpen, form]);


  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);
    try {
      // The data object is already validated and typed by Zod
      const response = await categoryApiRequest.createCategory(data);

      if (response && response.status === 201) {
        toast({
          title: "Thành công",
          description: "Danh mục dịch vụ đã được tạo thành công.",
        });
        onCreateCategory(); // Call the success callback
        form.reset(); // Reset the form fields
        setIsDialogOpen(false); // Close the dialog
      } else {
        toast({
          title: "Lỗi",
          description:
            response?.payload?.message ||
            "Không thể tạo danh mục dịch vụ. Vui lòng thử lại.",
          variant: "destructive",
        });
        console.error("Error creating category (API):", response);
      }
    } catch (error) {
      toast({
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      console.error("Error creating category (Catch):", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-400 hover:bg-emerald-400/90">
          Thêm danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Nhập tên và mô tả cho danh mục dịch vụ mới. Các trường bắt buộc được
            đánh dấu (*).
          </DialogDescription>
        </DialogHeader>

        {/* --- React Hook Form Integration --- */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Chăm sóc tại nhà"
                      {...field} // Spread field props (onChange, onBlur, value, name, ref)
                    />
                  </FormControl>
                  <FormMessage /> {/* Displays validation errors for this field */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về danh mục (ví dụ: các dịch vụ y tế được cung cấp tại nhà bệnh nhân)."
                      {...field}
                      rows={4} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              {/* Optional: Add a cancel button that uses DialogClose */}
              <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSaving}>
                    Hủy
                 </Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving || !form.formState.isValid} className="bg-emerald-400 hover:bg-emerald-400/90">
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu danh mục"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;