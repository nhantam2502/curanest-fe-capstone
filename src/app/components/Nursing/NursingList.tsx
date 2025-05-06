import React, { useEffect, useState } from "react";
import { NurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import GuestNursingCard from "./GuestNursingCard";

const NursingList = ({ serviceId }: { serviceId: string }) => {
  const [nurses, setNurses] = useState<NurseItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return; // Chỉ fetch khi serviceId có giá trị

    const fetchNurses = async () => {
      setLoading(true);
      try {
        const response = await nurseApiRequest.getListNurse(
          serviceId,
          null,
          1,
          3,
          null
        );

        const nursesData = response?.payload?.data || []; // Đảm bảo không bị undefined
        setNurses(nursesData.slice(0, 3)); // Giới hạn 3 kết quả đầu tiên
        console.log(nursesData);
      } catch (err) {
        console.error("Error fetching nurses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, [serviceId]); // Đúng biến cần theo dõi

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
       gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]"
    >
      {nurses.map((nurse) => (
        <GuestNursingCard
          key={nurse["nurse-id"]}
          nurse={nurse}
          serviceID={serviceId}
        />
      ))}
    </div>
  );
};

export default NursingList;
