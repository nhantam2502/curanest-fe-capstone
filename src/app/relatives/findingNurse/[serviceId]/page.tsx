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
  Search,
  StarIcon,
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import { NurseItemType } from "@/types/nurse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import RelativesNursingCard from "@/app/components/Nursing/RelativesNursingCard";

// Replace the two separate cards with this combined card
const NurseList = () => {
  const params = useParams();
  const router = useRouter();
  const serviceIdRaw = params?.serviceId;
  const serviceId =
    typeof serviceIdRaw === "string" ? serviceIdRaw : (serviceIdRaw?.[0] ?? "");
  const [searchTerm, setSearchTerm] = useState(
    serviceId ? decodeURIComponent(serviceId) : ""
  );

  // Lấy thêm các query parameter khác nếu có
  const searchParams = useSearchParams();
  const serviceID = searchParams.get("serviceId") || "";
  const category = searchParams.get("category") || "";

  console.log("Service ID: ", serviceID);
  console.log("Category: ", category);

  const [selectedSpecialization, setSelectedSpecialization] =
    useState(category);

  const [nurses, setNurses] = useState<NurseItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // Thêm state cho filter theo tên và rating
  const [nameFilter, setNameFilter] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (!serviceId) return; // Chỉ gọi khi nhấn tìm kiếm

    const fetchNurses = async () => {
      setLoading(true);
      try {
        const response = await nurseApiRequest.getListNurse(
          serviceID || null,
          minRating ? minRating.toString() : null,
          currentPage,
          nameFilter || null
        );
        setNurses(response.payload.data);
      } catch (err) {
        console.log("Error fetching nurses ", err);
      } finally {
        setLoading(false);
        setSearchTriggered(false); // Reset để tránh gọi API nhiều lần
      }
    };

    fetchNurses();
  }, [serviceID, searchTriggered]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Hiển thị 6 điều dưỡng mỗi trang

  const filteredNurses = useMemo(() => {
    return nurses.filter((nurse) => {
      // Filter theo tên điều dưỡng
      const matchesName =
        !nameFilter ||
        nurse["nurse-name"].toLowerCase().includes(nameFilter.toLowerCase());

      // Filter theo rating
      const matchesRating = nurse.rate >= minRating;

      return matchesName && matchesRating;
    });
  }, [searchTerm, selectedSpecialization, nameFilter, minRating, nurses]);

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

  const handleSearch = () => {
    setSearchTriggered(true); // Chỉ gọi API khi nhấn nút
    setCurrentPage(1); // Reset trang về 1 khi tìm kiếm mới
  };

  // Reset all filters
  const resetFilters = () => {
    setNameFilter("");
    setMinRating(0);
    setCurrentPage(1);
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
            <BreadcrumbLink href="/relatives/findingNurse" className="text-xl">
              Dịch vụ điều dưỡng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/relatives/findingNurse/${encodeURIComponent(searchTerm)}?category=${encodeURIComponent(category)}&serviceId=${decodeURIComponent(serviceID)}`}
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
          {/* Combined Filter and Info Card - Cột bên trái */}
          <div className="w-full md:w-1/4 lg:w-1/4">
            <Card className="h-fit shadow-lg border-t-4 border-t-irisBlueColor rounded-lg overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-irisBlueColor/10 to-transparent">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-irisBlueColor">
                  <FileText className="h-6 w-6" />
                  Thông tin và Bộ lọc
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {/* Phần Thông tin đã chọn */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-irisBlueColor flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Thông tin đã chọn
                  </h3>

                  {/* Chuyên khoa đã chọn */}
                  <div className="mb-4">
                    <p className="text-lg font-medium mb-2 flex items-center text-gray-700">
                      <Stethoscope className="h-5 w-5 mr-2 text-irisBlueColor" />
                      Chuyên khoa
                    </p>
                    {selectedSpecialization ? (
                      <div className="animate-fadeIn">
                        <Badge className="px-3 py-1.5 text-[16px] bg-[#e5ab47] hover:bg-[#e5ab47] text-white border-[#e5ab47] gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {selectedSpecialization}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 italic pl-2 border-l-2 border-gray-300">
                        <Info className="h-4 w-4 text-gray-400" />
                        <p>Chưa chọn chuyên khoa</p>
                      </div>
                    )}
                  </div>

                  {/* Dịch vụ đã chọn */}
                  <div className="mb-4">
                    <p className="text-lg font-medium mb-2 flex items-center text-gray-700">
                      <Clipboard className="h-5 w-5 mr-2 text-irisBlueColor" />
                      Dịch vụ
                    </p>
                    {searchTerm ? (
                      <div className="animate-fadeIn">
                        <Badge className="px-3 py-1.5 text-[16px] bg-[#e5ab47] hover:bg-[#e5ab47] text-white border-[#e5ab47] gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {searchTerm}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 italic pl-2 border-l-2 border-gray-300">
                        <Info className="h-4 w-4 text-gray-400" />
                        <p>Chưa chọn dịch vụ</p>
                      </div>
                    )}
                  </div>

                  {/* Hiển thị thông tin filter đã chọn */}
                  {(nameFilter || minRating > 0) && (
                    <div className="mb-4">
                      <p className="text-lg font-medium mb-2 flex items-center text-gray-700">
                        <Search className="h-5 w-5 mr-2 text-irisBlueColor" />
                        Bộ lọc đã áp dụng
                      </p>
                      <div className="space-y-2">
                        {nameFilter && (
                          <div className="animate-fadeIn">
                            <Badge className="px-3 py-1.5 text-[16px] bg-irisBlueColor hover:bg-irisBlueColor text-white border-irisBlueColor gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Tên: {nameFilter}
                            </Badge>
                          </div>
                        )}
                        {minRating > 0 && (
                          <div className="animate-fadeIn">
                            <Badge className="px-3 py-1.5 text-[16px] bg-irisBlueColor hover:bg-irisBlueColor text-white border-irisBlueColor gap-2">
                              <StarIcon className="h-4 w-4" />
                              Đánh giá: {minRating}+ sao
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phần Bộ lọc tìm kiếm */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-irisBlueColor flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Bộ lọc tìm kiếm
                  </h3>

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                    defaultValue="search"
                  >
                    {/* Search Filter */}
                    <AccordionItem value="search" className="border-b">
                      <AccordionTrigger className="text-lg py-3">
                        Tìm kiếm theo tên
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-5">
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Nhập tên điều dưỡng..."
                            value={nameFilter}
                            onChange={(e) => {
                              setNameFilter(e.target.value);
                              setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
                            }}
                            className="pl-10 py-5 text-base"
                          />
                          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Rating Filter */}
                    <AccordionItem value="rating" className="border-b">
                      <AccordionTrigger className="text-lg py-3">
                        <div className="flex items-center gap-2">
                          Xếp hạng đánh giá
                          <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-200" />
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pt-3 pb-5">
                        <div className="space-y-5">
                          <Slider
                            defaultValue={[0]}
                            max={5}
                            step={0.5}
                            className="w-full"
                            onValueChange={(value) => {
                              setMinRating(value[0]);
                              setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
                            }}
                          />
                          <div className="flex justify-between items-center">
                            <div className="text-base text-muted-foreground flex gap-2">
                              Tối thiểu:{" "}
                              <span className="font-medium text-irisBlueColor">
                                {minRating}
                              </span>{" "}
                              / 5
                            </div>

                            {/* Hiển thị rating bằng stars */}
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={`w-4 h-4 ${star <= minRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex justify-between gap-4 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 py-5 text-base border-irisBlueColor text-irisBlueColor hover:bg-irisBlueColor/10 hover:text-irisBlueColor"
                      onClick={resetFilters}
                    >
                      Đặt lại
                    </Button>

                    <Button
                      onClick={handleSearch}
                      disabled={!nameFilter && minRating === 0} // Điều kiện disable
                      className={`flex-1 py-5 text-base ${
                        !nameFilter && minRating === 0
                          ? "bg-[#e5ab47]/90 cursor-not-allowed" // Khi disable
                          : "bg-[#e5ab47] hover:bg-[#e5ab47]" // Khi enable
                      }`}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </div>

                {/* Nút Quay lại ở cuối cùng */}
                <Button
                  variant="outline"
                  className="w-full mt-8 py-5 text-base border-irisBlueColor text-irisBlueColor hover:bg-irisBlueColor/10 hover:text-irisBlueColor"
                  onClick={() => router.push("/relatives/findingNurse")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Cột bên phải lớn hơn */}
          <div className="w-full md:w-2/3 lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-irisBlueColor"></div>
              </div>
            ) : (
              <>
                {currentNurses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {currentNurses.map((nurse) => (
                      <RelativesNursingCard
                        key={nurse["nurse-id"]}
                        nurse={nurse}
                        service={serviceId}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Info className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Không tìm thấy điều dưỡng
                    </h3>
                    <p className="text-[18px] text-gray-500">
                      Thử điều chỉnh bộ lọc để xem nhiều kết quả hơn.
                    </p>
                    <Button
                      variant="outline"
                      className="text-[18px] mt-4 border-irisBlueColor text-irisBlueColor hover:bg-irisBlueColor/10"
                      onClick={resetFilters}
                    >
                      Đặt lại bộ lọc
                    </Button>
                  </div>
                )}

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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseList;
