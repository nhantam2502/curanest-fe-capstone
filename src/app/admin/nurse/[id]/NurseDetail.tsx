"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetAllNurseDetail } from "@/types/nurse"; // Assuming correct path
import nurseApiRequest from "@/apiRequest/nurse/apiNurse"; // Assuming correct path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
  ChevronLeft,
  Mail,
  Phone,
  Home,
  MapPin,
  Cake,
  User as UserIcon, // Renamed to avoid conflict
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon, // Link icon
  FileText,
  Loader2, // Generic document icon
} from "lucide-react";
import { StarRating } from "../components/StarRatings";

// Helper to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    // Use ISO format for consistency if possible, or format as needed
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

// Helper for initials
const getInitials = (name: string | undefined): string => {
  if (!name) return "N";
  const nameParts = name.split(" ");
  return nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : nameParts.length === 1 && nameParts[0].length > 0
      ? nameParts[0][0].toUpperCase()
      : "N";
};

// Helper component for rendering detail items consistently
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">
        {value || <span className="italic">N/A</span>}
      </span>
    </div>
  </div>
);

export default function NurseDetailPageRenovated() {
  const params = useParams();
  const id = params?.id;
  const nurseId = Array.isArray(id) ? id[0] : id; // Ensure string ID
  const router = useRouter();

  const [nurseDetail, setNurseDetail] = useState<GetAllNurseDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNurseDetail = async () => {
      setIsLoading(true);
      setError(null);
      if (!nurseId) {
        setError("ID điều dưỡng không hợp lệ.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await nurseApiRequest.getAllNurseDetail(nurseId);
        if (response.status === 200 && response.payload?.data) {
          setNurseDetail(response.payload.data);
        } else {
          setError(
            response.payload?.message || "Không tìm thấy thông tin điều dưỡng."
          );
          setNurseDetail(null); // Ensure state is null if not found
        }
      } catch (err: any) {
        console.error("Error fetching nurse detail:", err);
        setError(err.message || "Lỗi xảy ra khi tải dữ liệu.");
        setNurseDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNurseDetail();
  }, [nurseId]); // Depend only on nurseId

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 md:p-6 lg:p-8 space-y-6">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-destructive">
          Lỗi Tải Dữ Liệu
        </h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (!nurseDetail) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Không tìm thấy</h1>
        <p className="text-muted-foreground mb-6">
          Không tìm thấy thông tin cho điều dưỡng này.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // --- Render Details ---
  return (
    <div className="mx-auto p-4 lg:p-2 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Trở lại
      </Button>

      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:gap-6 mb-6">
        <Avatar className="h-24 w-24 border">
          <AvatarImage
            src={nurseDetail["nurse-picture"] || undefined}
            alt={nurseDetail["nurse-name"]}
          />
          <AvatarFallback>
            {getInitials(nurseDetail["nurse-name"])}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{nurseDetail["nurse-name"]}</h1>
          {nurseDetail.slogan && (
            <p className="text-sm text-muted-foreground italic">
              "{nurseDetail.slogan}"
            </p>
          )}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <StarRating rating={nurseDetail.rate || 0} size={18} />
            <span className="text-xs text-muted-foreground">
              ({nurseDetail.rate?.toFixed(1) || "0.0"} / 5)
            </span>
          </div>
        </div>
      </div>

      <Separator />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="h-[60vh]">
            <CardHeader>
              <CardTitle className="text-lg">
                Thông tin cá nhân & Liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={UserIcon}
                label="Giới tính"
                value={nurseDetail.gender ? "Nam" : "Nữ"}
              />
              <InfoItem
                icon={Cake}
                label="Ngày sinh"
                value={formatDate(nurseDetail.dob)}
              />
              <Separator />
              <InfoItem
                icon={Mail}
                label="Email"
                value={<span className="break-all">{nurseDetail.email}</span>}
              />
              <InfoItem
                icon={Phone}
                label="Số điện thoại"
                value={nurseDetail["phone-number"]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="h-[60vh]">
            <CardHeader>
              <CardTitle className="text-lg">Địa chỉ & Chuyên môn</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <InfoItem
                icon={Home}
                label="Số nhà, Đường"
                value={nurseDetail.address}
              />
              <InfoItem
                icon={MapPin}
                label="Phường/Xã"
                value={nurseDetail.ward}
              />
              <InfoItem
                icon={MapPin}
                label="Quận/Huyện"
                value={nurseDetail.district}
              />
              <InfoItem
                icon={MapPin}
                label="Tỉnh/Thành phố"
                value={nurseDetail.city}
              />
              <Separator className="md:col-span-2" />
              <InfoItem
                icon={Briefcase}
                label="Nơi làm việc"
                value={nurseDetail["current-work-place"]}
              />
              <InfoItem
                icon={GraduationCap}
                label="Học vấn"
                value={nurseDetail["education-level"]}
              />
              <InfoItem
                icon={Award}
                label="Kinh nghiệm"
                value={nurseDetail.experience}
              />
              <InfoItem
                icon={FileText}
                label="Chứng chỉ"
                value={nurseDetail.certificate}
              />
              {/* <InfoItem
                icon={LinkIcon}
                label="Google Drive"
                value={
                  nurseDetail["google-drive-url"] ? (
                    <a
                      href={nurseDetail["google-drive-url"]}
                      className="text-primary underline hover:text-primary/80 break-all"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {nurseDetail["google-drive-url"]}
                    </a>
                  ) : null
                }
              /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}