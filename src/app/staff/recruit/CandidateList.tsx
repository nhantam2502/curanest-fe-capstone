// components/CandidateList.tsx

import CandidateCard, { Candidate } from "./CandidateCard";

interface CandidateListProps {
  candidates: Candidate[];
  onUpdateCandidateStatus: (id: number, status: "approved" | "rejected") => void;
}

function CandidateList({ candidates, onUpdateCandidateStatus }: CandidateListProps) {
  return (
    <div>
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onUpdateCandidateStatus={onUpdateCandidateStatus}
        />
      ))}
    </div>
  );
}

export default CandidateList;