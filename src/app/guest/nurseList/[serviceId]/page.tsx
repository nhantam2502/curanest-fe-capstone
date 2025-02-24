"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, StarIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import NursingCard from "@/app/components/Nursing/NursingCard";
import nursing from "@/dummy_data/dummy_nurse.json";
import { useParams, useSearchParams } from "next/navigation";

const NurseList = () => {
  const params = useParams();
const serviceIdRaw = params.serviceId;
const serviceId = typeof serviceIdRaw === "string" ? serviceIdRaw : serviceIdRaw ? serviceIdRaw[0] : "";
const [searchTerm, setSearchTerm] = useState(
  serviceId ? decodeURIComponent(serviceId) : ""
);
console.log("serviceId:", serviceId);
console.log("searchTerm:", searchTerm);

  // Lấy thêm các query parameter khác nếu có
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [selectedSpecialization, setSelectedSpecialization] = useState(category);
  const [minRating, setMinRating] = useState(0);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const specializations = Array.from(
    new Set(nursing.map((nurse) => nurse.specialization))
  );

  const filteredNurses = useMemo(() => {
    return nursing.filter((nurse) => {
      // Bỏ điều kiện matchesSearch tạm thời
      const matchesSpecialization =
        !selectedSpecialization ||
        nurse.specialization === selectedSpecialization ||
        Object.keys(nurse.services).includes(searchTerm);
      const matchesRating = nurse.avgRating >= minRating;
      return matchesSpecialization && matchesRating;
    });
  }, [searchTerm, selectedSpecialization, minRating]);
  

  return (
    <div className="hero_section">
      <Breadcrumb className="px-10 py-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/nurseList" className="text-xl">
              Dịch vụ điều dưỡng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl text-gray-500">
              Chuyên khoa: {selectedSpecialization || "Tất cả"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl text-gray-500">
              Dịch vụ: {searchTerm || "Tất cả"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="xl:w-[650px] mx-auto">
        <h2 className="heading text-center">
          Đội ngũ điều dưỡng chuyên nghiệp
        </h2>
        <p className="text_para text-center">
          Đội ngũ điều dưỡng chuyên nghiệp, được tuyển chọn kỹ càng, cam kết
          mang đến dịch vụ chăm sóc sức khỏe tận tâm và chất lượng
        </p>
      </div>

      <div className="mx-auto max-w-[1900px] px-8 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <Card className="md:w-1/3 lg:w-1/4 h-fit">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold">
                Bộ lọc tìm kiếm
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Search Filter */}
                <AccordionItem value="search" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    Tìm kiếm theo tên
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Nhập tên điều dưỡng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 py-6 text-lg"
                      />
                      <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Các bộ lọc khác ... */}
              </Accordion>
              <Button
                variant="outline"
                className="w-full mt-6 py-6 text-lg"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("");
                  setMinRating(0);
                  setAddress("");
                  setDistrict("");
                  setWard("");
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredNurses.map((nurse) => (
                <NursingCard key={nurse.id} nurse={nurse} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseList;
