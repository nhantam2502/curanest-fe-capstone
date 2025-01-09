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
  const [candidates, setCandidates] = useState(initialCandidates);
  const [nurseProfiles, setNurseProfiles] = useState(initialNurseProfiles);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [editingJobPosting, setEditingJobPosting] = useState<
    JobPostingData | null
  >(null);
  const [editingCandidate, setEditingCandidate] = useState<CandidateData | null>(
    null
  );

  // Job Postings
  const handleAddJobPosting = (newJobPosting: JobPostingData) => {
    setJobPostings([
      ...jobPostings,
      { ...newJobPosting, id: Math.max(...jobPostings.map((j) => j.id), 0) + 1 },
    ]);
    setShowJobForm(false);
  };

  const handleUpdateJobPosting = (updatedJobPosting: JobPostingData) => {
    setJobPostings(
      jobPostings.map((job) =>
        job.id === updatedJobPosting.id ? updatedJobPosting : job
      )
    );
    setShowJobForm(false);
  };

  const handleEditJobPosting = (jobPosting: JobPostingData) => {
    setEditingJobPosting(jobPosting);
    setShowJobForm(true);
  };

  const handleDeleteJobPosting = (jobPostingId: number) => {
    setJobPostings(jobPostings.filter((job) => job.id !== jobPostingId));
  };

  const handleCloseJobPostingForm = () => {
    setEditingJobPosting(null);
    setShowJobForm(false);
  };

  // Candidates
  const handleAddCandidate = (newCandidate: CandidateData) => {
    setCandidates([
      ...candidates,
      { ...newCandidate, id: Math.max(...candidates.map((c) => c.id), 0) + 1 },
    ]);
    setShowCandidateForm(false);
  };

  const handleUpdateCandidate = (updatedCandidate: CandidateData) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )
    );
    setShowCandidateForm(false);
  };

  const handleEditCandidate = (candidate: CandidateData) => {
    setEditingCandidate(candidate);
    setShowCandidateForm(true);
  };

  const handleDeleteCandidate = (candidateId: number) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== candidateId));
  };

  const handleCloseCandidateForm = () => {
    setEditingCandidate(null);
    setShowCandidateForm(false);
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Recruitment Management</h1>

      <Tabs defaultValue="job-postings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="job-postings">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
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

        {/* Candidates Content */}
        <TabsContent value="candidates">
          <div className="flex justify-end mb-4">
            <Dialog open={showCandidateForm} onOpenChange={setShowCandidateForm}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowCandidateForm(true)}>
                  Add Candidate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCandidate ? "Edit Candidate" : "Add Candidate"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCandidate
                      ? "Make changes to candidate here."
                      : "Enter candidate details below."}
                  </DialogDescription>
                </DialogHeader>
                {/* <CandidateForm
                  candidate={editingCandidate}
                  onSave={
                    editingCandidate
                      ? handleUpdateCandidate
                      : handleAddCandidate
                  }
                  onCancel={handleCloseCandidateForm}
                /> */}
              </DialogContent>
            </Dialog>
          </div>
          <CandidatesTable
            candidates={candidates}
            jobPostings={jobPostings}
            onEdit={handleEditCandidate}
            onDelete={handleDeleteCandidate}
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