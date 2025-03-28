"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal, Briefcase, Trash2 } from "lucide-react";
import { GetAllNurse } from "@/types/nurse";
import { useRouter } from "next/navigation";
import { useNurse } from "@/app/context/NurseContext";
import { StarRating } from "./components/StarRatings"; // Assuming path

// Define ITEMS_PER_PAGE consistently with the parent component
const ITEMS_PER_PAGE = 10; // Or receive as prop if it can vary

interface NurseTableProps {
  nurses: GetAllNurse[];
  currentPage: number;
  totalPages: number;
  totalNurses: number;
  onPageChange: (page: number) => void;
}

export default function RenovatedNurseTable({
  nurses,
  currentPage,
  totalPages,
  totalNurses,
  onPageChange,
}: NurseTableProps) {
  const router = useRouter();
  const { setSelectedNurse } = useNurse();

  const handleRowClick = (nurseId: string) => {
    router.push(`/admin/nurse/${nurseId}`);
  };

  const handleAssignServiceClick = (
    event: React.MouseEvent,
    nurse: GetAllNurse
  ) => {
    event.stopPropagation();
    setSelectedNurse(nurse);
    console.log("Assign service for:", nurse["nurse-name"]);
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return "N";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0][0].toUpperCase();
    }
    return "N";
  };

  // Calculate start and end item numbers for display
  const startItem = totalNurses > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = totalNurses > 0 ? Math.min(currentPage * ITEMS_PER_PAGE, totalNurses) : 0;

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Quản lý Điều dưỡng</CardTitle>
          <CardDescription>
            Xem và quản lý danh sách điều dưỡng viên.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
               <TableRow>
                <TableHead className="w-[60px] hidden sm:table-cell pl-4">Avatar</TableHead>
                <TableHead>Tên Điều dưỡng</TableHead>
                <TableHead className="w-[100px]">Giới tính</TableHead>
                <TableHead className="hidden md:table-cell">Nơi làm việc</TableHead>
                <TableHead className="w-[120px]">Đánh giá</TableHead>
                <TableHead className="text-right w-[130px] pr-4">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nurses.length > 0 ? (
                nurses.map((nurse) => (
                   <TableRow
                    key={nurse["nurse-id"]}
                    onClick={() => handleRowClick(nurse["nurse-id"])}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                     {/* Table Cells */}
                     <TableCell className="hidden sm:table-cell pl-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={nurse["nurse-picture"] || undefined}
                          alt={nurse["nurse-name"] || "Avatar"}
                        />
                        <AvatarFallback>{getInitials(nurse["nurse-name"])}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {nurse["nurse-name"] || <span className="text-muted-foreground italic">N/A</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {nurse.gender ? "Nam" : "Nữ"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {nurse["current-work-place"] || <span className="italic">N/A</span>}
                    </TableCell>
                    <TableCell>
                      <StarRating rating={nurse.rate} size={16} />
                    </TableCell>
                    <TableCell className="text-right space-x-1 pr-4">
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleAssignServiceClick(e, nurse)}
                        className="h-8 gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Không có dữ liệu điều dưỡng.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-end ">
        {totalPages > 0 && (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0" // Use size="icon" equivalent padding
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1} // Use <= 1 for safety
            >
              <span className="sr-only">Trang trước</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
             <div className="flex w-[100px] items-center justify-center text-xs font-medium">
                Trang {currentPage} / {totalPages}
             </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0" // Use size="icon" equivalent padding
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages} // Use >= for safety
            >
              <span className="sr-only">Trang sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}