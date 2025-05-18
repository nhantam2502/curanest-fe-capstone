"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Feedback } from "@/types/nurse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, Calendar, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";

const FeedbackPage = () => {
  // Lấy session từ useSession
  const { data: session, status } = useSession();
  const nursingId = session?.user?.id || null;
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!nursingId) {
        setLoading(false);
        return;
      }

      try {
        const response = await nurseApiRequest.getFeedbackForNursing(nursingId);
        if (response.payload.data) {
          setFeedbacks(response.payload.data);
        } else {
          setError("Không thể tải phản hồi");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải phản hồi");
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [nursingId]);

  // Render stars based on rating
  const renderStars = (rating: string | number) => {
    const starCount =
      typeof rating === "string" ? parseInt(rating, 10) : Math.round(rating);
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < starCount
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Calculate statistics for the feedback overview
  const calculateStats = () => {
    if (feedbacks.length === 0)
      return { average: 0, distribution: [0, 0, 0, 0, 0] };

    // Calculate average rating
    const sum = feedbacks.reduce(
      (acc, curr) => acc + parseInt(curr.star, 10),
      0
    );
    const average = sum / feedbacks.length;

    // Get rating distribution
    const distribution = Array(5).fill(0);
    feedbacks.forEach((feedback) => {
      const starIndex = parseInt(feedback.star, 10) - 1;
      if (starIndex >= 0 && starIndex < 5) {
        distribution[starIndex]++;
      }
    });

    // Count unique services
    const uniqueServices = new Set(feedbacks.map((f) => f.service)).size;

    return { average, distribution, uniqueServices };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải phản hồi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!nursingId) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert>
          <AlertTitle>Thông báo</AlertTitle>
          <AlertDescription>
            Vui lòng đăng nhập để xem phản hồi
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Phản hồi từ bệnh nhân</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách phản hồi từ bệnh nhân về dịch vụ điều dưỡng của bạn
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex flex-col justify-center items-center h-40 gap-2">
              <MessageSquare className="w-12 h-12 text-gray-300" />
              <div className="text-center text-muted-foreground">
                Chưa có phản hồi nào
              </div>
              <p className="text-gray-400">
                Đánh giá đầu tiên sẽ được hiển thị tại đây
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Đánh giá tổng quan */}
          <Card className="w-full shadow-md mb-6">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
              <CardTitle>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tổng quan đánh giá
                </h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex">{renderStars(stats.average)}</div>
                      <span className="text-2xl font-bold text-amber-600">
                        {stats.average.toFixed(1)}
                      </span>
                      <span className="text-lg text-gray-500">
                        ({feedbacks.length} đánh giá)
                      </span>
                    </div>

                    {/* Rating distribution */}
                    <div className="space-y-1 mt-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = stats.distribution[star - 1];
                        const percentage =
                          feedbacks.length > 0
                            ? (count / feedbacks.length) * 100
                            : 0;

                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-2">{star}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Tóm tắt đánh giá
                    </h3>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {feedbacks.length}
                        </div>
                        <div className="text-sm text-gray-500">Tổng số</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {stats.distribution[4]}
                        </div>
                        <div className="text-sm text-gray-500">5 sao</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {stats.uniqueServices}
                        </div>
                        <div className="text-sm text-gray-500">Dịch vụ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Danh sách phản hồi chi tiết */}
          <h2 className="text-xl font-semibold mb-4">Chi tiết phản hồi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbacks.map((feedback) => (
              
              <Card key={feedback.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div>
                        <CardTitle className="text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-xs shrink-0 mr-4">
                          {feedback["patient-name"]}
                        </CardTitle>

                        {/* <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date().toLocaleDateString("vi-VN")}</span>
                        </div> */}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {feedback.service}
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="mb-2">{renderStars(feedback.star)}</div>
                  <p className="text-gray-700 whitespace-pre-line mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {feedback.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackPage;
