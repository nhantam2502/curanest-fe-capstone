"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Key,
  LogOut,
  MenuIcon,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleStickyHeader = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("sticky_header");
      } else {
        headerRef.current?.classList.remove("sticky_header");
      }
    };

    window.addEventListener("scroll", handleStickyHeader);
    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

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
    { id: 1, name: "Trang chủ", path: "/" },
    { id: 2, name: "Giới thiệu", path: "#about" },
    { id: 3, name: "Dịch vụ", path: "#services" },
    { id: 4, name: "Dịch vụ điều dưỡng", path: "/guest/nurseList" },

    { id: 5, name: "Tin tức", path: "/guest/news" },
  ];

  // Thêm "Đặt lịch" nếu role là relatives
  if (status === "authenticated" && session?.user?.role === "relatives") {
    Menu.push({ id: 6, name: "Đặt lịch", path: "/relatives/booking" });
  }

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
          <div className="flex items-center gap-4">
            {/* Desktop Auth */}
            {status === "authenticated" && session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-[70px] h-[70px] hidden md:block">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>
                      {session.user.name
                        ? session.user.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full p-4">
                  <DropdownMenuItem className="text-xl">
                    <User className="mr-4 h-7 w-7" /> Thông tin người dùng
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xl">
                    <Wallet className="mr-4 h-7 w-7" /> Ví tiền
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xl">
                    <Key className="mr-4 h-7 w-7" /> Thay đổi mật khẩu
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
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
                  <h2 className="text-center text-lg font-semibold">Menu</h2>
                </div>

                {/* Balance Card */}
                {status === "authenticated" && (
                  <div className="m-4 bg-white">
                    <div className="bg-gradient-to-r from-blue-300 to-yellow-300 rounded-xl p-6 text-white">
                      <p className="text-2xl">Số dư ví</p>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">0</span>
                        <span className="text-2xl">VND</span>
                      </div>
                      <button className="px-6 py-2 bg-white/20 rounded-full text-lg font-semibold backdrop-blur-sm">
                        Xem ví
                      </button>
                    </div>
                  </div>
                )}

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
                        <Link
                          href="/profile"
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
                          <span>Ví tiền</span>
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
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

export default Header;
