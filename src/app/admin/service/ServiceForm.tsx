"use client";
import React, { useState, useEffect } from "react"; // Removed useCallback as fetchCategories is gone
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
// Removed Select imports as category selection is removed
import { useToast } from "@/hooks/use-toast";
import { CreateServiceCate } from "@/types/service"; // Type for the service data
import serviceApiRequest from "@/apiRequest/service/apiServices";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import

// Updated Props Interface
interface ServiceFormProps {
  categoryId: string | null; // Receive category ID from parent
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback on successful creation
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  categoryId, // Use categoryId from props
  open,
  onOpenChange,
  onSuccess, // Use onSuccess callback
}) => {
  // Initial state for a new service
  const initialServiceState: CreateServiceCate = {
    name: "",
    description: "",
    "est-duration": "", // Keep as string for input, convert on save
  };
  const [newService, setNewService] = useState<CreateServiceCate>(initialServiceState);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog closes or categoryId changes (optional, but good practice)
  useEffect(() => {
    if (!open) {
      setNewService(initialServiceState); // Reset on close
    }
  }, [open]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle saving the new service
  const handleSave = async () => {
    // Check if a category is selected (passed via props)
    if (!categoryId) {
      toast({
        title: "Chưa chọn danh mục",
        description: "Vui lòng chọn một danh mục trước khi thêm dịch vụ.",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for name
    if (!newService.name.trim()) {
       toast({
        title: "Thiếu tên dịch vụ",
        description: "Vui lòng nhập tên cho dịch vụ.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Prepare payload with correct types
      const payload = {
        name: newService.name,
        description: newService.description || "", 
        "est-duration": newService["est-duration"],
      };

      // Call API to create service under the selected category
      const response = await serviceApiRequest.createService(
        categoryId, // Use categoryId from props
        payload
      );

      if (response && (response.status === 201 || response.status === 200)) { // Check common success statuses
        toast({
          title: "Thành công",
          description: `Đã tạo dịch vụ "${payload.name}" thành công.`,
        });
        onSuccess(); // Call the success callback passed from parent
        onOpenChange(false); // Close the dialog
        // No need to reset state here if useEffect handles it on !open
      } else {
        toast({
          title: "Lỗi tạo dịch vụ",
          description:
            response?.payload?.message ||
            "Không thể tạo dịch vụ. Vui lòng thử lại.",
          variant: "destructive",
        });
        console.error("Error creating service:", response);
      }
    } catch (error: any) {
      toast({
        title: "Lỗi hệ thống",
        description: error?.message || "Không thể tạo dịch vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error creating service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Dialog component controlled by parent's state via 'open' and 'onOpenChange' props
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* Disable button if no category is selected */}
        <Button disabled={!categoryId}>Thêm dịch vụ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Updated Title and Description */}
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cho dịch vụ mới vào danh mục đã chọn.
          </DialogDescription>
        </DialogHeader>
        {/* Form fields for service details */}
        <div className="grid gap-4 py-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">
              Tên dịch vụ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={newService.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Thay băng vết thương"
              required // Added basic required attribute
            />
          </div>
          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea // Use Textarea for description
              id="description"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn gọn về dịch vụ (không bắt buộc)"
              rows={3} // Adjust rows as needed
            />
          </div>
          {/* Estimated Duration Input */}
          <div className="grid gap-2">
            <Label htmlFor="est-duration">Thời gian dự kiến (phút)</Label>
            <Input
              id="est-duration"
              name="est-duration"
              type="number" // Change type to number
              min="0" // Prevent negative numbers
              value={newService["est-duration"]}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>
        {/* Dialog Actions */}
        <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          {/* Save Button */}
          <Button type="button" onClick={handleSave} disabled={isSaving || !categoryId}>
            {isSaving ? "Đang lưu..." : "Lưu dịch vụ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;