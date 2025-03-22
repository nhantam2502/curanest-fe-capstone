import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Clock, MessageCircle } from 'lucide-react';

export interface MedicalReport {
  id: string;
  appointment_id: string;
  nurse_name: string;
  avatar?: string;
  report_date: string;
  report_time: string;
  techniques: string;
  report: string;
  advice: string[];
  status: string;
}

interface MedicalReportCardProps {
  report: MedicalReport;
}

// Dữ liệu mẫu cho báo cáo y tế
const medical_report: MedicalReport = {
  id: '1',
  appointment_id: '1',
  nurse_name: 'Nguyễn Thị Minh',
  avatar: '/avatars/nurse.jpg',
  report_date: '10/03/2025',
  report_time: '14:30',
  techniques: 'Vật lý trị liệu - Massage trị liệu - Châm cứu - Kéo giãn cột sống',
  report: 'Bệnh nhân đến với tình trạng đau vùng thắt lưng kéo dài 2 tuần. Sau khi thăm khám, phát hiện có hiện tượng co cứng cơ vùng lưng dưới và hạn chế vận động. Đã tiến hành điều trị bằng phương pháp vật lý trị liệu kết hợp với massage và kéo giãn nhẹ cột sống.\n\nSau buổi điều trị đầu tiên, bệnh nhân đã có cảm giác dễ chịu hơn, giảm đau khoảng 30% và có thể di chuyển dễ dàng hơn. Tuy nhiên, vẫn còn hiện tượng đau khi cúi gập người hoặc ngồi lâu.',
  advice: [
    'Tránh ngồi một chỗ quá lâu, nên đứng dậy và đi lại nhẹ nhàng sau mỗi 30 phút ngồi',
    'Áp dụng các bài tập kéo giãn nhẹ nhàng tại nhà theo hướng dẫn đã cung cấp',
    'Sử dụng túi chườm ấm 15-20 phút mỗi ngày vào vùng lưng dưới',
    'Uống đủ nước và duy trì chế độ ăn giàu canxi và vitamin D'
  ],
  status: 'Đã hoàn thành'
};


export const MedicalReportCard: React.FC<MedicalReportCardProps> = ({ report }) => {
  return (
    <Card className="h-full shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">Báo cáo y tế</h3>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {report.status || "Đã hoàn thành"}
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <div className="space-y-6">
            {/* Thông tin điều dưỡng */}
            <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={report.avatar} alt={report.nurse_name} />
                <AvatarFallback className="text-xl font-bold">
                  {report.nurse_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{report.nurse_name}</h4>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{report.report_date} - {report.report_time}</span>
                </div>
              </div>
            </div>

            {/* Dịch vụ đã thực hiện */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-semibold mb-3">Dịch vụ đã thực hiện</h4>
              <div className="flex flex-wrap gap-2">
                {report.techniques && report.techniques.split("-").map((technique, index) => (
                  <Badge key={index} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                    {technique.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Báo cáo chi tiết */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-semibold mb-3">Báo cáo chi tiết</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {report.report}
                </p>
              </div>
            </div>

            {/* Lời khuyên */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Lời khuyên của điều dưỡng
              </h4>
              <div className="space-y-3">
                {report.advice && report.advice.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="min-w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};