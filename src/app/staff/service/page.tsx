"use client";

import categoryApiRequest from "@/apiRequest/category/apiCategory";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter

function Page() {
  interface ServiceCategory {
    id: string;
    name: string;
  }
  interface Service {
    id: string; // Changed to string to match payload id type
    name: string;
    category_id: string;
    description?: string; // Optional description
    est_duration?: string; // Optional duration
    status?: string; // Optional status
  }

  interface ServiceChipProps {
    service: Service;
    onClick: () => void; // Add onClick prop
  }
  const ServiceChip: React.FC<ServiceChipProps> = ({ service, onClick }) => {
    return (
      <button
        type="button"
        className="px-3 py-1 rounded-full text-sm transition-colors border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
        onClick={onClick} // Attach onClick handler
      >
        {service.name}
      </button>
    );
  };

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [categoriesWithServices, setCategoriesWithServices] = useState<
    { categoryInfo: ServiceCategory; listServices: Service[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApiRequest.getListService(null);
        if (response.payload && response.payload.data) {
          const processedData = response.payload.data.map((item: any) => ({
            categoryInfo: {
              id: item["category-info"].id,
              name: item["category-info"].name,
            },
            listServices: (item["list-services"] as any[]).map((serviceItem) => ({ // Ensure type safety
              id: serviceItem.id,
              category_id: serviceItem["category-id"],
              name: serviceItem.name,
              description: serviceItem.description,
              est_duration: serviceItem["est-duration"],
              status: serviceItem.status,
            })),
          }));
          setCategoriesWithServices(processedData);
        } else {
          setError("Failed to load service categories and services.");
        }
      } catch (err) {
        console.error("Failed to fetch categories and services:", err);
        setError(
          "Failed to load service categories and services. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  if (loading) {
    return <div>Loading categories and services...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleServiceClick = (serviceId: string) => {
    router.push(`/staff/service/service-package/${serviceId}`); // Navigate to the service package page
  };

  return (
    <div>
      {categoriesWithServices.map((categoryItem, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{categoryItem.categoryInfo.name}</h2>
          <div className="flex flex-wrap gap-2">
            {categoryItem.listServices.length > 0 ? (
              categoryItem.listServices.map((service) => (
                <ServiceChip
                  key={service.id}
                  service={service}
                  onClick={() => handleServiceClick(service.id)}
                />
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