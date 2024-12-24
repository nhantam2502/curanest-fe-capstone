import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

const Feedbacks = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Patient",
      avatar: "/patient-avatar.jpg",
      rating: 5,
      date: "March 15, 2024",
      comment:
        "The care I received was exceptional. The nursing staff was professional, caring, and attentive to all my needs. I couldn't have asked for better service.",
      service: "Home Care",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Family Member",
      avatar: "/family-avatar.jpg",
      rating: 5,
      date: "March 10, 2024",
      comment:
        "Having a nurse come to our home to care for my elderly mother has been a blessing. The level of expertise and compassion shown was remarkable.",
      service: "Elder Care",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Patient",
      avatar: "/patient-avatar-2.jpg",
      rating: 5,
      date: "March 5, 2024",
      comment:
        "The post-surgery care I received was outstanding. The nurse was knowledgeable and made sure I understood my recovery process completely.",
      service: "Post-Surgery Care",
    },
  ];

  const renderStars = (rating: any) => {
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