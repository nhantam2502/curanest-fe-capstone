import React from "react";
import { FileText, Clock, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MedicalReportProps {
  isOpen: boolean;
  onClose: () => void;
  medical_report: {
    nurse_name: string;
    avatar: string;
    report_date: string;
    report_time: string;
    report: string;
    advice: string[];
    techniques: string;
  };
}

const MedicalReport: React.FC<MedicalReportProps> = ({
  isOpen,
  onClose,
  medical_report,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh]">
      <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <DialogTitle className="text-3xl font-bold">
                Báo cáo y tế
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-160px)] overflow-y-auto pr-8">
          <div className="space-y-8 py-6">
            {/* Nurse Info */}
            <div className="flex items-center gap-6 bg-blue-50 p-6 rounded-lg">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={medical_report.avatar}
                  alt={medical_report.nurse_name}
                />
                <AvatarFallback className="text-2xl font-bold">
                  {medical_report.nurse_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">
                  {medical_report.nurse_name}
                </h3>
                <div className="flex items-center gap-3 text-gray-600 mt-2 text-lg">
                  <Clock className="w-5 h-5" />
                  <span>
                    {medical_report.report_date} - {medical_report.report_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Techniques */}
            <Card>
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4">
                  Dịch vụ đã thực hiện
                </h4>
                <div className="flex flex-wrap gap-4">
                  {medical_report.techniques
                    .split("-")
                    .map((technique, index) => (
                      <Badge
                        key={index}
                        className="text-white text-lg px-4 py-2"
                      >
                        {technique.trim()}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Report */}
            <Card>
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4">Báo cáo chi tiết</h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {medical_report.report}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  Lời khuyên của điều dưỡng
                </h4>
                <div className="space-y-4">
                  {medical_report.advice.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-green-50 p-6 rounded-lg"
                    >
                      <div className="min-w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-lg">
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalReport;
