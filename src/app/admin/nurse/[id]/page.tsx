"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import serviceApiRequest from "@/apiRequest/service/apiServices";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import NurseDetailPage from "./NurseDetail";
import { useParams } from "next/navigation";
import { ServiceCate } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ServiceChipProps {
  service: ServiceCate;
  selected: boolean;
  onToggle: (serviceId: string, newState: boolean) => void;
}
const ServiceChip: React.FC<ServiceChipProps> = ({ service, selected, onToggle }) => {

  const serviceIdStr = String(service.id);
  return (
    <button
      type="button"
      onClick={() => onToggle(serviceIdStr, !selected)}
      className={`px-3 py-1 rounded-full text-sm transition-colors border ${
        selected
          ? "bg-emerald-500 text-white border-emerald-500"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {service.name}
    </button>
  );
};

const NurseServiceMappingPage: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast(); // Initialize useToast

  // State for categories and a mapping for services by category
  const [serviceCategories, setServiceCategories] = useState<ServiceCate[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, ServiceCate[]>>({});
  // This state holds the service ids (as strings) that the nurse already has mapped
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // const [showConfirmationModal, setShowConfirmationModal] = useState(false); // You might not need this if toast is sufficient

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApiRequest.getCategory({ name: "" });
        if (response.status === 200 && response.payload) {
          setServiceCategories(response.payload.data || []);
        } else {
          console.error("Error fetching categories:", response);
          // Optional: Add toast for category fetch failure
          // toast({ title: "Lỗi", description: "Không thể tải danh mục dịch vụ.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Optional: Add toast for category fetch error
        // toast({ title: "Lỗi", description: "Lỗi khi tải danh mục dịch vụ.", variant: "destructive" });
      }
    };
    fetchCategories();
  }, []); // Removed toast dependency here to avoid potential loops if toast triggers re-renders

  useEffect(() => {
    if (serviceCategories.length === 0) return;
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchAllServices = async () => {
      const mapping: Record<string, ServiceCate[]> = {};
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
      if (isMounted) {
        setServicesByCategory(mapping);
      }
    };

    fetchAllServices();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [serviceCategories]);

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component
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
          response.payload?.data?.["service-ids"] 
        ) {
          const mappedServices = response.payload.data["service-ids"];
           if (isMounted) {
             setSelectedServices(mappedServices.map(String));
           }
        } else {
          console.error("Error fetching nurse services:", response);
          // toast({ title: "Lỗi", description: "Không thể tải dịch vụ hiện tại của điều dưỡng.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error fetching nurse services:", error);
        // toast({ title: "Lỗi", description: "Lỗi khi tải dịch vụ hiện tại của điều dưỡng.", variant: "destructive" });
      }
    };
    fetchNurseService();
    return () => {
        isMounted = false; // Cleanup function
      };
  }, [id]);

  // Toggle selected services
  const handleServiceChipToggle = (serviceId: string, newState: boolean) => {
    setSelectedServices((prev) => {
      const currentSet = new Set(prev);
      if (newState) {
        currentSet.add(serviceId);
      } else {
        currentSet.delete(serviceId);
      }
      return Array.from(currentSet); // Convert back to array
    });
  };


  const handleSubmitMapping = async () => {
    if (!id) {
      console.error("No nurse id found in URL");
      toast({ 
        title: "Lỗi",
        description: "Không tìm thấy ID điều dưỡng trong URL.",
        variant: "destructive",
      });
      return;
    }
    const nurseId = Array.isArray(id) ? id[0] : id;
    const body = { "service-ids": selectedServices };

    try {
      const response = await nurseApiRequest.mapNurseToService(nurseId, body);
      console.log("Mapping response:", response); // Keep for debugging

      if (response.status === 201) { // Check for successful status code
        toast({
          title: "Thành công",
          description: "Đã cập nhật danh sách dịch vụ cho điều dưỡng.",
          variant: "default",
        });
      } else {
        toast({
          title: "Lỗi cập nhật",
          description: response.payload?.message || "Không thể cập nhật dịch vụ. Máy chủ phản hồi không thành công.",
          variant: "destructive",
        });
      }
    } catch (error: any) { // Catch block for network errors or exceptions
      console.error("Error mapping nurse to service:", error);
      toast({
        title: "Lỗi hệ thống",
        description: error.message || "Đã xảy ra lỗi khi cố gắng cập nhật dịch vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const allServices: ServiceCate[] = Object.values(servicesByCategory).flat();

  const serviceIdToNameMap = new Map(
    allServices.map(service => [String(service.id), service.name])
  );


  return (
    <div className="mx-auto flex h-full">
      <div className="w-1/2 pr-4 border-r border-gray-300 overflow-y-auto"> {/* Added padding and border */}
        <NurseDetailPage />
      </div>

      <div className="w-1/2 pl-4 flex flex-col"> {/* Added padding and flex column */}
        <div className="mb-4 border-b pb-4">
          <div className="flex justify-between items-center mb-2">
             <h2 className="text-xl font-bold">Dịch vụ đã chọn</h2>
          </div>
          {selectedServices.length > 0 ? (
            <div className="flex flex-wrap gap-2 ">
              {selectedServices
                .map((serviceId) => (
                  <span
                    key={serviceId}
                    className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm"
                  >
                    {serviceIdToNameMap.get(serviceId) || `ID: ${serviceId}`} {/* Fallback if name not found */}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa chọn dịch vụ nào.</p>
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmitMapping} className="bg-emerald-400 hover:bg-emerald-400/90">Thêm</Button>
          </div>
        </div>

        {/* Service Selection Area (Scrollable) */}
        <div className="flex-grow pr-1 overflow-y-auto h-[calc(80vh-130px)]"> {/* Takes remaining height and allows scrolling */}
          {serviceCategories.length > 0 ? (
            serviceCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="font-semibold mb-2 text-base">{category.name}</h3> {/* Adjusted heading size */}
                <div className="flex flex-wrap gap-2">
                  {servicesByCategory[category.id] && servicesByCategory[category.id].length > 0 ? (
                    servicesByCategory[category.id].map((service) => {
                      const serviceIdStr = String(service.id); // Ensure string ID
                      return (
                        <ServiceChip
                          key={serviceIdStr}
                          service={service}
                          selected={selectedServices.includes(serviceIdStr)}
                          onToggle={handleServiceChipToggle}
                        />
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm italic">Không có dịch vụ trong danh mục này.</p> /* Improved message */
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center p-4 md:p-6 lg:p-8 space-y-6">
            <Loader2 className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
          </div> 
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseServiceMappingPage;