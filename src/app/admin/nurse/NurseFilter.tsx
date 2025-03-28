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
import { Search, X } from "lucide-react"; // Added X icon
import { GetAllNurseFilter } from "@/types/nurse";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card
import { Label } from "@/components/ui/label"; // Import Label

interface NurseFilterProps {
  onSearch: (filters: GetAllNurseFilter) => void;
  onReset: () => void;
  isLoading?: boolean; // Optional loading state from parent
}

// Define initial state outside component if static
const initialFilters: GetAllNurseFilter = {
  "nurse-name": "",
  "service-id": "", // Assuming service-id is searched via text input for now
  rate: "", // Use empty string for "All"
};

export default function RenovatedNurseFilter({
  onSearch,
  onReset,
  isLoading = false, // Default isLoading to false
}: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>(initialFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof GetAllNurseFilter, value: string) => {
     // Handle the "All" case specifically by setting to empty string
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleSearch = () => {
     // Filter out empty strings before sending if needed by API
     const activeFilters: Partial<GetAllNurseFilter> = {};
     if (filters["nurse-name"]?.trim()) activeFilters["nurse-name"] = filters["nurse-name"].trim();
     if (filters["service-id"]?.trim()) activeFilters["service-id"] = filters["service-id"].trim(); // Assuming service ID is string
     if (filters.rate) activeFilters.rate = filters.rate;

    onSearch(activeFilters as GetAllNurseFilter); // Pass potentially partial filters
  };

  const handleReset = () => {
    setFilters(initialFilters); // Reset state to initial values
    onReset(); // Call parent reset function
  };

   // Allow searching on Enter key press in text inputs
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        {/* Use grid for layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Filter by Name */}
          <div className="grid gap-1">
            <Input
              id="nurse-name"
              name="nurse-name" // Use name attribute for handleInputChange
              type="text"
              placeholder="Tìm theo tên..."
              value={filters["nurse-name"]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Input
              id="service-id"
              name="service-id"
              type="text"
              placeholder="Tìm theo mã dịch vụ..."
              value={filters["service-id"]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Select
              value={filters.rate || "all"} // Use "all" for empty string value
              onValueChange={(value) => handleSelectChange('rate', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="rate" className="h-9">
                <SelectValue placeholder="Chọn mức đánh giá" />
              </SelectTrigger>
              <SelectContent>
                {/* Use "all" value mapped to empty string */}
                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao trở lên</SelectItem>
                <SelectItem value="3">3 sao trở lên</SelectItem>
                <SelectItem value="2">2 sao trở lên</SelectItem>
                <SelectItem value="1">1 sao trở lên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 pb-3">
        <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
        <Button size="sm" onClick={handleSearch} disabled={isLoading}>
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