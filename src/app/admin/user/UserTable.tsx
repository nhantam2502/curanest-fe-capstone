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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const ITEMS_PER_PAGE = 10;

export default function UserTable({ users, setUsers }: UserTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Table className="w-full border border-gray-200">
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="w-[80px] px-4 py-2">ID</TableHead>
              <TableHead className="px-4 py-2">Name</TableHead>
              <TableHead className="px-4 py-2">Email</TableHead>
              <TableHead className="w-[150px] px-4 py-2">Role</TableHead>
              <TableHead className="text-right w-[250px] px-4 py-2">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <TableCell className="font-medium px-4 py-2">
                  {user.id}
                </TableCell>
                <TableCell className="px-4 py-2">{user.name}</TableCell>
                <TableCell className="px-4 py-2">{user.email}</TableCell>
                <TableCell className="px-4 py-2">{user.role}</TableCell>
                <TableCell className="text-right px-4 py-2 space-x-2 flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRowClick(user)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Inactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog Content for User Details */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedUser && (
              <>
                <div>
                  <span className="font-medium">Name: </span>
                  {selectedUser.name}
                </div>
                <div>
                  <span className="font-medium">Email: </span>
                  {selectedUser.email}
                </div>
                <div>
                  <span className="font-medium">Role: </span>
                  {selectedUser.role}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit information for {editUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {editUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editUser) {
                  handleUpdateUser(editUser);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
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
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}