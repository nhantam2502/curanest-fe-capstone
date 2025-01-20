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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";

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
    <Card className="mb-4">
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
      <CardFooter className="flex justify-end gap-2">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">View Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {candidate.firstName} {candidate.lastName}
              </DialogTitle>
              <DialogDescription>
                Full profile of {candidate.firstName} {candidate.lastName}
              </DialogDescription>
            </DialogHeader>
            <div
              className="py-4"
              dangerouslySetInnerHTML={{ __html: candidate.fullProfile }}
            ></div>
            <DialogFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    onClick={() => setOpenDialog(true)}
                    disabled={candidate.status !== "pending"}
                  >
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently approve
                      this candidate.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenDialog(true)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setOpenDialog(true)}
                    disabled={candidate.status !== "pending"}
                  >
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently reject
                      this candidate.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenDialog(true)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default CandidateCard;