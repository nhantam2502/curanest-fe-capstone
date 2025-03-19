import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { infoNurseRes, ProfileData } from "@/types/nurse";

interface ExperienceTabProps {
  profileData: infoNurseRes;
}

export function ExperienceTab({
  profileData,
}: ExperienceTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          Kinh nghiệm làm việc
        </h2>
        <div className="space-y-6">
          {/* {profileData.experience.map((exp, index) => (
            <div
              key={index}
              className="border-l-2 border-gray-200 pl-4 py-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600">{exp.workplace}</p>
                  <p className="text-gray-500 text-sm">
                    {exp.department}
                  </p>
                </div>
                <Badge variant="outline">{exp.duration}</Badge>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-gray-600 text-sm">
                    • {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
          {profileData.data.experience}
        </div>
      </CardContent>
    </Card>
  );
}