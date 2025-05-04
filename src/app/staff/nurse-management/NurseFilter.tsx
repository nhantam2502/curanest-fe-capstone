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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GetAllNurseFilter } from "@/types/nurse";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import serviceApiRequest from "@/apiRequest/service/apiServices";

// Define types
interface ServiceCategory {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  est_duration?: string;
  status?: string;
}

interface FetchedCategory {
  "category-info": ServiceCategory;
  "list-services": Array<{
    id: string;
    "category-id": string;
    name: string;
    description: string;
    "est-duration": string;
    status: string;
  }>;
}

interface ServiceItem {
  id: string;
  name: string;
}

interface NurseFilterProps {
  onSearch: (filters: GetAllNurseFilter) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const initialFilters: GetAllNurseFilter = {
  "nurse-name": "",
  "service-id": "",
  rate: "",
};

export default function RenovatedNurseFilter({
  onSearch,
  onReset,
  isLoading = false,
}: NurseFilterProps) {
  const [filters, setFilters] = useState<GetAllNurseFilter>(initialFilters);
  const [rawServiceData, setRawServiceData] = useState<
    { categoryInfo: ServiceCategory; listServices: Service[] }[]
  >([]);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);

  // Fetch and process services
  const fetchService = useCallback(async () => {
    try {
      const response = await serviceApiRequest.getListServiceOfStaff("");

      if (response.status === 200 && response.payload?.data) {
        const apiData = response.payload.data;

        if (apiData["category-info"] && Array.isArray(apiData["list-services"])) {
          const processedData = [
            {
              categoryInfo: {
                id: apiData["category-info"].id,
                name: apiData["category-info"].name,
              },
              listServices: apiData["list-services"].map((serviceItem: any) => ({
                id: serviceItem.id,
                category_id: serviceItem["category-id"],
                name: serviceItem.name,
                description: serviceItem.description,
                est_duration: serviceItem["est-duration"],
                status: serviceItem.status,
              })),
            },
          ];

          setRawServiceData(processedData);

          // Flatten into allServices for dropdown
          const flattenedServices = processedData.flatMap(
            (category) =>
              category.listServices.map((service) => ({
                id: service.id,
                name: service.name,
              }))
          );

          setAllServices(flattenedServices);
        } else {
          console.warn("Unexpected API response structure:", apiData);
          setRawServiceData([]);
          setAllServices([]);
        }
      } else {
        console.error("Failed to fetch services:", response);
        setRawServiceData([]);
        setAllServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setRawServiceData([]);
      setAllServices([]);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: keyof GetAllNurseFilter,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const handleSearch = () => {
    const activeFilters: Partial<GetAllNurseFilter> = {};
    if (filters["nurse-name"]?.trim())
      activeFilters["nurse-name"] = filters["nurse-name"].trim();
    if (filters["service-id"])
      activeFilters["service-id"] = filters["service-id"];
    if (filters.rate) activeFilters.rate = filters.rate;

    onSearch(activeFilters as GetAllNurseFilter);
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
          {/* Filter by Name */}
          <div className="grid gap-1">
            <Input
              id="nurse-name"
              name="nurse-name"
              type="text"
              placeholder="Tìm theo tên y tá..."
              value={filters["nurse-name"]}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-9"
              disabled={isLoading}
            />
          </div>

          {/* Filter by Service ID -> Now a Select */}
          <div className="grid gap-1">
            <Select
              value={filters["service-id"] || "all"}
              onValueChange={(value) => handleSelectChange("service-id", value)}
              disabled={isLoading || allServices.length === 0}
            >
              <SelectTrigger id="service-id" className="h-9">
                <SelectValue placeholder="Chọn dịch vụ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                {allServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Rate */}
          <div className="grid gap-1">
            <Select
              value={filters.rate || "all"}
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