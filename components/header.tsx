import { UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/logo";
import { NavRoutes } from "@/components/nav-routes";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

export function Header() {
  return (
    <header className="w-full border-b shadow-sm">
      <div className="flex items-center h-16 px-4">
        <Logo />
        <MobileSidebar />
        <NavRoutes className="mx-10" />
        <div className="flex items-center ml-auto space-x-4">
          <UserButton afterSignOutUrl="/" />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
