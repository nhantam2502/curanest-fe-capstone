"use client";

import React, { useState } from "react";
import CategoryManagement from "./CategoryManagement";
import ServiceManagement from "./ServiceManagement";

const ServiceManagementPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="p-4 flex min-h-screen">
      {/* Left Side - Category Management */}
      <div className="w-1/2 pr-4 flex">
        <CategoryManagement onCategorySelect={handleCategorySelect} />
      </div>
      <div className="w-[1px] bg-gray-300 mx-4"></div>
      {/* Right Side - Service Management */}
      <div className="w-1/2 pl-4">
        <ServiceManagement selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
};

export default ServiceManagementPage;
