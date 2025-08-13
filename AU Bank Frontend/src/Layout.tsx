// layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Nav } from "./Nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Nav />
      <div className="flex min-h-screen bg-[#DDDDDD] dark:bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <main className="px-6 py-[40px] flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}