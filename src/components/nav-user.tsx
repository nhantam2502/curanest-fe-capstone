"use client";
import { signOut, useSession } from "next-auth/react";
import { Bell, ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { infoNurseRes } from "@/types/nurse";
import nurseApiRequest from "@/apiRequest/nursing/apiNursing";

export function NavUser() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [profileData, setProfileData] = useState<infoNurseRes | null>(null);

  useEffect(() => {
    const fetchNurseData = async () => {
      try {
        const response = await nurseApiRequest.getInfoNurseMe();

        if (response.status === 200 && response.payload) {
          setProfileData(response.payload);
        } else {
          console.error("Failed to fetch nurse profile data:", response);
        }
      } catch (err) {
        console.error("Failed to fetch nurse profile data:", err);
      }
    };

    fetchNurseData();
  }, []);

  if (!session?.user) {
    return null;
  }

  const handleSignOut = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("next-auth.callback-url");
    localStorage.removeItem("next-auth.csrf-token");
    // Sau đó gọi hàm signOut
    signOut({ callbackUrl: "/" });
  };

  const { name, email, image: avatar } = session.user;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={profileData?.data["nurse-picture"] || "/placeholder.png"}
                  alt={name || "User"}
                />
                <AvatarFallback>
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-sm">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={
                      profileData?.data["nurse-picture"] ||
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/nurse/profile")}>
                <User />
                Thông tin
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <Bell />
                Thông báo
              </DropdownMenuItem> */}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 hover:bg-red-100"
            >
              <LogOut className="mr-4 h-7 w-7" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
