import Image from "next/image";
import Image1 from "../../../../public/t1.png";
import Image2 from "../../../../public/t2.png";
import Image3 from "../../../../public/t3.png";
import Image4 from "../../../../public/t4.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TreatmentPage = () => {
  const treatments = [
    {
      id: 1,
      title: "Theo dõi huyết áp tại nhà",
      description: "Người dùng book điều dưỡng đến nhà để đo và theo dõi huyết áp định kỳ, hỗ trợ tư vấn về tình trạng sức khỏe.",
      imageSrc: Image1,
    },
    {
      id: 2,
      title: "Tiêm thuốc tại nhà",
      description: "Người dùng book điều dưỡng về nhà để tiêm thuốc hoặc thực hiện các thủ thuật y tế cơ bản.",
      imageSrc: Image2,
    },
    {
      id: 3,
      title: "Chăm sóc bệnh nhân sau phẫu thuật",
      description: "Người dùng book điều dưỡng để hỗ trợ bệnh nhân sau phẫu thuật, bao gồm thay băng, chăm sóc vết thương, và hỗ trợ phục hồi.",
      imageSrc: Image3,
    },
    {
      id: 4,
      title: "Chăm sóc người già và trẻ nhỏ",
      description: "Người dùng book điều dưỡng đến nhà để chăm sóc người già hoặc trẻ nhỏ, đảm bảo họ được chăm sóc chu đáo và đúng cách.",
      imageSrc: Image4,
    },
  ];
  

  return (
    <div className="p-10">
      <p className="flex justify-center items-center m-10 text-4xl font-semibold">
        CURANEST <span className="text-lime-500 ml-2">DỊCH VỤ</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-5">
        {treatments.map((treatment) => (
          <Card
            key={treatment.id}
            className="flex flex-col items-center p-5 shadow-lg rounded-xl transform transition-transform hover:scale-105"
          >
            <CardHeader className="flex flex-col items-center">
              <div className="img-box mb-3">
                <Image
                  src={treatment.imageSrc}
                  alt={treatment.title}
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-xl font-semibold">{treatment.title}</p>
            </CardHeader>
            <CardContent className="text-wrap text-left break-words text-gray-400">
              <p>{treatment.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TreatmentPage;
