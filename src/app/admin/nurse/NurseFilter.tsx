"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search } from "lucide-react";
import { GetAllNurseFilter } from "@/types/nurse";

interface NurseFilterProps {
  onSearch: (filters: GetAllNurseFilter) => void;
  onReset: () => void;
}

export default function NurseFilter({ onSearch, onReset }: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>({
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
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
        
          <Select
            value={filters.rate.toString()}
            onValueChange={(value: string) =>
              setFilters((prev) => ({ ...prev, rate: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tìm theo đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              <SelectItem value="1">1 sao trở lên</SelectItem>
              <SelectItem value="2">2 sao trở lên</SelectItem>
              <SelectItem value="3">3 sao trở lên</SelectItem>
              <SelectItem value="4">4 sao trở lên</SelectItem>
              <SelectItem value="5">5 sao</SelectItem>
            </SelectContent>
          </Select>

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
