"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ActivitySquare,
  Clipboard,
  Home,
  Search,
  ShieldAlert,
  Utensils,
} from "lucide-react";
import { Heart, Baby, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import {
  CategoryInfo,
  ServiceItem,
  TransformedCategory,
} from "@/types/service";
import serviceApiRequest from "@/apiRequest/service/apiServices";

const ServicesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [services, setServices] = useState<TransformedCategory[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  // Category icons mapping
  const categoryIcons: { [key: string]: React.ReactNode } = {
    "Chăm sóc cho bé yêu": <Baby className="w-7 h-7 text-pink-500" />,
    "Chăm sóc cơ bản": <Heart className="w-7 h-7 text-blue-500" />,
    "Y tế tại nhà": <Home className="w-7 h-7 text-green-500" />,
    "Phục hồi chức năng": (
      <ActivitySquare className="w-7 h-7 text-purple-500" />
    ),
    "Hỗ trợ dinh dưỡng và vệ sinh": (
      <Utensils className="w-7 h-7 text-amber-500" />
    ),
    "Chăm sóc đặc biệt": <ShieldAlert className="w-7 h-7 text-red-500" />,
    "Tư vấn sức khỏe": <Clipboard className="w-7 h-7 text-teal-500" />,
  };

  useEffect(() => {
    const fetchFilteredServices = async () => {
      try {
        const nameFilter = searchTerm.trim() ? searchTerm : null;

        const response = await serviceApiRequest.getListService(nameFilter);

        const transformedServices: TransformedCategory[] =
          response.payload.data.map(
            (item: {
              "category-info": CategoryInfo;
              "list-services": ServiceItem[];
            }) => ({
              name: item["category-info"].name,
              id: item["category-info"].id,
              description: item["category-info"].description,
              services: item["list-services"].map((service: ServiceItem) => ({
                name: service.name,
                id: service.id,
                description: service.description,
              })),
            })
          );

        setServices(transformedServices);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch filtered services:", error);
      }
    };

    fetchFilteredServices();
  }, [searchTerm, selectedCategory]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleServiceClick = (
    category: string,
    service: string,
    id: string
  ) => {
    router.push(
      `/guest/nurseList/${encodeURIComponent(service)}?category=${encodeURIComponent(category)}&serviceId=${encodeURIComponent(id)}`
    );
  };

  const filteredCategories = useMemo(() => {
    return services.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.services.some((service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        !selectedCategory || category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, services]);

  // Get current page services
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredCategories.slice(
    indexOfFirstService,
    indexOfLastService
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredCategories.length / servicesPerPage);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of services section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, current page, and pages around current page
      if (currentPage <= 3) {
        // If current page is near start, show first 4 pages and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // If current page is near end, show first page and last 4 pages
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // If current page is in middle, show first page, last page, and pages around current page
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="xl:w-[650px] mx-auto">
        <h2 className="heading text-center">Dịch Vụ Điều Dưỡng</h2>
        <p className="text_para text-center">
          Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe chuyên nghiệp, tận
          tâm với đội ngũ điều dưỡng giàu kinh nghiệm.
        </p>
      </div>

      <div className="mx-auto max-w-[1900px] px-8 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <Card className="md:w-1/3 lg:w-1/4 h-fit">
            <CardHeader className="p-6 bg-gradient-to-r from-irisBlueColor/10 to-transparent">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-irisBlueColor">
                <Search className="h-6 w-6" />
                Bộ lọc tìm kiếm
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Search Filter */}
                <AccordionItem value="search" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    Tìm kiếm dịch vụ
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-12 py-6 text-lg"
                      />
                      <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Category Filter */}
                <AccordionItem value="category" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    Danh mục dịch vụ
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        variant="outline"
                        className={`cursor-pointer text-[18px] px-4 py-2 ${
                          selectedCategory === ""
                            ? "bg-[#e5ab47] text-white border-[#e5ab47]"
                            : ""
                        }`}
                        onClick={() => setSelectedCategory("")}
                      >
                        Tất cả
                      </Badge>
                      {services.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className={`cursor-pointer text-[18px] px-4 py-2 ${
                            selectedCategory === category.name
                              ? "bg-[#e5ab47] text-white border-[#e5ab47]"
                              : ""
                          }`}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Reset & Submit Buttons */}
              <div className="flex justify-between gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 py-6 text-lg border-irisBlueColor text-irisBlueColor hover:bg-irisBlueColor/10 hover:text-irisBlueColor"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchInput("");
                    setSelectedCategory("");
                  }}
                >
                  Đặt lại
                </Button>

                <Button
                  className={`flex-1 py-6 text-lg ${
                    searchInput.trim() === ""
                      ? "bg-[#e5ab47]/90 cursor-not-allowed"
                      : "bg-[#e5ab47] hover:bg-[#e5ab47]"
                  } text-white`}
                  onClick={() => setSearchTerm(searchInput)}
                  disabled={searchInput.trim() === ""} // Vô hiệu hóa khi input trống
                >
                  Tìm kiếm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="space-y-6">
              {currentServices.length > 0 ? (
                currentServices.map((category, index) => (
                  <div key={index} className="w-full">
                    <CardHeader className="p-6 ">
                      <CardTitle className="flex items-center gap-3 text-3xl">
                        {categoryIcons[category.name] || (
                          <Users className="w-7 h-7 text-gray-500" />
                        )}
                        {category.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-4">
                        {category.services.map((service) => (
                          <Button
                            key={service.id}
                            variant="outline"
                            className="rounded-full h-auto py-2 px-6 text-xl hover:bg-gray-100"
                            onClick={() =>
                              handleServiceClick(
                                category.name,
                                service.name,
                                service.id
                              )
                            }
                          >
                            {service.name}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                ))
              ) : (
                <div className="w-full p-8 text-center">
                  <p className="text-2xl text-gray-500">
                    Không tìm thấy dịch vụ nào phù hợp
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredCategories.length > servicesPerPage && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) =>
                      page === -1 ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
