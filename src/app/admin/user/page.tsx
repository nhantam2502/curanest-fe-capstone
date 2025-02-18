"use client";
import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import { RelativesFilter } from "@/types/relatives";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";

function Page() {
  const [, setUsers] = useState<RelativesFilter[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RelativesFilter[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: {},
          paging: { page: 1, size: 10, total: 0 },
        });
        setUsers(response.payload.data || []);
        setFilteredUsers(response.payload || []); // Default state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <main className="p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Thống kê người dùng</h1>
      </div>
      <UserFilter setFilteredUsers={setFilteredUsers} />
      <UserTable users={filteredUsers} />
    </main>
  );
}

export default Page;
