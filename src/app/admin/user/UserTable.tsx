"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image"; // Keep for Avatar, but use Shadcn Avatar component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  UserPlus, // Icon for Add User
} from "lucide-react";
import { RelativesFilter } from "@/types/relatives"; // Assuming this type is correct

interface UserTableProps {
  users: RelativesFilter[] | undefined;
  // Add callbacks for actions if needed, e.g.:
  // onAddUser: () => void;
  // onViewUser: (userId: string) => void;
  // onEditUser: (userId: string) => void;
  // onDeleteUser: (userId: string) => void;
}

const ITEMS_PER_PAGE = 6; // Adjust as needed

export default function UserTable({ users = [] }: UserTableProps) {
  // Default to empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered users for performance
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    if (!searchTerm) return users;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user["full-name"]?.toLowerCase().includes(lowerCaseSearch) ||
        user.email?.toLowerCase().includes(lowerCaseSearch) ||
        user["phone-number"]?.includes(searchTerm) // Phone numbers might not need lowercasing
    );
  }, [users, searchTerm]);

  // Recalculate pagination based on filtered users
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Reset page number if filters change and current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); // Go to last valid page
    } else if (totalPages === 0) {
      setCurrentPage(1); // Reset to 1 if no results
    }
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages)); // Ensure page is within bounds
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // setCurrentPage(1); // Optionally reset to page 1 on new search
  };

  // Helper to get initials for Avatar Fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0][0].toUpperCase();
    }
    return "?";
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Quản lý Người thân</CardTitle>
          <CardDescription>
            Xem, tìm kiếm và quản lý danh sách người thân.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            {/* TableHeader */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">
                  Avatar
                </TableHead>
                <TableHead>Tên</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead className="text-right w-[100px]">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            {/* TableBody */}
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  // ... TableRow rendering ...
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.avatar || undefined}
                          alt={user["full-name"] || "Avatar"}
                        />
                        <AvatarFallback>
                          {getInitials(user["full-name"])}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user["full-name"] || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {user.email || <span className="italic">N/A</span>}
                    </TableCell>
                    <TableCell>
                      {user["phone-number"] || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => console.log("View:", user.id)}
                          >
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => console.log("Edit:", user.id)}
                          >
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => console.log("Delete:", user.id)}
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // ... No results TableRow ...
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchTerm
                      ? "Không tìm thấy người thân nào khớp với tìm kiếm."
                      : "Không có dữ liệu người thân."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* --- Updated CardFooter --- */}
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {" "}
        {/* Added pt-4 for spacing */}
        <div className="text-xs text-muted-foreground">
          {/* Handle the case where filteredUsers is empty */}
          {filteredUsers.length > 0 ? (
            <>
              Hiển thị <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong>
              -
              <strong>
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </strong>{" "}
              trên <strong>{filteredUsers.length}</strong> người thân
            </>
          ) : (
            <>Không có kết quả nào</>
          )}
        </div>
        {/* REMOVED the totalPages > 1 condition wrapper */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            // Disable if on page 1 OR if there are no pages at all
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </Button>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {/* Show 0 or 1 correctly when totalPages is 0 */}
            Trang {filteredUsers.length > 0 ? currentPage : 0} /{" "}
            {totalPages > 0 ? totalPages : 0}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            // Disable if on last page OR if there are no pages at all
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
