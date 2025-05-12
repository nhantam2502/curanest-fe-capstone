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
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { GetAllNurse } from "@/types/nurse";
import { useRouter } from "next/navigation";
import { useNurse } from "@/app/context/NurseContext";
import { StarRating } from "./components/StarRatings"; 
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortDirection = "asc" | "desc";
interface NurseTableProps {
  nurses: GetAllNurse[];
  currentPage: number;
  totalPages: number;
  totalNurses: number;
  onPageChange: (page: number) => void;
  sortColumn: keyof GetAllNurse | "";
  sortDirection: SortDirection;
  onSort: (column: keyof GetAllNurse | "") => void;
}

export default function RenovatedNurseTable({
  nurses,
  currentPage,
  totalPages,
  onPageChange,
  sortColumn,
  sortDirection,
  onSort,
}: NurseTableProps) {
  const router = useRouter();
  // const { setSelectedNurse } = useNurse();
  const handleRowClick = (nurseId: string) => {
    router.push(`/admin/nurse/${nurseId}`);
  };

  // const handleAssignServiceClick = (
  //   event: React.MouseEvent,
  //   nurse: GetAllNurse
  // ) => {
  //   event.stopPropagation();
  //   setSelectedNurse(nurse);
  //   console.log("Trigger delete/action for:", nurse["nurse-name"]);
  //   // Add actual delete/action logic here
  // };

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
    <TooltipProvider delayDuration={100}>
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-start justify-between p-3 pr-4">
          <div></div>
          <div>
            <Link href="/admin/nurse/create-nurse">
              <Button className="bg-emerald-400 hover:bg-emerald-400/90">Thêm Điều dưỡng</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border m-4 mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Apply header styles */}
                  <TableHead className="w-[100px] hidden sm:table-cell pl-4 font-semibold text-lg">
                    Avatar
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg" // Applied styles
                    onClick={() => onSort("nurse-name")}
                  >
                    <div className="flex items-center">
                      Tên Điều dưỡng
                      {getSortIcon("nurse-name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg" // Applied styles
                    // Add onClick={() => onSort('gender')} if you want to make it sortable
                  >
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
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors font-semibold text-lg"
                    // Add onClick={() => onSort('rate')} if you want to make it sortable
                  >
                    <div className="flex items-center">Đánh giá</div>
                  </TableHead>
                  <TableHead className="text-right w-[100px] pr-4 font-semibold text-lg">
                    {" "}
                    {/* Applied styles, adjusted width */}
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nurses.length > 0 ? (
                  nurses.map((nurse) => (
                    <Tooltip key={nurse["nurse-id"]} >
                      <TooltipTrigger asChild>
                        <TableRow
                          key={nurse["nurse-id"]}
                          onClick={() => handleRowClick(nurse["nurse-id"])}
                          className="cursor-pointer hover:bg-muted/50"
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
                            {" "}
                            {/* Applied text-lg */}
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
                            {" "}
                            {/* Applied text-lg, kept muted */}
                            {nurse["current-work-place"] || (
                              <span className="italic">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="">
                            <StarRating rating={nurse.rate} size={20} />{" "}
                            {/* Slightly larger stars */}
                          </TableCell>
                          <TableCell className="text-right space-x-1 pr-4">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              aria-label="Edit"
                            >
                              {" "}
                              <Pencil className="h-4 w-4 text-blue-600" />{" "}
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="center"className="bg-white text-black">
                        <p>
                          Bấm để xem chi tiết
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6} // Ensure this matches the number of columns
                      className="py-12 text-center" // Increased padding, kept center align
                    >
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
        {/* Footer remains mostly the same, ensure text size is legible */}
        <CardFooter className="flex items-center justify-between gap-4 px-6 py-3 border-t">
          {totalPages > 1 ? (
            <div className="flex items-center justify-end w-full">
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label="Go to previous page"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Trước</span>
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  {" "}
                  {/* Kept text-sm for pagination */}
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-1"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  aria-label="Go to next page"
                  size="sm"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full"></div> // Placeholder to maintain layout if pagination is hidden
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
