import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { Major } from "@/types/major";

interface MajorTableProps {
  majors: Major[];
  onEdit: (major: Major) => void;
  onDelete: (id: number) => void;
}

export default function MajorTable({
  majors,
  onEdit,
}: MajorTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setSelectedStatus] = useState("");
    const filteredMajors = majors.filter((major) => {
    const nameMatch = major.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatch = (major.description || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || descriptionMatch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  return (
    <div className="p-4">
      <div className="p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 border rounded-lg shadow-sm">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72"
        />
        <Button variant="outline" onClick={clearFilters}>
          <XCircle className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <Table className="w-full border border-gray-200 overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="pl-6">Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMajors.map((major) => (
            <TableRow key={major.id} className="hover:bg-gray-50">
              <TableCell className="pl-6">{major.name}</TableCell>
              <TableCell>{major.description}</TableCell>
              <TableCell className="text-right space-x-2 pr-6">
                <Button variant="outline" size="sm" onClick={() => onEdit(major)}>
                  Sửa
                </Button>
                <Switch />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

