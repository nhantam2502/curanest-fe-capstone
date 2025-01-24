"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  district: string;
  ward: string;
}

interface UserFilterProps {
  users: User[];
  setFilteredUsers: (users: User[]) => void;
}

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
  province_code: string;
}

interface Ward {
  code: string;
  name: string;
  district_code: string;
}

export default function UserFilter({
  users,
  setFilteredUsers,
}: UserFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("79"); // Default city to Ho Chi Minh City (code: 79)
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    // Fetch provinces from the API
    fetch("https://provinces.open-api.vn/api/p/")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    // Fetch districts for the default city (HCM) when the component mounts
    if (selectedCity) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedCity}?depth=2`)
        .then((response) => response.json())
        .then((data) => setDistricts(data.districts))
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedCity]);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict(""); // Reset district and ward when city changes
    setSelectedWard("");

    // Fetch districts for the selected city
    fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`)
      .then((response) => response.json())
      .then((data) => setDistricts(data.districts))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard("");

    // Fetch wards for the selected district
    fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`)
      .then((response) => response.json())
      .then((data) => setWards(data.wards))
      .catch((error) => console.error("Error fetching wards:", error));
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
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCity, selectedDistrict, selectedWard, users]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("79"); // Reset to HCM
    setSelectedDistrict("");
    setSelectedWard("");
    setFilteredUsers(users); // Reset filters
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Tìm theo tên"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Tìm
          </Button>
        </div>

        <div className="flex gap-4">
          <Select onValueChange={handleCityChange} value={selectedCity} disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {provinces.length > 0
                  ? provinces.find((p) => p.code === selectedCity)?.name ||
                    "TP. Hồ Chí Minh"
                  : "Loading..."}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
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
              {districts.map((district) => (
                <SelectItem key={district.code} value={district.code}>
                  {district.name}
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
              {wards.map((ward) => (
                <SelectItem key={ward.code} value={ward.code}>
                  {ward.name}
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
