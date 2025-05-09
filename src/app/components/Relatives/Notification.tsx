"use client";

import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { NotificationItem } from "@/types/notification";
import notificationApiRequest from "@/apiRequest/notification/apiNotification";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.id && isOpen) {
        setIsLoading(true);
        try {
          const response = await notificationApiRequest.getNotification(session.user.id, 10);
          if (response.payload.data) {
            setNotifications(response.payload.data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [session?.user?.id, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await notificationApiRequest.seenNotification(notificationId);

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, "read-at": new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(notification => notification["read-at"] === null);

    for (const notification of unreadNotifications) {
      try {
        await notificationApiRequest.seenNotification(notification.id);
      } catch (error) {
        console.error(`Error marking notification ${notification.id} as read:`, error);
      }
    }

    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        "read-at": notification["read-at"] || new Date().toISOString()
      }))
    );
  };

  const filteredNotifications = activeTab === "unread"
    ? notifications.filter(notification => notification["read-at"] === null)
    : notifications;

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng`;
  };

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
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="text-base">Tất cả</TabsTrigger>
            <TabsTrigger value="unread" className="text-base">Chưa đọc</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <ScrollArea className="h-[70vh]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-lg font-medium text-gray-500">Trước đó</h3>
            <Button
              variant="link"
              size="sm"
              className="text-lg p-0 h-auto"
              onClick={markAllAsRead}
            >
              Đánh dấu đã đọc tất cả
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Đang tải thông báo...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-px">
              {filteredNotifications.map((notification) => {
                const isUnread = notification["read-at"] === null;

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-100 relative transition-colors cursor-pointer ${
                      isUnread ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-lg text-gray-600">{notification.content}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600 text-lg font-medium">
                          {formatRelativeTime(notification["created-at"])}
                        </span>
                        {isUnread ? (
                          <Badge variant="default" className="h-3 w-3 p-0 rounded-full bg-blue-500" />
                        ) : (
                          <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 hover:opacity-100">
                            <Check className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center text-lg items-center h-32">
              <p>Không có thông báo nào</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      <CardFooter className="flex justify-center p-4 border-t">
        <Button variant="outline" className="w-full py-3 text-lg">Xem tất cả thông báo</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationDropdown;
