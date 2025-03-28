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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react"; // Add icons
import EditNurseForm from "./EditNurseForm"; // Assuming path
import { NurseForStaff } from "@/types/nurse"; // Assuming path
import NurseFilter from "./NurseFilter"; // Assuming path
// Import StarRating if applicable
// import { StarRating } from "@/components/ui/star-rating";

interface NurseTableProps {
  Nurses: NurseForStaff[]; // Initial list of nurses
}

// --- Pagination ---
const ITEMS_PER_PAGE = 8; // Adjust as needed

export default function RenovatedNurseTableWrapper({ Nurses }: NurseTableProps) {
  const [allNurses] = useState<NurseForStaff[]>(Nurses || []); // Store original list
  const [filteredNurses, setFilteredNurses] = useState<NurseForStaff[]>(Nurses || []);
  const [selectedNurse, setSelectedNurse] = useState<NurseForStaff | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic ---
  const handleFilterChange = (filters: {
    department?: string; // Assuming 'major' is department?
    status?: string;
    gender?: string;
    search?: string;
  }) => {
    let processedNurses = [...allNurses]; // Filter from the original full list

    if (filters.department) {
      processedNurses = processedNurses.filter(
        (nurse) => nurse.major === filters.department // Match key 'major'
      );
    }
    if (filters.status) {
      processedNurses = processedNurses.filter(
        (nurse) => nurse.status === filters.status
      );
    }
    if (filters.gender) {
      processedNurses = processedNurses.filter(
        (nurse) => nurse.gender === filters.gender
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      processedNurses = processedNurses.filter(
        (nurse) =>
          nurse.name.toLowerCase().includes(searchLower) ||
          nurse.email.toLowerCase().includes(searchLower) ||
          nurse.major?.toLowerCase().includes(searchLower) // Include major in search
      );
    }
    setFilteredNurses(processedNurses);
    setCurrentPage(1); // Reset page on filter change
  };

   // Reset filters to show all original nurses
   const handleResetFilters = () => {
    setFilteredNurses([...allNurses]);
    setCurrentPage(1);
   }

  // --- Pagination Calculations ---
  const totalPages = Math.ceil(filteredNurses.length / ITEMS_PER_PAGE);
  const paginatedNurses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNurses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNurses, currentPage]);

   // --- Navigation & Actions ---
  const handleRowClick = (nurse: NurseForStaff) => {
    setSelectedNurse(nurse);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, nurse: NurseForStaff) => {
    e.stopPropagation(); // Prevent row click
    setSelectedNurse(nurse);
    setIsEditModalOpen(true);
  };

   const handleDeleteClick = (e: React.MouseEvent, nurseId: number | string) => {
     e.stopPropagation();
     // TODO: Implement actual delete confirmation and logic
     console.log("Delete nurse:", nurseId);
     alert(`Placeholder: Delete nurse with ID ${nurseId}`);
     // Example: Filter out locally (replace with API call + refetch)
     // setFilteredNurses(prev => prev.filter(n => n.id !== nurseId));
     // setAllNurses(prev => prev.filter(n => n.id !== nurseId)); // Also update original list if deleting locally
   };

  const handleSaveEdit = (updatedNurse: NurseForStaff) => {
    // Update both filtered and potentially the original list
    const updateList = (list: NurseForStaff[]) =>
        list.map((nurse) => (nurse.id === updatedNurse.id ? updatedNurse : nurse));

    setFilteredNurses(updateList);
    // setAllNurses(updateList); // Optional: update original list if not refetching
    setIsEditModalOpen(false);
    // Optionally show a success toast
  };

   const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };


  // Helper for initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return "N";
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts.length === 1 && nameParts[0].length > 0
      ? nameParts[0][0].toUpperCase()
      : "N";
  };

   // Helper for status badge variant
   const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
     switch (status?.toLowerCase()) {
       case 'active':
       case 'online': // Example aliases
         return 'default'; // Green (default)
       case 'inactive':
       case 'offline':
       case 'on leave': // Example aliases
         return 'secondary'; // Gray
       case 'suspended': // Example
         return 'destructive'; // Red
       default:
         return 'outline'; // Simple outline
     }
   };


  return (
    <div className="space-y-6"> {/* Add spacing */}
      {/* Pass handleResetFilters to the Filter component */}
      <NurseFilter onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Danh sách Điều dưỡng</CardTitle>
          <CardDescription>
            Quản lý thông tin và trạng thái của điều dưỡng viên.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] hidden sm:table-cell pl-4">Avatar</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Chuyên môn</TableHead>
                  <TableHead className="w-[120px] text-center">Trạng thái</TableHead>
                  <TableHead className="text-right w-[100px] pr-4">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNurses.length > 0 ? (
                  paginatedNurses.map((nurse) => (
                    <TableRow
                      key={nurse.id}
                      onClick={() => handleRowClick(nurse)} // Open detail modal on row click
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell className="hidden sm:table-cell pl-4">
                        <Avatar className="h-9 w-9">
                           {/* Assuming nurse.avatar is the URL */}
                          <AvatarImage src={nurse.avatar || undefined} alt={nurse.name} />
                          <AvatarFallback>{getInitials(nurse.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{nurse.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{nurse.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{nurse.major || <span className="italic">N/A</span>}</TableCell>
                      <TableCell className="text-center">
                         {/* Status Badge */}
                         <Badge variant={getStatusVariant(nurse.status)} className="capitalize">
                            {nurse.status || "Unknown"}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(nurse); }}>
                               <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleEditClick(e, nurse)}>
                              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={(e) => handleDeleteClick(e, nurse.id)}
                            >
                               <Trash2 className="mr-2 h-4 w-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy điều dưỡng nào khớp với bộ lọc.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between">
           {/* Item Count Display */}
            <div className="text-xs text-muted-foreground">
            {filteredNurses.length > 0 ? (
                <>
                Hiển thị từ <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> đến{" "}
                <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredNurses.length)}</strong> trong tổng số{" "}
                <strong>{filteredNurses.length}</strong> điều dưỡng (đã lọc)
                </>
            ) : (
                "Không có kết quả nào"
            )}
            </div>
             {/* Pagination Controls */}
            {totalPages > 0 && (
                <div className="flex items-center space-x-1">
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                        <span className="sr-only">Trang trước</span><ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex w-[100px] items-center justify-center text-xs font-medium">
                        Trang {currentPage} / {totalPages}
                    </div>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                        <span className="sr-only">Trang sau</span><ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </CardFooter>
      </Card>

      {/* Nurse Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg"> {/* Adjust size if needed */}
          <DialogHeader>
            <DialogTitle>Chi tiết Điều dưỡng</DialogTitle>
            <DialogDescription>Thông tin chi tiết của {selectedNurse?.name}.</DialogDescription>
          </DialogHeader>
          {selectedNurse && (
             <div className="grid gap-3 py-4 text-sm">
                <div className="flex items-center justify-center mb-4">
                     <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedNurse.avatar || undefined} alt={selectedNurse.name} />
                        <AvatarFallback>{getInitials(selectedNurse.name)}</AvatarFallback>
                    </Avatar>
                </div>
                 {/* Use grid for better alignment */}
                 <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                    <Label className="text-right text-muted-foreground">ID:</Label>
                    <span className="col-span-2">{selectedNurse.id}</span>

                    <Label className="text-right text-muted-foreground">Tên:</Label>
                    <span className="col-span-2 font-medium">{selectedNurse.name}</span>

                    <Label className="text-right text-muted-foreground">Email:</Label>
                    <span className="col-span-2">{selectedNurse.email}</span>

                    <Label className="text-right text-muted-foreground">Trạng thái:</Label>
                    <div className="col-span-2"><Badge variant={getStatusVariant(selectedNurse.status)}>{selectedNurse.status || 'N/A'}</Badge></div>

                    <Label className="text-right text-muted-foreground">Ngày sinh:</Label>
                    <span className="col-span-2">{selectedNurse.dob || 'N/A'}</span>

                     <Label className="text-right text-muted-foreground">Giới tính:</Label>
                    <span className="col-span-2">{selectedNurse.gender || 'N/A'}</span>

                    <Label className="text-right text-muted-foreground">CCCD:</Label>
                    <span className="col-span-2">{selectedNurse.citizen_id || 'N/A'}</span>

                    <Label className="text-right text-muted-foreground">Địa chỉ:</Label>
                    <span className="col-span-2">
                        {`${selectedNurse.address || ''}, ${selectedNurse.ward || ''}, ${selectedNurse.district || ''}, ${selectedNurse.city || ''}`.replace(/ ,/g, '').replace(/^, /,'').trim() || 'N/A'}
                    </span>

                     <Label className="text-right text-muted-foreground">Chuyên môn:</Label>
                    <span className="col-span-2">{selectedNurse.major || 'N/A'}</span>

                     <Label className="text-right text-muted-foreground">Slogan:</Label>
                    <span className="col-span-2 italic">{selectedNurse.slogan || 'N/A'}</span>
                 </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
             {/* Optional: Add Edit button here too */}
             {/* <Button onClick={() => { setIsDetailModalOpen(false); handleEditClick(new MouseEvent('click'), selectedNurse!); }}>Chỉnh sửa</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Nurse Modal/Sheet */}
      {/* Consider using Sheet for long forms: npx shadcn-ui@latest add sheet */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
         {/* Using Dialog for now, replace with Sheet if EditNurseForm is complex */}
        <DialogContent className="sm:max-w-2xl"> {/* Wider for forms */}
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Điều dưỡng</DialogTitle>
             <DialogDescription>Cập nhật thông tin cho {selectedNurse?.name}.</DialogDescription>
          </DialogHeader>
          {selectedNurse && (
            <EditNurseForm
              nurse={selectedNurse}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveEdit} // Use the new handler
            />
          )}
           {/* Footer might be handled inside EditNurseForm */}
        </DialogContent>
      </Dialog>
    </div>
  );
}