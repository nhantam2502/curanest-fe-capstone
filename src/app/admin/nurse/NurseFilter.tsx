"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

export interface NurseFilterValues {
  "nurse-name": string;
  "service-id": string;
  rate: string;
}

interface NurseFilterProps {
  onSearch: (filters: NurseFilterValues) => void;
  onReset: () => void;
}

export default function NurseFilter({ onSearch, onReset }: NurseFilterProps) {
  const [filters, setFilters] = useState<NurseFilterValues>({
    "nurse-name": "",
    "service-id": "",
    rate: "",
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({ "nurse-name": "", "service-id": "", rate: "" });
    onReset();
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Tìm theo tên điều dưỡng"
          value={filters["nurse-name"]}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, "nurse-name": e.target.value }))
          }
        />
        <Input
          type="text"
          placeholder="Tìm theo dịch vụ"
          value={filters["service-id"]}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, "service-id": e.target.value }))
          }
        />
        <Input
          type="text"
          placeholder="Tìm theo rate"
          value={filters.rate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, rate: e.target.value }))
          }
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Tìm
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Xoá bộ lọc
        </Button>
      </div>
    </div>
  );
}
