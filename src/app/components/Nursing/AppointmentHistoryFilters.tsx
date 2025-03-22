import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search, X } from "lucide-react";

interface AppointmentHistoryFiltersProps {
  filters: {
    patientName: string;
    serviceName: string;
    fromDate: Date | null;
    toDate: Date | null;
    status: "all" | "completed" | "cancelled" | "no-show";
    paymentStatus: "all" | "paid" | "unpaid" | "partial";
  };
  onFilterChange: (filters: AppointmentHistoryFiltersProps["filters"]) => void;
  onResetFilters: () => void;
}

const AppointmentHistoryFilters: React.FC<AppointmentHistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const handleInputChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleDateChange = (field: "fromDate" | "toDate", date: Date | null) => {
    onFilterChange({
      ...filters,
      [field]: date,
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tìm theo tên bệnh nhân */}
        <div className="relative">
          <Input
            placeholder="Tên bệnh nhân..."
            value={filters.patientName}
            onChange={(e) => handleInputChange("patientName", e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {filters.patientName && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => handleInputChange("patientName", "")}
            >
              <X  />
            </Button>
          )}
        </div>

        {/* Tìm theo tên dịch vụ */}
        <div className="relative">
          <Input
            placeholder="Tên dịch vụ..."
            value={filters.serviceName}
            onChange={(e) => handleInputChange("serviceName", e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {filters.serviceName && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => handleInputChange("serviceName", "")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Lọc theo trạng thái cuộc hẹn */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái cuộc hẹn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="completed">Đã hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
            <SelectItem value="no-show">Khách không đến</SelectItem>
          </SelectContent>
        </Select>

        {/* Lọc theo trạng thái thanh toán */}
        <Select
          value={filters.paymentStatus}
          onValueChange={(value) => handleSelectChange("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thanh toán</SelectItem>
            <SelectItem value="paid">Đã thanh toán</SelectItem>
            <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
            <SelectItem value="partial">Thanh toán một phần</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Chọn từ ngày */}
        <div className="w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-lg font-normal",
                  !filters.fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.fromDate ? (
                  format(filters.fromDate, "dd/MM/yyyy", { locale: vi })
                ) : (
                  "Từ ngày"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.fromDate || undefined}
                onSelect={(date) => handleDateChange("fromDate", date || null)}
                disabled={(date) =>
                  filters.toDate ? date > filters.toDate : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Chọn đến ngày */}
        <div className="w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-lg font-normal",
                  !filters.toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.toDate ? (
                  format(filters.toDate, "dd/MM/yyyy", { locale: vi })
                ) : (
                  "Đến ngày"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.toDate || undefined}
                onSelect={(date) => handleDateChange("toDate", date || null)}
                disabled={(date) =>
                  filters.fromDate ? date < filters.fromDate : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Nút reset bộ lọc */}
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="w-full sm:w-auto ml-auto"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHistoryFilters;