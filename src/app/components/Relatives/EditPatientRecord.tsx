"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft, Pencil } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PatientRecord } from "@/types/patient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse, set } from "date-fns";

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  wards: Ward[];
}

interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
}

export default function EditPatientRecord({
  profile,
}: {
  profile: PatientRecord;
}) {
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

  const initialDate = profile?.dob ? new Date(profile.dob) : undefined;

  const [selectedYear, setSelectedYear] = useState<string>(
    initialDate ? initialDate.getFullYear().toString() : ""
  );

  const [date, setDate] = useState<Date | undefined>(initialDate);

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.["full-name"] || "",
    phone_number: profile?.["phone-number"] || "",
    address: profile?.address || "",
    district: "",
    ward: "",
    city: profile?.city || "Hồ Chí Minh",
    medical_description: profile?.["desc-pathology"] || "",
    note_for_nurses: profile?.["note-for-nurse"] || "",
    year_of_birth: selectedYear,
    date: initialDate ? format(initialDate, "dd/MM/yyyy") : "",
  });

  const findDistrictByName = (districts: District[], name: string) => {
    return districts.find((d) => d.name === name)?.code.toString();
  };

  const findWardByName = (wards: Ward[], name: string) => {
    return wards.find((w) => w.name === name)?.code.toString();
  };

  // Fetch districts when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const hcmCode = 79;
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${hcmCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, []);

  // After districts load, set the correct district code
  useEffect(() => {
    if (districts.length > 0 && profile?.district) {
      const districtCode = findDistrictByName(districts, profile.district);
      if (districtCode) {
        setFormData((prev) => ({
          ...prev,
          district: districtCode,
        }));
      }
    }
  }, [districts, profile?.district]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.district) {
        setWards([]);
        return;
      }

      setIsLoadingWards(true);
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${formData.district}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [formData.district]);

  useEffect(() => {
    if (wards.length > 0 && profile?.ward) {
      const wardCode = findWardByName(wards, profile.ward);
      if (wardCode) {
        setFormData((prev) => ({
          ...prev,
          ward: wardCode,
        }));
      }
    }
  }, [wards, profile?.ward]);

  const handleYearSelect = (value: string) => {
    setSelectedYear(value);

    // Update year_of_birth in formData
    setFormData((prev) => ({
      ...prev,
      year_of_birth: value,
    }));

    // If there's an existing date, update it to the new year
    if (date) {
      const newDate = set(date, { year: parseInt(value) });
      setDate(newDate);
      setFormData((prev) => ({
        ...prev,
        date: format(newDate, "dd/MM/yyyy"),
      }));
    } else {
      // If no date is selected yet, clear the date field
      setFormData((prev) => ({
        ...prev,
        date: "",
      }));
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      setFormData((prev) => ({
        ...prev,
        date: "",
      }));
      return;
    }

    if (selectedYear) {
      // Create a new date with the selected year and the chosen date's month and day
      const dateInSelectedYear = set(selectedDate, {
        year: parseInt(selectedYear),
      });

      setDate(dateInSelectedYear);
      setFormData((prev) => ({
        ...prev,
        date: format(dateInSelectedYear, "dd/MM/yyyy"),
      }));
    }
  };

  const disableDate = (date: Date) => {
    if (!selectedYear) return true;
    return date.getFullYear() !== parseInt(selectedYear);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      district: value,
      ward: "", // Reset ward when district changes
    }));
  };

  const handleWardChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      ward: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      ...formData,
      dob: date?.toISOString(),
    });
  };

  console.log("formData: ", formData);
  return (
    <div className="hero_section h-full">
      <Breadcrumb className="px-10 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/relatives/booking" className="text-xl">
              Hồ sơ bệnh nhân
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400 text-[32px]" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl cursor-pointer">
              Chỉnh sửa hồ sơ bệnh nhân
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-[1400px] mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Chỉnh sửa hồ sơ bệnh nhân
            </CardTitle>
            <CardDescription className="text-lg">
              Chỉnh sửa thông tin chi tiết của hồ sơ bệnh nhân
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-10">
              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="full_name">
                      Họ và Tên
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="year_of_birth">
                      Năm sinh
                    </Label>
                    <Select
                      onValueChange={handleYearSelect}
                      value={selectedYear}
                    >
                      <SelectTrigger className="h-12 w-full text-xl">
                        <SelectValue placeholder="Chọn năm" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className="text-lg"
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="dateOfBirth">
                      Ngày sinh
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal text-xl",
                            !selectedYear && "opacity-50 cursor-not-allowed",
                            !date && "text-muted-foreground"
                          )}
                          disabled={!selectedYear}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date || "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          disabled={disableDate}
                          initialFocus
                          defaultMonth={
                            date || new Date(parseInt(selectedYear), 0, 1)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="phone_number">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="address">
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="district">
                      Quận
                    </Label>
                    <Select
                      onValueChange={handleDistrictChange}
                      value={formData.district}
                      disabled={isLoadingDistricts}
                    >
                      <SelectTrigger className="h-12 w-full text-xl">
                        <SelectValue
                          placeholder={
                            isLoadingDistricts ? "Đang tải..." : "Chọn quận"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem
                            key={district.code}
                            value={district.code.toString()}
                            className="text-lg"
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="ward">
                      Phường
                    </Label>
                    <Select
                      onValueChange={handleWardChange}
                      value={formData.ward}
                      disabled={!formData.district || isLoadingWards}
                    >
                      <SelectTrigger className="h-12 w-full text-xl">
                        <SelectValue
                          placeholder={
                            isLoadingWards ? "Đang tải..." : "Chọn phường"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem
                            key={ward.code}
                            value={ward.code.toString()}
                            className="text-lg"
                          >
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="city">
                      Thành phố
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      className="h-12"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="medical_description">
                    Mô tả bệnh lý
                  </Label>
                  <Textarea
                    id="medical_description"
                    value={formData.medical_description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả bệnh lý"
                    className="min-h-[120px] text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="note_for_nurses">
                    Lưu ý với điều dưỡng
                  </Label>
                  <Textarea
                    id="note_for_nurses"
                    value={formData.note_for_nurses}
                    onChange={handleInputChange}
                    placeholder="Nhập lưu ý với điều dưỡng"
                    className="min-h-[120px] text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                variant="destructive"
                className="h-12 px-6 text-xl"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button
                type="submit"
                className="h-12 px-8 text-xl bg-[#64D1CB] hover:bg-[#71DDD7]"
              >
                Lưu thay đổi
              </Button>
            </div>
          </CardContent>
        </form>
      </div>
    </div>
  );
}
