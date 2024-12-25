import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const DetailNews = ({ post }: { post: any }) => {
 

  return (
    <div className="p-6 bg-beige-100">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/news" className="text-lg ">
              Tin tức
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-gray-400" />

          <BreadcrumbItem>
            <BreadcrumbLink href="" className="text-lg">
              {post.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* Topic */}
      <Badge className="mb-4 text-lg text-white bg-[#e5ab47] hover:bg-[#e5ab47]">
        {post.topic}
      </Badge>

      {/* Created At */}
      <p className="text-gray-500 mb-4">Được đăng vào: {post.created_at}</p>

      {/* Image */}
      <div className="mb-6 flex justify-center">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800} // Adjust width and height as needed
          height={450}
          className="rounded-lg object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-700 text-2xl leading-relaxed">{post.content}</p>
      </div>
    </div>
  );
};

export default DetailNews;
