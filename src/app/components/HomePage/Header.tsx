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
  ];

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
            <img src="/logo.svg" alt="logo" width={180} height={80} />
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
                        ? "text-[16px] leading-7 font-[700]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-[#71DDD7]"
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

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 right-0 z-40 h-screen w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <div className="flex h-full flex-col justify-between border-e bg-white">
              <div className="px-4 py-6">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
                  Logo
                </span>

                <ul className="mt-6 space-y-1">
                  {Menu.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                          pathname === link.path
                            ? "bg-gray-100 text-gray-700"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  {status === "authenticated" ? (
                    <li>
                      <details className="group [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                          <span className="text-sm font-medium">Tài khoản</span>
                          <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </summary>

                        <ul className="mt-2 space-y-1 px-4">
                          <li>
                            <Link
                              href="#"
                              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Thông tin người dùng
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Ví tiền
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full block rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 text-left"
                            >
                              Đăng xuất
                            </button>
                          </li>
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li>
                      <Link
                        href="/auth/signIn"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-lg px-4 py-2 text-sm font-medium bg-[#71DDD7] text-white hover:bg-[#5fc4c0]"
                      >
                        Đăng nhập
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {status === "authenticated" && session ? (
                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs">
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

          {/* Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;