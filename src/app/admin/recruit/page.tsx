"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobPostingsTable from "./JobPostingsTable";
import CandidatesTable from "./CandidatesTable";

interface JobPostingData {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  status: string;
  datePosted: Date;
}

interface CandidateData {
  id: number;
  jobPostingId: number;
  name: string;
  email: string;
  resume: string;
  status: string;
  appliedDate: Date;
}

// Dummy data (replace with actual data fetching)
const initialJobPostings: JobPostingData[] = [
  {
    id: 1,
    title: "Software Engineer",
    department: "Engineering",
    location: "Remote",
    description: "...",
    status: "Open",
    datePosted: new Date(),
  },
  {
    id: 2,
    title: "Sales Representative",
    department: "Sales",
    location: "New York",
    description: "...",
    status: "Closed",
    datePosted: new Date(),
  },
];

const initialCandidates: CandidateData[] = [
  {
    id: 1,
    jobPostingId: 1,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    resume: "...",
    status: "Applied",
    appliedDate: new Date(),
  },
  {
    id: 2,
    jobPostingId: 1,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    resume: "...",
    status: "Interviewing",
    appliedDate: new Date(),
  },
];

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState(initialJobPostings);
  const [candidates, setCandidates] = useState(initialCandidates);

  // Job Postings (Replace with API calls)
  const handleEditJobPosting = (jobPosting: JobPostingData) => {
    // Example: Navigate to an edit page
    // router.push(`/job-postings/${jobPosting.id}/edit`);
    console.log("Edit job posting:", jobPosting);
  };

  const handleDeleteJobPosting = (jobPostingId: number) => {
    // Example: Delete from database
    // fetch(`/api/job-postings/${jobPostingId}`, { method: 'DELETE' });
    setJobPostings(jobPostings.filter((job) => job.id !== jobPostingId));
  };

  // Candidates (Replace with API calls)
  const handleEditCandidate = (candidate: CandidateData) => {
    // Example: Navigate to an edit page
    // router.push(`/candidates/${candidate.id}/edit`);
    console.log("Edit candidate:", candidate);
  };

  const handleDeleteCandidate = (candidateId: number) => {
    // Example: Delete from database
    // fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' });
    setCandidates(candidates.filter((candidate) => candidate.id !== candidateId));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Recruitment Management</h1>

      <Tabs defaultValue="job-postings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="job-postings">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>
        <TabsContent value="job-postings">
          {/* You can remove the Add Job Posting button if you don't need it */}
          {/* <div className="flex justify-end mb-4">
            <Button>Add Job Posting</Button>
          </div> */}
          <JobPostingsTable
            jobPostings={jobPostings}
            onEdit={handleEditJobPosting}
            onDelete={handleDeleteJobPosting}
          />
        </TabsContent>
        <TabsContent value="candidates">
          {/* You can remove the Add Candidate button if you don't need it */}
          {/* <div className="flex justify-end mb-4">
            <Button>Add Candidate</Button>
          </div> */}
          <CandidatesTable
            candidates={candidates}
            jobPostings={jobPostings}
            onEdit={handleEditCandidate}
            onDelete={handleDeleteCandidate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}