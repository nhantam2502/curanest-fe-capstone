"use client";

import serviceApiRequest from "@/apiRequest/service/apiServices";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Skeleton import removed
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const MAX_DESC_LENGTH = 80; // Max characters before truncating

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
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      setExpandedDescriptions({}); // Reset expansion state on fetch
      try {
        const response = await serviceApiRequest.getListServiceOfStaff(null);

        if (response.payload && response.payload.data) {
          const data = response.payload.data;
          // Ensure data structure is as expected before processing
          if (data["category-info"] && Array.isArray(data["list-services"])) {
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
            // Handle cases where the expected keys might be missing
            console.warn(
              "API response structure might be different than expected:",
              data
            );
            setError("Received unexpected data format for services.");
            setStaffServices([]); // Set to empty array to avoid errors
          }
        } else {
          setError("Failed to load service categories and services.");
          setStaffServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories and services:", err);
        setError(
          "Failed to load service categories and services. Please try again later."
        );
        setStaffServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // --- Function to toggle description expansion ---
  const toggleDescription = (serviceId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId], // Toggle boolean value for the specific id
    }));
  };

  // --- End Simple Text Loading State ---

  if (error) {
    return <div className="text-red-500 text-center p-10">Lỗi: {error}</div>;
  }

  const handleServiceClick = (serviceId: string, serviceName: string) => {
    const encodedName = encodeURIComponent(serviceName);
    router.push(
      `/staff/service/service-package/${serviceId}?name=${encodedName}`
    );
  };

  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Chọn 1 dịch vụ để tiếp tục</h1>
      {staffServices.length === 0 && !loading && !error && (
        <p className="text-gray-500 text-center py-4">
          Không có dịch vụ nào được phân công.
        </p>
      )}
      {staffServices.map((categoryItem, index) => (
        <div key={categoryItem.categoryInfo.id || index} className="mb-6">
          {" "}
          {/* Use category ID if available */}
          <h2 className="text-xl font-semibold mb-3">
            {categoryItem.categoryInfo.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItem.listServices.length > 0 ? (
              categoryItem.listServices.map((service) => {
                const description = service.description || ""; // Default to empty string if undefined
                const isExpanded = expandedDescriptions[service.id] || false;
                const needsTruncation = description.length > MAX_DESC_LENGTH;
                const displayDescription =
                  needsTruncation && !isExpanded
                    ? `${description.substring(0, MAX_DESC_LENGTH)}...`
                    : description;

                return (
                  <motion.div
                    key={service.id}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }} // Enhanced hover effect
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceClick(service.id, service.name)}
                    className="cursor-pointer"
                    style={{ minHeight: "200px" }} // Ensure cards have a minimum height
                  >
                    <Card className="p-2 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg font-semibold flex-grow">
                            {service.name}
                          </CardTitle>
                          {service.status && ( // Only show badge if status exists
                            <Badge
                              className={`flex-shrink-0 ${
                                service.status.toLowerCase() === "available"
                                  ? "bg-green-100 text-green-800 border border-green-300" // Softer green
                                  : "bg-gray-100 text-gray-800 border border-gray-300" // Softer gray
                              }`}
                            >
                              {service.status.toLowerCase() === "available"
                                ? "Khả dụng"
                                : "Không khả dụng"}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between pt-0">
                        {" "}
                        <div>
                          <p className="text-sm text-gray-600 mb-1 whitespace-pre-wrap">
                            {displayDescription}
                          </p>
                          {needsTruncation && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(service.id);
                              }}
                            >
                              {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          ⏳ {service.est_duration || "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm col-span-full text-center">
                Không có dịch vụ nào trong danh mục này.
              </p> // Adjusted message
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Page;
