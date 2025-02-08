"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { RelativesFilter } from "@/types/relatives";
import Image from "next/image";

interface UserTableProps {
  users: RelativesFilter[] | undefined; // Ensure users can be undefined
}

const ITEMS_PER_PAGE = 5;

export default function UserTable({ users }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState<RelativesFilter[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!Array.isArray(users)) return; // Prevent errors if users is undefined
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedUsers(users.slice(startIndex, endIndex));
  }, [users, currentPage]);

  const totalPages = Array.isArray(users) ? Math.ceil(users.length / ITEMS_PER_PAGE) : 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (id: number | undefined) => {
    router.push(`/admin/user/${id}`);
  };

  return (
    <div className="w-full">
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-4 py-2">Tên</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">SĐT</TableHead>
            <TableHead className="px-4 py-2">Avatar</TableHead>
            <TableHead className="px-4 py-2">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2">{user["full-name"]}</TableCell>
              <TableCell className="px-4 py-2">{user.email}</TableCell>
              <TableCell className="px-4 py-2">{user["phone-number"]}</TableCell>
              <TableCell className="px-4 py-2 ">
                <Image
                  width={48}
                  height={48}
                  src={user.avatar || "/default-avatar.png"} // Default avatar if none provided
                  alt="Avatar"
                  className="rounded-full object-cover border"
                />
              </TableCell>
              <TableCell className="py-2 px-4 space-x-2 flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(user.id)}
                >
                  Chi tiết
                </Button>
                <Switch />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
