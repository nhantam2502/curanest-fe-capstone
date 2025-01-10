"use client";
import React, { useState } from "react";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialUsers: User[] = [
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

function Page() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
    setShowAddForm(false); // Close the form after adding
  };

  return (
    <main className=" p-6 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Thống kê người dùng</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddForm(true)}>Add User</Button>
          </DialogTrigger>
          <AddUserForm
            onSave={handleAddUser}
            onClose={() => setShowAddForm(false)}
            open={showAddForm}
          />
        </Dialog>
      </div>
      <UserTable users={users} setUsers={setUsers} />
    </main>
  );
}

export default Page;