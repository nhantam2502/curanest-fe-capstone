"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // Triggered programmatically
} from "@/components/ui/dialog";
// DropdownMenu imports removed as it's not used directly in the provided snippet
// Re-add if actions are moved back into a dropdown
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  // MoreHorizontal, // Removed if not used
  Pencil,
  Eye,
  // Trash2, // Removed if not used
} from "lucide-react";
import EditNurseForm from "./EditNurseForm"; // Assuming path
import { NurseForStaff } from "@/types/nurse"; // ** IMPORTANT: Ensure NurseForStaff includes phone_number?: string; **
import NurseFilter from "./NurseFilter"; // Assuming path
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
// import { StarRating } from "@/components/ui/star-rating";

interface NurseTableProps {
  Nurses: NurseForStaff[]; // Initial list of nurses (ensure this data has phone_number)
}

// --- Pagination ---
const ITEMS_PER_PAGE = 8;

export default function RenovatedNurseTableWrapper({
  Nurses,
}: NurseTableProps) {
  // ** IMPORTANT: Ensure the 'Nurses' prop passed in contains 'phone_number' data **
  // Example structure needed:
  // const exampleNurse: NurseForStaff = {
  //   id: 1, name: "Nurse Joy", email: "joy@pokemon.com", phone_number: "0987654321", ...
  // };

  const [allNurses] = useState<NurseForStaff[]>(Nurses || []);
  const [filteredNurses, setFilteredNurses] = useState<NurseForStaff[]>(
    Nurses || []
  );
  const [selectedNurse, setSelectedNurse] = useState<NurseForStaff | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic ---
  const handleFilterChange = (filters: {
    department?: string;
    status?: string;
    gender?: string;
    search?: string;
  }) => {
    let processedNurses = [...allNurses];

    if (filters.department) {
      processedNurses = processedNurses.filter(
        (nurse) => nurse.major === filters.department
      );
    }
    if (filters.status) {
      processedNurses = processedNurses.filter(
        (nurse) => nurse.status === filters.status
      );
    }
    if (filters.gender) {
      // Ensure comparison handles potential boolean/string differences if needed
      processedNurses = processedNurses.filter(
        (nurse) => String(nurse.gender) === filters.gender
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      processedNurses = processedNurses.filter(
        (nurse) =>
          nurse.name.toLowerCase().includes(searchLower) ||
          nurse.email.toLowerCase().includes(searchLower) ||
          // Add phone number to search
          (nurse["phone-number"] && nurse["phone-number"].replace(/[\s\-()]/g, '').includes(searchLower.replace(/[\s\-()]/g, ''))) ||
          nurse.major?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredNurses(processedNurses);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilteredNurses([...allNurses]);
    setCurrentPage(1);
  };

  // --- Pagination Calculations ---
  const totalPages = Math.ceil(filteredNurses.length / ITEMS_PER_PAGE);
  const paginatedNurses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNurses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNurses, currentPage]);

  const handleRowClick = (nurse: NurseForStaff) => {
    setSelectedNurse(nurse);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, nurse: NurseForStaff) => {
    e.stopPropagation();
    setSelectedNurse(nurse);
    setIsEditModalOpen(true);
  };

  // Placeholder for delete
  const handleDeleteClick = (e: React.MouseEvent, nurseId: number | string) => {
    e.stopPropagation();
    console.log("Delete nurse:", nurseId);
    alert(`Placeholder: Delete nurse with ID ${nurseId}`);
    // API call + refetch would go here
  };

  const handleSaveEdit = (updatedNurse: NurseForStaff) => {
    const updateList = (list: NurseForStaff[]) =>
      list.map((nurse) =>
        nurse.id === updatedNurse.id ? updatedNurse : nurse
      );

    setFilteredNurses(updateList);
    // You might want to update allNurses too, or refetch the entire list
    // setAllNurses(updateList);
    setIsEditModalOpen(false);
    // TODO: Add success toast
  };

    // Handle Status Change (Example using Switch - needs API integration)
  const handleStatusChange = async (nurseId: number | string, newStatus: boolean) => {
    console.log(`Toggling status for nurse ${nurseId} to ${newStatus ? 'active' : 'inactive'}`);
    // ** IMPORTANT: Replace with your actual API call **
    try {
        // Example: await api.updateNurseStatus(nurseId, newStatus ? 'active' : 'inactive');

        // Update local state optimistically or after confirmation
        const updateStatus = (list: NurseForStaff[]) => list.map(nurse =>
            nurse.id === nurseId ? { ...nurse, status: newStatus ? 'active' : 'inactive' } : nurse // Assuming 'active'/'inactive' strings
        );
        setFilteredNurses(updateStatus);
        if (selectedNurse?.id === nurseId) {
            setSelectedNurse(prev => prev ? { ...prev, status: newStatus ? 'active' : 'inactive' } : null);
        }
        // Consider updating allNurses too or refetching
        // setAllNurses(updateStatus);

        // TODO: Add success toast
    } catch (error) {
        console.error("Failed to update nurse status:", error);
        // TODO: Add error toast
        // Revert optimistic update if needed
    }
};


  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return "N";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts.length === 1 && nameParts[0].length > 0
        ? nameParts[0][0].toUpperCase()
        : "N";
  };

  const getStatusVariant = (
    status?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
     const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "active":
        return "default"; // Greenish
      case "inactive":
         return "secondary"; // Gray
       case "pending": // Example
         return "outline";
      case "suspended": // Example
        return "destructive"; // Red
      default:
        return "secondary"; // Default to gray if unknown
    }
  };

    const getStatusText = (status?: string): string => {
      const lowerStatus = status?.toLowerCase();
      switch (lowerStatus) {
          case "active": return "Hoạt động";
          case "inactive": return "Không hoạt động";
          // Add other statuses as needed
          default: return status || "N/A";
      }
  }

  return (
    <div className="space-y-6">
      <NurseFilter
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-start justify-between p-3 pr-6">
          <div></div> {/* Placeholder for potential future elements */}
          <Link href="/staff/nurse-management/create-nurse">
            <Button>Thêm</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] hidden sm:table-cell pl-4">
                    Avatar
                  </TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  {/* New Column Header */}
                  <TableHead className="hidden lg:table-cell">
                    Số điện thoại
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Chuyên môn
                  </TableHead>
                  <TableHead className="w-[140px] text-center"> {/* Wider for switch */}
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-right w-[100px] pr-4">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNurses.length > 0 ? (
                  paginatedNurses.map((nurse) => (
                    <TableRow
                      key={nurse.id}
                      className="cursor-pointer hover:bg-muted/50"
                    // No onClick here to allow separate button actions
                    >
                      <TableCell className="hidden sm:table-cell pl-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={nurse.avatar || undefined}
                            alt={nurse.name}
                          />
                          <AvatarFallback>
                            {getInitials(nurse.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {nurse.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {nurse.email}
                      </TableCell>
                      {/* New Column Cell */}
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {nurse["phone-number"] || <span className="italic">N/A</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {nurse.major || <span className="italic">N/A</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Status Switch - Make sure status values align ('active'/'inactive') */}
                        <Switch
                          checked={nurse.status?.toLowerCase() === 'active'}
                          onCheckedChange={(isChecked) => {
                            handleStatusChange(nurse.id, isChecked);
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent row click
                          aria-label={`Status for ${nurse.name}`}
                          className="mx-auto" // Center the switch
                        />
                        {/* Optional: Text label below switch */}
                         <span className="text-xs block mt-1 text-muted-foreground">
                          {getStatusText(nurse.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xem chi tiết" // Tooltip text
                          onClick={(e) => {
                            e.stopPropagation(); // Still good practice
                            handleRowClick(nurse);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem chi tiết {nurse.name}</span>
                        </Button>
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                           title="Chỉnh sửa" // Tooltip text
                          onClick={(e) => handleEditClick(e, nurse)}
                        >
                          <Pencil className="h-4 w-4" />
                           <span className="sr-only">Chỉnh sửa {nurse.name}</span>
                        </Button>
                         {/* Delete Button (Placeholder) - Consider using DropdownMenu for more actions */}
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          title="Xóa" // Tooltip text
                          onClick={(e) => handleDeleteClick(e, nurse.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Xóa {nurse.name}</span>
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    {/* Updated colSpan to 7 */}
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy điều dưỡng nào khớp với bộ lọc.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {filteredNurses.length > 0 ? (
              <>
                Hiển thị từ{" "}
                <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> đến{" "}
                <strong>
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredNurses.length
                  )}
                </strong>{" "}
                trong tổng số <strong>{filteredNurses.length}</strong> điều dưỡng
                {/* Indicate if filtered */}
                {filteredNurses.length !== allNurses.length ? ' (đã lọc)' : ''}
              </>
            ) : (
              "Không có kết quả nào"
            )}
          </div>
          {totalPages > 1 && ( // Only show pagination if more than one page
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <span className="sr-only">Trang trước</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-xs font-medium">
                Trang {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Nurse Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết Điều dưỡng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của {selectedNurse?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedNurse && (
            <div className="grid gap-3 py-4 text-sm">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={selectedNurse.avatar || undefined}
                    alt={selectedNurse.name}
                  />
                  <AvatarFallback>
                    {getInitials(selectedNurse.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label className="text-right text-muted-foreground">ID:</Label>
                <span className="col-span-2">{selectedNurse.id}</span>

                <Label className="text-right text-muted-foreground">Tên:</Label>
                <span className="col-span-2 font-medium">
                  {selectedNurse.name}
                </span>

                <Label className="text-right text-muted-foreground">Email:</Label>
                <span className="col-span-2">{selectedNurse.email}</span>

                {/* New Phone Number Field */}
                <Label className="text-right text-muted-foreground">Điện thoại:</Label>
                <span className="col-span-2">{selectedNurse["phone-number"] || "N/A"}</span>

                <Label className="text-right text-muted-foreground">Trạng thái:</Label>
                <div className="col-span-2">
                  {/* Use Badge for visual status */}
                   <Badge variant={getStatusVariant(selectedNurse.status)}>
                     {getStatusText(selectedNurse.status)}
                   </Badge>
                 </div>

                <Label className="text-right text-muted-foreground">Ngày sinh:</Label>
                <span className="col-span-2">{selectedNurse.dob || "N/A"}</span>

                <Label className="text-right text-muted-foreground">Giới tính:</Label>
                <span className="col-span-2">{selectedNurse.gender || "N/A"}</span>

                <Label className="text-right text-muted-foreground">CCCD:</Label>
                <span className="col-span-2">{selectedNurse.citizen_id || "N/A"}</span>

                <Label className="text-right text-muted-foreground">Địa chỉ:</Label>
                <span className="col-span-2">
                  {`${selectedNurse.address || ""} ${selectedNurse.ward || ""} ${selectedNurse.district || ""} ${selectedNurse.city || ""}`
                    .replace(/ +/g, ' ').trim().replace(/^,|,$/g, '').replace(/ , /g, ', ') || "N/A"}
                </span>

                <Label className="text-right text-muted-foreground">Chuyên môn:</Label>
                <span className="col-span-2">{selectedNurse.major || "N/A"}</span>

                <Label className="text-right text-muted-foreground">Slogan:</Label>
                <span className="col-span-2 italic">{selectedNurse.slogan || "N/A"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Nurse Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Điều dưỡng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho {selectedNurse?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedNurse && (
            <EditNurseForm
              nurse={selectedNurse}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEdit}
            />
            // ** IMPORTANT: Ensure EditNurseForm component also handles 'phone_number' **
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}