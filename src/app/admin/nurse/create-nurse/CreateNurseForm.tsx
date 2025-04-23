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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import nurseApiRequest from "@/apiRequest/nurse/apiNurse";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"; // Make sure this hook is correctly set up
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
// import { BirthDatePicker } from "@/components/date-picker";

interface Geo {
  code: number | string;
  name: string;
}

const formSchema = z.object({
  "full-name": z.string().min(2, { message: "Tên không được để trống." }),
  dob: z.string().min(1, { message: "Ngày sinh không được để trống." }),
  "citizen-id": z
    .string()
    .min(9, { message: "CCCD phải có 9-12 số." })
    .max(12, { message: "CCCD phải có 9-12 số." })
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
  const { toast } = useToast(); // Initialize toast hook
  const [districts, setDistricts] = useState<Geo[]>([]);
  const [wards, setWards] = useState<Geo[]>([]);
  const cityCode = "79"; // Ho Chi Minh City Code
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed submissionError and submissionSuccess states as toasts are called directly

  const form = useForm<NurseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "full-name": "",
      dob: "",
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

  // Fetching Districts - Includes Toast on Error
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
          // Toast for district fetch error
          variant: "destructive",
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách Quận/Huyện. Vui lòng thử lại.",
        });
      }
    };
    fetchDistricts();
  }, [toast]); // Keep toast in dependency array for this useEffect

  // Fetching Wards - Includes Toast on Error
  useEffect(() => {
    if (selectedDistrictCode) {
      const fetchWards = async () => {
        setWards([]); // Clear wards immediately when district changes
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`
          );
          if (!response.ok) throw new Error("Failed to fetch wards");
          const data = await response.json();
          setWards(data.wards || []);
          if (!data.wards || data.wards.length === 0) {
            toast({
              // Optional: Inform user if no wards found for the district
              variant: "default",
              title: "Thông báo",
              description: "Không tìm thấy Phường/Xã cho Quận/Huyện đã chọn.",
            });
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast({
            // Toast for ward fetch error
            variant: "destructive",
            title: "Lỗi tải dữ liệu",
            description: "Không thể tải danh sách Phường/Xã. Vui lòng thử lại.",
          });
          setWards([]); // Ensure wards are cleared on error
        }
      };
      fetchWards();
    } else {
      setWards([]); // Clear wards if no district selected
    }
  }, [selectedDistrictCode, toast]); // Keep toast in dependency array

  // --- Submission Logic with Direct Toasts ---
  const onSubmit: SubmitHandler<NurseFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log("Form Data Submitted:", data);

    try {
      const formattedData = {
        ...data,
        dob: data.dob, // Already string 'YYYY-MM-DD'
        "current-work-place": data["current-work-place"] || "",
        experience: data["experience"] || "",
        "education-level": data["education-level"] || "",
        certificate: data["certificate"] || "",
        slogan: data["slogan"] || "",
        "google-drive-url": data["google-drive-url"] || "",
        "nurse-picture": data["nurse-picture"] || "",
        gender: data.gender === "true", // Convert to boolean
      };

      console.log("Formatted Data for API:", formattedData);

      const response = await nurseApiRequest.createNurse(formattedData);

      if (response.status === 201) {
        toast({
          title: "Thành công!",
          description: "Đã tạo hồ sơ điều dưỡng thành công.",
        });
        form.reset();
        setSelectedDistrictCode("");
        setWards([]);
        // Optional: Redirect after a short delay or immediately
        // setTimeout(() => router.push('/admin/nurse'), 1500); // Example redirect after 1.5s
        router.push('/admin/nurse');
      } else {
        const errorReason =
          response.payload?.error?.message || // More specific error field if exists
          response.payload?.message ||
          "Lỗi không xác định từ máy chủ.";
        toast({
          variant: "destructive",
          title: "Tạo hồ sơ thất bại",
          description: errorReason,
        });
        console.error("API Error:", response.payload);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Đã có lỗi xảy ra",
        description:
          "Không thể gửi yêu cầu tạo điều dưỡng. Vui lòng thử lại.",
      });
      console.error("Error creating nurse:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
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
      <h1 className="text-2xl font-bold mb-4">Thêm thông tin điều dưỡng</h1>
      <Separator className="mb-6" />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <Tabs defaultValue="personal-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="personal-info">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="contact-address">Liên hệ & Địa chỉ</TabsTrigger>
            <TabsTrigger value="professional">Thông tin chuyên môn</TabsTrigger>
            <TabsTrigger value="media">Tài liệu & Hình ảnh</TabsTrigger>
          </TabsList>

          {/* Tab Content: Personal Information */}
          <TabsContent value="personal-info" className="mt-4">
            <div className="space-y-5 rounded-md border p-6 shadow h-[calc(100vh-350px)] overflow-y-auto">
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
                      <FormLabel>
                        Ngày sinh <Req />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="cursor-pointer"
                        />
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                        <Input
                          placeholder="Nhập số Căn cước công dân"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab Content: Contact & Address */}
          <TabsContent value="contact-address" className="mt-4">
            <div className="space-y-5 rounded-md border p-6 shadow h-[calc(100vh-350px)] overflow-y-auto">
              {" "}
              {/* Adjusted height and scroll */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Fields remain the same */}
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
                {/* City (Disabled) */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TP. Hồ Chí Minh"
                          {...field}
                          disabled
                        />
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
                      <FormLabel>
                        Quận/Huyện <Req />
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selected = districts.find(
                              (d) => d.name === value
                            );
                            setSelectedDistrictCode(
                              selected ? String(selected.code) : ""
                            );
                            form.setValue("ward", "", { shouldValidate: true }); // Reset and validate ward
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Quận/Huyện" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {districts.map((district) => (
                              <SelectItem
                                key={district.code}
                                value={district.name}
                              >
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
                      <FormLabel>
                        Phường/Xã <Req />
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedDistrictCode || wards.length === 0}
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
                      {/* Show message if district selected but no wards fetched/available */}
                      {!field.value &&
                        selectedDistrictCode &&
                        wards.length === 0 &&
                        !form.formState.isSubmitting && (
                          <FormDescription className="text-destructive text-xs">
                            Không có Phường/Xã cho Quận/Huyện này hoặc đang tải.
                          </FormDescription>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab Content: Professional Information */}
          <TabsContent value="professional" className="mt-4">
            <div className="space-y-5 rounded-md border p-6 shadow h-[calc(100vh-350px)] overflow-y-auto">
              {" "}
              {/* Adjusted height and scroll */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                {/* Fields remain the same */}
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
                        <Input
                          placeholder="Ví dụ: 5 năm trong ngành"
                          {...field}
                        />
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
                        <Input
                          placeholder="Ví dụ: Cử nhân Điều dưỡng"
                          {...field}
                        />
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
          </TabsContent>

          {/* Tab Content: Links & Media */}
          <TabsContent value="media" className="mt-4">
            <div className="space-y-5 rounded-md border p-6 shadow h-[calc(100vh-350px)] overflow-y-auto">
              {" "}
              {/* Adjusted height and scroll */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                {/* Fields remain the same */}
                {/* Google Drive URL */}
                <FormField
                  control={form.control}
                  name="google-drive-url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Google Drive (Hồ sơ)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Liên kết đến thư mục chứa hồ sơ, chứng chỉ (không bắt
                        buộc).
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
                        <Input
                          type="url"
                          placeholder="https://"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Liên kết đến ảnh đại diện (không bắt buộc).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit/Back Buttons */}
        <div className="flex justify-end pt-4 space-x-3">
          <Button type="button" variant="outline" onClick={handleBack}>
            Quay lại
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full mr-2"></span>
                Đang xử lý...
              </>
            ) : (
              "Tạo hồ sơ Điều dưỡng"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NurseForm;
