"use client";
import { MenuIcon } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Header = () => {
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current?.classList.add("sticky_header");
      } else {
        headerRef.current?.classList.remove("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  const toggleMenu = () => {
    menuRef.current?.classList.toggle('show_menu');
  };

  const Menu = [
    {
      id: 1,
      name: "Trang chủ",
      path: "/",
    },
    {
      id: 2,
      name: "Giới thiệu",
      path: "#about",
    },
    {
      id: 3,
      name: "Dịch vụ",
      path: "#services",
    },
  ];

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src="/logo.svg" alt="logo" width={180} height={80} />
          </div>

          {/* Menu */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
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
            {/* Avatar */}
            <div className='hidden '>
              <Link href="">
                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                  <img
                    className="rounded-full w-full h-full"
                    src="./avatar-icon.png"
                    alt="avatar"
                  />
                </figure>
              </Link>
            </div>

            {/* Button */}
            <Link href="/login">
              <button className="bg-[#71DDD7] py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                Đăng nhập
              </button>
            </Link>

            <span className="md:hidden" onClick={toggleMenu}>
              <MenuIcon className="w-6 h-6 cursor-pointer"/>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;