"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {  useState } from "react";
import { Pencil } from "lucide-react";
import EditNurseForm from "./EditNurseForm";
import { NurseForStaff } from "@/types/nurse";
import NurseFilter from "./NurseFilter";
import { Switch } from "@/components/ui/switch";

interface NurseTableProps {
  Nurses: NurseForStaff[];
}

export default function NurseTable({ Nurses }: NurseTableProps) {
  const [nurses, setNurses] = useState<NurseForStaff[]>(Nurses);
  const [selectedNurse, setSelectedNurse] = useState<NurseForStaff | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRowClick = (nurse: NurseForStaff) => {
    setSelectedNurse(nurse);
    setIsDetailModalOpen(true);
  };

  const handleEditNurse = (nurse: NurseForStaff) => {
    setSelectedNurse(nurse);
    setIsEditModalOpen(true);
  };

  // const handleDeleteNurse = (nurseId: number) => {
  //   setNurses(nurses.filter((n) => n.id !== nurseId));
  // };

  const detailFields = [
    { label: "Tên", value: selectedNurse?.name },
    { label: "Trạng thái", value: selectedNurse?.status },
    { label: "Ngày sinh", value: selectedNurse?.dob },
    { label: "CCCD", value: selectedNurse?.citizen_id },
    { label: "Địa chỉ", value: selectedNurse?.address },
    { label: "Phường", value: selectedNurse?.ward },
    { label: "Quận", value: selectedNurse?.district },
    { label: "Thành phố", value: selectedNurse?.city },
    { label: "Giới tính", value: selectedNurse?.gender },
    { label: "Chuyên môn", value: selectedNurse?.major },
    { label: "Slogan", value: selectedNurse?.slogan },
  ];

  const handleFilterChange = (filters: {
    department?: string;
    status?: string;
    gender?: string;
    search?: string;
  }) => {
    let filteredNurses = [...Nurses];

    if (filters.department) {
      filteredNurses = filteredNurses.filter(
        nurse => nurse.department === filters.department
      );
    }

    if (filters.status) {
      filteredNurses = filteredNurses.filter(
        nurse => nurse.status === filters.status
      );
    }

    if (filters.gender) {
      filteredNurses = filteredNurses.filter(
        nurse => nurse.gender === filters.gender
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredNurses = filteredNurses.filter(
        nurse =>
          nurse.name.toLowerCase().includes(searchLower) ||
          nurse.email.toLowerCase().includes(searchLower)
      );
    }

    setNurses(filteredNurses);
  };

  return (
    <div>
      <NurseFilter onFilterChange={handleFilterChange} />
      <Table className="mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Chuyên môn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nurses.map((nurse) => (
            <TableRow
              key={nurse.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(nurse)}
            >
              <TableCell>{nurse.name}</TableCell>
              <TableCell>{nurse.major}</TableCell>
              <TableCell>{nurse.status}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNurse(nurse);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNurse(nurse.id);
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button> */}
                  {/* <Switch  onClick={(e) => {
                      e.stopPropagation();
                      // handleDeleteNurse(nurse.id);
                    }} /> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Nurse Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onOpenChange={() => setIsDetailModalOpen(false)}
      >
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Nurse Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {detailFields.map((field, index) => (
              <div key={index}>
                <Label>{field.label}</Label>
                <p>{field.value || "N/A"}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Nurse Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nurse</DialogTitle>
          </DialogHeader>
          {selectedNurse && (
            <EditNurseForm
              nurse={selectedNurse}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedNurse) => {
                setNurses(nurses.map(nurse => 
                  nurse.id === updatedNurse.id ? updatedNurse : nurse
                ));
                setIsEditModalOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}