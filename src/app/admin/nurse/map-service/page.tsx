"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNurse } from "@/app/context/NurseContext";
import { Star } from "lucide-react";
import categoryApiRequest from "@/apiRequest/category/apiCategory";
import serviceApiRequest from "@/apiRequest/service/apiServices";
// Import the nurse API request module that contains mapNurseToService
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";

interface ServiceCategory {
  id: string; // id is a string from the API
  name: string;
}

interface Service {
  id: number;
  name: string;
  category_id: string; // assuming services use string for category id as well
}

const NurseServiceMappingPage: React.FC = () => {
  const { selectedNurse } = useNurse();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [services, setServices] = useState<Service[]>([]);
  // selectedCategory is stored as a string
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Fetch services when the selected category changes
  const fetchServices = useCallback(async () => {
    try {
      if (!selectedCategory) {
        setServices([]);
        return;
      }
      // Pass the selectedCategory string directly to your API call
      const response = await serviceApiRequest.getService(
        selectedCategory,
        null
      );
      if (response.status === 200 && response.payload) {
        const data = response.payload.data || [];
        setServices(data);
        console.log("Fetched services:", data);
      } else {
        console.error("Error fetching services:", response);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handler for category select change: accept a string value
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Handler for service checkbox change
  const handleServiceCheckboxChange = (serviceId: number, checked: boolean) => {
    setSelectedServices((prev) =>
      checked
        ? [...prev, serviceId.toString()]
        : prev.filter((id) => id !== serviceId.toString())
    );
  };

  const form = useForm();

  // Updated handleSubmitMapping: call the API using nurseId and selectedServices
  const handleSubmitMapping = async () => {
    if (!selectedNurse) {
      console.error("No nurse selected");
      return;
    }
    try {
      const nurseId = selectedNurse["nurse-id"];
      const body = { "service-ids": selectedServices };
      const response = await nurseApiRequest.mapNurseToService(nurseId, body);
      console.log("Mapping response:", response);
      setShowConfirmationModal(true);
      // Additional handling on success can go here
    } catch (error) {
      console.error("Error mapping nurse to service:", error);
      // You might want to handle the error by showing a message to the user
    }
  };

  const filteredServices = selectedCategory
    ? services.filter((service) => service.category_id === selectedCategory)
    : services;

  return (
    <div className="mx-auto p-6 flex space-x-4">
      {/* Left Panel: Nurse Information */}
      <div className="w-1/3">
        <Card className="h-[75vh]">
          <CardHeader>
            <CardTitle>Thông tin điều dưỡng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6 ">
            <Avatar className="w-32 h-32 rounded-full mb-4">
              <AvatarImage
                src={selectedNurse?.["nurse-picture"]}
                alt="Nurse Avatar"
              />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-4">
              <h1>
                Tên: {selectedNurse?.["nurse-name"] || "No nurse selected"}
              </h1>
              <p className="text-gray-500">
                Nơi làm việc: {selectedNurse?.["current-work-place"]}
              </p>
              <div className="flex space-x-1 justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (selectedNurse?.rate || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <Badge variant="secondary">
                {selectedNurse?.gender ? "Nam" : "Nữ"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right Panel: Service Mapping */}
      <div className="w-2/3">
        <Card className="h-[75vh]">
          <CardHeader>
            <CardTitle>Thông tin dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <FormItem>
                <FormLabel>Chọn danh mục dịch vụ</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => handleCategoryChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>

              <div className="mt-4 space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      onCheckedChange={(checked) =>
                        handleServiceCheckboxChange(service.id, !!checked)
                      }
                    />
                    <Label htmlFor={`service-${service.id}`}>
                      {service.name}
                    </Label>
                  </div>
                ))}
              </div>

              <Button className="mt-4" onClick={handleSubmitMapping}>
                Gán dịch vụ
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseServiceMappingPage;
