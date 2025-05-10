"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookA,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  BriefcaseBusiness,
  Receipt,
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

// Custom signOut function that also removes sessionToken
const customSignOut = async (options = {}) => {
  // Remove sessionToken from sessionStorage
  sessionStorage.removeItem("sessionToken");
  // Call the original signOut function
  return signOut(options);
};

const PRIMARY_COLOR = "text-emerald-600";
const ACTIVE_BG_COLOR = "bg-emerald-50";
const ICON_COLOR = "text-emerald-500";

interface MenuItem {
  title: string;
  link: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { title: "Thống kê", link: "/dashboard", icon: <LayoutDashboard /> },
  { title: "Khách hàng", link: "/user", icon: <User /> },
  { title: "Điều dưỡng", link: "/nurse", icon: <User /> },
  { title: "Dịch vụ", link: "/service", icon: <BriefcaseBusiness /> },
  { title: "Giao dịch", link: "/invoice", icon: <Receipt /> },
  // { title: "Bài đăng", link: "/post", icon: <BookA /> },
];

const DesktopMenuItem: React.FC<{ item: MenuItem; isCollapsed: boolean }> = ({
  item,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive = pathname === `/admin${item.link}`;

  return (
    <Link
      href={`/admin${item.link}`}
      className={cn(
        "flex items-center p-3 my-1 rounded-lg transition-all duration-200 ease-in-out",
        isCollapsed ? "justify-center" : "px-3",
        isActive ? `${ACTIVE_BG_COLOR} ${PRIMARY_COLOR}` : "hover:bg-gray-100"
      )}
      aria-label={item.title}
    >
      <span className={`${ICON_COLOR} ${isCollapsed ? "" : "mr-3"}`}>
        {item.icon}
      </span>
      {!isCollapsed && item.title}
    </Link>
  );
};

interface AdminNavbarProps {
  isCollapsed: boolean;
  onToggleSidebar?: (collapsed: boolean) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async (callbackUrl = "/") => {
    await customSignOut({ callbackUrl });
  };

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
                className="w-full flex items-center justify-between p-2"
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleSignOut("/")}
                className="text-red-500 hover:bg-red-50"
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
                href={`/admin${item.link}`}
                onClick={toggleMobileMenu}
                className={`block px-4 py-2 my-1 rounded-md ${
                  pathname === `/admin${item.link}`
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
                handleSignOut("/");
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

export default AdminNavbar;