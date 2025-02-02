"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { NurseService } from "@/types/nurse";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Search } from "lucide-react";
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

interface NurseListProps {
  nurses: NurseService[];
  onAddNurse: (newNurse: NurseService) => void;
  onDeleteNurse: (nurseId: number) => void;
}

function NurseList({
  nurses,
  onAddNurse,
  onDeleteNurse,
}: NurseListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNurseName, setNewNurseName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddNurse = () => {
    if (!newNurseName.trim()) {
      alert("Please enter a nurse name.");
      return;
    }

    const newNurse: NurseService = {
      id: Date.now(), // Replace with your ID generation logic
      name: newNurseName,
      major_id: 0, // You'll need to set the appropriate majorId
    };

    onAddNurse(newNurse);
    setNewNurseName("");
    setIsAddDialogOpen(false);
  };

  // Filter nurses based on search term
  const filteredNurses = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Điều dưỡng</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm 1 điều dưỡng mới</DialogTitle>
              <DialogDescription>
                Nhập tên của điều dưỡng.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={newNurseName}
                  onChange={(e) => setNewNurseName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" onClick={handleAddNurse}>
                Thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Use filteredNurses here */}
        {filteredNurses.map((nurse) => (
          <Card key={nurse.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {nurse.name}
              </CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có muốn xoá điều dưỡng này không?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteNurse(nurse.id)}>
                      Xoá
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NurseList;