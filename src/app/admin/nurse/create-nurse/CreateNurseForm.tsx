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
import { Textarea } from "@/components/ui/textarea"; // Assuming you added this
import { Separator } from "@/components/ui/separator"; // <-- Using Separator

import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription, // Keep if needed for specific fields
  FormField,
  FormItem,
  FormLabel, // Use this instead of plain Label
  FormMessage,
} from "@/components/ui/form";
// Removed Label import
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have cn utility
import { BirthDatePicker } from "@/components/date-picker";

interface Geo {
  code: number | string;
  name: string;
}

// Updated Schema (using date, string for gender, stricter validations)
const formSchema = z.object({
  "full-name": z.string().min(2, { message: "Tên không được để trống." }),
  dob: z.string(),
  "citizen-id": z
    .string()
    .min(9, { message: "CCCD phải có ít nhất 9-12 số." })
    .max(12, { message: "CCCD phải có ít nhất 9-12 số." })
    .regex(/^\d+$/, { message: "CCCD chỉ chứa số." }),
  "phone-number": z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ." })
    .regex(/^\d+$/, { message: "Số điện thoại chỉ chứa số." }),
  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email({ message: "Email không hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  address: z
    .string()
    .min(1, { message: "Số nhà, tên đường không được để trống." }),
  city: z.string(),
  district: z.string().min(1, { message: "Vui lòng chọn Quận/Huyện." }),
  ward: z.string().min(1, { message: "Vui lòng chọn Phường/Xã." }),
  gender: z.string().min(1, { message: "Vui lòng chọn giới tính." }),
  "current-work-place": z.string().optional(),
  experience: z.string().optional(),
  "education-level": z.string().optional(),
  certificate: z.string().optional(),
  slogan: z.string().optional(),
  "google-drive-url": z
    .string()
    .url({ message: "Vui lòng nhập URL hợp lệ." })
    .optional()
    .or(z.literal("")),
  "nurse-picture": z
    .string()
    .url({ message: "Vui lòng nhập URL hợp lệ." })
    .optional()
    .or(z.literal("")),
});

type NurseFormValues = z.infer<typeof formSchema>;

const NurseForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [districts, setDistricts] = useState<Geo[]>([]);
  const [wards, setWards] = useState<Geo[]>([]);
  const cityCode = "79"; // Ho Chi Minh City Code
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const form = useForm<NurseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "full-name": "",
      "citizen-id": "",
      "phone-number": "",
      email: "",
      password: "",
      address: "",
      city: "Thành phố Hồ Chí Minh",
      district: "",
      ward: "",
      gender: "",
      "current-work-place": "",
      experience: "",
      "education-level": "",
      certificate: "",
      slogan: "",
      "google-drive-url": "",
      "nurse-picture": "",
    },
    mode: "onSubmit",
  });

  // --- Fetching Logic (remains the same) ---
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
        );
        if (!response.ok) throw new Error("Failed to fetch districts");
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách Quận/Huyện.",
        });
      }
    };
    fetchDistricts();
  }, [toast]);

  useEffect(() => {
    if (selectedDistrictCode) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`
          );
          if (!response.ok) throw new Error("Failed to fetch wards");
          const data = await response.json();
          setWards(data.wards || []);
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể tải danh sách Phường/Xã.",
          });
          setWards([]);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrictCode, toast]);

  useEffect(() => {
    if (submissionError) {
      toast({
        variant: "destructive",
        title: "Đã có lỗi xảy ra.",
        description: submissionError,
      });
    }
    if (submissionSuccess) {
      toast({
        title: "Success!",
        description: "Đã tạo điều dưỡng thành công.",
      });
    }
  }, [submissionError, submissionSuccess, toast]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);
    try {
      // Format date to string (YYYY-MM-DD) and ensure optional fields have at least empty strings
      const formattedData = {
        ...data,
        dob: data.dob, // Convert Date to YYYY-MM-DD string
        "current-work-place": data["current-work-place"] || "",
        experience: data["experience"] || "",
        "education-level": data["education-level"] || "",
        certificate: data["certificate"] || "",
        slogan: data["slogan"] || "",
        "google-drive-url": data["google-drive-url"] || "",
        "nurse-picture": data["nurse-picture"] || "",
        // Convert string gender to boolean
        gender: data.gender === "true",
      };

      const response = await nurseApiRequest.createNurse(formattedData);
      if (response.status === 201) {
        setSubmissionSuccess(true);
        form.reset();
        setSelectedDistrictCode("");
      } else {
        setSubmissionError(response.payload?.error?.reason_field);
      }
    } catch (error) {
      setSubmissionError("Có lỗi xảy ra khi tạo điều dưỡng.");
      console.error("Error creating nurse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const Req = () => <span className="text-destructive">*</span>;
  const handleBack = () => {
    router.back(); 
  };
  return (
    <Form {...form}>
      <Button
      className="mb-4"
        variant="outline"
        onClick={handleBack}
      >
        Quay lại
      </Button>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        {/* --- Section 1: Personal Information --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full-name"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>
                    Tên đầy đủ <Req />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
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
                  <FormLabel>Ngày sinh</FormLabel>
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
                  <FormLabel>
                    Giới tính <Req />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel>
                    Số CCCD <Req />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số Căn cước công dân" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* --------------------------------------- */}
        <Separator /> {/* Divider between sections */}
        {/* --- Section 2: Contact & Address --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Liên hệ & Địa chỉ</h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone-number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số điện thoại <Req />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      {...field}
                    />
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
                  <FormLabel>
                    Email <Req />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="abc@example.com"
                      {...field}
                    />
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
                  <FormLabel>
                    Mật khẩu <Req />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      {...field}
                    />
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
                <FormItem className="lg:col-span-3">
                  <FormLabel>
                    Số nhà, tên đường <Req />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 123 Đường ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
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
                  <FormLabel>Quận/Huyện</FormLabel>
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
                  <FormLabel>Phường/Xã</FormLabel>
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
          </div>
        </div>
        {/* --------------------------------------- */}
        <Separator />
        {/* --- Section 3: Professional Information --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin chuyên môn</h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
            {/* Current Work Place */}
            <FormField
              control={form.control}
              name="current-work-place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nơi làm việc hiện tại</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Bệnh viện XYZ" {...field} />
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
                  <FormLabel>Kinh nghiệm</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 5 năm trong ngành" {...field} />
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
                  <FormLabel>Trình độ học vấn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Cử nhân Điều dưỡng" {...field} />
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
                  <FormLabel>Chứng chỉ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Chứng chỉ hành nghề"
                      {...field}
                    />
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Slogan/Giới thiệu ngắn</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Nhập slogan hoặc giới thiệu ngắn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* --------------------------------------- */}
        <Separator />
        {/* --- Section 4: Links & Media --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Tài liệu & Hình ảnh (Tùy chọn)
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
            {/* Google Drive URL */}
            <FormField
              control={form.control}
              name="google-drive-url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Google Drive (Hồ sơ)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Liên kết đến thư mục chứa hồ sơ, chứng chỉ.
                  </FormDescription>
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
                  <FormLabel>URL Hình ảnh</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Liên kết đến ảnh đại diện.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* --------------------------------------- */}
        {/* --- Submit Button --- */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full mr-2"></span>
            ) : null}
            {isSubmitting ? "Đang xử lý..." : "Tạo hồ sơ Điều dưỡng"}
          </Button>
        </div>
        {/* ------------------- */}
      </form>
    </Form>
  );
};

export default NurseForm;
