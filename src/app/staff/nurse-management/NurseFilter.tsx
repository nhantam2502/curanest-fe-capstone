"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, X } from "lucide-react";

// Define the filter type more explicitly if possible
interface NurseFilterValues {
    major: string;
    status: string;
    gender: string;
    search: string;
}

interface FilterProps {
  currentFilters?: Partial<NurseFilterValues>;
  onFilterChange: (filters: Partial<NurseFilterValues>) => void;
  onReset: () => void;
  isLoading?: boolean; // Keep optional loading state
}

const initialFilters: NurseFilterValues = {
    major: "",
    status: "",
    gender: "",
    search: "",
};

export default function RenovatedNurseFilterImmediate({
  onFilterChange,
  onReset,
  currentFilters,
  isLoading = false,
}: FilterProps) {
  const [filters, setFilters] = useState<NurseFilterValues>(() => ({
    ...initialFilters,
    ...(currentFilters || {}),
  }));

  // Update local state if filters change externally
  useEffect(() => {
    setFilters((prev) => ({
      ...initialFilters,
      ...(currentFilters || {}),
    }));
  }, [currentFilters]);

  // --- Generic handler to update state AND call parent filter function ---
  const handleChange = (
    key: keyof NurseFilterValues,
    value: string | React.ChangeEvent<HTMLInputElement> // Accept event or direct value
  ) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    // Use empty string "" for "all" option from Select
    const actualValue = newValue === "all" ? "" : newValue;

    setFilters((prev) => {
      const newFilters = { ...prev, [key]: actualValue };

      // Prepare active filters to send to parent
      const activeFilters: Partial<NurseFilterValues> = {};
      if (newFilters.major) activeFilters.major = newFilters.major;
      if (newFilters.status) activeFilters.status = newFilters.status;
      if (newFilters.gender) activeFilters.gender = newFilters.gender;
      if (newFilters.search?.trim()) activeFilters.search = newFilters.search.trim();

      onFilterChange(activeFilters); // Call parent immediately
      return newFilters;
    });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onReset();
    onFilterChange({});
  };


  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {/* Major Select */}
          <div className="grid gap-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-1"
                name="search-1"
                type="search"
                placeholder="Tìm theo chuyên môn"
                // value={filters.search}
                // // Directly use handleChange for Input onChange
                // onChange={(e) => handleChange("search", e)}
                className="h-9 pl-8"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Gender Select */}
          <div className="grid gap-1">
            <Select
              value={filters.gender || "all"}
              onValueChange={(value) => handleChange("gender", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="gender" className="h-9"><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giới tính</SelectItem>
                <SelectItem value="Male">Nam (Male)</SelectItem>
                <SelectItem value="Female">Nữ (Female)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="grid gap-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                name="search"
                type="search"
                placeholder="Tìm tên, email"
                value={filters.search}
                // Directly use handleChange for Input onChange
                onChange={(e) => handleChange("search", e)}
                className="h-9 pl-8"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 pb-3">

        <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
        {/* No explicit search button needed in this option */}
      </CardFooter>
    </Card>
  );
}