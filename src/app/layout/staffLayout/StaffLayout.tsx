import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { StaffSidebar } from "./StaffSidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
