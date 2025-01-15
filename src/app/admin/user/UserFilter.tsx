"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "./UserTable"; // Import the User interface from your UserTable file
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserFilterProps {
  users: User[];
  setFilteredUsers: (users: User[]) => void;
}

export default function UserFilter({ users, setFilteredUsers }: UserFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict(""); // Reset district and ward when city changes
    setSelectedWard("");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard(""); // Reset ward when district changes
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
  };

  const handleSearch = () => {
        const filtered = users.filter((user) => {
          const fullName = `${user.first_name} ${user.last_name}`;
          const searchMatch =
            fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone_number.includes(searchQuery);
          const cityMatch = selectedCity ? user.city === selectedCity : true;
          const districtMatch = selectedDistrict
            ? user.district === selectedDistrict
            : true;
          const wardMatch = selectedWard ? user.ward === selectedWard : true;

          return searchMatch && cityMatch && districtMatch && wardMatch;
        });
        setFilteredUsers(filtered);
  }

  useEffect(() => {
    handleSearch()
  }, [searchQuery, selectedCity, selectedDistrict, selectedWard, users]);

  const getUniqueCities = () => {
    return Array.from(new Set(users.map((user) => user.city)));
  };

  const getUniqueDistricts = () => {
    return Array.from(
      new Set(
        users
          .filter((user) => user.city === selectedCity)
          .map((user) => user.district)
      )
    );
  };

  const getUniqueWards = () => {
    return Array.from(
      new Set(
        users
          .filter(
            (user) =>
              user.city === selectedCity && user.district === selectedDistrict
          )
          .map((user) => user.ward)
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedWard("");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Tìm theo tên"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Tìm
          </Button>
        </div>

        <div className="flex gap-4">
          <Select onValueChange={handleCityChange} value={selectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {getUniqueCities().map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleDistrictChange}
            value={selectedDistrict}
            disabled={!selectedCity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn quận" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {getUniqueDistricts().map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleWardChange}
            value={selectedWard}
            disabled={!selectedDistrict}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn phường" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {getUniqueWards().map((ward) => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Xoá
          </Button>
        </div>
      </div>
    </div>
  );
}