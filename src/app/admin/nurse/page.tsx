"use client";

import React, { useCallback, useEffect, useState } from "react";
import NurseTable from "@/app/admin/nurse/NurseTable";
import NurseFilter from "./NurseFilter";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { useToast } from "@/hooks/use-toast";
import { GetAllNurse, GetAllNurseFilter } from "@/types/nurse";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SortDirection = "asc" | "desc";

export default function NurseManagementPage() {
  const { toast } = useToast();
  const [nurses, setNurses] = useState<GetAllNurse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<GetAllNurseFilter>({
    "nurse-name": "",
    "service-id": "",
    rate: "",
  });
  const itemsPerPage = 5;

  const fetchNurses = useCallback(async () => {
    try {
      const filterPayload = {
        "nurse-name": filters["nurse-name"],
        "service-id": filters["service-id"],
        rate: filters.rate,
      };
      const paging = {
        page: currentPage,
        size: itemsPerPage,
      };
      const response = await nurseApiRequest.getAllNurse({
        filter: filterPayload,
        paging,
      });

      if (response.status === 200 && response.payload) {
        const receivedNurses = response.payload.data || [];
        const totalPagesFromApi = response.payload.paging.total || 1;

        const hasActiveFilters =
          filters["nurse-name"] !== "" ||
          filters["service-id"] !== "" ||
          filters.rate !== "";

        if (hasActiveFilters && receivedNurses.length === 0) {
          toast({
            title: "Không tìm thấy",
            description: "Không có điều dưỡng nào khớp với bộ lọc.",
          });
        }

        setNurses(receivedNurses);
        setTotalPages(totalPagesFromApi);
      } else {
        toast({
          title: "Lỗi tải điều dưỡng",
          description:
            response.payload?.message || "Không thể tải danh sách điều dưỡng.",
          variant: "destructive",
        });
        // Optionally clear nurses if the fetch failed significantly
        // setNurses([]);
        // setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching nurses:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải danh sách điều dưỡng.",
        variant: "destructive",
      });
    }
  }, [filters, currentPage, itemsPerPage, toast]);

  useEffect(() => {
    fetchNurses();
  }, [fetchNurses]);

  const handleSearch = (newFilters: Partial<GetAllNurseFilter>) => {
    setFilters({
      "nurse-name": newFilters["nurse-name"] ?? filters["nurse-name"],
      "service-id": newFilters["service-id"] ?? filters["service-id"],
      rate: newFilters.rate ?? filters.rate,
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ "nurse-name": "", "service-id": "", rate: "" });
    toast({
      title: "Đã xóa bộ lọc",
      description: "Hiển thị lại tất cả người thân.",
    });
  };
  const [sortColumn, setSortColumn] = useState<keyof GetAllNurse | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: keyof GetAllNurse | "") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and reset to ascending order
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const sortedNurses = [...nurses].sort((a, b) => {
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

  return (
    <div>
      <Card className="mb-4 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Quản lý điều dưỡng
          </CardTitle>
          <CardDescription>
            Danh sách điều dưỡng trong hệ thống.
          </CardDescription>
        </CardHeader>
      </Card>
      <NurseFilter onSearch={handleSearch} onReset={resetFilters} />
      <NurseTable
        nurses={sortedNurses}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totalNurses={0}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}
