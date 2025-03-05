import { MedicalReport, MedicalReportCard } from '@/app/components/Nursing/MedicalReportCard';
import { Appointment, PatientProfile } from '@/app/components/Nursing/PatientRecord';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { BriefcaseMedicalIcon, CheckCircle2, } from 'lucide-react';

// Thêm interface cho dịch vụ
interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
}

// Mở rộng interface Appointment để thêm dịch vụ
interface EnhancedAppointment extends Appointment {
  services: Service[];
}

const DetailAppointment: React.FC = () => {
  // Dữ liệu mẫu cho cuộc hẹn
  const appointment: EnhancedAppointment = {
    id: '1',
    patient_name: 'Huỳnh Đào',
    avatar: '/avatars/patient.jpg',
    phone_number: '0923 456 789',
    birth_date: '15/01/1943',
    age: '81',
    appointment_date: '15/03/2025',
    appointment_time: '09:00 - 10:00',
    address: '64 Điện Biên Phủ, phường Đa Kao, quận 1, Hồ Chí Minh',
    description: 'Chấn thương gần cơ, đáy chẳng, trật khớp',
    note: 'Theo dõi phản ứng của cơ thể bệnh nhân và báo cáo kịp thời.',
    // Thêm danh sách dịch vụ
    services: [
      {
        id: '1',
        name: 'Vật lý trị liệu',
        category: 'Điều trị cơ xương khớp',
        description: 'Phương pháp điều trị không dùng thuốc, tập trung vào việc phục hồi chức năng vận động',
        duration: '45 phút',
        price: '350.000 VNĐ'
      },
      {
        id: '2',
        name: 'Massage trị liệu',
        category: 'Điều trị đau nhức',
        description: 'Massage chuyên sâu giúp giảm đau, thư giãn cơ và tăng cường tuần hoàn máu',
        duration: '30 phút',
        price: '250.000 VNĐ'
      },
      {
        id: '3',
        name: 'Châm cứu',
        category: 'Y học cổ truyền',
        description: 'Kích thích các huyệt đạo để giảm đau và cải thiện chức năng cơ thể',
        duration: '45 phút',
        price: '400.000 VNĐ'
      }
    ]
  };

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

  // Component cho danh sách dịch vụ
  const ServicesList = ({ services }: { services: Service[] }) => {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <BriefcaseMedicalIcon className="w-5 h-5 text-blue-600" />
            Dịch vụ đã đặt
          </h3>
          
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                    <p className="mt-2">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Thời gian</div>
                    <div className="font-medium">{service.duration}</div>
                    <div className="text-sm text-gray-500 mt-2">Giá</div>
                    <div className="font-medium text-blue-600">{service.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <div className="bg-blue-50 p-4 rounded-lg">
              <span className="text-gray-600">Tổng cộng:</span>
              <span className="font-bold text-lg ml-3 text-blue-700">
                {appointment.services.reduce((total, service) => {
                  const price = parseInt(service.price.replace(/\D/g, ''));
                  return total + price;
                }, 0).toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto">
      {/* Breadcrumb từ shadcn/ui */}
      <Breadcrumb className="px-10 py-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/nurse/appointments" className="text-xl">
              Danh sách cuộc hẹn sắp tới
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-xl">
              Chi tiết cuộc hẹn: {appointment.patient_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="px-10 pb-10">
        <h2 className="text-3xl font-bold mb-8">Chi tiết cuộc hẹn</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cột thông tin bệnh nhân - Bên trái */}
          <PatientProfile appointment={appointment} />

          {/* Cột báo cáo y tế - Bên phải */}
          <MedicalReportCard report={medical_report} />
        </div>
        
        {/* Phần dịch vụ đã đặt */}
        <ServicesList services={appointment.services} />
      </div>
    </div>
  );
};

export default DetailAppointment;