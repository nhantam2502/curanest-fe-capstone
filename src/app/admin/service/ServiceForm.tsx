"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreateServiceCate } from "@/types/service";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import { Category, CategoryFilter } from "@/types/category";

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateService: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  open,
  onOpenChange,
  onCreateService,
}) => {
  const [newService, setNewService] = useState<CreateServiceCate>({
    name: "",
    description: "",
    "est-duration": "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [searchQuery] = useState<CategoryFilter>({ name: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApiRequest.getCategory(searchQuery);
      if (response.status === 200 && response.payload) {
        setCategories(response.payload.data || []);
      } else {
        console.error("Error fetching categories:", response);
        toast({
          title: "Lỗi tải danh mục",
          description:
            response.payload?.message || "Không thể tải danh mục dịch vụ.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Lỗi tải danh mục",
        description: "Không thể tải danh mục dịch vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [searchQuery, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prevState: CreateServiceCate) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (!selectedCategoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một danh mục.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        name: newService.name,
        description: newService.description,
        "est-duration": newService["est-duration"],
      };

      const response = await serviceApiRequest.createService(
        selectedCategoryId,
        payload
      ); // Pass selectedCategoryId
      if (response && response.status === 201) {
        toast({
          title: "Thành công",
          description: "Danh mục dịch vụ đã được tạo thành công.",
        });
        onCreateService();
        console.log(response);
        setNewService({
          name: "",
          description: "",
          "est-duration": "",
        });
        setSelectedCategoryId(undefined); // Reset selected category
        onOpenChange(false);
      } else {
        toast({
          title: "Lỗi",
          description:
            response?.payload?.message ||
            "Không thể tạo danh mục dịch vụ. Vui lòng thử lại.",
          variant: "destructive",
        });
        console.error("Error creating category:", response);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh mục dịch vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error creating category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Thêm danh mục</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Nhập tên và mô tả cho danh mục dịch vụ mới.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-id">Danh mục</Label>
            <Select onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              name="name"
              value={newService.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Chăm sóc tại nhà"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn gọn về danh mục"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="est-duration">Thời gian dự kiến</Label>
            <Input
              id="est-duration"
              name="est-duration"
              value={newService["est-duration"]}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
