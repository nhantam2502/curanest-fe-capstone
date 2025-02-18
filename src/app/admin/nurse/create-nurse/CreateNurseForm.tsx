"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { Major } from "@/types/major";
import majorApiRequest from "@/apiRequest/major/apiMajor";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
interface Geo {
  code: number | string;
  name: string;
}

const formSchema = z.object({
  "full-name": z.string().min(1, { message: "Tên đầy đủ là bắt buộc" }),
  "major-id": z.string().min(1, { message: "Chuyên môn là bắt buộc" }),
  dob: z.string().min(1, { message: "Ngày sinh là bắt buộc" }),
  "citizen-id": z.string().min(1, { message: "CCCD là bắt buộc" }),
  "phone-number": z.string().min(1, { message: "Số điện thoại là bắt buộc" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  city: z.string().min(1, { message: "Tỉnh/Thành phố là bắt buộc" }),
  district: z.string().min(1, { message: "Quận/Huyện là bắt buộc" }),
  ward: z.string().min(1, { message: "Phường/Xã là bắt buộc" }),
  slogan: z.string().default(""),
  gender: z.boolean().default(true),
  "google-drive-url": z.string().default(""),
  certificate: z.string().default(""),
  "current-work-place": z.string().default(""),
  experience: z.string().default(""),
  "education-level": z.string().default(""),
  "nurse-picture": z.string().default(""),
});

const NurseForm: React.FC = () => {
  const { toast } = useToast();
  const [majors, setMajors] = useState<Major[]>([]);
  const [districts, setDistricts] = useState<Geo[]>([]);
  const [wards, setWards] = useState<Geo[]>([]);
  const cityCode = "79";
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "full-name": "",
      "major-id": "",
      dob: "",
      "citizen-id": "",
      "phone-number": "",
      email: "",
      password: "",
      address: "",
      city: "TP. Hồ Chí Minh",
      district: "",
      ward: "",
      slogan: "",
      gender: true,
      "google-drive-url": "",
      certificate: "",
      "current-work-place": "",
      experience: "",
      "education-level": "",
      "nurse-picture": "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchMajor = async () => {
      try {
        const response = await majorApiRequest.getMajor();
        if (response.status === 200 && response.payload) {
          setMajors(response.payload.data || []);
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };
    fetchMajor();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrictCode) {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`
          );
          const data = await response.json();
          setWards(data.wards);
          console.log("Fetched wards:", data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      } else {
        setWards([]); // clear wards if no district is selected
      }
    };
    fetchWards();
  }, [selectedDistrictCode]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);
    try {
      const response = await nurseApiRequest.createNurse(data);
      if (response.status === 201) {
        setSubmissionSuccess(true);
        form.reset();
        setSelectedDistrictCode("");
      } else {
        setSubmissionError(
          response.payload?.data.error?.reason_field 
        );
      }
    } catch (error) {
      setSubmissionError("Có lỗi xảy ra khi tạo điều dưỡng.");
      console.error("Error creating nurse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submissionError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: submissionError,
      })
    }
  }, [submissionError]);

  useEffect(() => {
    if (submissionSuccess) {
      toast({
        title: "Success!",
        description: "Đã tạo điều dưỡng thành công.",
      });
    }
  }, []);

  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-2xl font-semibold">Tạo điều dưỡng</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full-name"
              render={({ field }) => (
                <FormItem>
                  <Label>Tên đầy đủ</Label>
                  <FormControl>
                    <Input size={20} placeholder="Tên đầy đủ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Major */}
            <FormField
              control={form.control}
              name="major-id"
              render={({ field }) => (
                <FormItem>
                  <Label>Chuyên môn</Label>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chuyên môn" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {majors.map((major) => (
                          <SelectItem
                            key={major.id}
                            value={major.id.toString()}
                          >
                            {major.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <Label>Ngày sinh</Label>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label>Giới tính</Label>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="true">Nam</SelectItem>
                      <SelectItem value="false">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Citizen ID */}
            <FormField
              control={form.control}
              name="citizen-id"
              render={({ field }) => (
                <FormItem>
                  <Label>CCCD</Label>
                  <FormControl>
                    <Input placeholder="CCCD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone-number"
              render={({ field }) => (
                <FormItem>
                  <Label>Số điện thoại</Label>
                  <FormControl>
                    <Input placeholder="Số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>Mật khẩu</Label>
                  <FormControl>
                    <Input type="password" placeholder="Mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <Label>Địa chỉ</Label>
                  <FormControl>
                    <Input placeholder="Địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <Label>Tỉnh/Thành phố</Label>
                  <FormControl>
                    <Input placeholder="TP. Hồ Chí Minh" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <Label>Quận/Huyện</Label>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        // value is the district name
                        field.onChange(value);
                        // Find the district in our list so we can extract its code for fetching wards
                        const selected = districts.find(
                          (d) => d.name === value
                        );
                        setSelectedDistrictCode(
                          selected ? selected.code.toString() : ""
                        );
                        // Clear ward value when district changes
                        form.setValue("ward", "");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {districts.map((district) => (
                          <SelectItem key={district.code} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ward */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <Label>Phường/Xã</Label>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      disabled={!selectedDistrictCode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Work Place */}
            <FormField
              control={form.control}
              name="current-work-place"
              render={({ field }) => (
                <FormItem>
                  <Label>Nơi làm việc hiện tại</Label>
                  <FormControl>
                    <Input placeholder="Nơi làm việc hiện tại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <Label>Kinh nghiệm</Label>
                  <FormControl>
                    <Input placeholder="Kinh nghiệm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Education Level */}
            <FormField
              control={form.control}
              name="education-level"
              render={({ field }) => (
                <FormItem>
                  <Label>Trình độ học vấn</Label>
                  <FormControl>
                    <Input placeholder="Trình độ học vấn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certificate */}
            <FormField
              control={form.control}
              name="certificate"
              render={({ field }) => (
                <FormItem>
                  <Label>Chứng chỉ</Label>
                  <FormControl>
                    <Input placeholder="Chứng chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slogan */}
            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <Label>Slogan</Label>
                  <FormControl>
                    <Input placeholder="Slogan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Google Drive URL */}
            <FormField
              control={form.control}
              name="google-drive-url"
              render={({ field }) => (
                <FormItem>
                  <Label>Google Drive URL</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nurse Picture URL */}
            <FormField
              control={form.control}
              name="nurse-picture"
              render={({ field }) => (
                <FormItem>
                  <Label>Hình ảnh điều dưỡng</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo điều dưỡng"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NurseForm;
