import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

const NewsCard = ({ post }: { post: any }) => {
  return (
    <Card className="w-full max-w-[480px] transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-4 left-4  text-white bg-[#e5ab47] hover:bg-[#e5ab47] text-base px-4 py-1">
            {post.topic}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-base text-gray-500">{post.created_at}</span>
        </div>
        <CardTitle className="text-xl mb-4 line-clamp-2 hover:text-[#71DDD7] cursor-pointer transition-colors">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-lg">
          {post.content}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium">{post.author.name}</span>
        </div>
        {/* <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-gray-500" />
          <span className="text-base text-gray-500">{post.likes}</span>
        </div> */}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
