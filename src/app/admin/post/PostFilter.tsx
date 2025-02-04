"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Post } from "./page"; // Import the Post interface
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, XCircle } from "lucide-react";

interface PostFilterProps {
  posts: Post[];
  setFilteredPosts: (posts: Post[]) => void;
}

export default function PostFilter({ posts, setFilteredPosts }: PostFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"published" | "draft" | "">("");

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (value: "published" | "draft" | "") => {
    setSelectedStatus(value);
  };

  const handleSearch = () => {
    const filtered = posts.filter((post) => {
      const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = selectedStatus ? post.status === selectedStatus : true;
      return searchMatch && statusMatch;
    });
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedStatus, posts]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Tìm
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Select onValueChange={handleStatusChange} value={selectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            <XCircle className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}