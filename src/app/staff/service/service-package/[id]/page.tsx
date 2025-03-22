"use client";

import React, { useState } from "react";
import ServicePackageComponent from "./ServicePackage"; // Assuming this is meant to be ServicePackageList
import CreateServicePackage from "./CreateServicePackage"; // Assuming this is the correct path
import ServiceTaskComponent from "./ServiceTask"; // Assuming this is meant to be ServiceTaskList
import CreateServiceTask from "./CreateServiceTask"; // Assuming this is the correct path

function MainPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [selectedServicePackageId, setSelectedServicePackageId] = useState<
    string | null
  >(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedServicePackageId(null); // Clear service package selection when service changes
  };

  const handleServicePackageClick = (servicePackageId: string) => {
    setSelectedServicePackageId(servicePackageId); // Update selected service package ID
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 border-r border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Gói dịch vụ</h2>
        <ServicePackageComponent
          onPackageClick={handleServicePackageClick}
        />
      </div>

      <div className="w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">Công việc gói dịch vụ</h2>
          <>
            <ServiceTaskComponent servicePackageId={selectedServicePackageId} />
          </>
      </div>
    </div>
  );
}

export default MainPage;