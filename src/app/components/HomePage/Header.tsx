'use client'
import React, { useEffect, useRef, useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

  const Menu = [
    { id: 1, name: "Trang chủ", path: "/" },
    { id: 2, name: "Giới thiệu", path: "#about" },
    { id: 3, name: "Dịch vụ", path: "#services" },
    { id: 4, name: "Tin tức", path: "#news" },
  ];

  // Thêm "Đặt lịch" nếu role là relatives
  if (status === "authenticated" && session?.user?.role === "relatives") {
    Menu.push({ id: 5, name: "Đặt lịch", path: "/booking" });
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setIsMenuOpen(false);
  };

  return (
    <header className="header flex items-center relative" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <img src="/logo.svg" alt="logo" width={200} height={90} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="menu flex items-center gap-[2.7rem]">
              {Menu.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.path}
                    className={`${
                      pathname === link.path
                        ? "text-[18px] leading-7 font-[700]"
                        : "text-textColor text-[18px] leading-7 font-[500] hover:text-[#71DDD7]"
                    }`}
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
              <Popover>
                <PopoverTrigger>
                  <Avatar className="w-[60px] h-[60px]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-50 mt-3">
                  <div className="flex flex-col">
                    <Button variant="ghost">Thông tin người dùng</Button>
                    <Button variant="ghost">Ví tiền</Button>
                    <Button variant="ghost">Thay đổi mật khẩu</Button>
                    <Button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      variant="destructive"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
