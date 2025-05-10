"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import { CreateCategory } from "@/types/category";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onOpenChange,
  onCreateCategory,
}) => {
  const [newCategory, setNewCategory] = React.useState<CreateCategory>({ name: "", description: ""});
  const [isSaving, setIsSaving] = useState(false); // More generic loading state name
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevState: CreateCategory) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true); // Start loading
    try {
      const response = await categoryApiRequest.createCategory(newCategory);

      if (response && response.status === 201) {
        toast({
          title: "Thành công",
          description: `Danh mục dịch vụ đã được tạo thành công.`, // Static message for create
        });
        onCreateCategory();
        setNewCategory({ name: "", description: "" });
        onOpenChange(false);
      } else {
        toast({
          title: "Lỗi",
          description:
            response?.payload?.message ||
            `Không thể tạo danh mục dịch vụ. Vui lòng thử lại.`, // Static error message
          variant: "destructive",
        });
        console.error(
          `Error creating category:`,
          response
        );
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo danh mục dịch vụ. Vui lòng thử lại.`, // Static error message
          variant: "destructive",
        });
      console.error(
        `Error creating category:`,
        error
      );
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-400 hover:bg-emerald-400/90">Thêm danh mục</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>{" "}
          {/* Static modal title */}
          <DialogDescription>
            Nhập tên và mô tả cho danh mục dịch vụ mới.
          </DialogDescription>{" "}
          {/* Static modal description */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Chăm sóc tại nhà"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn gọn về danh mục"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {/* Save Button */}
            {isSaving ? "Đang lưu..." : "Lưu"} {/* Dynamic button text */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;