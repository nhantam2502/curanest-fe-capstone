"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  Clipboard,
  FileText,
  Info,
  RefreshCw,
  Search,
  StarIcon,
  Stethoscope,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NursingCard from "@/app/components/Nursing/NursingCard";
import nursing from "@/dummy_data/dummy_nurse.json";
import { useParams, useSearchParams } from "next/navigation";

const NurseList = () => {
  const params = useParams();
  const serviceIdRaw = params.serviceId;
  const serviceId =
    typeof serviceIdRaw === "string"
      ? serviceIdRaw
      : serviceIdRaw
      ? serviceIdRaw[0]
      : "";
  const [searchTerm, setSearchTerm] = useState(
    serviceId ? decodeURIComponent(serviceId) : ""
  );
  console.log("serviceId:", serviceId);
  console.log("searchTerm:", searchTerm);

  // Lấy thêm các query parameter khác nếu có
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [selectedSpecialization, setSelectedSpecialization] =
    useState(category);

  const filteredNurses = useMemo(() => {
    return nursing.filter((nurse) => {
      // Bỏ điều kiện matchesSearch tạm thời
      const matchesSpecialization =
        !selectedSpecialization ||
        nurse.specialization === selectedSpecialization ||
        Object.keys(nurse.services).includes(searchTerm);
      return matchesSpecialization ;
    });
  }, [searchTerm, selectedSpecialization]);

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
            <BreadcrumbLink href={`/guest/nurseList/${encodeURIComponent(searchTerm)}?category=${encodeURIComponent(category)}`} className="text-xl">
              Danh sách điều dưỡng thuộc dịch vụ: {searchTerm}
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
          {/* Selected Info Card - thay thế Filter Sidebar */}
          <Card className="md:w-1/3 lg:w-1/4 h-fit shadow-lg border-t-4 border-t-irisBlueColor rounded-lg overflow-hidden">
            <CardHeader className="p-6 bg-gradient-to-r from-irisBlueColor/10 to-transparent">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-irisBlueColor">
                <FileText className="h-6 w-6" />
                Thông tin đã chọn
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {/* Chuyên khoa đã chọn */}
              <div className="mb-8">
                <p className="text-xl font-medium mb-4 flex items-center text-gray-800">
                  <Stethoscope className="h-6 w-6 mr-3 text-irisBlueColor" />
                  Chuyên khoa
                </p>
                {selectedSpecialization ? (
                  <div className="animate-fadeIn">
                    <Badge className="px-3 py-1.5 text-[18px] bg-[#e5ab47] hover:bg-[#e5ab47] text-white border-[#e5ab47] gap-2">
                    <CheckCircle className="h-4 w-4" />
                      {selectedSpecialization}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 italic pl-2 border-l-2 border-gray-300">
                    <Info className="h-5 w-5 text-gray-400" />
                    <p>Chưa chọn chuyên khoa</p>
                  </div>
                )}
              </div>

              {/* Dịch vụ đã chọn */}
              <div className="mb-6">
                <p className="text-xl font-medium mb-4 flex items-center text-gray-800">
                  <Clipboard className="h-6 w-6 mr-3 text-irisBlueColor" />
                  Dịch vụ
                </p>
                {searchTerm ? (
                  <div className="animate-fadeIn">
                    <Badge className="px-3 py-1.5 text-[18px] bg-[#e5ab47] hover:bg-[#e5ab47] text-white border-[#e5ab47] gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {searchTerm}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 italic pl-2 border-l-2 border-gray-300">
                    <Info className="h-5 w-5 text-gray-400" />
                    <p>Chưa chọn dịch vụ</p>
                  </div>
                )}
              </div>

              {/* Nút Quay lại và Reset */}
                <Button
                  variant="outline"
                  className="w-full mt-6 py-6 text-lg border-irisBlueColor text-irisBlueColor hover:bg-irisBlueColor/10 hover:text-irisBlueColor"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>
               
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredNurses.map((nurse) => (
                <NursingCard key={nurse.id} nurse={nurse} service={searchTerm} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseList;
