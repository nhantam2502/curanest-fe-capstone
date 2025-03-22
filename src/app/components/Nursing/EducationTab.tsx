import { Card, CardContent } from "@/components/ui/card";
import { infoNurseRes } from "@/types/nurse";

interface EducationTabProps {
  profileData: infoNurseRes;
}

export function EducationTab({ profileData }: EducationTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Trình độ học vấn</h2>

          {/* {profileData.education.map((edu, index) => (
            <div
              key={index}
              className="border-l-2 border-gray-200 pl-4 py-2 space-y-2"
            >
              <h3 className="text-lg font-medium">{edu.degree}</h3>
              <p className="text-gray-600">{edu.major}</p>
              <p className="text-gray-500">{edu.university}</p>
              <p className="text-gray-500 text-sm">{edu.duration}</p>
            </div>
          ))} */}
          {profileData.data["education-level"]}
        </div>
      </CardContent>
    </Card>
  );
}
