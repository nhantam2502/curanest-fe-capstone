import React, { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import { NurseItemType, Feedback } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { useToast } from "@/hooks/use-toast";
import { PatientRecord } from "@/types/patient";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    estTimeFrom?: string;
    estTimeTo?: string;
    apiData: Appointment;
    cusPackage?: CusPackageResponse | null;
  };
  nurse?: NurseItemType;
  medicalReportId: string | null;
  patientName?: string;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  nurse,
  medicalReportId,
  patientName,
}) => {
  // console.log("medicalReportId: ", medicalReportId);

  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const packageData = appointment.cusPackage?.data?.package;

  // Reset states when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoveredStar(0);
      setContent("");
      setExistingFeedback(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (medicalReportId && isOpen) {
        setIsLoading(true);
        // Reset states before fetching new data
        setRating(0);
        setContent("");
        setExistingFeedback(null);

        try {
          const response = await nurseApiRequest.getFeedback(medicalReportId);
          if (response.payload.data) {
            setExistingFeedback(response.payload.data);

            // Pre-fill form with existing feedback data if available
            if (response.payload.data.star) {
              setRating(parseInt(response.payload.data.star));
            }
            if (response.payload.data.content) {
              setContent(response.payload.data.content);
            }
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
          setExistingFeedback(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isOpen && medicalReportId) {
      checkExistingFeedback();
    }
  }, [medicalReportId, isOpen]);

  const handleSubmit = async () => {
    if (rating === 0) return;

    if (existingFeedback) {
      toast({
        title: "Thông báo",
        description:
          "Bạn đã gửi đánh giá trước đó. Mỗi dịch vụ chỉ được đánh giá một lần.",
        variant: "default",
      });
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo payload cho API createFeedback
      const feedbackData = {
        content: content,
        "medical-record-id": medicalReportId || "",
        "nurse-id": nurse?.["nurse-id"] || "",
        "patient-name": patientName || "",
        service: packageData?.name || "",
        star: rating.toString(),
      };

      console.log("Feedback data:", feedbackData);

      // Gọi API
      const response = await nurseApiRequest.createFeedback(feedbackData);

      // Xử lý kết quả thành công
      if (response.payload.data) {
        setExistingFeedback(response.payload.data);
      }

      toast({
          title: "Thành công",
          description: "Đánh giá đã gửi thành công",
          variant: "default",
        });
              onClose();

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 1:
        return "Rất không hài lòng";
      case 2:
        return "Không hài lòng";
      case 3:
        return "Bình thường";
      case 4:
        return "Hài lòng";
      case 5:
        return "Rất hài lòng";
      default:
        return "Chưa đánh giá";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Send className="w-8 h-8 text-blue-600" />
              <DialogTitle className="text-3xl font-bold">
                {existingFeedback ? "Xem đánh giá" : "Gửi đánh giá"}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg">Đang tải thông tin...</p>
          </div>
        ) : (
          <div className="space-y-8 py-6">
            <div className="flex items-center gap-6 bg-blue-50 p-6 rounded-xl">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={nurse?.["nurse-picture"]}
                  alt={nurse?.["nurse-name"]}
                />
                <AvatarFallback className="text-2xl">
                  {nurse?.["nurse-name"]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold">
                  {nurse?.["nurse-name"]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {packageData && (
                    <div className="text-primary font-semibold text-xl py-2">
                      {packageData.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xl font-medium">
                Đánh giá dịch vụ
              </label>
              <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="transition-transform hover:scale-110"
                      onMouseEnter={() =>
                        !existingFeedback && setHoveredStar(star)
                      }
                      onMouseLeave={() =>
                        !existingFeedback && setHoveredStar(0)
                      }
                      onClick={() => !existingFeedback && setRating(star)}
                      disabled={!!existingFeedback}
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xl font-medium text-gray-700">
                  {getRatingLabel(hoveredStar || rating)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xl font-medium">
                Nhận xét của bạn
              </label>
              <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                className="min-h-[150px] text-lg"
                value={content}
                onChange={(e) =>
                  !existingFeedback && setContent(e.target.value)
                }
                disabled={!!existingFeedback}
              />
            </div>

            <div className="flex justify-end pt-6">
              {existingFeedback ? (
                <Button
                  size="lg"
                  onClick={onClose}
                  className="h-12 px-8 text-xl bg-gray-400 hover:bg-gray-500"
                >
                  Đóng
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    disabled={rating === 0 || isSubmitting}
                    onClick={handleSubmit}
                    className="h-12 px-8 text-xl bg-[#64D1CB] hover:bg-[#71DDD7]"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </Button>
                  {!isSubmitting && (
                    <Button
                      size="lg"
                      onClick={onClose}
                      className="h-12 px-8 text-xl bg-gray-400 hover:bg-gray-500 ml-4"
                    >
                      Hủy
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
