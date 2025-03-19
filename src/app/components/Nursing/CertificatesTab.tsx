import { Card, CardContent } from "@/components/ui/card";
import { infoNurseRes } from "@/types/nurse";

interface CertificatesTabProps {
  profileData: infoNurseRes;
}

export function CertificatesTab({
  profileData,
}: CertificatesTabProps) {
  const certificates = profileData.data.certificate
  ? profileData.data.certificate.split(" - ")
  : [];

  return (
    // <Card>
    //   <CardContent className="p-6">
    //     <h2 className="text-xl font-semibold mb-6">Chứng chỉ</h2>
    //     <div className="space-y-6">
    //       {/* {profileData.certificates.map((cert, index) => (
    //         <div key={index} className="border-b border-gray-200 pb-4">
    //           <div>
    //             <h3 className="text-lg font-medium">{cert.name}</h3>
    //             <p className="text-gray-600">{cert.issuer}</p>
    //             <p className="text-gray-500 text-sm">
    //               Năm cấp: {cert.year} - Hết hạn: {cert.expiry}
    //             </p>
    //           </div>
    //         </div>
    //       ))} */}
    //       {profileData.data.certificate}
    //     </div>
    //   </CardContent>
    // </Card>

    <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-6">Chứng chỉ</h2>
      <div className="space-y-4">
        {certificates.map((cert, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium">{cert}</h3>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  );
}