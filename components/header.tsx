import { UserButton } from "@clerk/nextjs";

import { MainNav } from "@/components/main-nav";

export function Header() {
  return (
    <div className="border-b shadow-sm">
      <div className="flex items-center h-16 px-4">
        <h2 className="font-black text-2xl">
          Supply Marine
        </h2>
        <MainNav className="mx-10" />

        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
