"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="w-full h-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg">
            <img
              src="/logo.png"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>

          <div className="grid flex-1 text-center text-lg leading-tight">
            <span className="truncate font-semibold">Curanest</span>
            <span className="truncate text-sm">Điều dưỡng</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
