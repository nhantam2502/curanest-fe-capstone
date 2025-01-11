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
import { CalendarIcon, ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Profile } from "@/types/profile";

export default function EditPatientRecord({ profile }: { profile: Profile }) {

  const [date, setDate] = useState<Date | undefined>(() => {
    const dob = profile?.dob;
    return dob ? new Date(dob) : undefined;
  });
  const [avatar, setAvatar] = useState<string | null>(profile?.avatar);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
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
            <BreadcrumbLink href="/relatives/profiles" className="text-xl">
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
              {/* Avatar Section */}
              <div className="w-80 flex-shrink-0">
                <Label className="block mb-2 text-xl">Ảnh đại diện</Label>
                <div className="w-80 h-80 relative border-2 rounded-lg overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xl text-gray-500">
                      Chọn ảnh
                    </div>
                  )}
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
                    <Label className="text-xl" htmlFor="ward">
                      Phường
                    </Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      placeholder="Nhập phường"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="district">
                      Quận
                    </Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Nhập quận"
                      className="h-12"
                    />
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