"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

interface NurseProfile {
  id: number;
  full_name: string;
  major_id: string;
  dob: string;
  gender: boolean;
  email: string;
  phone_number: string;
  slogan: string;
  nurse_picture: string;
}

interface ServiceCategory {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  category_id: number;
}

const NurseServiceMappingPage: React.FC = () => {
  const dummyNurseProfile: NurseProfile = {
    id: 123,
    full_name: "Nguyễn Thị Điều Dưỡng",
    major_id: "Tim mạch",
    dob: "1992-05-10",
    gender: false,
    email: "nurse.nguyen@example.com",
    phone_number: "0901234567",
    slogan: "Tận tâm chăm sóc, hết lòng vì bệnh nhân",
    nurse_picture: "/placeholder-nurse.jpg",
  };

  const [nurseProfile] = useState<NurseProfile>(dummyNurseProfile);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [, setSelectedServices] = useState<number[]>([]);
  const [, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const dummyCategories: ServiceCategory[] = [
      { id: 201, name: "Chăm sóc cơ bản" },
      { id: 202, name: "Chăm sóc chuyên sâu" },
      { id: 203, name: "Hỗ trợ y tế" },
    ];
    setServiceCategories(dummyCategories);

    const dummyServices: Service[] = [
      { id: 301, category_id: 201, name: "Vệ sinh cá nhân" },
      { id: 302, category_id: 201, name: "Thay băng" },
      { id: 303, category_id: 202, name: "Theo dõi tim mạch" },
      { id: 304, category_id: 202, name: "Hỗ trợ hô hấp" },
      { id: 305, category_id: 203, name: "Lấy mẫu xét nghiệm" },
      { id: 306, category_id: 203, name: "Hướng dẫn dùng thuốc" },
    ];
    setServices(dummyServices);
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleServiceCheckboxChange = (serviceId: number, checked: boolean) => {
    setSelectedServices((prev) =>
      checked ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)
    );
  };
  const form = useForm();

  const handleSubmitMapping = () => {
    setShowConfirmationModal(true);
  };

  const filteredServices = selectedCategory
    ? services.filter((service) => service.category_id === selectedCategory)
    : services;

  return (
    <div className=" mx-auto p-6 flex space-x-4">
      <div className="w-1/3">
        <Card className="h-[75vh]">
          <CardHeader>
            <CardTitle>Thông tin điều dưỡng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <Avatar className="w-32 h-32 rounded-full mb-4">
              <AvatarImage src={nurseProfile.nurse_picture} alt={nurseProfile.full_name} />
              <AvatarFallback>DN</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{nurseProfile.full_name}</h3>
              <p className="text-gray-500">{nurseProfile.major_id}</p>
              <Badge variant="secondary">{nurseProfile.gender ? "Nam" : "Nữ"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
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
                  <Select onValueChange={(value) => handleCategoryChange(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
              <div className="mt-4 space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      onCheckedChange={(checked) => handleServiceCheckboxChange(service.id, !!checked)}
                    />
                    <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={handleSubmitMapping}>Gán dịch vụ</Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseServiceMappingPage;
