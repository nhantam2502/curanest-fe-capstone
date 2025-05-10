"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  User,
  Menu,
  X,
  Calendar,
  Hand,
  LayoutDashboard,
  CalendarX2,
  Calendar1,
  ClipboardPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const PRIMARY_COLOR = "text-emerald-600";
const ACTIVE_BG_COLOR = "bg-emerald-50";
const ICON_COLOR = "text-emerald-500";

interface MenuItem {
  title: string;
  link: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    title: "Thống kê",
    link: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },

  {
    title: "Quản lý điều dưỡng",
    link: "/nurse-management",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Thêm lịch hẹn",
    link: "/map-schedule",
    icon: <Calendar1 className="h-4 w-4" />,
  },
  {
    title: "Lịch làm việc",
    link: "/schedule",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Báo cáo",
    link: "/medical-report",
    icon: <ClipboardPlus className="h-4 w-4" />,
  },
  { title: "Dịch vụ", link: "/service", icon: <Hand className="h-4 w-4" /> },
];

const DesktopMenuItem: React.FC<{ item: MenuItem; isCollapsed: boolean }> = ({
  item,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive = pathname === `/staff${item.link}`;

  return (
    <Link
      href={`/staff${item.link}`}
      className={cn(
        "flex items-center p-3 my-1 rounded-lg transition-all duration-200 ease-in-out",
        isCollapsed ? "justify-center" : "px-3",
        isActive ? `${ACTIVE_BG_COLOR} ${PRIMARY_COLOR}` : "hover:bg-gray-100"
      )}
      aria-label={item.title}
    >
      <span className={cn(ICON_COLOR, isCollapsed ? "" : "mr-3")}>
        {item.icon}
      </span>
      {!isCollapsed && <span className="text-base">{item.title}</span>}
    </Link>
  );
};

interface StaffNavbarProps {
  isCollapsed: boolean;
  onToggleSidebar: (collapsed: boolean) => void;
}

const StaffNavbar: React.FC<StaffNavbarProps> = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const { name, email, image: avatar } = session.user;

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "h-screen p-4 fixed hidden lg:flex flex-col transition-all duration-300 ease-in-out bg-white border-r",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="mb-8 flex items-center">
          <Link href="/" className="flex flex-row items-center">
            <Image src="/logo.png" alt="Curanest Logo" width={40} height={40} />

            {!isCollapsed && (
              <p className={`font-bold text-xl ml-3 ${PRIMARY_COLOR}`}>
                CURANEST
              </p>
            )}
          </Link>
        </div>

        <nav className="flex flex-col flex-1">
          {menuItems.map((item) => (
            <DesktopMenuItem
              key={item.link}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Current User Section */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between px-2 py-2"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={avatar || "/placeholder.png"}
                      alt={name || "User"}
                    />
                    <AvatarFallback>
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{name}</span>
                      <span className="text-sm text-gray-500">{email}</span>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-500 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between bg-gray-800 text-white p-4 fixed w-full z-50">
        <Link href="/">
          <p className="font-bold text-xl">CURANEST</p>
        </Link>
        <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray-800 text-white w-full p-4 fixed z-40 top-16">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.link}
                href={`/staff${item.link}`}
                onClick={toggleMobileMenu}
                className={`block px-4 py-2 my-1 rounded-md ${
                  pathname === `/staff${item.link}`
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
                aria-label={item.title}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </Link>
            ))}
            <Button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                toggleMobileMenu();
              }}
              variant="ghost"
              className="block w-full text-red-500 hover:bg-red-50"
              aria-label="Log out"
            >
              Log out
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default StaffNavbar;
