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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight, // Keep UserPlus if you add the button back
} from "lucide-react";
import { RelativesFilter } from "@/types/relatives";
import { Switch } from "@/components/ui/switch";

type SortDirection = "asc" | "desc";
interface UserTableProps {
  users: RelativesFilter[] | undefined;
  sortColumn: keyof RelativesFilter | "";
  sortDirection: SortDirection;
  onSort: (column: keyof RelativesFilter | "") => void;
}

const ITEMS_PER_PAGE = 5;

export default function UserTable({
  users = [],
  sortColumn,
  sortDirection,
  onSort,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    if (!searchTerm) return users;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user["full-name"]?.toLowerCase().includes(lowerCaseSearch) ||
        user.email?.toLowerCase().includes(lowerCaseSearch) ||
        user["phone-number"]?.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && filteredUsers.length === 0) {
      // Ensure reset only when truly empty
      setCurrentPage(1);
    }
    // Reset to 1 only if current page becomes invalid OR if the list becomes empty
    else if (currentPage > 1 && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage !== 1 && totalPages === 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredUsers.length]); // Add filteredUsers.length dependency

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages || 1)); // Handle totalPages being 0
    setCurrentPage(newPage);
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    const nameParts = name.trim().split(/\s+/); // Use regex for multiple spaces
    if (
      nameParts.length > 1 &&
      nameParts[0].length > 0 &&
      nameParts[nameParts.length - 1].length > 0
    ) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0][0].toUpperCase();
    }
    return "?";
  };

  const getSortIcon = (column: keyof RelativesFilter | "") => {
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
        {/* Optional: Add Search Input Here */}
        {/* <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm tên, email, SĐT..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div> */}
        {/* Optional: Add User Button Here if needed
         <Button size="sm" className="ml-auto gap-1">
            <UserPlus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Thêm người thân
            </span>
          </Button>
        */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border m-4 mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                {/* --- Applied Styles to Headers --- */}
                <TableHead className="w-[100px] hidden sm:table-cell font-semibold text-lg pl-4">
                  Avatar
                </TableHead>
                <TableHead
                  className="font-semibold text-lg"
                  onClick={() => onSort("full-name")}
                >
                  <div className="flex items-center">
                    Tên
                    {getSortIcon("full-name")}
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell font-semibold text-lg"
                  onClick={() => onSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold text-lg"
                  onClick={() => onSort("phone-number")}
                >
                  <div className="flex items-center">
                    Số điện thoại
                    {getSortIcon("phone-number")}
                  </div>
                </TableHead>
                {/* <TableHead className="text-right w-[120px] font-semibold text-lg pr-4">
                  Trạng thái
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    {/* --- Applied Styles to Cells --- */}
                    <TableCell className="hidden sm:table-cell py-2 pl-4">
                      {" "}
                      {/* Reduced padding py-2, added pl-4 */}
                      <Avatar className="h-10 w-10">
                        {" "}
                        {/* Slightly adjusted size */}
                        <AvatarImage
                          src={user.avatar || undefined}
                          alt={user["full-name"] || "Avatar"}
                        />
                        <AvatarFallback>
                          {getInitials(user["full-name"])}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-lg py-2">
                      {" "}
                      {/* Applied text-lg, py-2 */}
                      {user["full-name"] || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-lg py-2">
                      {" "}
                      {/* Applied text-lg, py-2 */}
                      {user.email || <span className="italic">N/A</span>}
                    </TableCell>
                    <TableCell className="text-lg py-2">
                      {" "}
                      {/* Applied text-lg, py-2 */}
                      {user["phone-number"] || (
                        <span className="text-muted-foreground italic">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    {/* <TableCell className="text-right py-2 pr-4">
                      <Switch />
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5} // Adjusted colSpan
                    // --- Applied Styles to No Data Row ---
                    className="text-center text-lg text-muted-foreground py-8" // Reduced padding py-8, text-lg
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

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t">
        {" "}
        {/* Reduced padding, added border */}
        <div className="text-sm text-muted-foreground">
          {" "}
          {/* Increased size slightly */}
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
            <>0 kết quả</> // Simplified message
          )}
        </div>
        {/* Show pagination controls even if only 1 page, but disable buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm" // Keep sm for pagination buttons
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1" // Specific size for icon vs text
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Trước</span>
          </Button>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap px-2">
            Trang {filteredUsers.length > 0 ? currentPage : 0} /{" "}
            {totalPages > 0 ? totalPages : 0}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4 sm:ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
