// ./components/ScheduleFilterSidebar.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Keep Input for Package ID
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

// Interface for the processed service list items
interface ServiceItem {
  id: string;
  name: string;
}

// Props definition updated
interface ScheduleFilterSidebarProps {
  status: string;
  serviceId: string;
  packageId: string;
  hasNurse: string; 
  services: ServiceItem[];

  onStatusChange: (value: string) => void;
  onServiceIdChange: (value: string) => void; // This will receive the selected service ID
  onPackageIdChange: (value: string) => void;
  onHasNurseChange: (value: string) => void; // New handler prop

  onClearFilters: () => void;
  isLoading?: boolean;
}

const ScheduleFilterSidebar: React.FC<ScheduleFilterSidebarProps> = ({
  status,
  serviceId,
  hasNurse, 
  services,
  onStatusChange,
  onServiceIdChange,
  onHasNurseChange, // Destructure new handler
  onClearFilters,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Filter className="w-4 h-4" /> Bộ lọc
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-xs text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          <X className="w-3 h-3 mr-1" /> Xoá bộ lọc
        </Button>
      </div>

      {/* Status Filter (No changes) */}
      <div>
        <Label htmlFor="filter-status" className="text-xs">
          Trạng thái L.Hẹn
        </Label>
        <Select
          value={status}
          onValueChange={onStatusChange}
          disabled={isLoading}
        >
          <SelectTrigger id="filter-status" className="h-8 text-xs mt-1">
            <SelectValue placeholder="Chọn trạng thái..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="success">Hoàn thành</SelectItem>
            <SelectItem value="refused">Từ chối</SelectItem>
            <SelectItem value="changed">Đã đổi lịch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- NEW: Has Nurse Filter --- */}
      <div>
        <Label htmlFor="filter-has-nurse" className="text-xs">
          Trạng thái Đ.Dưỡng
        </Label>
        <Select
          value={hasNurse}
          onValueChange={onHasNurseChange} // Use the new handler
          disabled={isLoading}
        >
          <SelectTrigger id="filter-has-nurse" className="h-8 text-xs mt-1">
            <SelectValue placeholder="Trạng thái ĐD..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Đã gán ĐD</SelectItem> 
            <SelectItem value="0">Chưa gán ĐD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="filter-service-id" className="text-xs">
          Dịch vụ
        </Label>
        <Select
          value={serviceId} // Use the existing serviceId state (which holds the ID)
          onValueChange={onServiceIdChange} // Use the existing handler (passes the selected ID)
          disabled={isLoading || services.length === 0} // Disable if loading or no services
        >
          <SelectTrigger id="filter-service-id" className="h-8 text-xs mt-1">
            <SelectValue placeholder="Chọn dịch vụ..." />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {" "}
                {/* value is ID */}
                {service.name} {/* Display is NAME */}
              </SelectItem>
            ))}
            {services.length === 0 && !isLoading && (
              <p className="p-2 text-xs text-muted-foreground">
                Không có dịch vụ.
              </p>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ScheduleFilterSidebar;
