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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Editor" },
  { id: 3, name: "Peter Jones", email: "peter.jones@example.com", role: "Viewer" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@example.com", role: "Editor" },
  { id: 5, name: "Michael Brown", email: "michael.brown@example.com", role: "Viewer" },
  { id: 6, name: "Emily Davis", email: "emily.davis@example.com", role: "Admin" },
  { id: 7, name: "David Lee", email: "david.lee@example.com", role: "Editor" },
  { id: 8, name: "Lisa Anderson", email: "lisa.anderson@example.com", role: "Viewer" },
  { id: 9, name: "Robert Taylor", email: "robert.taylor@example.com", role: "Admin" },
  { id: 10, name: "Jennifer White", email: "jennifer.white@example.com", role: "Editor" },
  { id: 11, name: "William Thomas", email: "william.thomas@example.com", role: "Admin" },
  { id: 12, name: "Mary Jackson", email: "mary.jackson@example.com", role: "Editor" },
  { id: 13, name: "James Harris", email: "james.harris@example.com", role: "Viewer" },
  { id: 14, name: "Elizabeth Lewis", email: "elizabeth.lewis@example.com", role: "Admin" },
  { id: 15, name: "Charles Walker", email: "charles.walker@example.com", role: "Editor" },
  { id: 16, name: "Margaret Hall", email: "margaret.hall@example.com", role: "Viewer" },
  { id: 17, name: "Joseph Young", email: "joseph.young@example.com", role: "Admin" },
  { id: 18, name: "Linda King", email: "linda.king@example.com", role: "Editor" },
  { id: 19, name: "Thomas Wright", email: "thomas.wright@example.com", role: "Viewer" },
  { id: 20, name: "Patricia Lopez", email: "patricia.lopez@example.com", role: "Admin" },
];

const ITEMS_PER_PAGE = 10; // Number of users to display per page

export default function UserTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setOpenDialog(true);
  };

  const handleSave = () => {
    // Update the user's role in your data source (e.g., database)
    // ...

    setOpenDialog(false);
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
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow className="hover:bg-gray-50">
            <TableHead className="w-[80px] px-4 py-2">ID</TableHead>
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="w-[150px] px-4 py-2">Role</TableHead>
            <TableHead className="text-right w-[200px] px-4 py-2">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="font-medium px-4 py-2">{user.id}</TableCell>
              <TableCell className="px-4 py-2">{user.name}</TableCell>
              <TableCell className="px-4 py-2">{user.email}</TableCell>
              <TableCell className="px-4 py-2">{user.role}</TableCell>
              <TableCell className="text-right px-4 py-2">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Role</DialogTitle>
                      <DialogDescription>
                        Change the role for {selectedUser?.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select
                        onValueChange={(value) => setSelectedRole(value)}
                        defaultValue={selectedUser?.role}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleSave}>
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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