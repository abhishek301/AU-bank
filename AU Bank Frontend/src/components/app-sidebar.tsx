import { useState } from 'react';
import monitorIcon from '../assets/monitor-icon.svg?react'
import storesIcon from '../assets/stores-icon.svg?react'
import notificationsIcon from '../assets/notifications-icon.svg?react'
import settingsIcon from '../assets/settings-icon.svg?react'
import MoonIcon from '../assets/moon-icon.svg?react'
import SunIcon from '../assets/sun-icon.svg?react';
import {useTheme } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Sales Overview",
    url: "#",
    icon: monitorIcon,
  },
  {
    title: "Stores",
    url: "#",
    icon: storesIcon,
  },
  {
    title: "Notifications",
    url: "#",
    icon: notificationsIcon,
  },
  {
    title: "Settings",
    url: "#",
    icon: settingsIcon,
  },
]

export function AppSidebar() {

   const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(theme === "dark")

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light")
      setIsDark(false)
    } else {
      setTheme("dark")
      setIsDark(true)
    }
  }
  return (
    <Sidebar>
      <SidebarContent className='bg-sidebar dark:bg-background'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className='p-[24px] dark:hover:bg-card hover:bg-sidebar-accent text-white'>
                    <a href={item.url}>
                      <item.icon className='mr-[24px] !w-[18px] !h-[18px]'/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Theme Toggle Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className='p-[24px] dark:hover:bg-card hover:bg-sidebar-accent text-white '>
                  <div onClick={toggleTheme} className="cursor-pointer">
                    {isDark ? 
                    <SunIcon className='mr-[24px] !w-[18px] !h-[18px]'/> :
                    <MoonIcon className='mr-[24px] !w-[18px] !h-[18px]'/> }
                    <span>{isDark ? "Light Theme" : "Dark Theme"}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}