"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Major } from "./page";

interface AddMajorModalProps {
  onAddMajor: (newMajor: Major) => void;
}

function AddMajorModal({ onAddMajor }: AddMajorModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMajorName, setNewMajorName] = useState("");

  const handleAddMajor = () => {
    if (!newMajorName.trim()) {
      alert("Please enter a major name.");
      return;
    }

    const newMajor: Major = {
      id: Date.now(), 
      name: newMajorName,
    };

    onAddMajor(newMajor);
    setNewMajorName("");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Thêm chuyên môn</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Major</DialogTitle>
          <DialogDescription>
            Enter the name of the new major.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newMajorName}
              onChange={(e) => setNewMajorName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleAddMajor}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddMajorModal;