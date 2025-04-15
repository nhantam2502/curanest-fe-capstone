import React, { useState } from "react";
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
import { NurseItemType } from "@/types/nurse";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    time_from_to: string;
    apiData: Appointment;
    cusPackage?: CusPackageResponse | null;
  };
  onSubmit: (feedback: { rating: number; content: string }) => void;
  nurse?: NurseItemType;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  onSubmit,
  nurse,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packageData = appointment.cusPackage?.data?.package;
  const tasks = appointment.cusPackage?.data?.tasks || [];

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, content });
      setContent("");
      setRating(0);
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
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
                Gửi đánh giá
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="flex items-center gap-6 bg-blue-50 p-6 rounded-xl">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={nurse?.["nurse-picture"]}
                alt={nurse?.["nurse-name"]}
              />
              <AvatarFallback className="text-2xl">
                {nurse?.["nurse-name"]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">
                {nurse?.["nurse-name"]}
              </h3>
              <div className="flex flex-wrap gap-3">
                {packageData && (
                  <div className="text-primary font-semibold text-xl  py-2">
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
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
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
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button
              size="lg"
              disabled={rating === 0 || isSubmitting}
              onClick={handleSubmit}
              className="h-12 px-8 text-xl bg-[#64D1CB] hover:bg-[#71DDD7]"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
