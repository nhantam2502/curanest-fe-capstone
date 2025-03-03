"use client"

import NurseTable from "@/app/admin/nurse/NurseTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NurseFilter from "./NurseFilter";
import { useEffect, useState } from "react";
import { RelativesFilter } from "@/types/relatives";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";

export default function NurseManagementPage() {
  const [users, setUsers] = useState<RelativesFilter[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RelativesFilter[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: {role: "nurse"},
          paging: { page: 1, size: 10, total: 0 },
        });
        setUsers(response.payload.data || []);
        setFilteredUsers(response.payload.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const resetUsers = () => {
    setFilteredUsers(users); // Reset filtered users to the original list
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quản lý điều dưỡng</h1>
        <div className="flex space-x-4">
          <Link href="/admin/nurse/create-nurse">
            <Button className="mb-4"> Thêm</Button>
          </Link>
        </div>
      </div>
      <NurseFilter setFilteredUsers={setFilteredUsers} resetUsers={resetUsers} />
      <NurseTable users={filteredUsers} />
    </div>
  );
}
