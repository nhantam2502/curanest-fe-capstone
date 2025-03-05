import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NurseForStaff } from "@/types/nurse";

interface NurseFormProps {
  nurse: NurseForStaff;
  onSave: (nurse: NurseForStaff) => void;
  onClose: () => void;
}

export default function EditNurseForm({
  nurse,
  onSave,
  onClose,
}: NurseFormProps) {
  return (
    <DialogContent className="max-w-[900px]"> {/* Increased width for better grid display */}
      <DialogHeader>
        <DialogTitle>Edit Nurse</DialogTitle>
        <DialogDescription>Edit the nurse details</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={nurse.name}
            onChange={(e) => onSave({ ...nurse, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={nurse.email}
            onChange={(e) => onSave({ ...nurse, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={nurse.department}
            onChange={(e) => onSave({ ...nurse, department: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            value={nurse.status}
            onChange={(e) => onSave({ ...nurse, status: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Input
            id="major"
            value={nurse.major}
            onChange={(e) => onSave({ ...nurse, major: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            value={nurse.dob}
            onChange={(e) => onSave({ ...nurse, dob: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="citizen_id">Citizen ID</Label>
          <Input
            id="citizen_id"
            value={nurse.citizen_id}
            onChange={(e) => onSave({ ...nurse, citizen_id: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={nurse.address}
            onChange={(e) => onSave({ ...nurse, address: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ward">Ward</Label>
          <Input
            id="ward"
            value={nurse.ward}
            onChange={(e) => onSave({ ...nurse, ward: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={nurse.district}
            onChange={(e) => onSave({ ...nurse, district: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={nurse.city}
            onChange={(e) => onSave({ ...nurse, city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            value={nurse.gender}
            onChange={(e) => onSave({ ...nurse, gender: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            id="slogan"
            value={nurse.slogan}
            onChange={(e) => onSave({ ...nurse, slogan: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(nurse)}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
