import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export interface MajorData {
  id: number;
  name: string;
  description: string;
}

interface MajorFormProps {
  major: MajorData | null;
  onSave: (major: MajorData) => void;
  onCancel: () => void;
}

const MajorForm: React.FC<MajorFormProps> = ({ major, onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (major) {
      setName(major.name);
      setDescription(major.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [major]);

  const handleSave = () => {
    const newMajor: MajorData = {
      id: major ? major.id : Date.now(), 
      name,
      description,
    };
    onSave(newMajor);
  };

  return (
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </div>
  );
};

export default MajorForm;