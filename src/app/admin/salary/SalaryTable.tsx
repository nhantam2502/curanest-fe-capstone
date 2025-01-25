import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  
  interface SalaryData {
    id: number;
    employeeName: string;
    department: string;
    salary: number;
    currency: string;
    payFrequency: string;
    effectiveDate: Date;
  }
  
  interface SalaryTableProps {
    salaries: SalaryData[];
    onEdit: (salary: SalaryData) => void;
    onDelete: (salaryId: number) => void;
  }
  
  export default function SalaryTable({
    salaries,
    onEdit,
    onDelete,
  }: SalaryTableProps) {
    return (
      <Table className="w-full border border-gray-200 overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Employee Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Pay Frequency</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id}>
              <TableCell>{salary.employeeName}</TableCell>
              <TableCell>{salary.department}</TableCell>
              <TableCell>{salary.salary}</TableCell>
              <TableCell>{salary.currency}</TableCell>
              <TableCell>{salary.payFrequency}</TableCell>
              <TableCell>
                {salary.effectiveDate.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(salary)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(salary.id)}
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