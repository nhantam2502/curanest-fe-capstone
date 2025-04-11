"use client";

import { useEffect, useState } from "react";
import DetailNurse from "@/app/components/Nursing/DetailNurse";
import { DetailNurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const DetailNursePage = ({
  params,
}: {
  params: { serviceId: string; nursingId: string };
}) => {
  const { nursingId } = params;
  const [detailNurse, setDetailNurse] = useState<DetailNurseItemType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const serviceID = searchParams.get("serviceID");

  useEffect(() => {
    const fetchDetailNurse = async () => {
      try {
        const response = await nurseApiRequest.getDetailNurse(nursingId);
        setDetailNurse(response.payload.data);
      } catch (error) {
        setError("Không thể tải thông tin điều dưỡng.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailNurse();
  }, [nursingId]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#FEFEFE] to-[#FEF0D7] bg-opacity-50 z-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-[#A8E0E9] opacity-30 animate-pulse"></div>
            <Loader2
              className="h-12 w-12 animate-spin text-[#64D1CB]"
              aria-label="Loading..."
            />
          </div>
          <div className="text-[#64D1CB] text-sm font-medium mt-4 animate-fade-in">
            Đang tải...
          </div>
        </div>
      </div>
    );
  if (error) return <p>{error}</p>;
  if (!detailNurse) return <p>Điều dưỡng không tồn tại.</p>;

  return (
    <div>
      <DetailNurse nurse={detailNurse} serviceID={serviceID ?? ""} />
    </div>
  );
};

export default DetailNursePage;
