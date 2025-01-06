import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NursingCard from "./NursingCard";
import { Nurse } from "@/types/nurse";

interface NurseSelectionListProps {
  nurses: Nurse[];
  onSelect: (nurseId: number) => void;
}

const NurseSelectionList: React.FC<NurseSelectionListProps> = ({
  nurses,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [city, setCity] = useState<string>("Hồ Chí Minh");
  // Thêm state để theo dõi nurse được chọn
  const [selectedNurseId, setSelectedNurseId] = useState<number | null>(null);

  // Lọc danh sách điều dưỡng theo các tiêu chí
  const filteredNurses = nurses.filter((nurse) => {
    const matchesSearch = nurse.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRating =
      ratingFilter === null || nurse.avgRating >= ratingFilter;

    return matchesSearch && matchesRating;
  });

  const handleFindNearby = () => {
    // Logic tìm điều dưỡng dựa trên địa chỉ đã nhập
    alert(
      `Tìm điều dưỡng xung quanh: ${address}, ${ward}, ${district}, ${city}`
    );
  };

  // Thêm hàm xử lý khi chọn nurse
  const handleNurseSelect = (nurseId: number) => {
    setSelectedNurseId(nurseId);
    onSelect(nurseId);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Tìm kiếm */}
        <Input
          placeholder="Tìm kiếm theo tên hoặc bệnh viện"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3"
        />

        {/* Lọc theo đánh giá */}
        <Select
          onValueChange={(value) =>
            setRatingFilter(value === "all" ? null : Number(value))
          }
          value={ratingFilter === null ? "all" : ratingFilter.toString()}
        >
          <SelectTrigger className="w-full md:w-1/3 text-[18px]">
            <SelectValue placeholder="Chọn mức đánh giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[18px]" value="all">
              Tất cả đánh giá
            </SelectItem>
            <SelectItem className="text-[18px]" value="4">
              Từ 4 sao trở lên
            </SelectItem>
            <SelectItem className="text-[18px]" value="4.5">
              Từ 4.5 sao trở lên
            </SelectItem>
            <SelectItem className="text-[18px]" value="5">
              5 sao
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Nút Tìm xung quanh bạn */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-1/3 bg-[#71DDD7] hover:bg-[#71DDD7] text-white text-[18px]">
              Tìm xung quanh bạn
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] sm:w-full w-[90%] rounded-lg shadow-lg bg-white p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Nhập địa chỉ tìm kiếm
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-lg p-3"
              />
              <Input
                placeholder="Quận"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="text-lg p-3"
              />
              <Input
                placeholder="Phường"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="text-lg p-3"
              />
              <Input
                placeholder="Thành phố"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                defaultValue="Hồ Chí Minh"
                className="text-lg p-3"
                disabled
              />
              <Button
                className="bg-[#71DDD7] text-white w-full text-lg p-3 font-semibold hover:bg-[#71DDD7]"
                onClick={handleFindNearby}
              >
                Tìm kiếm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách điều dưỡng */}
      {filteredNurses.length === 0 ? (
        <p className="text-muted-foreground">Không có điều dưỡng nào phù hợp</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNurses.map((nurse) => (
            <NursingCard 
              key={nurse.id} 
              nurse={nurse} 
              onSelect={handleNurseSelect}
              isSelected={selectedNurseId === nurse.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NurseSelectionList;