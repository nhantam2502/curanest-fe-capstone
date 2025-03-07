"use client";

import React, { useEffect, useState, useCallback } from "react";
import NurseTable from "@/app/admin/nurse/NurseTable";
import NurseFilter, { NurseFilterValues } from "./NurseFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { useToast } from "@/hooks/use-toast";
import { GetAllNurse } from "@/types/nurse";

export default function NurseManagementPage() {
  const { toast } = useToast();
  const [nurses, setNurses] = useState<GetAllNurse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<NurseFilterValues>({
    "nurse-name": "",
    "service-id": "",
    rate: "",
  });
  const itemsPerPage = 10; // adjust as needed

  const fetchNurses = useCallback(async () => {
    try {
      // Build the filter object for your API call. Here, we assume your API expects a shape like:
      // { filter: { "nurse-name": string, "service-id": string, rate: string }, paging: { page: number, size: number, total: number } }
      const filter = {
        "nurse-name": filters["nurse-name"],
        "service-id": filters["service-id"],
        rate: filters.rate,
      };
      const paging = {
        page: currentPage,
        size: itemsPerPage,
        total: 0, // total is not used for the request
      };
      const response = await nurseApiRequest.getAllNurse({ filter, paging });
      if (response.status === 200 && response.payload) {
        setNurses(response.payload.data || []);
        // If the API returns the total count, use it. Otherwise, you might compute total pages from the response.
        const total = response.payload.total || (response.payload.data ? response.payload.data.length : 0);
        setTotalPages(Math.ceil(total / itemsPerPage) || 1);
      } else {
        toast({
          title: "Lỗi tải điều dưỡng",
          description: response.payload?.message || "Không thể tải danh sách điều dưỡng.",
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

  const handleSearch = (newFilters: NurseFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ "nurse-name": "", "service-id": "", rate: "" });
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quản lý điều dưỡng</h1>
        <div className="flex space-x-4">
          <Link href="/admin/nurse/create-nurse">
            <Button className="mb-4">Thêm</Button>
          </Link>
        </div>
      </div>
      <NurseFilter onSearch={handleSearch} onReset={resetFilters} />
      <NurseTable
        nurses={nurses}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
