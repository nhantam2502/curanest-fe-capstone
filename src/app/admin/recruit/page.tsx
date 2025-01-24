"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JobPostingsTable from "./JobPostingsTable";
import CandidatesTable from "./CandidatesTable";
import NurseProfilesTable from "./NurseProfilesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface NurseProfile {
  id: number;
  name: string;
  email: string;
  qualifications: string;
  status: "Pending" | "Approved" | "Rejected";
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

const initialNurseProfiles: NurseProfile[] = [
  {
    id: 1,
    name: "Eve Williams",
    email: "eve.williams@example.com",
    qualifications: "RN, BSN",
    status: "Pending",
  },
  {
    id: 2,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    qualifications: "RN, MSN",
    status: "Approved",
  },
];

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState(initialJobPostings);
  const [nurseProfiles, setNurseProfiles] = useState(initialNurseProfiles);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobPosting, setEditingJobPosting] = useState<
    JobPostingData | null
  >(null);

  // Job Postings
  const handleEditJobPosting = (jobPosting: JobPostingData) => {
    setEditingJobPosting(jobPosting);
    setShowJobForm(true);
  };

  const handleDeleteJobPosting = (jobPostingId: number) => {
    setJobPostings(jobPostings.filter((job) => job.id !== jobPostingId));
  };

  // Nurse Profiles
  const handleApproveProfile = (profileId: number) => {
    setNurseProfiles(
      nurseProfiles.map((profile) =>
        profile.id === profileId ? { ...profile, status: "Approved" } : profile
      )
    );
  };

  const handleRejectProfile = (profileId: number) => {
    setNurseProfiles(
      nurseProfiles.map((profile) =>
        profile.id === profileId ? { ...profile, status: "Rejected" } : profile
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Quản lý tuyển dụng</h1>

      <Tabs defaultValue="job-postings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="job-postings">Job Postings</TabsTrigger>
          <TabsTrigger value="nurse-profiles">Nurse Profiles</TabsTrigger>
        </TabsList>

        {/* Job Postings Content */}
        <TabsContent value="job-postings">
          <div className="flex justify-end mb-4">
            <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowJobForm(true)}>
                  Add Job Posting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingJobPosting
                      ? "Edit Job Posting"
                      : "Add Job Posting"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJobPosting
                      ? "Make changes to job posting."
                      : "Enter job posting details below."}
                  </DialogDescription>
                </DialogHeader>
                {/* <JobPostingForm
                  jobPosting={editingJobPosting}
                  onSave={
                    editingJobPosting
                      ? handleUpdateJobPosting
                      : handleAddJobPosting
                  }
                  onCancel={handleCloseJobPostingForm}
                /> */}
              </DialogContent>
            </Dialog>
          </div>
          <JobPostingsTable
            jobPostings={jobPostings}
            onEdit={handleEditJobPosting}
            onDelete={handleDeleteJobPosting}
          />
        </TabsContent>

        {/* Nurse Profiles Content */}
        <TabsContent value="nurse-profiles">
          <NurseProfilesTable
            nurseProfiles={nurseProfiles}
            onApprove={handleApproveProfile}
            onReject={handleRejectProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}