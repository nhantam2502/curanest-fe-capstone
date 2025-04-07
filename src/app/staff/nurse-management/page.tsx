import NurseTable from "@/app/staff/nurse-management/NurseTable";
import { Button } from "@/components/ui/button";
import { NurseForStaff } from "@/types/nurse";
import Link from "next/link";

const nurses: NurseForStaff[] = [
  {
    id: 1,
    avatar: "https://example.com/avatar1.jpg",
    name: "Nguyễn Thị A",
    email: "nguyena@example.com",
    department: "Pediatrics",
    status: "Active",
    dob: "1990-03-15",
    citizen_id: "123456789",
    address: "123 phố Bạch Đằng",
    ward: "Downtown",
    district: "Central",
    city: "Metropolis",
    gender: "Female",
    major: "Chuyên khoa nhi",
    slogan: "",
    "phone-number": "123-456-7890",
  },
  {
    id: 2,
    avatar: "https://example.com/avatar2.jpg",
    name: "Nguyễn Văn B",
    email: "nguyenb@example.com",
    department: "Emergency",
    status: "Inactive",
    dob: "1985-07-22",
    citizen_id: "987654321",
    address: "456 đuờng Trần Hưng Đạo",
    ward: "Uptown",
    district: "Westside",
    city: "Gotham",
    gender: "Male",
    major: "Khoa cấp cứu",
    slogan: "Every second counts.",
    "phone-number": "123-456-7890",
  },
  {
    id: 3,
    avatar: "https://example.com/avatar3.jpg",
    name: "Trần Thị C",
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
    major: "Chuyên khoa sản",
    slogan: "Hope begins here.",
    "phone-number": "123-456-7890",
  },
];

export default function NurseManagementPage() {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quản lý điều dưỡng</h1>
      </div>
      <NurseTable Nurses={nurses} />
    </div>
  );
}
