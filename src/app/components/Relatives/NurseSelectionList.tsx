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
import { NurseItemType } from "@/types/nurse";

interface NurseSelectionListProps {
  nurses: NurseItemType[];
  onSelect: (nurseId: string) => void;
}

const NurseSelectionList: React.FC<NurseSelectionListProps> = ({
  nurses,
  onSelect,
}) => {
  
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);

 

  // Thêm hàm xử lý khi chọn nurse
  const handleNurseSelect = (nurseId: string) => {
    setSelectedNurseId(nurseId);
    onSelect(nurseId);
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
     

      {/* Danh sách điều dưỡng */}
      {nurses.length === 0 ? (
        <p className="text-muted-foreground">Không có điều dưỡng nào phù hợp</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nurses.map((nurse) => (
            <NursingCard 
              key={nurse["nurse-id"]} 
              nurse={nurse} 
              onSelect={handleNurseSelect}
              isSelected={selectedNurseId === nurse["nurse-id"]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NurseSelectionList;