import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import HamburgerIcon from './assets/hamburger-icon.svg?react'

export function Nav() {
  return (
    <nav className="bg-[#0C6470] dark:bg-background text-white dark:text-foreground p-[24px] border-0 dark:border-b dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <SidebarTrigger className="cursor-pointer">
            <HamburgerIcon className="!w-[24px]"/>
        </SidebarTrigger>
        <p className="font-inter font-medium text-base md:text-xl leading-[0px] tracking-normal ml-[24px]">Sales Dashboard</p>
      </div>
      <div className="flex items-center space-x-4">
        <p className="font-inter font-normal text-base leading-none tracking-normal capitalize mr-[24px]">hello user</p>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}