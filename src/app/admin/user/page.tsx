"use client";
import React, { useState } from "react";
import UserTable, { User } from "./UserTable";
import users from "@/dummy_data/dummy_user_list.json";
import UserFilter from "./UserFilter";

const initialUsers: User[] = users;

function Page() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);

  return (
    <main className=" p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Thống kê người dùng</h1>
      </div>
      <UserFilter users={users} setFilteredUsers={setFilteredUsers} />
      <UserTable users={filteredUsers} setUsers={setUsers} />
    </main>
  );
}

export default Page;