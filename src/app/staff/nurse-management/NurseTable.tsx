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
  // CardDescription, // Removed if not used
  CardFooter,
  CardHeader,
  // CardTitle, // Removed if not used
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { GetAllNurse } from "@/types/nurse";
// import { useRouter } from "next/navigation"; // Removed useRouter
// import { useNurse } from "@/app/context/NurseContext"; // Removed useNurse
import Link from "next/link";
import { StarRating } from "@/app/admin/nurse/components/StarRatings"; // Assuming StarRating component exists

type SortDirection = "asc" | "desc";
interface NurseTableProps {
  nurses: GetAllNurse[];
  currentPage: number;
  totalPages: number;
  totalNurses: number; // Keep if needed for display, otherwise can be removed
  onPageChange: (page: number) => void;
  sortColumn: keyof GetAllNurse | "";
  sortDirection: SortDirection;
  onSort: (column: keyof GetAllNurse | "") => void;
  // Add props for delete/edit actions if needed, e.g.:
  // onDelete?: (nurseId: string) => void;
  // onEdit?: (nurseId: string) => void;
}

export default function RenovatedNurseTable({
  nurses,
  currentPage,
  totalPages,
  onPageChange,
  sortColumn,
  sortDirection,
  onSort,
}: // onDelete, // Example prop
// onEdit, // Example prop
NurseTableProps) {
  // Removed router and useNurse context usage

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

  const getSortIcon = (column: keyof GetAllNurse | "") => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between p-3 pr-4">
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border m-4 mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] hidden sm:table-cell pl-4 font-semibold text-lg">
                  Avatar
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg"
                  onClick={() => onSort("nurse-name")}
                >
                  <div className="flex items-center">
                    Tên Điều dưỡng
                    {getSortIcon("nurse-name")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg">
                  <div className="flex items-center">Giới tính</div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg"
                  onClick={() => onSort("current-work-place")}
                >
                  <div className="flex items-center">
                    Nơi làm việc
                    {getSortIcon("current-work-place")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg">
                  <div className="flex items-center">Đánh giá</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nurses.length > 0 ? (
                nurses.map((nurse) => (
                  <TableRow
                    key={nurse["nurse-id"]}
                    // Removed onClick row navigation
                    className="hover:bg-muted/50" // Removed cursor-pointer as row click is removed
                  >
                    <TableCell className="hidden sm:table-cell pl-4">
                      <Avatar className="h-11 w-11">
                        <AvatarImage
                          src={nurse["nurse-picture"] || undefined}
                          alt={nurse["nurse-name"] || "Avatar"}
                        />
                        <AvatarFallback>
                          {getInitials(nurse["nurse-name"])}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-lg">
                      {nurse["nurse-name"] || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-lg">
                      {typeof nurse.gender === "boolean" ? (
                        nurse.gender ? (
                          "Nam"
                        ) : (
                          "Nữ"
                        )
                      ) : (
                        <span className="italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-lg">
                      {nurse["current-work-place"] || (
                        <span className="italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StarRating rating={nurse.rate} size={20} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <p className="text-gray-600 text-lg">
                      Không có dữ liệu điều dưỡng.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 px-6 py-3 border-t">
        {/* Optional: Display total count */}
        {/* <div className="text-sm text-muted-foreground">
             Tổng cộng {totalNurses} điều dưỡng
         </div> */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full"></div>
        )}
      </CardFooter>
    </Card>
  );
}