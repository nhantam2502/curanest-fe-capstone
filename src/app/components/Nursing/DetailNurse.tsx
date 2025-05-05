"use client";
import React, { useEffect, useState } from "react";
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
import { DetailNurseItemType, type Feedback as FeedbackType } from "@/types/nurse";
import {
  BookOpenCheck,
  Clock,
  GraduationCap,
  MapPin,
  Star,
  StarIcon,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import TimeTableNurse from "./TimeTableNurse";
import Feedback from "./Feedbacks";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";
import RelativesNursingCard from "./RelativesNursingCard";

const DetailNurse = ({
  nurse,
  serviceID,
}: {
  nurse: DetailNurseItemType;
  serviceID: string;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [relatedNurses, setRelatedNurses] = useState<DetailNurseItemType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  const params = useParams();
  const serviceIdRaw = params.serviceId;
  const serviceId =
    typeof serviceIdRaw === "string" ? serviceIdRaw : (serviceIdRaw?.[0] ?? "");
  const [searchTerm, setSearchTerm] = useState(
    serviceId ? decodeURIComponent(decodeURIComponent(serviceId)) : ""
  );

  // Fetch danh sách điều dưỡng liên quan dựa vào serviceID
  useEffect(() => {
    const fetchRelatedNurses = async () => {
      if (!serviceID) return;

      setIsLoading(true);
      try {
        const response = await nurseApiRequest.getListNurse(
          serviceID,
          null,
          1,
          3,
          null
        );

        // Lọc để loại bỏ điều dưỡng hiện tại khỏi danh sách
        const filtered = response.payload.data.filter(
          (item: DetailNurseItemType) => item["nurse-id"] !== nurse["nurse-id"]
        );

        setRelatedNurses(filtered);
      } catch (error) {
        console.error("Error fetching related nurses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedNurses();
  }, [serviceID, nurse]);

  // Fetch đánh giá cho điều dưỡng
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const nurseID = nurse["nurse-id"];
        const response = await nurseApiRequest.getFeedbackForNursing(nurseID);
        setFeedbacks(response.payload.data);
        setLoadingFeedbacks(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedback();
  }, [nurse["nurse-id"]]);

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
    return (
      <div className="space-y-4">
        <Skeleton className="w-60 h-60 rounded-full" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
    );
  }

  const handleBookingClick = (nurse: DetailNurseItemType) => {
    if (!nurse) {
      console.error("Nurse information is missing!");
      return;
    }
    const isUnauthenticated = status === "unauthenticated";
    const isNotRelativesRole = session?.user?.role !== "relatives";

    if (isUnauthenticated || isNotRelativesRole) {
      router.push("/api/auth/signin?callbackUrl=/relatives/booking");
      return;
    }
    // Điều hướng tới trang đặt lịch
    router.push(
      `/relatives/findingNurse/${serviceId}/${nurse["nurse-id"]}/bookingNurse?serviceID=${serviceID}`
    );
  };
  
  // Tính toán thống kê từ feedbacks
  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((acc, curr) => acc + parseInt(curr.star, 10), 0) / feedbacks.length
    : 0;
  
  // Tính phân phối đánh giá theo số sao
  const ratingDistribution = Array(5).fill(0);
  feedbacks.forEach(feedback => {
    const starIndex = parseInt(feedback.star, 10) - 1;
    if (starIndex >= 0 && starIndex < 5) {
      ratingDistribution[starIndex]++;
    }
  });
  
  // Tính các dịch vụ đã được đánh giá
  const uniqueServices = new Set(feedbacks.map(f => f.service));

  // Hàm render stars
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ));
  };

  return (
    <div className="relative bg-[url('/hero-bg.png')] bg-no-repeat bg-center bg-cover bg-fixed min-h-screen pb-16">
      {/* Breadcrumb */}
      <Breadcrumb className="px-10 py-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/nurseList" className="text-xl">
              Dịch vụ điều dưỡng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />

          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => {
                window.history.back();
              }}
              className="text-xl"
            >
              Danh sách điều dưỡng thuộc dịch vụ: {searchTerm}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            {isMobile ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BreadcrumbLink className="text-xl text-gray-500 truncate max-w-[200px]">
                      {nurse["nurse-name"]}
                    </BreadcrumbLink>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#e5ab47] font-semibold text-lg text-white ml-5 rounded">
                    <p>{nurse["nurse-name"]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <BreadcrumbLink className="text-xl text-gray-500 truncate">
                {nurse["nurse-name"]}
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
                    src={nurse["nurse-picture"]}
                    alt={nurse["nurse-name"]}
                    className="w-60 h-60 rounded-full object-cover mb-4"
                  />
                  <h1 className="text-3xl font-bold text-center mb-2">
                    {nurse["nurse-name"]}
                  </h1>

                 
                  <Button
                    onClick={() => handleBookingClick(nurse)}
                    className="w-full mb-4 bg-[#e5ab47] hover:bg-[#e5ab47]/90 text-xl mt-4"
                  >
                    Đặt lịch
                  </Button>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <MapPin className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">
                      {nurse["current-work-place"]}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <GraduationCap className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">{nurse["education-level"]}</span>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <BookOpenCheck className="w-8 h-8 text-[#e5ab47]" />
                    <span className="text-xl">
                      {nurse.certificate.split(" - ").join(", ")}
                    </span>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-4">
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
            <Card className="shadow-md">
              <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-white">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="w-8 h-8 text-[#e5ab47]" />
                  Đánh giá & Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingFeedbacks ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-t-amber-500 border-amber-200 rounded-full animate-spin"></div>
                      <p className="text-lg text-gray-500 font-medium">Đang tải đánh giá...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột bên trái - Tổng quan đánh giá */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-semibold text-xl">Đánh giá trung bình</h3>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <p className="text-4xl font-bold text-[#e5ab47]">
                          {averageRating > 0 ? averageRating.toFixed(1) : parseFloat(nurse.rate).toFixed(1)}
                        </p>
                        <div className="flex">{renderStars(Math.round(averageRating > 0 ? averageRating : Number(nurse.rate)))}</div>
                        <span className="text-lg text-gray-500">
                          ({feedbacks.length} đánh giá)
                        </span>
                      </div>
                      
                      {/* Phân phối đánh giá */}
                      <div className="space-y-2 mt-4">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingDistribution[star - 1];
                          const percentage = feedbacks.length > 0 
                            ? (count / feedbacks.length) * 100 
                            : 0;
                            
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-sm w-2">{star}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#e5ab47] rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Cột bên phải - Tóm tắt thống kê */}
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-xl text-gray-700 mb-4">Tóm tắt thống kê</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm">Tổng số đánh giá</p>
                              <p className="text-2xl font-bold text-[#e5ab47]">{feedbacks.length}</p>
                            </div>
                            <MessageSquare className="w-10 h-10 text-[#e5ab47]/30" />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm">Đánh giá 5 sao</p>
                              <p className="text-2xl font-bold text-[#e5ab47]">
                                {ratingDistribution[4]}
                              </p>
                            </div>
                            <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm">Số dịch vụ</p>
                              <p className="text-2xl font-bold text-[#e5ab47]">
                                {uniqueServices.size}
                              </p>
                            </div>
                            <BookOpenCheck className="w-10 h-10 text-[#e5ab47]/30" />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm">Kinh nghiệm</p>
                              <p className="text-2xl font-bold text-[#e5ab47]">
                                {parseInt(nurse.experience) || 0} năm
                              </p>
                            </div>
                            <Calendar className="w-10 h-10 text-[#e5ab47]/30" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                <TimeTableNurse nurseId={nurse["nurse-id"]} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feedback */}
        <Feedback nurse={nurse} />

        {/* Related Nurse */}
        {isLoading ? (
          <div className="mt-10 mb-10">
            <h2 className="text-3xl font-bold mb-5">
              Đang tải điều dưỡng liên quan...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="w-full h-40 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : relatedNurses.length > 0 ? (
          <div className="mt-10 mb-10">
            <h2 className="text-3xl font-bold mb-5">
              Điều dưỡng khác liên quan đến dịch vụ: {searchTerm}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 ">
              {relatedNurses.map((relatedNurse) => (
                <Link
                  href={`/relatives/findingNurse/${serviceId}/${relatedNurse["nurse-id"]}?serviceID=${serviceID}`}
                  key={relatedNurse["nurse-id"]}
                >
                  <RelativesNursingCard
                    nurse={relatedNurse}
                    service={searchTerm}
                    serviceID=""
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DetailNurse;