"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryForm from "./CategoryForm";
// import majorApiRequest from "@/apiRequest/major/apiMajor";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";

interface CategoryManagementProps {
  onCategorySelect: (categoryId: number | null) => void;
}

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ onCategorySelect }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      // const response = await majorApiRequest.getMajor();
      // if (response.status === 200 && response.payload) {
      //   setCategories(response.payload.data || []);
      // } else {
      //   console.error("Error fetching categories:");
      // }
      // Dummy data for categories
      const dummyCategories: ServiceCategory[] = [
        { id: 1, name: "Chăm sóc cơ bản", description: "Các dịch vụ chăm sóc cơ bản tại nhà và vân vân mây mây" },
        { id: 2, name: "Chăm sóc chuyên sâu", description: "Các dịch vụ chăm sóc y tế chuyên sâu" },
        { id: 3, name: "Hỗ trợ y tế", description: "Các dịch vụ hỗ trợ và tư vấn y tế" },
      ];
      setCategories(dummyCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = () => {
    fetchCategories();
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleUpdateCategory = (updatedCategory: ServiceCategory) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setEditingCategory(null);
    setOpen(false);
    fetchCategories();
  };

  const handleCloseForm = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    setIsDeleting(true);
    setCategoryToDeleteId(categoryId);

    // Simulate API call - replace with your actual API delete call
    setTimeout(() => {
      setCategories(categories.filter((category) => category.id !== categoryId));
      setIsDeleting(false);
      setCategoryToDeleteId(null);
      toast({
        title: "Thành công",
        description: "Danh mục dịch vụ đã được xoá thành công.",
      });
    }, 1000);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Label className="text-lg font-bold">Quản lý danh mục dịch vụ</Label>
        <CategoryForm
          open={open}
          onOpenChange={setOpen}
          onCreateCategory={handleCreateCategory}
          editingCategory={editingCategory}
          onUpdateCategory={handleUpdateCategory}
          onCancel={handleCloseForm}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell className="text-right font-medium space-x-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}>
                  Sửa
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                    >
                      Xoá
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xoá danh mục dịch vụ này? Hành động
                        này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          categoryToDeleteId === category.id &&
                          handleDeleteCategory(category.id)
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Đang xoá..." : "Xoá"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryManagement;