"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  SettingsIcon,
  HelpCircleIcon,
  MenuIcon,
  CircleUserRound,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Quản lý điều dưỡng",
    icon: <CircleUserRound size={20} />,
    href: "/staff/nurse-management",
  },
  { label: "Tuyển dụng", icon: <SettingsIcon size={16} />, href: "/staff/recruit" },
  { label: "Lịch làm việc", icon: <Calendar size={16} />, href: "/staff/schedule" },
];

interface CollapsibleSidebarProps {
  isCollapsed: boolean;
}

const CollapsibleSidebar = ({ isCollapsed }: CollapsibleSidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-gray-100 border-r h-screen sticky top-0 transition-all duration-200",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-center">
        {isCollapsed ? (
          <MenuIcon size={16} />
        ) : (
          <span className="font-bold text-lg">My Sidebar</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <TooltipProvider>
          <ul>
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith("/staff") && pathname === item.href;
              return (
                <li key={item.label} className="mb-2">
                  <Link href={item.href}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full px-4 py-2 justify-center",
                              isActive && "bg-gray-200 hover:bg-gray-200"
                            )}
                          >
                            <div className="relative">
                              {item.icon}
                              {/* Indicator line for collapsed state */}
                              {isActive && (
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-200 text-gray-800">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full px-4 py-2 justify-start",
                          isActive && "bg-gray-200 hover:bg-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                          {/* No indicator line in expanded state */}
                        </div>
                      </Button>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default CollapsibleSidebar;