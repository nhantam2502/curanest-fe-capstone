"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { GetAllNurse } from "@/types/nurse";
import { useRouter } from "next/navigation";
import { useNurse } from "@/app/context/NurseContext";

interface NurseTableProps {
  nurses: GetAllNurse[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NurseTable({
  nurses,
  currentPage,
  totalPages,
  onPageChange,
}: NurseTableProps) {
  const router = useRouter();
  const { setSelectedNurse } = useNurse();

  const handleRowClick = (nurseId: string) => {
    router.push(`/admin/nurse/${nurseId}`);
  };

  const handleMapService = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    nurse: GetAllNurse
  ) => {
    event.stopPropagation();
    setSelectedNurse(nurse);
    router.push(`/admin/nurse/map-service`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Nơi làm việc</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nurses.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center italic text-gray-500"
              >
                Không có điều dưỡng nào.
              </TableCell>
            </TableRow>
          ) : (
            nurses.map((nurse) => (
              <TableRow
                key={nurse["nurse-id"]}
                onClick={() => handleRowClick(nurse["nurse-id"])}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{nurse["nurse-name"]}</TableCell>
                <TableCell>{nurse.gender ? "Nam" : "Nữ"}</TableCell>
                <TableCell>{nurse["current-work-place"]}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < nurse.rate
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {nurse["nurse-picture"] ? (
                    <img
                      src={nurse["nurse-picture"]}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" onClick={(event) => handleMapService(event, nurse)}>
                    Map
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4 space-x-2 items-center">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
