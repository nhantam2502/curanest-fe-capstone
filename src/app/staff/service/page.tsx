"use client";

import serviceApiRequest from "@/apiRequest/service/apiServices";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function Page() {
  interface ServiceCategory {
    id: string;
    name: string;
  }

  interface Service {
    id: string;
    name: string;
    category_id: string;
    description?: string;
    est_duration?: string;
    status?: string;
  }

  const [staffServices, setStaffServices] = useState<
    { categoryInfo: ServiceCategory; listServices: Service[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApiRequest.getListServiceOfStaff(null);

        if (response.payload && response.payload.data) {
          const data = response.payload.data;
          const processedData = [
            {
              categoryInfo: {
                id: data["category-info"].id,
                name: data["category-info"].name,
              },
              listServices: (data["list-services"] || []).map(
                (serviceItem: any) => ({
                  id: serviceItem.id,
                  category_id: serviceItem["category-id"],
                  name: serviceItem.name,
                  description: serviceItem.description,
                  est_duration: serviceItem["est-duration"],
                  status: serviceItem.status,
                })
              ),
            },
          ];

          setStaffServices(processedData);
        } else {
          setError("Failed to load service categories and services.");
        }
      } catch (err) {
        console.error("Failed to fetch categories and services:", err);
        setError("Failed to load service categories and services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const handleServiceClick = (serviceId: string, serviceName: string) => {
    const encodedName = encodeURIComponent(serviceName);
    router.push(`/staff/service/service-package/${serviceId}?name=${encodedName}`);
  };

  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Chọn 1 dịch vụ để tiếp tục</h1>
      {staffServices.map((categoryItem, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">{categoryItem.categoryInfo.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItem.listServices.length > 0 ? (
              categoryItem.listServices.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServiceClick(service.id, service.name)}
                  className="cursor-pointer"
                >
                  <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow min-h-[220px]">
                    <CardHeader className="flex flex-col">
                      <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                      <Badge
                      style={{ width: "fit-content" }}
                        className={
                          service.status === "available"
                            ? "bg-green-300 text-white"
                            : "bg-gray-400 text-white" 

                        }
                      >
                        {service.status === "available" ? "Available" : "Unavailable"}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <p className="text-xs text-gray-500">⏳ {service.est_duration || "N/A"}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No services available in this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Page;
