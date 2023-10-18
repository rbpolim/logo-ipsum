import { UserButton } from "@clerk/nextjs";

import { NavRoutes } from "@/components/nav-routes";
import { ModeToggle } from "./mode-toggle";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
  return (
    <header className="w-full border-b shadow-sm">
      <div className="flex items-center h-16 px-4">
        <h2 className="hidden text-2xl font-black md:flex">
          Supply Marine
        </h2>
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
