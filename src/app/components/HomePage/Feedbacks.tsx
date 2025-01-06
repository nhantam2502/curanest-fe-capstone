import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

const Feedbacks = () => {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      role: "Bệnh nhân",
      avatar: "/patient-avatar.jpg",
      rating: 5,
      date: "15 tháng 3, 2024",
      comment:
        "Dịch vụ chăm sóc tôi nhận được rất tuyệt vời. Đội ngũ điều dưỡng chuyên nghiệp, chu đáo và luôn quan tâm đến mọi nhu cầu của tôi. Tôi không thể đòi hỏi dịch vụ nào tốt hơn.",
      service: "Chăm sóc tại nhà",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      role: "Người nhà",
      avatar: "/family-avatar.jpg",
      rating: 5,
      date: "10 tháng 3, 2024",
      comment:
        "Việc có điều dưỡng đến nhà chăm sóc mẹ già của tôi thực sự là một điều tuyệt vời. Trình độ chuyên môn và sự tận tâm thể hiện rất đáng khâm phục.",
      service: "Chăm sóc người già",
    },
    {
      id: 3,
      name: "Lê Minh Tuấn",
      role: "Bệnh nhân",
      avatar: "/patient-avatar-2.jpg",
      rating: 5,
      date: "5 tháng 3, 2024",
      comment:
        "Dịch vụ chăm sóc hậu phẫu mà tôi nhận được rất xuất sắc. Điều dưỡng có kiến thức chuyên môn cao và đảm bảo tôi hiểu rõ hoàn toàn về quá trình phục hồi của mình.",
      service: "Chăm sóc hậu phẫu",
    },
  ];

  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, index) => (
      <StarIcon key={index} className="w-5 h-5 fill-yellow-400 text-yellow-200" />
    ));
  };

  return (
    <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-10">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full place-items-center">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="w-full max-w-[480px] bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-base text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-[#71DDD7]/10 text-[#71DDD7] hover:bg-[#71DDD7]/20 text-base px-4 py-1">
                    {testimonial.service}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-4">{renderStars(testimonial.rating)}</div>
                <p className="text-gray-600 mb-4 text-lg leading-relaxed line-clamp-3">{testimonial.comment}</p>
                <div className="text-base text-gray-400">{testimonial.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;