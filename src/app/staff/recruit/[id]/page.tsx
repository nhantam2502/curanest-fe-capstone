"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dummyCandidates from "../../../../dummy_data/dummy_candidate.json";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Candidate } from "../CandidateCard";
import { Label } from "@/components/ui/label";

function CandidateProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { toast } = useToast();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    // Fetch candidate data based on ID (replace with your API call)
    const fetchCandidate = async () => {
      const candidateId = Number(id); // Convert id to number
      const foundCandidate = dummyCandidates.find((c) => c.id === candidateId);

      if (foundCandidate) {
        setCandidate(foundCandidate);
      } else {
        console.error("Candidate not found");
        // router.replace("/404");
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleUpdateCandidateStatus = (
    candidateId: number,
    status: "approved" | "rejected"
  ) => {
    // In a real app, you would make an API call here to update the database
    // For now, we'll just update the status in the dummy data
    // const updatedCandidates = dummyCandidates.map((c) =>
    //   c.id === candidateId ? { ...c, status: status } : c
    // );

    // Update the candidate state
    setCandidate((prevCandidate) =>
      prevCandidate ? { ...prevCandidate, status: status } : null
    );

    // Update local storage or global state with updatedCandidates (if applicable)

    // Show a success message
    const message =
      status === "approved" ? "Candidate Approved" : "Candidate Rejected";
    toast({
      variant: status === "approved" ? "default" : "destructive",
      title: message,
      description: `${candidate?.firstName} ${candidate?.lastName} has been ${status}.`,
    });

    // Optionally, redirect to the recruitment page after a delay
    setTimeout(() => {
      router.push("/staff/recruit");
    }, 2000); // Redirect after 2 seconds
  };

  const handleApprove = () => {
    if (candidate) {
      handleUpdateCandidateStatus(candidate.id, "approved");
    }
  };

  const handleReject = () => {
    if (candidate) {
      handleUpdateCandidateStatus(candidate.id, "rejected");
    }
  };

  if (!candidate) {
    return <div>Loading...</div>; // Or a more sophisticated loading state
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {candidate.firstName[0]}
              {candidate.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            {candidate.firstName} {candidate.lastName}
            <CardDescription>{candidate.position}</CardDescription>
          </div>
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <p>{candidate.email}</p>
        </div>
        <div>
          <Label>Phone</Label>
          <p>{candidate.phone}</p>
        </div>
        <div>
          <Label>Applied Date</Label>
          <p>{candidate.appliedDate}</p>
        </div>
        <div>
          <Label>Status</Label>
          <p>
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
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Label>Profile Summary</Label>
        <p className="text-sm">{candidate.profileSummary}</p>
      </div>

      <div className="mt-6">
        <Label>Full Profile</Label>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: candidate.fullProfile }}
        />
      </div>

      <div className="mt-6">
        <Label>Schedule Interview</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-[280px] justify-start text-left font-normal"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" disabled={candidate.status !== "pending"}>
            Approve
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently approve this
              candidate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            disabled={candidate.status !== "pending"}
          >
            Reject
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently reject this
              candidate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CandidateProfilePage;
