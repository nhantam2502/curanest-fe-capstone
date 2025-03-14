"use client";

import React, { useState } from "react";
import ServiceListPanel from "./ServiceList";
import ServiceTasksPanel from "./ServiceTask";


const ServiceManagementPage: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  return (
    <div className="p-6 flex space-x-4">
      <div className="w-1/3">
        <ServiceListPanel onServiceSelect={handleServiceSelect} />
      </div>
      <div className="w-2/3">
        <ServiceTasksPanel selectedServiceId={selectedServiceId} />
      </div>
    </div>
  );
};

export default ServiceManagementPage;