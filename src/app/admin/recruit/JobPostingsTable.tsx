import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";

  interface JobPostingData {
    id: number;  
    title: string;  
    department: string;  
    location: string;  
    description: string;  
    status: string;
    datePosted: Date;  
  }
  
  interface JobPostingsTableProps {
    jobPostings: JobPostingData[];
    onEdit: (jobPosting: JobPostingData) => void;
    onDelete: (jobPostingId: number) => void;
  }
  
  export default function JobPostingsTable({
    jobPostings,
    onEdit,
    onDelete,
  }: JobPostingsTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPostings.map((jobPosting) => (
            <TableRow key={jobPosting.id}>
              <TableCell>{jobPosting.title}</TableCell>
              <TableCell>{jobPosting.department}</TableCell>
              <TableCell>{jobPosting.location}</TableCell>
              <TableCell>{jobPosting.status}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(jobPosting)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(jobPosting.id)}
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