"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MoreHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const notifications = [
    {
      id: 1,
      avatar: "/avatar1.png",
      name: "Na Na",
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong FAIRY TAIL - All About Goods...",
      time: "2 giờ",
      isUnread: true,
      hasAvatar: true
    },
    {
      id: 2,
      avatar: "/avatar2.png",
      name: "Minh Ánh",
      content: "đã nhắc đến bạn ở một bình luận trong Sylvanian Family VN.",
      time: "4 giờ",
      isUnread: true,
      hasAvatar: true
    },
    {
      id: 3,
      avatar: "/avatar3.png",
      name: "Thành viên ẩn danh",
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong FAIRY TAIL - All...",
      time: "1 ngày",
      isUnread: true,
      hasAvatar: true
    },
    {
      id: 4,
      avatar: "/avatar4.png",
      name: "Trâm Dth Dayy",
      content: "đã nhắc đến bạn và những người khác ở một bình luận trong GR SYLVANIAN FAMILY🔰.",
      time: "2 ngày",
      isUnread: false,
      hasAvatar: true
    },
    {
      id: 5,
      avatar: "/nang-concept.png",
      name: "Nắng Concept - Sữa Hạt",
      content: "đã nhắc đến bạn trong một bình luận.",
      time: "5 ngày",
      isUnread: true,
      hasAvatar: true
    },
    {
      id: 6,
      avatar: "/nang-concept.png",
      name: "Nắng Concept - Sữa Hạt",
      content: "đã bày tỏ cảm xúc về bình luận của bạn: xin giá với ạ.",
      time: "5 ngày",
      emoji: "😍",
      reactions: "1 cảm xúc · 1 phản hồi",
      isUnread: true,
      hasAvatar: true
    }
  ];

  if (!isOpen) return null;

  return (
    <Card 
      ref={dropdownRef}
      className="absolute top-16 right-0 w-[450px] max-h-[90vh] shadow-lg z-50 border border-gray-200"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Thông báo</CardTitle>
          
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="text-base ">Tất cả</TabsTrigger>
            <TabsTrigger value="unread" className="text-base">Chưa đọc</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <ScrollArea className="h-[70vh]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-500">Trước đó</h3>
            <Button variant="link" size="sm" className="text-sm p-0 h-auto">
              Đánh dấu đã đọc tất cả
            </Button>
          </div>
          
          <div className="space-y-px">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 flex items-start gap-4 hover:bg-gray-100 relative transition-colors ${
                  notification.isUnread ? 'bg-blue-50' : ''
                }`}
              >
                <Avatar className="h-14 w-14 flex-shrink-0">
                  <AvatarImage src={notification.avatar} alt={notification.name} />
                  <AvatarFallback>{notification.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="text-base">
                    <span className="font-medium">{notification.name}</span>{' '}
                    <span className="text-gray-600">{notification.content}</span>
                    {notification.emoji && (
                      <span className="text-xl ml-1">{notification.emoji}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-blue-600 text-sm font-medium">{notification.time}</span>
                    {notification.reactions && (
                      <span className="text-gray-500 text-sm">· {notification.reactions}</span>
                    )}
                  </div>
                </div>
                
                {notification.isUnread ? (
                  <Badge variant="default" className="h-3 w-3 p-0 rounded-full bg-blue-500" />
                ) : (
                  <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 hover:opacity-100">
                    <Check className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
      
      <CardFooter className="flex justify-center p-4 border-t">
        <Button variant="outline" className="w-full py-3 text-base">Xem tất cả thông báo</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationDropdown;