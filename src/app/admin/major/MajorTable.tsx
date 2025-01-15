import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { MajorData } from "./MajorForm";
import { Switch } from "@/components/ui/switch";
  
  interface MajorTableProps {
    majors: MajorData[];
    onEdit: (major: MajorData) => void;
    onDelete: (majorId: number) => void;
  }
  
  export default function MajorTable({
    majors,
    onEdit,
    onDelete,
  }: MajorTableProps) {
    return (
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {majors.map((major) => (
            <TableRow key={major.id}>
              <TableCell>{major.name}</TableCell>
              <TableCell>{major.description}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(major)}>
                  Sửa
                </Button>
                <Switch />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }