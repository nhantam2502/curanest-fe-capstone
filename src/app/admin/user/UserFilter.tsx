"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface FiltersState {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ActiveUserFilters {
  "full-name"?: string;
  email?: string;
  "phone-number"?: string;
}

interface UserFilterProps {
  onSearch: (filters: ActiveUserFilters) => void;
  onReset: () => void; 
  isLoading?: boolean;
}

const initialFilters: FiltersState = {
  fullName: "",
  email: "",
  phoneNumber: "",
};

export default function UserFilter({ // Renamed component for clarity if desired
  onSearch,
  onReset,
  isLoading = false, // Default isLoading to false
}: UserFilterProps) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Build the filter object with API-expected keys, only including non-empty, trimmed values
    const activeFilters: ActiveUserFilters = {};
    if (filters.fullName.trim())
      activeFilters["full-name"] = filters.fullName.trim();
    if (filters.email.trim()) activeFilters.email = filters.email.trim();
    if (filters.phoneNumber.trim())
      activeFilters["phone-number"] = filters.phoneNumber.trim();
    if (Object.keys(activeFilters).length > 0) {
      onSearch(activeFilters);
    } else {
      // If no filters are active after trimming, treat it as a reset
      onReset();
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onReset(); 
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Filter by Full Name */}
          <div className="grid gap-1">
            <Input
              id="filter-name"
              name="fullName"
              type="text"
              placeholder="Tìm theo tên..." 
              value={filters.fullName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading}
            />
          </div>

          {/* Filter by Email */}
          <div className="grid gap-1">
            <Input
              id="filter-email"
              name="email" 
              type="email"
              placeholder="Tìm theo email..."
              value={filters.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading} 
            />
          </div>

          <div className="grid gap-1">
            <Input
              id="filter-phone"
              name="phoneNumber" 
              type="tel"
              placeholder="Tìm theo SĐT..."
              value={filters.phoneNumber}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 pb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading} 
        >
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>

        <Button
          size="sm"
          onClick={handleSearch}
          disabled={isLoading} 
        >
          {isLoading ? (
            <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full mr-1"></span>
          ) : (
            <Search className="h-4 w-4 mr-1" />
          )}
          {isLoading ? "Đang tìm..." : "Tìm"}
        </Button>
      </CardFooter>
    </Card>
  );
}