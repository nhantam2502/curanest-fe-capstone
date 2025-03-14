"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable list if many services
import { ChevronRightIcon, PlusIcon } from "lucide-react";

// Define your Service type (adjust to your actual API response type)
interface Service {
  id: string;
  name: string;
  description?: string;
  // ... other service properties
}

interface ServiceListPanelProps {
  onServiceSelect: (serviceId: string) => void; 
}

const ServiceListPanel: React.FC<ServiceListPanelProps> = ({ onServiceSelect }) => {
  const [services, setServices] = useState<Service[]>([
    { id: "svc-1", name: "Vật lý trị liệu", description: "Các buổi phục hồi chức năng và trị liệu vật lý" },
    { id: "svc-2", name: "Điều dưỡng tại nhà", description: "Dịch vụ chăm sóc điều dưỡng tại nhà" },
    { id: "svc-3", name: "Tư vấn y tế", description: "Tư vấn y tế trực tuyến hoặc trực tiếp" },
    { id: "svc-4", name: "Chăm sóc chuyên sâu", description: "Chăm sóc đặc biệt cho các bệnh mãn tính" },
    { id: "svc-5", name: "Chăm sóc sau phẫu thuật", description: "Chăm sóc và hỗ trợ sau khi phẫu thuật" },
  ]);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleServiceClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    onServiceSelect(serviceId);
  };

  return (
    <Card className="h-[75vh] w-full">
      <CardHeader>
        <CardTitle>Dịch vụ</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(75vh - 80px)]">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-4 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${selectedServiceId === service.id ? "bg-gray-100 font-semibold" : ""}`}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{service.name}</h4>
                  {service.description && <p className="text-sm text-gray-500 truncate">{service.description}</p>}
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ServiceListPanel;