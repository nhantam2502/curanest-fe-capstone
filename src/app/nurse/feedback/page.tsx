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
import { Star, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  const renderStars = (rating: string) => {
    const starCount = parseInt(rating, 10);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Phản hồi từ bệnh nhân</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách phản hồi từ bệnh nhân về dịch vụ điều dưỡng của bạn
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              Chưa có phản hồi nào
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        {feedback["patient-name"]}
                      </CardTitle>
                      {/* <CardDescription>
                        Mã hồ sơ: {feedback["medical-record-id"]}
                      </CardDescription> */}
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
                <p className="text-gray-700 whitespace-pre-line">
                  {feedback.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
