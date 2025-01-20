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
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Pencil } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Profile } from "@/types/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function EditPatientRecord({ profile }: { profile: Profile }) {
  const [date, setDate] = useState<Date | undefined>(() => {
    const dob = profile?.dob;
    return dob ? new Date(dob) : undefined;
  });
  const [avatar, setAvatar] = useState<string | null>(profile?.avatar);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    address: profile?.address || "",
    ward: profile?.ward || "",
    district: profile?.district || "",
    city: profile?.city || "Hồ Chí Minh",
    medical_description: profile?.medical_description || "",
    note_for_nurses: profile?.note_for_nurses || "",
  });

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl); // Update avatar state with the new image URL
      console.log("Selected file:", file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      ...formData,
      dob: date?.toISOString(),
      avatar,
    });
  };

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
            <div className="flex gap-10 mt-5">
              {/* Avatar Section */}
              <div className="w-80 flex-shrink-0">
                {/* <Label className="block mb-2 text-xl">Ảnh đại diện</Label> */}
                <div className="w-80 flex flex-col items-center space-y-6">
                  <div className="relative group">
                    <img
                      src={avatar || "/placeholder-avatar.png"} // Add a placeholder image path
                      alt="Profile"
                      className="w-64 h-64 rounded-full object-cover border-6 border-violet-100 cursor-pointer"
                    />
                    <div
                      className="absolute bottom-4 right-4 p-2 bg-yellowColor rounded-full cursor-pointer transition-colors group-hover:scale-110"
                      onClick={handleAvatarClick}
                    >
                      <Pencil className="w-6 h-6 text-white" />
                    </div>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-6">
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
                    <Label className="text-xl" htmlFor="dob">
                      Ngày sinh
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start text-left font-normal text-lg",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
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
                      <SelectTrigger className="h-12 w-full text-lg">
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
                      <SelectTrigger className="h-12 w-full text-lg">
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
                    className="min-h-[120px]"
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
                    className="min-h-[120px]"
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
