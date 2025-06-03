import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailNurseItemType, type Feedback } from "@/types/nurse";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";

const Feedback = ({ nurse }: { nurse: DetailNurseItemType }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Get the nurse ID from the nurse object
        const nurseID = nurse["nurse-id"];
        const response = await nurseApiRequest.getFeedbackForNursing(nurseID);

        // Assuming the API returns an array of feedback objects
        setFeedbacks(response.payload.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Không thể tải dữ liệu đánh giá");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [nurse["nurse-id"]]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ));
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p className="text-xl text-gray-500">Đang tải đánh giá...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p className="text-xl text-gray-500">Chưa có đánh giá nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating from star values
  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, curr) => acc + parseInt(curr.star, 10), 0) /
        feedbacks.length
      : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Trung bình tổng đánh giá</h2>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-2xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-gray-500">({feedbacks.length})</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center gap-6 mb-3">
                  {/* <Avatar className="w-20 h-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {feedback["patient-name"].substring(0, 2) || "UN"}
                    </AvatarFallback>
                  </Avatar> */}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold">
                          {feedback["patient-name"]}
                        </h3>
                        {renderStars(parseInt(feedback.star, 10))}
                      </div>
                      {/* No date field in the Feedback type, could add if needed */}
                    </div>
                  </div>
                </div>

                <p className="text-xl mb-3">{feedback.content}</p>
                <Badge className="rounded-full bg-[#64D1CB] text-white border-[#64D1CB] text-lg mb-4 hover:bg-[#64D1CB] cursor-pointer">
                  {feedback.service}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Feedback;