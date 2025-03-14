"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import NurseDetailPage from "./NurseDetail";
import { useParams } from "next/navigation";

interface ServiceCategory {
  id: string;
  name: string;
}

interface Service {
  id: number;
  name: string;
  category_id: string;
}

// Aesthetic ServiceChip component
interface ServiceChipProps {
  service: Service;
  selected: boolean;
  onToggle: (serviceId: number, newState: boolean) => void;
}
const ServiceChip: React.FC<ServiceChipProps> = ({ service, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(service.id, !selected)}
      className={`px-3 py-1 rounded-full text-sm transition-colors border ${
        selected
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {service.name}
    </button>
  );
};

const NurseServiceMappingPage: React.FC = () => {
  const { id } = useParams();

  // State for categories and a mapping for services by category
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, Service[]>>({});
  // This state holds the service ids (as strings) that the nurse already has mapped
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Fetch service categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApiRequest.getCategory({ name: "" });
        if (response.status === 200 && response.payload) {
          setServiceCategories(response.payload.data || []);
        } else {
          console.error("Error fetching categories:", response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Once categories are loaded, fetch services for each category and build a mapping.
  useEffect(() => {
    if (serviceCategories.length === 0) return;
    const fetchAllServices = async () => {
      const mapping: Record<string, Service[]> = {};
      await Promise.all(
        serviceCategories.map(async (category) => {
          try {
            const response = await serviceApiRequest.getService(category.id, null);
            if (response.status === 200 && response.payload) {
              mapping[category.id] = response.payload.data || [];
            } else {
              mapping[category.id] = [];
            }
          } catch (error) {
            console.error("Error fetching services for category", category.id, error);
            mapping[category.id] = [];
          }
        })
      );
      setServicesByCategory(mapping);
    };
    fetchAllServices();
  }, [serviceCategories]);

  // NEW: Fetch the nurse's mapped services so the corresponding chips appear as selected.
  useEffect(() => {
    const fetchNurseService = async () => {
      if (!id) {
        console.error("No nurse id found in URL");
        return;
      }
      const nurseId = Array.isArray(id) ? id[0] : id;
      try {
        const response = await nurseApiRequest.getNurseService(nurseId);
        console.log("Nurse mapped services response:", response);
        if (
          response.status === 200 &&
          response.payload &&
          response.payload.data &&
          response.payload.data["service-ids"]
        ) {
          const mappedServices = response.payload.data["service-ids"];
          setSelectedServices(mappedServices);
        } else {
          console.error("Error fetching nurse services:", response);
        }
      } catch (error) {
        console.error("Error fetching nurse services:", error);
      }
    };
    fetchNurseService();
  }, [id]);
  
  

  // Toggle selected services
  const handleServiceChipToggle = (serviceId: number, newState: boolean) => {
    setSelectedServices((prev) =>
      newState
        ? [...prev, serviceId.toString()]
        : prev.filter((id) => id !== serviceId.toString())
    );
  };

  // Submit mapping API call using nurse id from URL parameters
  const handleSubmitMapping = async () => {
    if (!id) {
      console.error("No nurse id found in URL");
      return;
    }
    try {
      const nurseId = Array.isArray(id) ? id[0] : id;
      const body = { "service-ids": selectedServices };
      const response = await nurseApiRequest.mapNurseToService(nurseId, body);
      console.log("Mapping response:", response);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Error mapping nurse to service:", error);
    }
  };

  // Flatten all services for the top display (to show selected service names)
  const allServices: Service[] = Object.values(servicesByCategory).flat();

  return (
    <div className="mx-auto flex">
      {/* Left Panel: Nurse Detail */}
      <div className="w-1/2">
        <NurseDetailPage />
      </div>

      {/* Separator using a div with inline CSS */}
      <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 16px" }} />

      {/* Right Panel: Service Mapping */}
      <div className="w-1/2">
        {/* Top Part: Selected Services & Submit */}
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-bold mb-2">Dịch vụ đã chọn</h2>
          {selectedServices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allServices
                .filter((service) =>
                  selectedServices.includes(service.id.toString())
                )
                .map((service) => (
                  <span
                    key={service.id}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {service.name}
                  </span>
                ))}
            </div>
          ) : (
            <p>Chưa chọn dịch vụ nào.</p>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmitMapping}>Gán</Button>
          </div>
        </div>

        {/* Bottom Part: Categories & Their Services */}
        <div>
          {serviceCategories.map((category) => (
            <div key={category.id} className="mb-4">
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {servicesByCategory[category.id] && servicesByCategory[category.id].length > 0 ? (
                  servicesByCategory[category.id].map((service) => (
                    <ServiceChip
                      key={service.id}
                      service={service}
                      selected={selectedServices.includes(service.id.toString())}
                      onToggle={handleServiceChipToggle}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No services available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseServiceMappingPage;
