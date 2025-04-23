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
import { useCallback, useEffect, useMemo, useState } from "react"; // Added useMemo
import { Search, X } from "lucide-react";
import { GetAllNurseFilter } from "@/types/nurse";
import {
  Card,
  CardContent,
  // CardDescription, // Removed if not used
  // CardFooter, // Moved import up
  // CardHeader, // Removed if not used
  // CardTitle, // Removed if not used
} from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card"; // Keep CardFooter import separate if needed elsewhere
// import { Label } from "@/components/ui/label"; // Removed if not used
import serviceApiRequest from "@/apiRequest/service/apiServices";

// Define the structure of a single service item for clarity
interface ServiceItem {
  id: string;
  name: string;
  // Add other properties if needed
}

// Define the structure of the fetched service data
interface FetchedCategory {
  "category-info": {
    id: string;
    name: string;
    // ... other category properties
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
  onSearch: (filters: GetAllNurseFilter) => void;
  onReset: () => void;
  isLoading?: boolean; // Optional loading state from parent
}

const initialFilters: GetAllNurseFilter = {
  "nurse-name": "",
  "service-id": "", // Will hold the selected service ID, empty string means "All"
  rate: "", // Use empty string for "All" rates
  // Add other potential filters here with initial empty values
  // "workplace": "", // Example if the placeholder input is meant for this
};

export default function RenovatedNurseFilter({
  onSearch,
  onReset,
  isLoading = false, // Default isLoading to false
}: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>(initialFilters);
  const [rawServiceData, setRawServiceData] = useState<FetchedCategory[]>([]);

  // Fetch service data
  const fetchService = useCallback(async () => {
    try {
      // Assuming getListService doesn't need filters, pass empty string or adjust if needed
      const response = await serviceApiRequest.getListService("");
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
  }, []); // No dependencies needed if it always fetches all services

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Use useMemo to create a flattened list of all services for the Select dropdown
  const allServices = useMemo((): ServiceItem[] => {
    if (!rawServiceData || rawServiceData.length === 0) {
      return [];
    }
    // Flatten the nested structure
    return rawServiceData.flatMap(
      (category) =>
        category["list-services"]?.map((service) => ({
          id: service.id,
          name: service.name,
        })) ?? [] // Use empty array if list-services is missing/null
    );
  }, [rawServiceData]); // Recalculate only when rawServiceData changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof GetAllNurseFilter, value: string) => {
    // Handle the "All" case specifically by setting to empty string
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleSearch = () => {
    // Filter out empty strings before sending
    const activeFilters: Partial<GetAllNurseFilter> = {};
    // Trim potential whitespace from text inputs
    if (filters["nurse-name"]?.trim())
      activeFilters["nurse-name"] = filters["nurse-name"].trim();
    if (filters["service-id"])
      activeFilters["service-id"] = filters["service-id"]; // No trim needed for ID
    if (filters.rate) activeFilters.rate = filters.rate;
    // Add other filters here if they exist (e.g., workplace)
    // if (filters["workplace"]?.trim()) activeFilters["workplace"] = filters["workplace"].trim();

    onSearch(activeFilters as GetAllNurseFilter);
  };

  const handleReset = () => {
    setFilters(initialFilters); // Reset state to initial values
    onReset(); // Call parent reset function
  };

  // Handle Enter key press on text inputs
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

          {/* Placeholder for Workplace Filter - Currently not wired up */}
          {/* <div className="grid gap-1">
            <Input
              // id="workplace"  // Suggest using relevant id/name if implemented
              // name="workplace"
              type="text"
              placeholder="Tìm theo nơi làm việc..."
              // value={filters["workplace"]} // Add state if implemented
              // onChange={handleInputChange}
              // onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading} // Disable if parent is loading
            />
          </div> */}

          {/* Filter by Service ID -> Now a Select */}
          <div className="grid gap-1">
            <Select
              // Use service-id from filters state. Default to "all" if empty string.
              value={filters["service-id"] || "all"}
              onValueChange={(value) => handleSelectChange("service-id", value)}
              disabled={isLoading || allServices.length === 0} // Disable if loading or no services fetched
            >
              <SelectTrigger id="service-id" className="h-9">
                <SelectValue placeholder="Chọn dịch vụ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {allServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} {/* Display service name */}
                  </SelectItem>
                ))}
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