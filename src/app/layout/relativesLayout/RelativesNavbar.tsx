"use client";
import notificationApiRequest from "@/apiRequest/notification/apiNotification";
import NotificationDropdown from "@/app/components/Relatives/Notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Bell,
  Key,
  LogOut,
  MenuIcon,
  User,
  Wallet,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const RelativesNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const Menu = [
    { id: 1, name: "Hồ sơ bệnh nhân", path: "/relatives/booking" },
    {
      id: 2,
      name: "Tìm kiếm điều dưỡng",
      path: "/relatives/findingNurse",
    },
    { id: 3, name: "Lịch hẹn sắp tới", path: "/relatives/appointments" },
    { id: 4, name: "Lịch sử cuộc hẹn", path: "/relatives/appointmentHistory" },
  ];

  const handleNavigate = () => {
    router.push("/relatives/settings");
  };

  const handleNotificationsClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await notificationApiRequest.getNotification(
          session.user.id,
          100
        );
        if (response.payload.data) {
          const unreadCount = response.payload.data.filter(
            (notification: any) => notification["read-at"] === null
          ).length;
          setUnreadNotificationsCount(unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    if (status === "authenticated") {
      fetchUnreadNotificationsCount();
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    if (
      !isNotificationsOpen &&
      status === "authenticated" &&
      session?.user?.id
    ) {
      const fetchUpdatedNotifications = async () => {
        if (!session?.user?.id) return;

        try {
          const response = await notificationApiRequest.getNotification(
            session.user.id,
            100
          );
          if (response.payload.data) {
            const unreadCount = response.payload.data.filter(
              (notification: any) => notification["read-at"] === null
            ).length;
            setUnreadNotificationsCount(unreadCount);
          }
        } catch (error) {
          console.error("Failed to update notifications count:", error);
        }
      };

      fetchUpdatedNotifications();
    }
  }, [isNotificationsOpen, status, session?.user?.id]);

  const handleSignOut = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("next-auth.callback-url");
    localStorage.removeItem("next-auth.csrf-token");
    // Sau đó gọi hàm signOut
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="header flex items-center relative" ref={headerRef}>
      <div className="max-w-full w-[1140px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <img src="/logo.png" alt="logo" width={230} height={90} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block flex-1 px-8">
            <ul className="menu flex items-center justify-between">
              {Menu.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.path}
                    className={`${
                      pathname === link.path
                        ? "text-xl font-[700]"
                        : "text-textColor text-xl font-[500]"
                    } whitespace-nowrap`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Right */}
          <div className="flex items-center gap-6">
            {/* Notification Bell - Desktop */}
            {status === "authenticated" && (
              <div className="hidden md:flex relative cursor-pointer">
                <div onClick={handleNotificationsClick}>
                  <Bell className="h-7 w-7" />
                  {/* Notification Badge */}
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>

                {/* Notification Dropdown */}
                <NotificationDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </div>
            )}

            {/* Desktop Auth */}
            {status === "authenticated" && session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-[70px] h-[70px] hidden md:block">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>
                      {(() => {
                        const fullName = session.user.name;
                        const words = fullName?.split(" ").filter(Boolean);
                        const lastWord = words?.slice(-1)[0];
                        const initial = lastWord?.[0]?.toUpperCase();
                        return initial || "?";
                      })()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full p-4">
                  <DropdownMenuItem
                    className="text-xl"
                    onClick={handleNavigate}
                  >
                    <User className="mr-4 h-7 w-7" /> Thông tin người dùng
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xl"
                    onClick={handleNavigate}
                  >
                    <Wallet className="mr-4 h-7 w-7" /> Lịch sử thanh toán
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    className="text-xl"
                    onClick={handleNavigate}
                  >
                    <Key className="mr-4 h-7 w-7" /> Thay đổi mật khẩu
                  </DropdownMenuItem> */}

                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-xl text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="mr-4 h-7 w-7" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signIn" className="hidden md:block">
                <button className="bg-[#71DDD7] py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Đăng nhập
                </button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 cursor-pointer" />
              ) : (
                <MenuIcon className="w-6 h-6 cursor-pointer" />
              )}
            </button>

            {/* Mobile Menu */}
            <div
              className={`fixed inset-0 z-40 bg-white transition-transform duration-300 ease-in-out transform ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              } md:hidden`}
            >
              <div className="flex h-full flex-col bg-white">
                <div className="relative p-4 border-b bg-white">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <h2 className="text-center text-lg font-semibold">
                    Curanest
                  </h2>
                </div>

                {/* Menu Items */}
                <div className="flex-1 bg-white p-4">
                  <ul className="space-y-1">
                    {Menu.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block rounded-lg px-4 py-3 text-xl font-medium ${
                            pathname === link.path
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {status === "authenticated" ? (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-1">
                        {/* Notification Bell - Mobile */}
                        <Link
                          href="/relatives/notifications"
                          className="flex items-center gap-3 px-4 py-3 text-xl text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="relative">
                            <Bell size={25} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                              6
                            </span>
                          </div>
                          <span>Thông báo</span>
                        </Link>
                        <Link
                          href="/relatives/settings"
                          className="flex items-center gap-3 px-4 py-3 text-xl text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          <User size={25} />
                          <span>Thông tin người dùng</span>
                        </Link>
                        <Link
                          href="/wallet"
                          className="flex items-center gap-3 px-4 py-3 text-xl text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          <Wallet size={25} />
                          <span>Lịch sử thanh toán </span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-4 py-3 text-xl text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut size={25} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href="/auth/signIn"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-lg bg-[#71DDD7] px-4 py-3 text-xl font-medium text-white hover:bg-[#5fc4c0]"
                      >
                        Đăng nhập
                      </Link>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                {status === "authenticated" && session ? (
                  <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="ml-2 text-xl">
                          <strong className="block font-medium">
                            {session.user?.name}
                          </strong>
                          <span>{session.user?.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RelativesNavbar;
