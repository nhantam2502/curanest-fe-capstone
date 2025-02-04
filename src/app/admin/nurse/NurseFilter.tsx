"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterProps {
  onFilterChange: (filters: { major?: string; status?: string; gender?: string; search?: string }) => void;
}

export default function NurseFilter({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    major: "",
    status: "",
    gender: "",
    search: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="major">Chuyên môn</Label>
          <Select
            onValueChange={(value) => handleFilterChange("major", value)}
          >
            <SelectTrigger id="major">
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <Select
            onValueChange={(value) => handleFilterChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="search">Tìm kiếm</Label>
          <Input
            id="search"
            placeholder="Tìm theo tên"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({ major: "", status: "", gender: "", search: "" });
            onFilterChange({ major: "", status: "", gender: "", search: "" });
          }}
        >
          Xoá
        </Button>
        <Button onClick={() => onFilterChange(filters)}>Tìm</Button>
      </div>
    </div>
  );
}
