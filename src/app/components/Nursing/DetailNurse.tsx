"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DetailNurseProps } from "@/types/nurse";
import {
  BookOpenCheck,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  StarIcon,
  Users,
} from "lucide-react";
import services from "@/dummy_data/dummy_service.json";
import TimeTableNurse from "./TimeTableNurse";
import Feedback from "./Feedbacks";
import data_nurses from "@/dummy_data/dummy_nurse.json";
import Link from "next/link";
import NursingCard from "./NursingCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DetailNurse = ({ nurse }: DetailNurseProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      setMounted(true);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!nurse || !mounted) {
    return <div>Loading...</div>;
  }

  const relatedNurse = data_nurses
    .filter(
      (p) => p.specialization === nurse.specialization && p.id !== nurse.id
    )
    .slice(0, 3);

  const handleBookingClick = () => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/relatives/booking");
    } else if (session?.user?.role !== "relatives") {
      router.push("/api/auth/signin?callbackUrl=/relatives/booking");
    } else {
      router.push("/relatives/booking");
    }
  };

  // Get the services for the nurse's specialization
  const nurseServices = services[nurse.specialization as keyof typeof services] || [];

  return (
    <div className="hero_section">
      {/* Breadcrumb */}
      <Breadcrumb className="px-10 py-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/nurseList" className="text-xl">
              Đội ngũ điều dưỡng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            {isMobile ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BreadcrumbLink className="text-xl text-gray-500 truncate max-w-[200px]">
                      {nurse.name}
                    </BreadcrumbLink>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#e5ab47] font-semibold text-lg text-white ml-5 rounded">
                    <p>{nurse.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <BreadcrumbLink className="text-xl text-gray-500 truncate">
                {nurse.name}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-[1700px] mx-auto sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* left content */}
          <div className="lg:w-1/3">
            <Card className="w-full h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <img
                    src={nurse.photo}
                    alt={nurse.name}
                    className="w-60 h-60 rounded-full object-cover mb-4"
                  />
                  <h1 className="text-3xl font-bold text-center mb-2">
                    {nurse.name}
                  </h1>
                  <Badge className="rounded-[50px] bg-[#CCF0F3] text-irisBlueColor text-lg mb-4 hover:bg-[#CCF0F3]">
                    {nurse.specialization}
                  </Badge>
                  <div className="flex items-center gap-3 mb-4">
                    <StarIcon className="w-6 h-6 fill-yellow-400 text-yellow-200" />
                    <span className="font-semibold text-xl">
                      {nurse.avgRating}
                    </span>
                    <span className="text-gray-500 text-lg">
                      ({nurse.totalRating} đánh giá)
                    </span>
                  </div>
                  <Button
                    onClick={handleBookingClick}
                    className="w-full mb-4 bg-[#e5ab47] hover:bg-[#e5ab47]/90 text-xl"
                  >
                    Đặt lịch
                  </Button>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">{nurse.hospital}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <GraduationCap className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">{nurse.education_level}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <BookOpenCheck className="w-9 h-9 text-[#e5ab47]" />
                    <span className="text-xl">
                      {nurse.certificate.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">{nurse.experience}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Thống kê */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-[#e5ab47]" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-xl mb-3">
                      Số bệnh nhân đã điều trị
                    </h3>
                    <p className="text-4xl font-bold text-[#e5ab47]">
                      {nurse.totalPatients}+
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-3">
                      Đánh giá trung bình
                    </h3>
                    <p className="text-4xl font-bold text-[#e5ab47] flex items-center gap-3">
                      {nurse.avgRating}
                      <StarIcon className="w-7 h-7 fill-yellow-400 text-yellow-200" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* lịch làm việc */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="w-7 h-7 text-[#e5ab47]" />
                  Lịch làm việc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeTableNurse id={nurse.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="w-7 h-7 text-[#e5ab47]" />
                  Dịch vụ chăm sóc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nurseServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#e5ab47]" />
                      <span className="text-xl">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Feedback */}
        <Feedback nurse={nurse} />

        {/* Related Nurse */}
        <div className="mt-10 mb-10">
          <h2 className="text-4xl font-bold mb-5">
            Xem thêm Điều dưỡng cùng chuyên ngành
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNurse.map((relatedNurse) => (
              <Link
                href={`/guest/nurseList/${relatedNurse.id}`}
                key={relatedNurse.id}
              >
                <NursingCard nurse={relatedNurse} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNurse;