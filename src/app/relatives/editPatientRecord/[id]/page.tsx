"use client";
import { useEffect, useState } from "react";
import EditPatientRecord from "@/app/components/Relatives/EditPatientRecord";
import { useParams } from "next/navigation";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { PatientRecord } from "@/types/patient";
import { Loader2 } from "lucide-react";

export default function EditPatientPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<PatientRecord | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await patientApiRequest.getPatientRecord(); 
        const foundProfile = response.payload.data.find(
          (p: PatientRecord) => p.id === id
        );

        if (foundProfile) {
          setProfile(foundProfile);
        } else {
          setError("Không tìm thấy hồ sơ bệnh nhân");
        }
        setLoading(false);
      } catch (err) {
        console.log("Error fetching patient record data: ", err);
        setError("Không thể tải hồ sơ bệnh nhân");
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="relative">
          {/* Outer ring with pulse effect */}
          <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>

          {/* Inner spinner */}
          <Loader2
            className="h-12 w-12 animate-spin text-[#64D1CB]"
            aria-label="Loading..."
          />
        </div>
        <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
          Đang tải...
        </div>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl text-red-500 mt-10">{error}</div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-2xl text-red-500 mt-10">
        Không tìm thấy hồ sơ bệnh nhân
      </div>
    );
  }

  return <EditPatientRecord profile={profile} />;
}
