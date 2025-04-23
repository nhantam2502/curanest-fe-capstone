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
// Added imports for state management and data fetching
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GetAllNurseFilter } from "@/types/nurse"; // Keep this for the filter type
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import serviceApiRequest from "@/apiRequest/service/apiServices"; // Adjust the path as needed
export interface ServiceItem {
  id: string;
  name: string;
}

export interface FetchedCategory {
  "category-info": {
    id: string;
    name: string;
  };
  "list-services": Array<{
    id: string;
    "category-id": string;
    name: string;
    description: string;
    "est-duration": string;
    status: string;
  }>;
}

interface NurseFilterProps {
  onSearch: (filters: Partial<GetAllNurseFilter>) => void; // Allow partial filters
  onReset: () => void;
  isLoading?: boolean; // Optional loading state from parent
}

// Define initial state outside component
const initialFilters: GetAllNurseFilter = {
  "nurse-name": "",
  "service-id": "", // Will hold the selected service ID, empty string means "All"
  rate: "", // Use empty string for "All" rates
  // Add other potential filters here if needed (e.g., workplace)
  // "current-work-place": "",
};

export default function NurseFilter({
  onSearch,
  onReset,
  isLoading = false, // Default isLoading to false
}: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>(initialFilters);
  // State for the raw fetched service data (nested structure)
  const [rawServiceData, setRawServiceData] = useState<FetchedCategory[]>([]);

  // --- Service Data Fetching ---
  const fetchService = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getListService(""); // Pass necessary params if any
      if (response.status === 200 && response.payload?.data) {
        setRawServiceData(response.payload.data || []);
      } else {
        console.error("Failed to fetch services:", response);
        setRawServiceData([]); // Reset on failure
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setRawServiceData([]); // Reset on error
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]); // Run fetchService on mount

  const allServices = useMemo((): ServiceItem[] => {
    if (!rawServiceData || rawServiceData.length === 0) {
      return [];
    }
    // Flatten the nested structure [{id: '...', name: '...'}, ...]
    return rawServiceData.flatMap(
      (category) =>
        category["list-services"]?.map((service) => ({
          id: service.id,
          name: service.name,
        })) ?? []
    );
  }, [rawServiceData]); 

  // --- Event Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof GetAllNurseFilter, value: string) => {
    // Handle the "all" value specifically by setting to empty string
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleSearch = () => {
    // Build the filter object, only including non-empty values
    const activeFilters: Partial<GetAllNurseFilter> = {};
    if (filters["nurse-name"]?.trim())
      activeFilters["nurse-name"] = filters["nurse-name"].trim();
    // Use the service-id directly if it exists (it's already an ID or empty string)
    if (filters["service-id"])
      activeFilters["service-id"] = filters["service-id"];
    if (filters.rate) activeFilters.rate = filters.rate;
    // Add other filters like workplace if implemented
    // if (filters["current-work-place"]?.trim())
    //   activeFilters["current-work-place"] = filters["current-work-place"].trim();

    console.log("Searching with filters:", activeFilters); // Debugging log
    onSearch(activeFilters); // Pass the active filters object
  };

  const handleReset = () => {
    setFilters(initialFilters); // Reset internal state to initial values
    onReset(); // Call parent reset function
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        {/* Use grid for layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter by Name */}
          <div className="grid gap-1">
            <Input
              id="nurse-name"
              name="nurse-name" // Use name attribute for handleInputChange
              type="text"
              placeholder="Tìm theo tên y tá..."
              value={filters["nurse-name"]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading}
            />
          </div>

          {/* Placeholder for Workplace Filter */}
          <div className="grid gap-1">
            <Input
              // id="current-work-place" // Use relevant id/name if implemented
              // name="current-work-place"
              type="text"
              placeholder="Tìm theo nơi làm việc..."
              // value={filters["current-work-place"]} // Add state if implemented
              // onChange={handleInputChange}
              // onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading} // Disable if parent is loading
            />
          </div>

          {/* Filter by Service ID -> Now a Select */}
          <div className="grid gap-1">
            <Select
              value={filters["service-id"] || "all"}
              onValueChange={(value) => handleSelectChange("service-id", value)}
              disabled={isLoading || allServices.length === 0} // Disable if loading or no services fetched
            >
              <SelectTrigger id="service-id" className="h-9 max-w-sm">
                <SelectValue placeholder="Chọn dịch vụ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {/* Map over the flattened service list */}
                {allServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} {/* Display service name */}
                  </SelectItem>
                ))}
                {/* Optionally show a message if services are loading or failed */}
                {allServices.length === 0 && !isLoading && (
                   <p className="p-2 text-sm text-muted-foreground">Không có dịch vụ.</p>
                )}
                 {/* You could add a loading indicator inside the dropdown too */}
                 {isLoading && rawServiceData.length === 0 && (
                      <p className="p-2 text-sm text-muted-foreground">Đang tải dịch vụ...</p>
                 )}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Rate */}
          <div className="grid gap-1">
            <Select
              value={filters.rate || "all"} // Use "all" for empty string value
              onValueChange={(value) => handleSelectChange("rate", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="rate" className="h-9">
                <SelectValue placeholder="Chọn mức đánh giá" />
              </SelectTrigger>
              <SelectContent>
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading}
        >
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