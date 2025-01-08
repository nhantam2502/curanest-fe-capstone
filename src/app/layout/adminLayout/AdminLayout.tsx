"use client";
import AdminNavbar from "@/app/layout/adminLayout/AdminNavbar";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <main>
      <AdminNavbar
        onToggleSidebar={handleToggleSidebar}
        isCollapsed={isCollapsed}
      />
      <div
        className={`relative flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Header Container */}
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <Button
            onClick={() => handleToggleSidebar(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
            aria-label="Toggle Sidebar"
            variant="ghost"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>

          {/* Current User Section */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                  {/* Placeholder image */}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.png" alt="User Name" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {/* Placeholder name and email */}
                    <p className="text-sm font-medium leading-none">
                      User Name
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      username@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {}}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  Setting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-12 bg-gray-100 min-h-screen">
          <div className="bg-white border rounded-lg p-6 h-[80vh] ">{children}</div>
        </main>
      </div>
    </main>
  );
}