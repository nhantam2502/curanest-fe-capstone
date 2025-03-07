"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryForm from "./CategoryForm";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import categoryApiRequest, { addStaffToCate, removeStaffToCate } from "@/apiRequest/category/apiCategory";
import { Search } from "lucide-react";
import { Category, CategoryFilter, StaffInfo } from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RelativesFilter } from "@/types/relatives";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryManagementProps {
  onCategorySelect: (categoryId: string) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onCategorySelect,
}) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<CategoryFilter | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [nurseInfoDialogOpen, setNurseInfoDialogOpen] = useState(false);
  const [selectedNurseInfo, setSelectedNurseInfo] = useState<StaffInfo | null>(null);
  const [users, setUsers] = useState<RelativesFilter[]>([]);
  // State to hold the staff selected from the dropdown.
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this to adjust items per page
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApiRequest.getCategory(searchQuery);
      if (response.status === 200 && response.payload) {
        setCategories(response.payload.data || []);
        // Reset page to 1 on new search/fetch
        setCurrentPage(1);
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
    const fetchStaff = async () => {
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: { role: "staff" },
          paging: { page: 1, size: 10, total: 0 },
        });
        setUsers(response.payload.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = () => {
    fetchCategories();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleting(true);
    setCategoryToDeleteId(categoryId);
    // Delete logic here
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({ name: e.target.value });
  };

  const handleRowClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    onCategorySelect(categoryId);
  };

  // Open nurse info dialog regardless of whether staff info exists.
  const handleNurseInfoClick = (
    staffInfo: StaffInfo | null,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedNurseInfo(staffInfo);
    setNurseInfoDialogOpen(true);
  };

  // When adding staff, use the selectedStaffId from the dropdown.
  const handleAddStaff = async () => {
    if (!selectedCategoryId || !selectedStaffId) {
      toast({
        title: "Lỗi",
        description: "Chưa chọn đủ thông tin.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addStaffToCate(selectedCategoryId, selectedStaffId);
      toast({
        title: "Thành công",
        description: "Y tá đã được thêm thành công.",
      });
      fetchCategories();
      setNurseInfoDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm y tá. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error adding staff:", error);
    }
  };

  const handleRemoveStaff = async () => {
    if (!selectedCategoryId) return;
    try {
      await removeStaffToCate(selectedCategoryId);
      toast({
        title: "Thành công",
        description: "Y tá đã được xoá thành công.",
      });
      fetchCategories();
      setNurseInfoDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xoá y tá. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error removing staff:", error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Label className="text-lg font-bold">Quản lý danh mục dịch vụ</Label>
        <CategoryForm
          open={open}
          onOpenChange={setOpen}
          onCreateCategory={handleCreateCategory}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mô tả..."
          value={searchQuery?.name || ""}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>

      <Table>
        <TableHeader className="space-x-2">
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Người phụ trách</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCategories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center italic text-gray-500"
              >
                Không có danh mục nào.
              </TableCell>
            </TableRow>
          ) : (
            paginatedCategories.map((category) => (
              <TableRow
                key={category.id}
                onClick={() => handleRowClick(category.id)}
                className={`hover:bg-gray-100/50 cursor-pointer ${
                  selectedCategoryId === category.id ? "bg-gray-100" : ""
                }`}
              >
                <TableCell>{category.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description}
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNurseInfoClick(category["staff-info"] || null, e);
                    }}
                  >
                    Xem thông tin
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add edit logic here if needed
                    }}
                  >
                    Sửa
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={(e) => e.stopPropagation()}
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
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước 
          </Button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Nurse Info Dialog */}
      <Dialog
        open={nurseInfoDialogOpen}
        onOpenChange={(open) => {
          if (!open) setNurseInfoDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin y tá</DialogTitle>
            <DialogDescription>
              Dưới đây là thông tin chi tiết của y tá phụ trách.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedNurseInfo ? (
              <>
                <p>
                  <strong>Tên y tá: </strong>
                  {selectedNurseInfo["nurse-name"]}
                </p>
                {selectedNurseInfo["nurse-picture"] && (
                  <img
                    src={selectedNurseInfo["nurse-picture"]}
                    alt={selectedNurseInfo["nurse-name"]}
                    className="w-32 h-32 object-cover mt-2"
                  />
                )}
              </>
            ) : (
              <p>Không có thông tin y tá.</p>
            )}
          </div>
          <div className="py-4">
            {selectedNurseInfo === null ? (
              <div>
                <Label className="block mb-2">Chọn y tá cần thêm:</Label>
                <Select
                  value={selectedStaffId}
                  onValueChange={(value) => setSelectedStaffId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn y tá" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id || ''} value={(user.id || '').toString()}>
                        {user["full-name"]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddStaff} className="my-2 w-full" variant="secondary">
                  Xác nhận thêm y tá
                </Button>
              </div>
            ) : (
              <Button onClick={handleRemoveStaff}>Xoá y tá</Button>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setNurseInfoDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
