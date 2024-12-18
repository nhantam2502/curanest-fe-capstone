"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import SliderPage from "@/app/layout/homepage/SliderPage";
import AboutPage from "@/app/layout/homepage/AboutPage";
import TreatmentPage from "@/app/layout/homepage/ServicePage";

const HeaderHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    // Add login navigation logic here
  };

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-[#FEFEFE] flex items-center justify-center">
        <div className="container flex h-16 items-center justify-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="sm:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium text-[#64D1CB]">
                <Link
                  href="/"
                  className="hover:text-[#A8E0E9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="#about"
                  className="hover:text-[#A8E0E9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="#treatment"
                  className="hover:text-[#A8E0E9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
                <Button
                  variant="outline"
                  className="text-[#64D1CB] border-[#64D1CB] hover:bg-[#64D1CB] hover:text-[#FEFEFE]"
                  onClick={() => {
                    handleLoginClick();
                    setIsMenuOpen(false);
                  }}
                >
                  Đăng nhập
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-[#64D1CB]">CURANEST</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} hover:font-semibold`}
                    >
                      Trang chủ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} hover:font-semibold`}
                    >
                      Giới thiệu
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#treatment" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} hover:font-semibold`}
                    >
                      Dịch vụ
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Login Button */}
          <div className="hidden sm:block ml-auto">
            <Button
              className="text-[#FEFEFE] font-semibold bg-[#64D1CB] hover:bg-[#A8E0E9]"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      <div id="slider">
        <SliderPage />
      </div>

      <div id="about">
        <AboutPage />
      </div>

      <div id="treatment">
        <TreatmentPage />
      </div>
    </div>
  );
};

export default HeaderHomePage;
