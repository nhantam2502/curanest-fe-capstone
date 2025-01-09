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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {majors.map((major) => (
            <TableRow key={major.id}>
              <TableCell className="font-medium">{major.id}</TableCell>
              <TableCell>{major.name}</TableCell>
              <TableCell>{major.description}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(major)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(major.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }