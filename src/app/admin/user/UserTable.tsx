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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";


interface UserTableProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const ITEMS_PER_PAGE = 10;

export default function UserTable({ users }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (id: number) => {
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
            <TableHead className="px-4 py-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="px-4 py-2">{user.email}</TableCell>
              <TableCell className="px-4 py-2">{user.phone_number}</TableCell>
              <TableCell className=" py-2 space-x-2 flex">
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
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className="mx-1"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
