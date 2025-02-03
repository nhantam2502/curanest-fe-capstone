"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { format, parse } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CreatePatientInput,
  CreatePatientSchema,
} from "@/schemaValidation/relatives.schema";
import patientApiRequest from "@/apiRequest/patient/apiPatient";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  ward: Ward[];
}

interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
}

export default function CreatePatientRecord() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [selectedWardName, setSelectedWardName] = useState<string>("");
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePatientInput>({
    resolver: zodResolver(CreatePatientSchema),
  });

  const date = watch("dob");
  const selectedDistrict = watch("district");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setValue("dob", "");
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedYear) {
      // Combine selected year with selected date
      const formattedDate = format(
        new Date(
          parseInt(selectedYear),
          selectedDate.getMonth(),
          selectedDate.getDate()
        ),
        "yyyy-MM-dd"
      );
      setValue("dob", formattedDate);
    }
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

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      setIsLoadingWards(true);
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
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
  }, [selectedDistrict]);

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setAvatar(file);
  //     setValue("avatar", file);
  //   }
  // };

  const onSubmit = async (data: CreatePatientInput) => {
    setIsSubmitting(true);
    try {
      const response = await patientApiRequest.createPatientRecord({
        "full-name": data["full-name"],
        "phone-number": data["phone-number"],
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        district: selectedDistrictName,
        ward: selectedWardName,
        city: data.city,
        "desc-pathology": data["desc-pathology"],
        "note-for-nurse": data["note-for-nurse"],
      });
      console.log("Patient record created:", response);

      toast.success("Đã tạo thành công hồ sơ bệnh nhân.", {
        position: "top-right",
        autoClose: 3000,
      });

      router.push("/relatives/booking");
    } catch (error) {
      console.error("Error creating patient record:", error);
      setIsSubmitting(false);

      toast.error("Có lỗi xảy ra khi tạo hồ sơ bệnh nhân.", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-10">
                {/* Avatar Section */}
                {/* <div className="w-80 flex-shrink-0">
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
                  {errors.avatar && (
                    <p className="text-red-500 mt-1">{errors.avatar.message}</p>
                  )}
                </div> */}

                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="full-name">
                        Họ và Tên
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="Nhập họ và tên"
                        className="h-12 text-lg"
                        {...register("full-name")}
                      />
                      {errors["full-name"] && (
                        <p className="text-red-500">
                          {errors["full-name"].message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="year">
                        Năm sinh
                      </Label>
                      <Select onValueChange={handleYearSelect}>
                        <SelectTrigger className="h-12 w-full text-xl">
                          <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem
                              key={year}
                              value={year}
                              className="text-lg"
                            >
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.dob && (
                        <p className="text-red-500">{errors.dob.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="dateOfBirth">
                        Ngày sinh
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            disabled={!selectedYear}
                            className={cn(
                              "h-12 w-full justify-start text-left font-normal text-xl",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date
                              ? format(
                                  parse(date, "yyyy-MM-dd", new Date()),
                                  "dd/MM/yyyy"
                                )
                              : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            fromYear={parseInt(
                              selectedYear || currentYear.toString()
                            )}
                            toYear={parseInt(
                              selectedYear || currentYear.toString()
                            )}
                            selected={date ? new Date(date) : undefined}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.dob && (
                        <p className="text-red-500">{errors.dob.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="gender">
                        Giới tính
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("gender", value === "true")
                        }
                      >
                        <SelectTrigger className="h-12 w-full text-xl">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="text-lg" value="true">
                            Nam
                          </SelectItem>
                          <SelectItem className="text-lg" value="false">
                            Nữ
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500">{errors.gender.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="phone-number">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone-number"
                        placeholder="Nhập số điện thoại"
                        className="h-12"
                        {...register("phone-number")}
                      />
                      {errors["phone-number"] && (
                        <p className="text-red-500">
                          {errors["phone-number"].message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="address">
                        Địa chỉ
                      </Label>
                      <Input
                        id="address"
                        placeholder="Nhập địa chỉ"
                        className="h-12"
                        {...register("address")}
                      />
                      {errors.address && (
                        <p className="text-red-500">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="district">
                        Quận
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("district", value);
                          setValue("ward", "");
                          const district = districts.find(
                            (d) => d.code.toString() === value
                          );
                          if (district) {
                            setSelectedDistrictName(district.name);
                          }
                        }}
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
                      {errors.district && (
                        <p className="text-red-500">
                          {errors.district.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="ward">
                        Phường
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("ward", value);
                          const ward = wards.find(
                            (w) => w.code.toString() === value
                          );
                          if (ward) {
                            setSelectedWardName(ward.name);
                          }
                        }}
                        disabled={!selectedDistrict || isLoadingWards}
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
                      {errors.ward && (
                        <p className="text-red-500">{errors.ward.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xl" htmlFor="city">
                        Thành phố
                      </Label>
                      <Input
                        id="city"
                        className="h-12"
                        value="Hồ Chí Minh"
                        disabled
                        {...register("city")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="desc-pathology">
                      Mô tả bệnh lý
                    </Label>
                    <Textarea
                      id="desc-pathology"
                      placeholder="Nhập mô tả bệnh lý"
                      className="min-h-[120px] text-xl"
                      {...register("desc-pathology")}
                    />
                    {errors["desc-pathology"] && (
                      <p className="text-red-500">
                        {errors["desc-pathology"].message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="note-for-nurse">
                      Lưu ý với điều dưỡng
                    </Label>
                    <Textarea
                      id="note-for-nurse"
                      placeholder="Nhập lưu ý với điều dưỡng"
                      className="min-h-[120px] text-xl"
                      {...register("note-for-nurse")}
                    />
                    {errors["note-for-nurse"] && (
                      <p className="text-red-500">
                        {errors["note-for-nurse"].message}
                      </p>
                    )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Tạo hồ sơ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
