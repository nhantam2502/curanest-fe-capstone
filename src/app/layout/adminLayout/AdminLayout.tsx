"use client";

import AdminNavbar from "@/app/layout/adminLayout/AdminNavbar";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { NurseProvider } from "@/app/context/NurseContext";

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
    <NurseProvider>
      <main>
        <Toaster />
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
          <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 p-2 flex items-center justify-between">
            <Button
              onClick={() => handleToggleSidebar(!isCollapsed)}
              className="p-2 rounded-sm hover:bg-gray-200 text-gray-600"
              aria-label="Toggle Sidebar"
              variant="ghost"
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </header>
          <div className="flex-1 lg:p-2 bg-gray-100 min-h-[calc(100vh-3rem)]">
            <div className="bg-white border rounded-md p-4 min-h-[calc(100vh-7rem)]">
              {children}
            </div>
          </div>
        </div>
      </main>
    </NurseProvider>
  );
}
