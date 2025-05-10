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
  "service-id": "",
  rate: "", 
  // "current-work-place": "",
};

export default function NurseFilter({
  onSearch,
  onReset,
  isLoading = false, 
}: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>(initialFilters);
  const [rawServiceData, setRawServiceData] = useState<FetchedCategory[]>([]);

  const fetchService = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getListService("");
      if (response.status === 200 && response.payload?.data) {
        setRawServiceData(response.payload.data || []);
      } else {
        console.error("Failed to fetch services:", response);
        setRawServiceData([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setRawServiceData([]); 
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]); 

  const allServices = useMemo((): ServiceItem[] => {
    if (!rawServiceData || rawServiceData.length === 0) {
      return [];
    }
    return rawServiceData.flatMap(
      (category) =>
        category["list-services"]?.map((service) => ({
          id: service.id,
          name: service.name,
        })) ?? []
    );
  }, [rawServiceData]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof GetAllNurseFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleSearch = () => {
    const activeFilters: Partial<GetAllNurseFilter> = {};
    if (filters["nurse-name"]?.trim())
      activeFilters["nurse-name"] = filters["nurse-name"].trim();
    if (filters["service-id"])
      activeFilters["service-id"] = filters["service-id"];
    if (filters.rate) activeFilters.rate = filters.rate;
    // if (filters["current-work-place"]?.trim())
    //   activeFilters["current-work-place"] = filters["current-work-place"].trim();

    console.log("Searching with filters:", activeFilters);
    onSearch(activeFilters);
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

          {/* <div className="grid gap-1">
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
          </div> */}

          <div className="grid gap-1">
            <Select
              value={filters["service-id"] || "all"}
              onValueChange={(value) => handleSelectChange("service-id", value)}
              disabled={isLoading || allServices.length === 0} 
            >
              <SelectTrigger id="service-id" className="h-9 max-w-sm">
                <SelectValue placeholder="Chọn dịch vụ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {allServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} 
                  </SelectItem>
                ))}
                {allServices.length === 0 && !isLoading && (
                   <p className="p-2 text-sm text-muted-foreground">Không có dịch vụ.</p>
                )}
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
        <Button size="sm" onClick={handleSearch} disabled={isLoading} className="bg-emerald-400 hover:bg-emerald-400/90">
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