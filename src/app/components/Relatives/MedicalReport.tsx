import React from "react";
import { FileText, Clock, MessageCircle, Calendar } from "lucide-react";
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
import { MedicalRecord } from "@/types/appointment";
import { Appointment, CusPackageResponse } from "@/types/appointment";
import { formatDate } from "@/lib/utils";

interface MedicalReportProps {
  isOpen: boolean;
  onClose: () => void;
  medical_report: {
    nurse_name: string;
    avatar: string;
    report: MedicalRecord;
  };
  appointment: {
    estTimeFrom?: string;
    estTimeTo?: string;
    apiData: Appointment;
    cusPackage?: CusPackageResponse | null;
  };
}

const MedicalReport: React.FC<MedicalReportProps> = ({
  isOpen,
  onClose,
  medical_report,
  appointment,
}) => {
  console.log("Medical Report", medical_report);
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
                  {medical_report.nurse_name}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">
                  {medical_report.nurse_name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mt-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  <span>
                  {formatDate(new Date(appointment.apiData["est-date"]))}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-2 text-lg">
                  <Clock className="w-5 h-5" />
                  <span>
                  {appointment.estTimeFrom} - {appointment.estTimeTo}
                  </span>
                </div>
              </div>
            </div>

            {/* Techniques */}
            <Card>
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4">
                  Gói dịch vụ đã thực hiện
                </h4>
                <div className="flex flex-wrap gap-4">
                  {appointment.cusPackage?.data.package.name ? (
                    <Badge className="bg-blue-500 text-white text-xl font-semibold">
                      {appointment.cusPackage?.data.package.name}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-300 text-gray-700 font-semibold">
                      Không có dịch vụ nào được thực hiện.
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medical Report */}
            <Card>
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-4">Báo cáo chi tiết</h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 text-xl leading-relaxed whitespace-pre-line">
                    {medical_report.report?.["nursing-report"] ||
                      "No report available."}
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
                  {medical_report.report?.["staff-confirmation"] ? (
                    <div className="flex items-start gap-4 bg-green-50 p-6 rounded-lg">
                      {/* <div className="min-w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        1
                      </div> */}
                      <p className="text-gray-700 text-xl">
                        {medical_report.report["staff-confirmation"]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-lg">
                      Không có lời khuyên nào được cung cấp.
                    </p>
                  )}
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
