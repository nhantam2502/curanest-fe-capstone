"use client";

import AdminNavbar from "@/app/layout/adminLayout/AdminNavbar";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <main className="flex h-screen overflow-hidden bg-gray-100">
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          isCollapsed={isCollapsed}
        />

        <div
          className={`flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          {/* Header: Fixed height, does not grow/shrink vertically */}
          <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 p-2 flex items-center justify-between"> {/* Removed sticky, ensure flex-shrink-0 */}
            {/* Toggle Button - position independent of header content */}
            <Button
              onClick={() => handleToggleSidebar(!isCollapsed)}
              className="p-2 rounded-sm hover:bg-gray-200 text-gray-600"
              aria-label="Toggle Sidebar"
              variant="ghost"
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </header>
          <div className="flex-1 overflow-y-auto lg:p-4">
            <div className="bg-gray-50 border rounded-md p-4 min-h-[80vh]"> 
              {children}
            </div>
          </div>
        </div>
      </main>
    </NurseProvider>
  );
}