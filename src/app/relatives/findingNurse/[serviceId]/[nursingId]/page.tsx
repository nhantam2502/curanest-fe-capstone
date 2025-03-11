"use client";

import { useEffect, useState } from "react";
import DetailNurse from "@/app/components/Nursing/DetailNurse";
import { DetailNurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";

const DetailNursePage = ({ params }: { params: { serviceId: string; nursingId: string } }) => {
  const { nursingId } = params;
  const [detailNurse, setDetailNurse] = useState<DetailNurseItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailNurse = async () => {
      try {
        const response = await nurseApiRequest.getDetailNurse(nursingId);
        setDetailNurse(response.payload.data);
        console.log(response.payload.data);
      } catch (error) {
        setError("Không thể tải thông tin điều dưỡng.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailNurse();
  }, [nursingId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!detailNurse) return <p>Điều dưỡng không tồn tại.</p>;

  return (
    <div>
      <DetailNurse nurse={detailNurse} />
    </div>
  );
};

export default DetailNursePage;
