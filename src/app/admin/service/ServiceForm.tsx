"use client";
import React, { useEffect, useState } from "react";
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

// Define props for ServiceForm component (updated with editingService and onUpdateService)
interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateService: (
    service: Omit<Service, "id" | "category_id"> & { categoryId: string }
  ) => void;
  categories: ServiceCategory[];
  editingService: Service | null; // Prop to receive service being edited
  onUpdateService: (updatedService: Service) => void; // Callback for updating service
  onCancel: () => void; // Callback for cancel action
}

// Dummy types - replace with your actual types
interface ServiceCategory {
  id: number;
  name: string;
  description: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category_id: number;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  open,
  onOpenChange,
  onCreateService,
  categories,
  editingService,
  onUpdateService,
  onCancel,
}) => {
  // Destructure new props
  const [newService, setNewService] = React.useState<
    Omit<Service, "id" | "category_id"> & { categoryId: string }
  >({ name: "", description: "", categoryId: "" });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingService) {
      setNewService({
        name: editingService.name,
        description: editingService.description,
        categoryId: editingService.category_id.toString(),
      }); // Populate form with editing service data, including categoryId
    } else {
      setNewService({ name: "", description: "", categoryId: "" });
    }
  }, [editingService]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prevState) => ({ ...prevState, [name]: value }));
  };

  // const handleCategoryChange = (value: string) => {
  //   setNewService((prevState) => ({ ...prevState, categoryId: value }));
  // };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let response;
      if (editingService) {
        // Dummy Update Logic - Replace with API call in real app
        onUpdateService({
          ...editingService,
          ...newService,
          category_id: parseInt(newService.categoryId, 10),
        } as Service); // Call onUpdateService callback for edit mode, parse categoryId to number
        response = { status: 200 }; // Simulate successful response
      } else {
        response = { status: 201 }; // Simulate successful response
        onCreateService(newService);
      }

      if (response && (response.status === 200 || response.status === 201)) {
        toast({
          title: "Thành công",
          description: `Dịch vụ đã được ${
            editingService ? "cập nhật" : "tạo"
          } thành công.`,
        });
        setNewService({ name: "", description: "", categoryId: "" });
        onOpenChange(false);
      } else {
        toast({
          title: "Lỗi",
          description: `Không thể ${
            editingService ? "cập nhật" : "tạo"
          } dịch vụ. Vui lòng thử lại.`,
          variant: "destructive",
        });
        console.error(
          `Error ${editingService ? "updating" : "creating"} service:`,
          response
        );
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể ${
          editingService ? "cập nhật" : "tạo"
        } dịch vụ. Vui lòng thử lại.`,
        variant: "destructive",
      });
      console.error(
        `Error ${editingService ? "updating" : "creating"} service:`,
        error
      );
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
          <DialogTitle>
            {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          </DialogTitle>{" "}
          {/* Dynamic modal title */}
          <DialogDescription>
            {editingService
              ? "Chỉnh sửa thông tin dịch vụ."
              : "Nhập thông tin chi tiết cho dịch vụ mới."}{" "}
            {/* Dynamic modal description */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid gap-2">
            <Label htmlFor="category">Danh mục dịch vụ</Label>
            <Select>
              {" "}
              {/* Simplified Select - no props for now */}
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Tên dịch vụ</Label>
            <Input
              id="name"
              name="name"
              value={newService.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Đo huyết áp tại nhà"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết về dịch vụ"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
