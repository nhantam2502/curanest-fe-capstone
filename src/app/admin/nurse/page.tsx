import NurseTable from "@/app/admin/nurse/NurseTable";
import { Button } from "@/components/ui/button";
import { NurseForStaff } from "@/types/nurse";
import Link from "next/link";

const nurses: NurseForStaff[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    department: "Pediatrics",
    status: "Active",
    dob: "1990-03-15",
    citizen_id: "123456789",
    address: "123 Elm Street",
    ward: "Downtown",
    district: "Central",
    city: "Metropolis",
    gender: "Female",
    major: "Pediatric Nursing",
    slogan: "Caring for the little ones!",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    department: "Emergency",
    status: "Inactive",
    dob: "1985-07-22",
    citizen_id: "987654321",
    address: "456 Oak Avenue",
    ward: "Uptown",
    district: "Westside",
    city: "Gotham",
    gender: "Male",
    major: "Emergency Medicine",
    slogan: "Every second counts.",
  },
  {
    id: 3,
    name: "Clara Lee",
    email: "clara.lee@example.com",
    department: "Oncology",
    status: "Active",
    dob: "1992-11-30",
    citizen_id: "112233445",
    address: "789 Pine Drive",
    ward: "East Village",
    district: "Eastside",
    city: "Star City",
    gender: "Female",
    major: "Oncology Nursing",
    slogan: "Hope begins here.",
  },
];

export default function NurseManagementPage() {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quản lý điều dưỡng</h1>
        <Link href="/admin/nurse/create-nurse">
          <Button className="mb-4"> Thêm</Button>
        </Link>
      </div>
      <NurseTable Nurses={nurses} />
    </div>
  );
}
