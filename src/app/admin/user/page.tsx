"use client";
import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import { RelativesFilter } from "@/types/relatives";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";

function Page() {
  const [users, setUsers] = useState<RelativesFilter[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RelativesFilter[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: {role: "relatives"},
          paging: { page: 1, size: 10, total: 0 },
        });
        setUsers(response.payload.data || []);
        setFilteredUsers(response.payload.data || []); // Default state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const resetUsers = () => {
    setFilteredUsers(users); 
  };

  return (
    <main className="p-2 bg-white rounded-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Thống kê người dùng</h1>
      </div>
      <UserFilter 
        setFilteredUsers={setFilteredUsers} 
        resetUsers={resetUsers}
      />
      <UserTable users={filteredUsers} />
    </main>
  );
}

export default Page;
