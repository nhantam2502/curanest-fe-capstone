"use client"

import * as React from "react"
import {
  BriefcaseBusiness,
  CalendarCheck,
  GalleryVerticalEnd,
  HandPlatter,
  Settings2,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavItems } from "./StaffNavItems"
import { StaffSidebarHeader } from "./StaffSidebarHeader"
import { NavUser } from "./StaffSidebarFooter"

const data = {
  user: {
    name: "shadcn",
    phone: "0987654321",
    avatar: "/avatars/shadcn.jpg",
  },
  logo: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navItem: [
    {
      title: "Quản lý điều dưỡng",
      url: "/staff/nurse-management",
      icon: User,
      isActive: true,
    },
    {
      title: "Tuyển dụng",
      url: "/staff/recruit",
      icon: BriefcaseBusiness,
    },
    {
      title: "Lịch làm việc",
      url: "/staff/schedule",
      icon: CalendarCheck,
    },
    {
      title: "Quản lý dịch vụ",
      url: "/staff/service",
      icon: HandPlatter,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StaffSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.navItem} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
