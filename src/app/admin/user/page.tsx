"use client";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
// Import the refactored filter component and its filter type

import UserTable from "./UserTable";
import { RelativesFilter as UserType } from "@/types/relatives"; // Renamed for clarity
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import UserFilter, { ActiveUserFilters } from "./UserFilter";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SortDirection = "asc" | "desc";

function Page() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveUserFilters>({});

  const [sortColumn, setSortColumn] = useState<keyof UserType | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { toast } = useToast();

  const fetchUsers = useCallback(
    async (filters: ActiveUserFilters = {}) => {
      setIsLoading(true);
      const finalFilters = {
        ...filters,
        role: "relatives",
      };
      console.log("Fetching with filters:", finalFilters);
      try {
        const response = await relativesApiRequest.getRelativesFilter({
          filter: finalFilters,
          paging: { page: 1, size: 50, total: 0 },
        });
        if (response.status === 200) {
          const fetchedData = response.payload.data || [];
          setUsers(fetchedData);
          if (Object.keys(filters).length > 0 && fetchedData.length === 0) {
            toast({
              title: "Không tìm thấy",
              description: "Không có người thân nào khớp với bộ lọc.",
            });
          }
        } else {
          toast({
            title: "Lỗi tải dữ liệu",
            description:
              response.payload?.message ||
              "Không thể tải danh sách người thân.",
            variant: "destructive",
          });
          setUsers([]); // Clear users on error
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: error.message || "Đã xảy ra lỗi mạng hoặc hệ thống.",
          variant: "destructive",
        });
        setUsers([]); // Clear users on error
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (filters: ActiveUserFilters) => {
    setActiveFilters(filters); // Store the applied filters
    fetchUsers(filters); // Fetch data with the new filters (will be merged with role)
  };

  // Called by RenovatedUserFilter when the reset button is clicked
  const handleReset = () => {
    setActiveFilters({}); // Clear applied filters
    fetchUsers({}); // Fetch data with only the hardcoded role filter
    toast({
      title: "Đã xóa bộ lọc",
      description: "Hiển thị lại tất cả người thân.",
    });
  };

  // --- Sorting Logic ---
  const handleSort = (column: keyof UserType | "") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    // Note: Sorting happens client-side *after* fetching based on the current `users` state
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn] ?? "";
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

  return (
    <div className="rounded-md h-full">
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Quản lý tài khoản người thân
          </CardTitle>
          <CardDescription>
            Quản lý tài khoản người thân của bệnh nhân.
          </CardDescription>
        </CardHeader>
      </Card>
      {/* Use the refactored filter component */}
      <UserFilter
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />
      <UserTable
        users={sortedUsers}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}

export default Page;
