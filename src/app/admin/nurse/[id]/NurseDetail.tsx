"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetAllNurseDetail } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { ChevronLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NurseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [nurseDetail, setNurseDetail] = useState<GetAllNurseDetail | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNurseDetail = async (): Promise<void> => {
      if (!id) {
        setError("Không thể tải thông tin điều dưỡng.");
        return;
      }
      const nurse_id = Array.isArray(id) ? id[0] : id;
      try {
        const response = await nurseApiRequest.getAllNurseDetail(nurse_id);
        console.log("API response:", response);
        setNurseDetail(response.payload.data);
      } catch (err) {
        console.error("Error fetching nurse detail:", err);
        setError("Không thể tải thông tin điều dưỡng.");
      }
    };

    fetchNurseDetail();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!nurseDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <Button className="mb-4" variant="outline" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Trở lại
      </Button>
      <div className="flex items-center space-x-4">
        <img
          src={nurseDetail["nurse-picture"] || "/placeholder-avatar.png"}
          alt={nurseDetail["nurse-name"]}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{nurseDetail["nurse-name"]}</h2>
          <p className="text-gray-600">
            Slogan: {nurseDetail.slogan || "No slogan"}
          </p>
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < nurseDetail.rate ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              ({nurseDetail.rate} / 5)
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4 space-y-3">
        <DetailItem label="Role" value={nurseDetail.role} />
        <DetailItem label="Email" value={nurseDetail.email} />
        <DetailItem label="Phone Number" value={nurseDetail["phone-number"]} />
        <DetailItem label="Gender" value={nurseDetail.gender ? "Nam" : "Nữ"} />
        <DetailItem label="DOB" value={nurseDetail.dob} />
        <DetailItem label="Address" value={nurseDetail.address} />
        <DetailItem label="Ward" value={nurseDetail.ward} />
        <DetailItem label="District" value={nurseDetail.district} />
        <DetailItem label="City" value={nurseDetail.city} />
        <DetailItem
          label="Current Work Place"
          value={nurseDetail["current-work-place"]}
        />
        <DetailItem
          label="Education Level"
          value={nurseDetail["education-level"]}
        />
        <DetailItem label="Experience" value={nurseDetail.experience} />
        <DetailItem label="Certificate" value={nurseDetail.certificate} />
        <div className="col-span-2">
          <h3 className="font-medium text-gray-700">Google Drive URL:</h3>
          <a
            href={nurseDetail["google-drive-url"]}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {nurseDetail["google-drive-url"]}
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | boolean;
}) {
  return (
    <div className="flex items-center">
      <span className="font-medium text-gray-700 mr-2">{label}:</span>
      <span className="text-gray-900">{String(value) || "N/A"}</span>
    </div>
  );
}
