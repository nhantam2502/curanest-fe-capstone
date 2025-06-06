"use client";
import * as React from "react";
import {
  CalendarClock,
  CalendarDays,
  HandCoins,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    // {
    //   title: "Thống kê",
    //   url: "/nurse",
    //   icon: LayoutDashboard,
    // },
    {
      title: "Lịch hẹn",
      url: "/nurse",
      icon: CalendarClock,
    },
    {
      title: "Lịch sử cuộc hẹn",
      url: "/nurse/appointmentHistory",
      icon: CalendarDays,
    },
    {
      title: "Phản hồi từ khách hàng",
      url: "/nurse/feedback",
      icon: MessageCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
