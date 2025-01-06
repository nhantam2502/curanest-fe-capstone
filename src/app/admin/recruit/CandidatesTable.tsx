import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";

  interface CandidateData {
    id: number; 
    jobPostingId: number; 
    name: string;
    email: string
    resume: string;
    status: string;
    appliedDate: Date;
  }

interface JobPostingData {
  id: number;
  title: string;
}
  interface CandidatesTableProps {
    candidates: CandidateData[];
    jobPostings: JobPostingData[];
    onEdit: (candidate: CandidateData) => void;
    onDelete: (candidateId: number) => void;
  }
  
  export default function CandidatesTable({
    candidates,
    jobPostings,
    onEdit,
    onDelete,
  }: CandidatesTableProps) {
    const getJobPostingTitle = (jobPostingId: number) => {
      const jobPosting = jobPostings.find((jp) => jp.id === jobPostingId);
      return jobPosting ? jobPosting.title : "N/A";
    };
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Posting</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                {getJobPostingTitle(candidate.jobPostingId)}
              </TableCell>
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.status}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(candidate)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(candidate.id)}
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
