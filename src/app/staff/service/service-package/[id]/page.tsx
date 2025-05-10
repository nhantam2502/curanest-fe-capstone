"use client";

import React, { useState, useCallback } from "react";
import ServicePackageComponent from "./ServicePackage";
import ServiceTaskComponent from "./ServiceTask";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function MainPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [selectedServicePackageId, setSelectedServicePackageId] = useState<
    string | null
  >(null);
  const [refreshPackages, setRefreshPackages] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const router = useRouter();

  const handleServicePackageClick = (servicePackageId: string) => {
    setSelectedServicePackageId(servicePackageId);
    setRefreshTasks((prevState) => !prevState);
  };

  const handlePackageCreated = useCallback(() => {
    setRefreshPackages((prevState) => !prevState);
  }, []);

  const handleTaskCreated = useCallback(() => {
    setRefreshTasks((prevState) => !prevState);
  }, []);

  const handleBack = () => {
    router.back(); // Navigate back in history
  };

  const searchParams = useSearchParams();
  const serviceName = searchParams.get("name");

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="mb-4"
      >
        Quay lại
      </Button>
      <h1 className="text-xl font-semibold mb-4">
        Quản lý dịch vụ: {serviceName}
      </h1>
      <div className="flex">
        <div className="w-1/2 p-3 border-r border-gray-200">
          <ServicePackageComponent
            serviceId={selectedServiceId}
            onPackageClick={handleServicePackageClick}
            refresh={refreshPackages}
            onPackageCreated={handlePackageCreated}
          />
        </div>

        <div className="w-1/2 p-3">
          {selectedServicePackageId && (
            <>
              <ServiceTaskComponent
                servicePackageId={selectedServicePackageId}
                refresh={refreshTasks}
                onTaskCreated={handleTaskCreated}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
