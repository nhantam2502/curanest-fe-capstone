import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const DetailNews = ({ post }: { post: any }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 lg:px-12">
      <Card className="shadow-lg">
        <div className="relative h-[300px] w-full overflow-hidden rounded-t-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <Badge className="absolute top-4 left-4 bg-[#71DDD7] text-white text-lg px-4 py-1">
            {post.category}
          </Badge>
        </div>
        <CardContent className="p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-gray-700">{post.excerpt}</p>
          <div className="mt-6 text-base text-gray-600">
            {/* Nội dung chi tiết bài viết */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non
            malesuada tortor. Fusce luctus, enim id pretium bibendum, ligula
            velit porttitor felis, ut efficitur arcu eros nec enim. Donec a
            mollis turpis. Pellentesque facilisis ante ac facilisis tempor.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailNews;
