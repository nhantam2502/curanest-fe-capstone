"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import blogPosts from "@/dummy_data/dummy_news.json";
import { DetailNewsProps } from "@/types/news";
import NewsCard from "./NewsCard ";

const DetailNews = ({ post }: DetailNewsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const relatedPosts = blogPosts
    .filter((p) => p.topic === post.topic && p.id !== post.id)
    .slice(0, 3);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="py-12">
      <Breadcrumb className="px-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/news" className="text-xl">
              Tin tức
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem className="">
            {isMobile ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BreadcrumbLink className="text-xl text-gray-500 truncate max-w-[200px]">
                      {post.title}
                    </BreadcrumbLink>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#e5ab47] font-semibold text-lg text-white ml-5 rounded">
                    <p className="tex-lg">{post.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <BreadcrumbLink className="text-xl text-gray-500 truncate">
                {post.title}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-[1600px] mx-auto  px-8 py-8">
          <article className="bg-white rounded-xl shadow-sm p-8 mb-16">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <Badge className="text-xl py-2 px-4 bg-[#e5ab47] hover:bg-[#e5ab47]">
                {post.topic}
              </Badge>
              <span className="text-gray-500 text-lg">{post.created_at}</span>
            </div>

            <div className="mb-10 aspect-video relative rounded-xl overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-2xl leading-relaxed text-gray-700">
                {post.content}
              </p>
            </div>
          </article>

          <section className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-4xl font-bold mb-10">Tin tức liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  href={`/guest/news/${relatedPost.id}`}
                  key={relatedPost.id}
                >
                  <NewsCard post={relatedPost}/>
                </Link>
              ))}
            </div>
          </section>
      </div>
    </div>
  );
};

export default DetailNews;
