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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Bộ lọc Điều dưỡng</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Major Select */}
          <div className="grid gap-1">
            <Label htmlFor="major" className="text-sm">Chuyên môn</Label>
            <Select
              value={filters.major || "all"}
              onValueChange={(value) => handleChange("major", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="major" className="h-9"><SelectValue placeholder="Chọn chuyên môn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên môn</SelectItem>
                <SelectItem value="Cardiology">Tim mạch (Cardiology)</SelectItem>
                <SelectItem value="Neurology">Thần kinh (Neurology)</SelectItem>
                <SelectItem value="Pediatrics">Nhi khoa (Pediatrics)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="grid gap-1">
            <Label htmlFor="status" className="text-sm">Trạng thái</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="status" className="h-9"><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Hoạt động (Active)</SelectItem>
                <SelectItem value="Inactive">Không hoạt động (Inactive)</SelectItem>
                <SelectItem value="On Leave">Nghỉ phép (On Leave)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender Select */}
          <div className="grid gap-1">
            <Label htmlFor="gender" className="text-sm">Giới tính</Label>
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
          <div className="grid gap-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Label htmlFor="search" className="text-sm">Tìm kiếm tổng quát</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                name="search"
                type="search"
                placeholder="Tìm tên, email, chuyên môn..."
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
        {/* Reset button is always useful */}
        <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
        {/* No explicit search button needed in this option */}
      </CardFooter>
    </Card>
  );
}