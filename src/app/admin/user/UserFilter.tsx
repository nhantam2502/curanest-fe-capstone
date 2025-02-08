"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import relativesApiRequest from "@/apiRequest/relatives/apiRelatives";
import { RelativesFilter } from "@/types/relatives";

interface UserFilterProps {
  setFilteredUsers: (users: RelativesFilter[]) => void;
}

export default function UserFilter({ setFilteredUsers }: UserFilterProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSearch = async () => {
    try {
      const response = await relativesApiRequest.getRelativesFilter({
        filter: {
          ...(fullName.trim() && { "full-name": fullName }),
          ...(email.trim() && { email }),
          ...(phoneNumber.trim() && { "phone-number": phoneNumber }),
        },
        paging: { page: 1, size: 10, total: 0 },
      });

      console.log("Filtered users:", response);
      setFilteredUsers(response.payload.data || []);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [fullName, email, phoneNumber]);

  const clearFilters = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Tìm theo tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Tìm theo email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Tìm theo số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Tìm
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          Xoá bộ lọc
        </Button>
      </div>
    </div>
  );
}
