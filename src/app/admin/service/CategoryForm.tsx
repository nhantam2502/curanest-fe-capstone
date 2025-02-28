"use client";
import React, { useEffect, useState } from "react"; // Import useEffect
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
import majorApiRequest from "@/apiRequest/major/apiMajor";

// Define props for CategoryForm component (updated with editingCategory and onUpdateCategory)
interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: () => void;
  editingCategory: ServiceCategory | null; // Prop to receive category being edited
  onUpdateCategory: (updatedCategory: ServiceCategory) => void; // Callback for updating category
  onCancel: () => void; // Callback for cancel action
}

// Dummy types - replace with your actual types
interface ServiceCategory {
  id: number;
  name: string;
  description: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onOpenChange, onCreateCategory, editingCategory, onUpdateCategory, onCancel }) => { // Destructure new props
  const [newCategory, setNewCategory] = React.useState<Omit<ServiceCategory, 'id'>>({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false); // More generic loading state name
  const { toast } = useToast();

  useEffect(() => {
    // When editingCategory prop changes (when user clicks "Edit" button), populate the form
    if (editingCategory) {
      setNewCategory(editingCategory);
    } else {
      setNewCategory({ name: "", description: "" }); // Reset form when not editing
    }
  }, [editingCategory]); // Dependency array includes editingCategory

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true); // Start loading
    try {
      let response;
      if (editingCategory) { // Check if we are in edit mode (editingCategory is not null)
        // API call for updating category
        // response = await majorApiRequest.updateMajor({ ...editingCategory, ...newCategory }); // Assuming your API updateMajor expects the entire updated object
      } else {
        // API call for creating category (same as before)
        response = await majorApiRequest.createMajor(newCategory);
      }


      if (response && (response.status === 200 || response.status === 201)) {
        toast({
          title: "Thành công",
          description: `Danh mục dịch vụ đã được ${editingCategory ? 'cập nhật' : 'tạo'} thành công.`, // Dynamic message based on action
        });
        if (editingCategory) {
          onUpdateCategory({ ...editingCategory, ...newCategory } as ServiceCategory); // Call onUpdateCategory callback for edit mode
        } else {
          onCreateCategory(); // Call onCreateCategory callback for create mode
        }
        setNewCategory({ name: "", description: "" });
        onOpenChange(false);
      } else {
        toast({
          title: "Lỗi",
          description: response?.payload?.message || `Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục dịch vụ. Vui lòng thử lại.`, // Dynamic error message
          variant: "destructive",
        });
        console.error(`Error ${editingCategory ? 'updating' : 'creating'} category:`, response);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục dịch vụ. Vui lòng thử lại.`, // Dynamic error message
        variant: "destructive",
      });
      console.error(`Error ${editingCategory ? 'updating' : 'creating'} category:`, error);
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
        <Button>Thêm danh mục</Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle> {/* Dynamic modal title */}
          <DialogDescription>
            {editingCategory ? "Chỉnh sửa tên và mô tả của danh mục." : "Nhập tên và mô tả cho danh mục dịch vụ mới."} {/* Dynamic modal description */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input id="name" name="name" value={newCategory.name} onChange={handleInputChange} placeholder="Ví dụ: Chăm sóc tại nhà" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" name="description" value={newCategory.description} onChange={handleInputChange} placeholder="Mô tả ngắn gọn về danh mục" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel}> {/* Cancel Button */}
            Hủy
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving}> {/* Save Button */}
            {isSaving ? "Đang lưu..." : "Lưu"} {/* Dynamic button text */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;