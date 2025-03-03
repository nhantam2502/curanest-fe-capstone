import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DetailNurseProps } from "@/types/nurse";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import nursesData from "@/dummy_data/dummy_nurse.json";

const Feedback = ({ nurse }: { nurse: DetailNurseProps["nurse"] }) => {
  const getServicesBySpecialization = (specialization: string) => {
    const nurse = nursesData.find((n) => n.specialization === specialization);
    return nurse ? nurse.services : [];
  };
  
  const services = getServicesBySpecialization(nurse.specialization);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      avatar: "/patient-avatar.jpg",
      rating: 5,
      date: "15 tháng 3, 2024",
      comment: "Dịch vụ chăm sóc tôi nhận được rất tuyệt vời.",
      service: services[0] || "Dịch vụ khác",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      avatar: "/family-avatar.jpg",
      rating: 4,
      date: "10 tháng 3, 2024",
      comment:
        "Việc có điều dưỡng chăm sóc người thân của tôi thực sự là một điều tuyệt vời.",
      service: services[1] || "Dịch vụ khác",
    },
    {
      id: 3,
      name: "Lê Minh Tuấn",
      avatar: "/patient-avatar-2.jpg",
      rating: 3,
      date: "5 tháng 3, 2024",
      comment: "Dịch vụ chăm sóc mà tôi nhận được rất xuất sắc.",
      service: services[2] || "Dịch vụ khác",
    },
  ];
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ));
  };

  const averageRating =
    testimonials.reduce((acc, curr) => acc + curr.rating, 0) /
    testimonials.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Trung bình tổng đánh giá</h2>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(5)}</div>
            <span className="text-2xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-gray-500">
              ({testimonials.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {testimonials.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-6 mb-3">
                <Avatar className="w-[80px] h-[80px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold">{review.name}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-lg text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>

              <p className="text-xl mb-3">{review.comment}</p>
              <Badge className="rounded-[50px] bg-[#e5ab47] text-white border-[#e5ab47] text-lg mb-4 hover:bg-[#e5ab47] cursor-pointer">
                {review.service}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Feedback;
