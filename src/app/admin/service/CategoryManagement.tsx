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
// Assuming useToast is correctly defined in hooks/use-toast
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
import categoryApiRequest, {
  addStaffToCate,
  removeStaffToCate,
} from "@/apiRequest/category/apiCategory";
import { Search, Trash2 } from "lucide-react";
import { Category, CategoryFilter, StaffInfo } from "@/types/category"; // Assuming these types are correct
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Removed unused Relatives imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NurseItemType } from "@/types/nurse"; // Assuming path is correct
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";

interface CategoryManagementProps {
  onCategorySelect: (categoryId: string) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onCategorySelect,
}) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false); // State for CategoryForm dialog
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<CategoryFilter | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [nurseInfoDialogOpen, setNurseInfoDialogOpen] = useState(false);
  const [selectedNurseInfo, setSelectedNurseInfo] = useState<StaffInfo | null>(
    null
  );
  // State to hold the list of nurses fetched from the API
  const [users, setUsers] = useState<NurseItemType[]>([]);
  // State to hold the ID of the nurse selected in the dropdown
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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

  // Fetch nurses once on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Adjust pagination/filter parameters as needed for getListNurse
        const response = await nurseApiRequest.getListNurse(
          1,
          100,
        );
        if (response.status === 200 && response.payload?.data) {
            setUsers(response.payload.data);
        } else {
            console.error("Failed to fetch staff:", response);
            setUsers([]);
        }

      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Ensure users is an empty array on error
        toast({
            title: "Lỗi tải danh sách y tá",
            description: "Không thể tải danh sách y tá để lựa chọn.",
            variant: "destructive"
        })
      }
    };
    fetchStaff();
  }, [toast]);

  // Fetch categories when search query changes
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Callback for after creating a category
  const handleCreateCategory = () => {
    fetchCategories(); // Refetch categories list
  };

  // Sets state to prepare for deletion confirmation
  const prepareDeleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setCategoryToDeleteId(categoryId);
    // The actual deletion happens in confirmDeleteCategory
  };

  // Performs the actual deletion after confirmation
  const confirmDeleteCategory = async () => {
    if (!categoryToDeleteId) return;

    setIsDeleting(true);
    // try {
    //   // Assuming you have a deleteCategory function in your API request module
    //   // const response = await categoryApiRequest.deleteCategory(categoryToDeleteId);

    //   if (response.status === 200) { // Check for success status
    //     toast({
    //       title: "Thành công",
    //       description: "Đã xoá danh mục dịch vụ thành công.",
    //     });
    //     setCategoryToDeleteId(null); // Clear ID after deletion
    //     fetchCategories(); // Refetch the list
    //   } else {
    //     console.error("Error deleting category:", response);
    //     toast({
    //       title: "Lỗi xoá danh mục",
    //       description: response.payload?.message || "Không thể xoá danh mục.",
    //       variant: "destructive",
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Error deleting category:", error);
    //   toast({
    //     title: "Lỗi xoá danh mục",
    //     description: error.message || "Đã xảy ra lỗi khi xoá danh mục.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsDeleting(false);
    // }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({ name: e.target.value });
  };

  const handleRowClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId); // Keep track of selected category for API calls
    onCategorySelect(categoryId); // Notify parent component
  };

  // Opens the dialog to view/add/remove nurse
  const handleNurseInfoClick = (
    staffInfo: StaffInfo | null,
    categoryId: string, // Pass categoryId to know which category we're working with
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedCategoryId(categoryId); // Set the current category ID
    setSelectedNurseInfo(staffInfo);
    setSelectedStaffId(""); // Reset dropdown selection when opening
    setNurseInfoDialogOpen(true);
  };

  // Adds the selected nurse to the currently selected category
  const handleAddStaff = async () => {
    if (!selectedCategoryId || !selectedStaffId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn danh mục và y tá cần thêm.",
        variant: "destructive",
      });
      return;
    }
    try {
      await addStaffToCate(selectedCategoryId, selectedStaffId);
      toast({
        title: "Thành công",
        description: "Y tá đã được thêm vào danh mục.",
      });
      fetchCategories(); // Refetch to show the updated staff info
      setNurseInfoDialogOpen(false); // Close dialog
    } catch (error: any) {
      toast({
        title: "Lỗi thêm y tá",
        description: error.message || "Không thể thêm y tá. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error adding staff:", error);
    }
  };

  // Removes the currently assigned nurse from the selected category
  const handleRemoveStaff = async () => {
    if (!selectedCategoryId || !selectedNurseInfo) {
         toast({
            title: "Thông tin không hợp lệ",
            description: "Không có y tá nào được chỉ định cho danh mục này.",
            variant: "destructive",
         });
        return;
    }
    try {
      // Assuming removeStaffToCate just needs the categoryId
      await removeStaffToCate(selectedCategoryId);
      toast({
        title: "Thành công",
        description: "Y tá đã được xoá khỏi danh mục.",
      });
      fetchCategories(); // Refetch to update the UI
      setNurseInfoDialogOpen(false); // Close dialog
    } catch (error: any) {
      toast({
        title: "Lỗi xoá y tá",
        description: error.message || "Không thể xoá y tá. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error removing staff:", error);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Label className="text-xl font-semibold">Quản lý danh mục dịch vụ</Label>
        {/* Ensure CategoryForm handles its own open state via props */}
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
          placeholder="Tìm kiếm theo tên danh mục..."
          value={searchQuery?.name || ""}
          onChange={handleSearchChange}
          className="pr-10" // Padding for the icon
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Tên danh mục</TableHead>
              <TableHead className="w-[40%]">Mô tả</TableHead>
              <TableHead className="w-[15%] text-center">Người phụ trách</TableHead>
              <TableHead className="w-[20%] text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow
                  key={category.id}
                  onClick={() => handleRowClick(category.id)}
                  className={`hover:bg-accent cursor-pointer ${
                    selectedCategoryId === category.id ? "bg-muted" : "" // Use muted for selection
                  }`}
                  data-state={selectedCategoryId === category.id ? "selected" : undefined}
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground"> {/* Limit lines */}
                    {category.description}
                  </TableCell>
                  <TableCell className="text-center">
                    {category["staff-info"] ? (
                      <div
                        className="flex justify-center items-center cursor-pointer group"
                        onClick={(e) => handleNurseInfoClick(category["staff-info"], category.id, e)}
                      >
                        <Avatar className="w-8 h-8 group-hover:ring-2 group-hover:ring-primary">
                          <AvatarImage
                            src={ category["staff-info"]["nurse-picture"] || undefined } // Use undefined for missing src
                            alt={category["staff-info"]["nurse-name"]}
                          />
                          <AvatarFallback>
                             {/* Simple fallback */}
                            {category["staff-info"]["nurse-name"]?.charAt(0)?.toUpperCase() || 'N'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={(e) => handleNurseInfoClick(null, category.id, e)}
                      >
                        Thêm y tá
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Placeholder for Edit Button */}
                    {/* <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                         <Edit className="h-4 w-4" />
                    </Button> */}
                    <AlertDialog onOpenChange={(isOpen) => { if (!isOpen) setCategoryToDeleteId(null); }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => prepareDeleteCategory(category.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                       {/* Ensure content only renders if categoryToDeleteId matches */}
                      {categoryToDeleteId === category.id && (
                          <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                              <AlertDialogDescription>
                              Bạn có chắc chắn muốn xoá danh mục "{category.name}"? Hành động này sẽ xoá vĩnh viễn danh mục và không thể hoàn tác.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setCategoryToDeleteId(null)}>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                  onClick={confirmDeleteCategory}
                                  disabled={isDeleting}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Destructive styling
                              >
                              {isDeleting ? "Đang xoá..." : "Xoá vĩnh viễn"}
                              </AlertDialogAction>
                          </AlertDialogFooter>
                          </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <span className="text-sm font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      <Dialog
        open={nurseInfoDialogOpen}
        onOpenChange={setNurseInfoDialogOpen} // Direct state setter is fine here
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin người phụ trách</DialogTitle>
            <DialogDescription>
              {selectedNurseInfo
                ? "Xem hoặc xoá y tá phụ trách hiện tại."
                : "Thêm y tá phụ trách cho danh mục này."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Display current nurse info OR show Add form */}
            {selectedNurseInfo ? (
              <div className="space-y-2">
                 <div className="flex items-center gap-4">
                     <Avatar className="w-16 h-16">
                          <AvatarImage src={ selectedNurseInfo["nurse-picture"] || undefined } alt={selectedNurseInfo["nurse-name"]} />
                          <AvatarFallback> {selectedNurseInfo["nurse-name"]?.charAt(0)?.toUpperCase() || 'N'} </AvatarFallback>
                     </Avatar>
                    <p className="font-medium">{selectedNurseInfo["nurse-name"]}</p>
                 </div>
                {/* Add more details if available in StaffInfo */}
                {/* <p><strong>ID:</strong> {selectedNurseInfo["nurse-id"]}</p> */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRemoveStaff}
                >
                  Xoá khỏi danh mục này
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="nurse-select">Chọn y tá để thêm:</Label>
                <Select
                  value={selectedStaffId}
                  onValueChange={setSelectedStaffId} // Directly set the state
                >
                  <SelectTrigger id="nurse-select" className="w-full">
                    <SelectValue placeholder="-- Chọn y tá --" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 ? (
                       // --- CORRECTED SELECT OPTIONS ---
                      users.map((user) => (
                        <SelectItem
                          key={user["nurse-id"]} // Use correct ID for key
                          value={user["nurse-id"]} // Use correct ID for value
                        >
                          {user["nurse-name"]} {/* Display correct name */}
                        </SelectItem>
                      ))
                      // ---------------------------------
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Không có y tá nào.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddStaff}
                  className="w-full"
                  disabled={!selectedStaffId} // Disable if no nurse is selected
                >
                  Thêm y tá vào danh mục
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNurseInfoDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;