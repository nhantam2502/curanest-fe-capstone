"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, X } from "lucide-react";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";
import { RelativesFilter } from "@/types/relatives";
import {
  Card,
  CardContent,
  // CardDescription, // <-- Remove if not needed
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserFilterProps {
  setFilteredUsers: (users: RelativesFilter[]) => void;
  resetUsers: () => void;
}

export default function UserFilter({
  setFilteredUsers,
  resetUsers,
}: UserFilterProps) {
  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const activeFilters: Record<string, string> = {};
      if (filters.fullName.trim()) activeFilters["full-name"] = filters.fullName.trim();
      if (filters.email.trim()) activeFilters.email = filters.email.trim();
      if (filters.phoneNumber.trim()) activeFilters["phone-number"] = filters.phoneNumber.trim();

       if (Object.keys(activeFilters).length > 0) {
            const response = await relativesApiRequest.getRelativesFilter({
                filter: activeFilters,
                paging: { page: 1, size: 50, total: 0 },
            });

            if (response.status === 200) {
                setFilteredUsers(response.payload.data || []);
                if (!response.payload.data || response.payload.data.length === 0) {
                     toast({ title: "Không tìm thấy", description: "Không có người thân nào khớp với bộ lọc." });
                }
            } else {
                 toast({ title: "Lỗi tìm kiếm", description: response.payload?.message || "Không thể thực hiện tìm kiếm.", variant: "destructive" });
                 setFilteredUsers([]);
            }
       } else {
           resetUsers();
           toast({ title: "Hiển thị tất cả", description: "Đã xóa bộ lọc, hiển thị tất cả người thân." });
       }

    } catch (error: any) {
      console.error("Error fetching filtered users:", error);
      toast({
        title: "Lỗi tìm kiếm",
        description: error.message || "Đã xảy ra lỗi mạng hoặc hệ thống.",
        variant: "destructive",
      });
       setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    // ... (clearFilters logic remains the same) ...
    setFilters({ fullName: "", email: "", phoneNumber: "" });
    resetUsers();
    toast({ title: "Đã xóa bộ lọc", description: "Hiển thị lại tất cả người thân." });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="grid gap-1">
            <Input
              id="filter-name"
              type="text"
              placeholder="Tìm theo tên..."
              value={filters.fullName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fullName: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              className="h-8" // Make input slightly shorter
            />
          </div>

          <div className="grid gap-1">
            <Input
              id="filter-email"
              type="email"
              placeholder="Tìm theo email..."
              value={filters.email}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, email: e.target.value }))
              }
               onKeyDown={handleKeyDown}
               className="h-8"
            />
          </div>

          <div className="grid gap-1">
            <Input
              id="filter-phone"
              type="tel"
              placeholder="Tìm theo SĐT..."
              value={filters.phoneNumber}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
               onKeyDown={handleKeyDown}
               className="h-8"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 pb-3">
        <Button variant="outline" size="sm" onClick={clearFilters} disabled={isLoading}> {/* Use size="sm" */}
          <X className="h-4 w-4 mr-1" /> {/* Reduced margin */}
          Xóa bộ lọc
        </Button>
        <Button size="sm" onClick={handleSearch} disabled={isLoading}> {/* Use size="sm" */}
          {isLoading ? (
            <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full mr-1"></span>
          ) : (
            <Search className="h-4 w-4 mr-1" />
          )}
          {isLoading ? "Đang tìm..." : "Tìm"} {/* Shortened text */}
        </Button>
      </CardFooter>
    </Card>
  );
}