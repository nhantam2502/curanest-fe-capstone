"use client";

import React, { useCallback, useEffect, useState } from "react";

import NurseFilter from "./NurseFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { useToast } from "@/hooks/use-toast";
import { GetAllNurse, GetAllNurseFilter } from "@/types/nurse";
import RenovatedNurseTable from "./NurseTable";
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
  const itemsPerPage = 5; // adjust as needed

  const fetchNurses = useCallback(async () => {
    try {
      const filter = {
        "nurse-name": filters["nurse-name"],
        "service-id": filters["service-id"],
        rate: filters.rate,
      };
      // Subtract 1 from currentPage if API expects 0-indexed pages
      const paging = {
        page: currentPage,
        size: itemsPerPage,
      };
      const response = await nurseApiRequest.getAllNurse({ filter, paging });
      if (response.status === 200 && response.payload) {
        setNurses(response.payload.data || []);
        setTotalPages(response.payload.paging.total || 1);
      } else {
        toast({
          title: "Lỗi tải điều dưỡng",
          description:
            response.payload?.message || "Không thể tải danh sách điều dưỡng.",
          variant: "destructive",
        });
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

  const handleSearch = (newFilters: GetAllNurseFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ "nurse-name": "", "service-id": "", rate: "" });
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
      <Card className="mb-6 bg-gradient-to-r from-emerald-400/10 to-transparent border-l-4 border-emerald-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-500">
            Quản lý điều dưỡng
          </CardTitle>
          <CardDescription>
            Danh sách điều dưỡng hiện đang trong danh mục.
          </CardDescription>
        </CardHeader>
      </Card>
      <NurseFilter onSearch={handleSearch} onReset={resetFilters} />
      <RenovatedNurseTable
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
