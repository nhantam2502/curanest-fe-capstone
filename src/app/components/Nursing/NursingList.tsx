import React, { useEffect, useState } from "react";
import { NurseItemType } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { Loader2 } from "lucide-react";
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
          serviceId , 
          null,               
          1,
          10,                 
          null             
        );

        const nursesData = response?.payload?.data || []; 
        setNurses(nursesData.slice(0, 3)); 
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
          service=""
        />
      ))}
    </div>
  );
};

export default NursingList;
