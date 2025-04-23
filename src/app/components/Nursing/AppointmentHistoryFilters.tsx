import React, { useState, useEffect } from "react";
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
import { cn, getFormattedDate } from "@/lib/utils";
import { CalendarIcon, Search, X, Filter } from "lucide-react";

interface AppointmentHistoryFiltersProps {
  filters: {
    patientName: string;
    serviceName: string;
    fromDate: Date | null;
    toDate: Date | null;
    status: string;
    paymentStatus: string;
  };
  onFilterChange: (filters: AppointmentHistoryFiltersProps["filters"]) => void;
  onResetFilters: () => void;
}

const AppointmentHistoryFilters: React.FC<AppointmentHistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  // State nội bộ để lưu trữ giá trị filter tạm thời
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Cập nhật tempFilters khi filters từ props thay đổi
  useEffect(() => {
    setTempFilters({ ...filters });
  }, [filters]);

  const handleInputChange = (field: string, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: "fromDate" | "toDate",
    date: Date | null
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]:  getFormattedDate(date ? date.toISOString() : ""),
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm áp dụng bộ lọc khi người dùng nhấn nút tìm kiếm
  const applyFilters = () => {
    // Chuyển đổi định dạng ngày tháng cho fromDate và toDate
    const formattedFilters = {
      ...tempFilters,
    };

    console.log("Applying filters:", formattedFilters);
    onFilterChange(formattedFilters);
  };

  const handleResetFilters = () => {
    onResetFilters();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tìm theo tên bệnh nhân */}
        <div className="relative">
          <Input
            placeholder="Tên bệnh nhân..."
            value={tempFilters.patientName}
            onChange={(e) => handleInputChange("patientName", e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {tempFilters.patientName && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => handleInputChange("patientName", "")}
            >
              <X />
            </Button>
          )}
        </div>

        {/* Tìm theo tên dịch vụ */}
        {/* <div className="relative">
          <Input
            placeholder="Tên dịch vụ..."
            value={tempFilters.serviceName}
            onChange={(e) => handleInputChange("serviceName", e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {tempFilters.serviceName && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => handleInputChange("serviceName", "")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div> */}

        {/* Lọc theo trạng thái cuộc hẹn */}
        <Select
          value={tempFilters.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái cuộc hẹn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái cuộc hẹn</SelectItem>
            <SelectItem value="completed">Đã hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
            <SelectItem value="waiting">Đang đợi</SelectItem>
          </SelectContent>
        </Select>

        {/* Lọc theo trạng thái thanh toán */}
        <Select
          value={tempFilters.paymentStatus}
          onValueChange={(value) => handleSelectChange("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái thanh toán</SelectItem>
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
                  !tempFilters.fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tempFilters.fromDate
                  ? format(new Date(tempFilters.fromDate), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "Từ ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  tempFilters.fromDate
                    ? new Date(tempFilters.fromDate)
                    : undefined
                }
                onSelect={(date) => handleDateChange("fromDate", date || null)}
                disabled={(date) =>
                  tempFilters.toDate
                    ? date > new Date(tempFilters.toDate)
                    : false
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
                  !tempFilters.toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tempFilters.toDate
                  ? format(new Date(tempFilters.toDate), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "Đến ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  tempFilters.toDate ? new Date(tempFilters.toDate) : undefined
                }
                onSelect={(date) => handleDateChange("toDate", date || null)}
                disabled={(date) =>
                  tempFilters.fromDate
                    ? date < new Date(tempFilters.fromDate)
                    : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Nút tìm kiếm */}
        <Button
          variant="default"
          onClick={applyFilters}
          className="w-full sm:w-auto "
        >
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>

        {/* Nút reset bộ lọc */}
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full sm:w-auto "
        >
          <X className="mr-2 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHistoryFilters;
