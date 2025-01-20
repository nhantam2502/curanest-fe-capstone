"use client";

import { useState } from "react";
import { Candidate } from "./CandidateCard";
import dummyCandidates from "../../../dummy_data/dummy_candidate.json";
import CandidateList from "./CandidateList";

function RecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(dummyCandidates);

  const handleUpdateCandidateStatus = (
    id: number,
    status: "pending" | "approved" | "rejected"
  ) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((c) =>
        c.id === id ? { ...c, status: status } : c
      )
    );

  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recruitment Dashboard</h1>
      <CandidateList
        candidates={candidates}
        onUpdateCandidateStatus={handleUpdateCandidateStatus}
      />
    </div>
  );
}

export default RecruitmentPage;