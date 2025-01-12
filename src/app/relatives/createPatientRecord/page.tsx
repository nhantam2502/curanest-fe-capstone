"use client";
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function CreatePatientRecord() {
  const [date, setDate] = useState<Date>();
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
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
              Tạo hồ sơ bệnh nhân
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-[1400px] mx-auto">
        <div className="w-full">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Tạo hồ sơ bệnh nhân
            </CardTitle>
            <CardDescription className="text-lg">
              Điền thông tin chi tiết để tạo hồ sơ mới cho bệnh nhân
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
                      src={URL.createObjectURL(avatar)}
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
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="fullName">
                      Họ và Tên
                    </Label>
                    <Input
                      id="fullName"
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
                          variant={"outline"}
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

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="gender">
                      Giới tính
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 w-full text-lg">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-lg" value="male">
                          Nam
                        </SelectItem>
                        <SelectItem className="text-lg" value="female">
                          Nữ
                        </SelectItem>
                        <SelectItem className="text-lg" value="other">
                          Khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="phone">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
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
                    <Select>
                      <SelectTrigger className="h-12 w-full text-lg">
                        <SelectValue placeholder="Chọn phường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-lg" value="phuong-1">Phường 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="district">
                      Quận
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 w-full text-lg">
                        <SelectValue placeholder="Chọn quận" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-lg" value="quan-1">Quận 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="city">
                      Thành phố
                    </Label>
                    <Input
                      id="city"
                      className="h-12"
                      value={"Hồ Chí Minh"}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="medicalDescription">
                    Mô tả bệnh lý
                  </Label>
                  <Textarea
                    id="medicalDescription"
                    placeholder="Nhập mô tả bệnh lý"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="nurseNotes">
                    Lưu ý với điều dưỡng
                  </Label>
                  <Textarea
                    id="nurseNotes"
                    placeholder="Nhập lưu ý với điều dưỡng"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                variant="destructive"
                className="h-12 px-6 text-xl"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button className="h-12 px-8 text-xl bg-[#64D1CB] hover:bg-[#71DDD7]">
                Tạo
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
