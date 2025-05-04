// NurseTable.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import appointmentApiRequest from "@/apiRequest/appointment/apiAppointment";
import { GetAppointment } from "@/types/appointment";
import { NurseItemType } from "@/types/nurse";
import { NurseSheet } from "./NurseSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface NurseTableProps {
  selectedAppointment: GetAppointment | null;
}

export default function NurseTable({ selectedAppointment }: NurseTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [nurses, setNurses] = useState<NurseItemType[]>([]);
  const [selectedNurse, setSelectedNurse] = useState<NurseItemType | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!selectedAppointment) return;
    const fetchNursesForAppointment = async () => {
      try {
        const serviceId = selectedAppointment["service-id"];
        const estDateFrom = selectedAppointment["est-date"];
        const estDuration = selectedAppointment["total-est-duration"];

        const response = await appointmentApiRequest.getNursingAvailable(
          serviceId,
          estDateFrom,
          Number(estDuration)
        );

        if (response.status === 200 && Array.isArray(response.payload?.data)) {
          const mappedNurses = response.payload.data.map((nurse: any) => ({
            "nurse-id": nurse["nurse-id"],
            "nurse-picture": nurse["nurse-picture"],
            "nurse-name": nurse["nurse-name"],
            gender: nurse.gender,
            "current-work-place": nurse["current-work-place"],
            rate: nurse.rate,
          }));

          setNurses(mappedNurses);
          setTotalPages(Math.ceil(mappedNurses.length / 10));
        }
      } catch (error) {
        console.error("Error fetching nurses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNursesForAppointment();
  }, [selectedAppointment]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Danh sách điều dưỡng</CardTitle>
        <CardDescription>Danh sách điều dưỡng đang hoạt động.</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] hidden sm:table-cell">
                Avt
              </TableHead>
              <TableHead>Tên điều dưỡng</TableHead>
              <TableHead>Nơi công tác</TableHead>
              <TableHead>Đánh giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Chọn 1 điều dưỡng để tiếp tục
                </TableCell>
              </TableRow>
            ) : nurses.length > 0 ? (
              nurses.map((nurse) => (
                <TableRow
                  key={nurse["nurse-id"]}
                  onClick={() => setSelectedNurse(nurse)}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    nurse["nurse-id"] === selectedNurse?.["nurse-id"] &&
                      "bg-primary/10"
                  )}
                >
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={nurse["nurse-picture"]}
                        alt={nurse["nurse-name"]}
                      />
                      <AvatarFallback>
                        {nurse["nurse-name"].charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {nurse["nurse-name"]}
                    <span className="text-xs block text-muted-foreground">
                      {nurse.gender ? "Nam" : "Nữ"}
                    </span>
                  </TableCell>
                  <TableCell>{nurse["current-work-place"]}</TableCell>
                  <TableCell>⭐ {nurse.rate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  Hiện chưa có y tá nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <NurseSheet
        nurse={selectedNurse}
        onClose={() => setSelectedNurse(null)}
        selectedAppointment={selectedAppointment}
      />

      {totalPages > 1 && (
        <CardFooter className="pt-4 border-t">
          <div className="flex items-center justify-end space-x-2 w-full">
            <span className="text-xs text-muted-foreground">
              Trang {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="border rounded px-3 py-1 text-sm"
            >
              Trước
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="border rounded px-3 py-1 text-sm"
            >
              Sau
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
