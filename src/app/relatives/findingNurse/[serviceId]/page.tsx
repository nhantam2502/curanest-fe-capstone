"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Clipboard,
  FileText,
  Info,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import nursing from "@/dummy_data/dummy_nurse.json";
import { useParams, useSearchParams } from "next/navigation";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { NurseItemType } from "@/types/nurse";
import RelativesNursingCard from "@/app/components/Nursing/RelativesNursingCard";

const NurseList = () => {
  const params = useParams();
  const serviceIdRaw = params?.serviceId;
  const serviceId =
    typeof serviceIdRaw === "string" ? serviceIdRaw : (serviceIdRaw?.[0] ?? "");
  const [searchTerm, setSearchTerm] = useState(
    serviceId ? decodeURIComponent(serviceId) : ""
  );

  // Lấy thêm các query parameter khác nếu có
  const searchParams = useSearchParams();
  const serviceID = searchParams.get("serviceId");

  const category = searchParams.get("category") || "";
  const [selectedSpecialization, setSelectedSpecialization] =
    useState(category);

  const [nurses, setNurses] = useState<NurseItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchNurses = async () => {
      setLoading(true);
      try {
        const response = await nurseApiRequest.getListNurse({
          "service-id": serviceID || "",
        });
        setNurses(response.payload.data);
        console.log("Nurses: ", response.payload.data);
      } catch (err) {
        console.log("Error fetching nurses ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, [serviceId]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Hiển thị 6 điều dưỡng mỗi trang

  const filteredNurses = useMemo(() => {
    return nursing.filter((nurse) => {
      // Bỏ điều kiện matchesSearch tạm thời
      const matchesSpecialization =
        !selectedSpecialization ||
        nurse.specialization === selectedSpecialization ||
        Object.keys(nurse.services).includes(searchTerm);
      return matchesSpecialization;
    });
  }, [searchTerm, selectedSpecialization]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredNurses.length / itemsPerPage);

  // Lấy danh sách điều dưỡng cho trang hiện tại
  const currentNurses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNurses.slice(startIndex, endIndex);
  }, [filteredNurses, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

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
            <BreadcrumbLink
              href={`/guest/nurseList/${encodeURIComponent(searchTerm)}?category=${encodeURIComponent(category)}`}
              className="text-xl"
            >
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
              {nurses.map((nurse) => (
                <RelativesNursingCard
                  key={nurse["nurse-id"]}
                  nurse={nurse}
                  service={serviceId}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-4 text-gray-500">
                  Trang {currentPage} / {totalPages} • Hiển thị{" "}
                  {Math.min(
                    itemsPerPage,
                    filteredNurses.length - (currentPage - 1) * itemsPerPage
                  )}{" "}
                  trên tổng số {filteredNurses.length} điều dưỡng
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseList;
