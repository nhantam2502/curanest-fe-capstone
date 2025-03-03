"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";
import { RelativesFilter } from "@/types/relatives";

interface NurseFilterProps {
  setFilteredUsers: (users: RelativesFilter[]) => void;
  resetUsers: () => void;
}


export default function NurseFilter({ setFilteredUsers, resetUsers }: NurseFilterProps) {
  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  
  const role = "nurse";

  const handleSearch = async () => {
    try {
      const response = await relativesApiRequest.getRelativesFilter({
        filter: {
          ...(filters.fullName.trim() && { "full-name": filters.fullName }),
          ...(filters.email.trim() && { email: filters.email }),
          ...(filters.phoneNumber.trim() && {
            "phone-number": filters.phoneNumber,
          }),
          role,
        },
        paging: { page: 1, size: 10, total: 0 },
      });

      setFilteredUsers(response.payload.data || []);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  const clearFilters = () => {
    setFilters({ fullName: "", email: "", phoneNumber: "" });
    resetUsers(); 
  };
  

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Tìm theo tên"
          value={filters.fullName}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fullName: e.target.value }))
          }
        />
        <Input
          type="text"
          placeholder="Tìm theo email"
          value={filters.email}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          type="text"
          placeholder="Tìm theo số điện thoại"
          value={filters.phoneNumber}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))
          }
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Tìm
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          Xoá bộ lọc
        </Button>
      </div>
    </div>
  );
}
