// components/CandidateCard.tsx
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CandidateCardProps {
  candidate: Candidate;
  onUpdateCandidateStatus: (id: number, status: "approved" | "rejected") => void;
}

export type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  appliedDate: string;
  profileSummary: string;
  fullProfile: string;
};

function CandidateCard({
  candidate,
  onUpdateCandidateStatus,
}: CandidateCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const handleApprove = () => {
    onUpdateCandidateStatus(candidate.id, "approved");
    setOpenDialog(false);
    toast({
      variant: "default",
      title: "Candidate Approved",
      description: `${candidate.firstName} ${candidate.lastName} has been approved.`,
    });
  };

  const handleReject = () => {
    onUpdateCandidateStatus(candidate.id, "rejected");
    setOpenDialog(false);
    toast({
      variant: "destructive",
      title: "Candidate Rejected",
      description: `${candidate.firstName} ${candidate.lastName} has been rejected.`,
    });
  };

  return (
    <Card className="mb-4" onClick={() => router.push(`/staff/recruit/${candidate.id}`)}>
      <CardHeader>
        <CardTitle>
          {candidate.firstName} {candidate.lastName}
        </CardTitle>
        <CardDescription>
          Applied for: {candidate.position} on{" "}
          {candidate.appliedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{candidate.profileSummary}</p>
        <div className="mt-2">
          <Badge
            variant={
              candidate.status === "pending"
                ? "secondary"
                : candidate.status === "approved"
                ? "default"
                : "destructive"
            }
          >
            {candidate.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default CandidateCard;