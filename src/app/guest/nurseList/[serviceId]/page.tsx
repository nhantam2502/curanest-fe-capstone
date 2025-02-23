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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import NursingCard from "@/app/components/Nursing/NursingCard";
import nursing from "@/dummy_data/dummy_nurse.json";
import { useSearchParams } from "next/navigation";

const NurseList = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const service = searchParams.get('service');
  const [searchTerm, setSearchTerm] = useState(service || "");
  const [selectedSpecialization, setSelectedSpecialization] = useState(category || "");
  const [minRating, setMinRating] = useState(0);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  
  const specializations = Array.from(
    new Set(nursing.map((nurse) => nurse.specialization))
  );

  const filteredNurses = useMemo(() => {
    return nursing.filter((nurse) => {
      const matchesSearch =
        nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization =
        !selectedSpecialization ||
        nurse.specialization === selectedSpecialization;
      const matchesRating = nurse.avgRating >= minRating;

      return matchesSearch && matchesSpecialization && matchesRating;
    });
  }, [searchTerm, selectedSpecialization, minRating, nursing]);

  return (
    <section className="hero_section">
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

                {/* Specialization Filter */}
                <AccordionItem value="specialization" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    Chuyên môn
                  </AccordionTrigger>

                  <AccordionContent className="pt-4 pb-6">
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        variant="outline"
                        className={`cursor-pointer text-[18px] px-4 py-2 ${
                          selectedSpecialization === ""
                            ? "bg-[#e5ab47] text-white border-[#e5ab47]"
                            : ""
                        }`}
                        onClick={() => setSelectedSpecialization("")}
                      >
                        All
                      </Badge>
                      {specializations.map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className={`cursor-pointer text-[18px] px-4 py-2 ${
                            selectedSpecialization === spec
                              ? "bg-[#e5ab47] text-white border-[#e5ab47]"
                              : ""
                          }`}
                          onClick={() => setSelectedSpecialization(spec)}
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Rating Filter */}
                <AccordionItem value="rating" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    <div className="flex items-center gap-2">
                      Xếp hạng đánh giá
                      <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-200" />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-6">
                      <Slider
                        value={[minRating]}
                        onValueChange={([value]) => setMinRating(value)}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-lg text-muted-foreground flex gap-2">
                        Tối thiểu: {minRating} / 5
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nearby" className="border-b-2">
                  <AccordionTrigger className="text-xl py-4">
                    Xung quanh bạn
                  </AccordionTrigger>

                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-4">
                      {/* Địa chỉ */}
                      <div>
                        <label className="block text-lg font-medium mb-2">
                          Địa chỉ
                        </label>
                        <Input
                          type="text"
                          placeholder="Nhập địa chỉ..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="py-4 text-lg"
                        />
                      </div>

                      {/* Quận/Huyện */}
                      <div>
                        <label className="block text-lg font-medium mb-2">
                          Quận/Huyện
                        </label>
                        <Input
                          type="text"
                          placeholder="Nhập quận/huyện..."
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="py-4 text-lg"
                        />
                      </div>

                      {/* Phường */}
                      <div>
                        <label className="block text-lg font-medium mb-2">
                          Phường
                        </label>
                        <Input
                          type="text"
                          placeholder="Nhập phường..."
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                          className="py-4 text-lg"
                        />
                      </div>

                      {/* Thành phố */}
                      <div>
                        <label className="block text-lg font-medium mb-2">
                          Thành phố
                        </label>
                        <Input value={"Hồ Chí Minh"} className="py-4 text-lg" />
                      </div>

                      {/* Nút Lọc */}
                      <Button
                        variant="outline"
                        className="w-full mt-4 text-lg"
                        disabled={!address || !district || !ward}
                      >
                        Lọc xung quanh
                      </Button>
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
    </section>
  );
};

export default NurseList;
