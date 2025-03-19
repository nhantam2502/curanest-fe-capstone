"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { infoNurseRes } from "@/types/nurse";
import { AboutTab } from "@/app/components/Nursing/AboutTab";
import { ExperienceTab } from "@/app/components/Nursing/ExperienceTab";
import { EducationTab } from "@/app/components/Nursing/EducationTab";
import { CertificatesTab } from "@/app/components/Nursing/CertificatesTab";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { Loader2 } from "lucide-react";

export default function NurseProfile() {
  const [profileData, setProfileData] = useState<infoNurseRes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNurseData = async () => {
      try {
        setLoading(true);
        const response = await nurseApiRequest.getInfoNurseMe();
        
        if (response.status === 200 && response.payload) {
          setProfileData(response.payload);
        } else {
          setError("Không thể tải thông tin. Vui lòng thử lại sau.");
        }
       
      } catch (err) {
        console.error("Failed to fetch nurse profile data:", err);
        setError("Không thể tải thông tin điều dưỡng. Vui lòng thử lại sau.");
        // Keep the initialProfileData as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchNurseData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
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
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return <div>Không tìm thấy thông tin của điều dưỡng.</div>;
  }

  const { data } = profileData;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <Avatar className="w-28 h-28">
              <AvatarImage src={data["nurse-picture"]} />
              <AvatarFallback>
                {data["full-name"].slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {data["full-name"]}
              </h1>
              {/* <p className="text-gray-600 mb-1">
                {profileData.professional_info.position}
              </p>
              <p className="text-gray-500 text-sm">
                {profileData.professional_info.department}
              </p> */}
              <p className="text-gray-500 text-sm">
                {data["current-work-place"]}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 italic">
            {data.slogan}
          </p>
        </div>
      </div>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
          <TabsTrigger value="about">Thông tin</TabsTrigger>
          <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
          <TabsTrigger value="education">Học vấn</TabsTrigger>
          <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <AboutTab 
            profileData={profileData}
          />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceTab 
            profileData={profileData}
          />
        </TabsContent>

        <TabsContent value="education">
          <EducationTab 
            profileData={profileData}
          />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesTab 
            profileData={profileData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}