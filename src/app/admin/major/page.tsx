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
import MajorForm, { MajorData } from "./MajorForm";
import MajorTable from "./MajorTable";

const initialMajors: MajorData[] = [
  { id: 1, name: "Computer Science", description: "Study of computers and computational systems." },
  { id: 2, name: "Business Administration", description: "Study of business principles and practices." },
  { id: 3, name: "Psychology", description: "Study of mind and behavior." },
];

export default function MajorPage() {
  const [majors, setMajors] = useState<MajorData[]>(initialMajors);
  const [showForm, setShowForm] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorData | null>(null);

  const handleAddMajor = (newMajor: MajorData) => {
    setMajors([...majors, { ...newMajor, id: Date.now() }]);
    setShowForm(false);
  };

  const handleUpdateMajor = (updatedMajor: MajorData) => {
    setMajors(
      majors.map((major) =>
        major.id === updatedMajor.id ? updatedMajor : major
      )
    );
    setShowForm(false);
  };

  const handleEditMajor = (major: MajorData) => {
    setEditingMajor(major);
    setShowForm(true);
  };

  const handleDeleteMajor = (majorId: number) => {
    setMajors(majors.filter((major) => major.id !== majorId));
  };

  const handleCloseForm = () => {
    setEditingMajor(null);
    setShowForm(false);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý chuyên khoa</h1>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowForm(true)}>Thêm</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingMajor ? "Edit Major" : "Add Major"}
              </DialogTitle>
              <DialogDescription>
                {editingMajor
                  ? "Make changes to major information."
                  : "Enter major details below."}
              </DialogDescription>
            </DialogHeader>
            <MajorForm
              major={editingMajor}
              onSave={editingMajor ? handleUpdateMajor : handleAddMajor}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      <MajorTable
        majors={majors}
        onEdit={handleEditMajor}
        onDelete={handleDeleteMajor}
      />
    </div>
  );
}