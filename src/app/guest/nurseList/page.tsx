"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Heart, Stethoscope, Baby, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const ServicesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    {
      name: "Chăm sóc người già",
      icon: <Heart className="w-7 h-7 text-red-500" />,
      services: [
        "Chăm sóc tại nhà",
        "Theo dõi sức khỏe",
        "Phục hồi chức năng",
        "Dinh dưỡng",
        "Đo sinh hiệu",
      ],
    },
    {
      name: "Chăm sóc sau phẫu thuật",
      icon: <Stethoscope className="w-7 h-7 text-blue-500" />,
      services: [
        "Thay băng",
        "Theo dõi sinh tồn",
        "Vật lý trị liệu",
        "Chăm sóc vết thương",
      ],
    },
    {
      name: "Chăm sóc mẹ và bé",
      icon: <Baby className="w-7 h-7 text-pink-500" />,
      services: [
        "Chăm sóc sau sinh",
        "Tư vấn dinh dưỡng",
        "Theo dõi bé",
        "Massage",
      ],
    },
    {
      name: "Dịch vụ khám bệnh",
      icon: <Users className="w-7 h-7 text-orange-500" />,
      services: ["Khám tổng quát", "Xét nghiệm", "Tư vấn", "Đo sinh hiệu"],
    },
  ];

  const handleServiceClick = (category: string, service: string) => {
    router.push(`/guest/nurseList/${encodeURIComponent(service)}?category=${encodeURIComponent(category)}`);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.services.some(service =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory = !selectedCategory || category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, categories]);

  return (
    <section className="hero_section">
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
                    Tìm kiếm dịch vụ
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                      {categories.map((category) => (
                        <Badge
                          key={category.name}
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

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full mt-6 py-6 text-lg"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </CardContent>
          </Card>

          {/* Services Content */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="space-y-6">
              {filteredCategories.map((category, index) => (
                <div key={index} className="w-full">
                  <CardHeader className="p-6 ">
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      {category.icon}
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4">
                      {category.services.map((service, serviceIndex) => (
                        <Button
                          key={serviceIndex}
                          variant="outline"
                          className="rounded-full h-auto py-2 px-6 text-xl hover:bg-gray-100"
                          onClick={() => handleServiceClick(category.name, service)}
                        >
                          {service}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;