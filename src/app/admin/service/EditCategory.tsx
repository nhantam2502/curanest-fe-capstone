// components/EditCategory.tsx
"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import { Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCategoryProps {
  categoryId: string;
  currentName: string;
  currentDescription?: string;
  currentStatus?: string;
  onUpdated: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  status: z.string().default("available"),
});

export const EditCategory: React.FC<EditCategoryProps> = ({
  categoryId,
  currentName,
  currentDescription = "",
  currentStatus = "available",
  onUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentName,
      description: currentDescription,
      status: currentStatus,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
  
    try {
      const payload = {
        id: categoryId,
        name: values.name,
        description: values.description,
      };
  
      const response = await categoryApiRequest.updateCategory(
        payload
      );
  
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Cập nhật danh mục thành công.",
        });
        onUpdated();
        setOpen(false);
      } else {
        throw new Error(
          response.payload?.message || "Không thể cập nhật danh mục."
        );
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi khi cập nhật.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Chỉnh sửa danh mục</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input {...field} required/>
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
                    <Input {...field} required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
{/* 
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
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
