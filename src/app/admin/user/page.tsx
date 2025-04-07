"use client";
import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import { RelativesFilter } from "@/types/relatives";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";

type SortDirection = "asc" | "desc";

function Page() {
  const [users, setUsers] = useState<RelativesFilter[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RelativesFilter[]>([]);

  const [sortColumn, setSortColumn] = useState<keyof RelativesFilter | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: keyof RelativesFilter | "") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and reset to ascending order
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) return 0; // If no sorting column is selected, return original order

    const valueA = a[sortColumn] ?? ""; // Handle null/undefined
    const valueB = b[sortColumn] ?? "";

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: { role: "relatives" },
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
      <UserFilter setFilteredUsers={setFilteredUsers} resetUsers={resetUsers} />
      <UserTable
        users={sortedUsers}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </main>
  );
}

export default Page;
