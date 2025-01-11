"use client";
import EditPatientRecord from "@/app/components/Relatives/EditPatientRecord";
import dummy_profile from "@/dummy_data/dummy_profile.json";
import { useParams } from 'next/navigation';

export default function EditPatientPage() {
  const { id } = useParams();
  
  // Tìm profile tương ứng với id
  const profile = dummy_profile.find(p => p.id === Number(id));
  
  if (!profile) {
    return <div>Không tìm thấy hồ sơ bệnh nhân</div>;
  }

  return <EditPatientRecord profile={profile} />;
}