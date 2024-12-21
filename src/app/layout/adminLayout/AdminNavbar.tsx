"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnDecreasing,
  HandCoins,
  LayoutDashboard,
  MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const AdminNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Thống kê", link: "/dashboard", icon: <LayoutDashboard /> },
    // {
    //   title: "Quản lí điều dưỡng",
    //   link: "/nurse-management",
    //   icon: <ChartColumnDecreasing />,
    // },
    // { title: "Quản lí dịch vụ", link: "/service-fee", icon: <ChartColumnDecreasing /> },
    // { title: "Quản lí giao dịch", link: "/payment-history", icon: <HandCoins /> },
  ];

  return (
    <>
      <div className="h-screen w-72 bg-[#FFF p-4 fixed hidden lg:flex flex-col ">
        <div className="mb-8">
          <Link href="">
            <p className="font-bold text-center text-4xl text-sky-400 mt-4">
              CURANEST
            </p>
          </Link>
        </div>

        <nav className="flex flex-col flex-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={`/admin${item.link}`}
              className={`flex items-center p-4 my-2 rounded-xl font-semibold text-lg ${
                pathname === `/admin${item.link}`
                  ? "bg-white text-sky-400 border-l-4 border-sky-600 shadow-lg"
                  : "text-slate-800 hover:bg-white hover:border-l-4 hover:border-sky-600 hover:text-sky-400"
              }`}
            >
              <span className="mr-3 rounded-full bg-sky-300 p-2 text-white">
                {item.icon}
              </span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between bg-gray-800 text-white p-4 fixed w-full z-50">
        <Link href="">
          <p className="font-bold text-inherit text-2xl hover:text-sky-400">
            CURANEST
          </p>
        </Link>
        <Button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <MenuIcon /> : <MenuIcon />}
        </Button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-gray-800 text-white w-full p-4 fixed z-40 top-16">
          <nav className="flex flex-col">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={`/admin${item.link}`}
                className={`block px-4 py-2 my-2 rounded ${
                  pathname === `/admin${item.link}`
                    ? "bg-white text-black border-l-4 border-green-500"
                    : "text-gray-300 hover:bg-gray-200 hover:border-l-4 hover:border-gray-300 hover:text-black"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 text-center rounded"
            >
              Đăng xuất
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
