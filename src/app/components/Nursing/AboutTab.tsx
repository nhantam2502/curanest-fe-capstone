import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { infoNurseRes } from "@/types/nurse";
import { User, Mail, Phone, Map, Calendar, Award, Briefcase } from "lucide-react";

interface AboutTabProps {
  profileData: infoNurseRes;
}

export function AboutTab({ profileData }: AboutTabProps) {
  const formatDOB = (dob: string): string => {
    if (dob.includes("/")) return dob;

    if (dob.includes("-")) {
      const date = new Date(dob);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    }

    return dob;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
         
            Thông tin cá nhân & liên hệ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">Ngày sinh</p>
                  <p className="text-gray-600">{formatDOB(profileData.data.dob)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p className="text-gray-600">{profileData.data["phone-number"]}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{profileData.data.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Map className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="text-gray-600">
                    {`${profileData.data.address}, ${profileData.data.ward}, ${profileData.data.district}, ${profileData.data.city}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Kỹ năng & Chuyên môn
          </h2>
          <div className="space-y-4">
            {profileData.data.skills && profileData.data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.data.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có thông tin kỹ năng</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}